import NoteEditor from '@/components/NoteEditor';
import StyleCard from '@/components/StyleCard';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SuccessCard from '@/components/ui/SuccessCard';
import { useLookbook } from '@/contexts/LookbookContext';
import { exportFolderAsPDF } from '@/utils/exportUtils';
import { getOutfitIdFromStyleId, isOutfitStyle } from '@/utils/outfitAdapter';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LookbookFolderScreen() {
  const { folderId, folderName, folderColor } = useLocalSearchParams();
  const { 
    getStylesInFolder, 
    removeStyleFromFolder, 
    updateStyleNotes 
  } = useLookbook();
  
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [styleToRemove, setStyleToRemove] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const folderStyles = getStylesInFolder(folderId as string);

  const handleStylePress = (style: any) => {
    // Check if this is an outfit-based style and get the original outfit ID
    if (isOutfitStyle(style.id)) {
      const outfitId = getOutfitIdFromStyleId(style.id);
      if (outfitId) {
        router.push({
          pathname: '/style-detail',
          params: { id: outfitId }
        });
      } else {
        console.error('Could not find outfit ID for style:', style.id);
        // Don't navigate if we can't find the proper outfit ID
      }
    } else {
      // For non-outfit styles, use the style ID directly
      router.push({
        pathname: '/style-detail',
        params: { id: style.id.toString() }
      });
    }
  };

  const handleRemoveStyle = (style: any) => {
    setStyleToRemove(style);
    setShowConfirmModal(true);
  };

  const confirmRemoveStyle = () => {
    if (styleToRemove) {
      removeStyleFromFolder(styleToRemove.id, folderId as string);
      setSuccessMessage(`Style Removed! "${styleToRemove.title}" has been removed from ${folderName}.`);
      setShowSuccessMessage(true);
      setShowConfirmModal(false);
      setStyleToRemove(null);
    }
  };

  const handleAddNote = (style: any) => {
    setSelectedStyle(style);
    setShowNoteEditor(true);
  };

  const handleSaveNote = async (note: string) => {
    if (selectedStyle) {
      await updateStyleNotes(selectedStyle.id, folderId as string, note);
      setShowNoteEditor(false);
      setSelectedStyle(null);
    }
  };

  const handleExport = async () => {
    if (folderStyles.length === 0) {
      Alert.alert(
        'No Styles to Export',
        'Add some styles to this folder before exporting.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsExporting(true);
    try {
      await exportFolderAsPDF(
        folderName as string,
        folderStyles,
        folderColor as string
      );
    } catch (error) {
      Alert.alert(
        'Export Failed',
        'There was an error exporting your lookbook. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  const renderStyleItem = ({ item }: { item: any }) => (
    <View style={styles.styleItem}>
      <StyleCard
        style={item}
        onPress={handleStylePress}
        showSaveButton={false}
      />
      
      <View style={styles.styleActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleAddNote(item)}
        >
          <Ionicons 
            name={item.notes ? "document-text" : "document-text-outline"} 
            size={20} 
            color={item.notes ? "#FF6B35" : "#666"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleRemoveStyle(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>
      
      {item.notes && (
        <View style={styles.notePreview}>
          <Text style={styles.noteText} numberOfLines={2}>
            {item.notes}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {folderStyles.length === 0 ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header - scrollable */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <View style={styles.headerTitle}>
                <View 
                  style={[styles.folderColorDot, { backgroundColor: folderColor as string }]} 
                />
                <Text style={styles.folderName} numberOfLines={1}>
                  {folderName}
                </Text>
              </View>
              <Text style={styles.styleCount}>
                {folderStyles.length} {folderStyles.length > 1 ? 'styles' : 'style'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
              onPress={handleExport}
              disabled={isExporting}
            >
              <Ionicons 
                name={isExporting ? "hourglass-outline" : "share-outline"} 
                size={24} 
                color={isExporting ? "#999" : "#000"} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={80} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No Styles Yet</Text>
            <Text style={styles.emptySubtitle}>
              Save styles from the feed to see them here
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)/')}
            >
              <Text style={styles.browseButtonText}>Browse Styles</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={folderStyles}
          renderItem={renderStyleItem}
          keyExtractor={(item) => `${item.id}-${item.folderId}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.stylesContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
              
              <View style={styles.headerInfo}>
                <View style={styles.headerTitle}>
                  <View 
                    style={[styles.folderColorDot, { backgroundColor: folderColor as string }]} 
                  />
                  <Text style={styles.folderName} numberOfLines={1}>
                    {folderName}
                  </Text>
                </View>
                <Text style={styles.styleCount}>
                  {folderStyles.length} {folderStyles.length > 1 ? 'styles' : 'style'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
                onPress={handleExport}
                disabled={isExporting}
              >
                <Ionicons 
                  name={isExporting ? "hourglass-outline" : "share-outline"} 
                  size={24} 
                  color={isExporting ? "#999" : "#000"} 
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {selectedStyle && (
        <NoteEditor
          visible={showNoteEditor}
          initialNote={selectedStyle.notes || ''}
          styleTitle={selectedStyle.title}
          onSave={handleSaveNote}
          onCancel={() => {
            setShowNoteEditor(false);
            setSelectedStyle(null);
          }}
        />
      )}

      <ConfirmationModal
        visible={showConfirmModal}
        iconName="trash"
        iconBackground="#FF3B30"
        title="Remove Style"
        message={styleToRemove ? `Remove "${styleToRemove.title}" from ${folderName}?` : ''}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmRemoveStyle}
        onCancel={() => {
          setShowConfirmModal(false);
          setStyleToRemove(null);
        }}
      />

      <SuccessCard
        visible={showSuccessMessage}
        title="Style Removed!"
        message={successMessage}
        onClose={() => setShowSuccessMessage(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  folderColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  styleCount: {
    fontSize: 14,
    color: '#666',
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  exportButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stylesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  styleItem: {
    marginBottom: 16,
  },
  styleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notePreview: {
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    marginHorizontal: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
}); 