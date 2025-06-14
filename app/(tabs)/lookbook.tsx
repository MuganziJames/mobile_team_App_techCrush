import FolderCard from '@/components/FolderCard';
import { useLookbook } from '@/contexts/LookbookContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const folderColors = ['#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

export default function LookbookScreen() {
  const { 
    folders, 
    getStylesInFolder, 
    createFolder, 
    deleteFolder 
  } = useLookbook();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(folderColors[0]);

  const handleFolderPress = (folder: any) => {
    router.push({
      pathname: '/lookbook-folder',
      params: { 
        folderId: folder.id,
        folderName: folder.name,
        folderColor: folder.color
      }
    });
  };

  const handleDeleteFolder = (folderId: string) => {
    Alert.alert(
      'Delete Folder',
      'Are you sure you want to delete this folder? All styles in this folder will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteFolder(folderId)
        }
      ]
    );
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await createFolder(newFolderName.trim(), selectedColor);
      setNewFolderName('');
      setSelectedColor(folderColors[0]);
      setShowCreateModal(false);
    }
  };

  const renderFolderCard = ({ item }: { item: any }) => {
    const folderStyles = getStylesInFolder(item.id);
    return (
      <FolderCard
        folder={item}
        styles={folderStyles}
        onPress={handleFolderPress}
        onDelete={handleDeleteFolder}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Lookbook</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {folders.length} folder{folders.length !== 1 ? 's' : ''} • {' '}
          {folders.reduce((total, folder) => total + getStylesInFolder(folder.id).length, 0)} styles saved
        </Text>
      </View>

      {folders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>No Folders Yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first folder to start organizing your saved styles
          </Text>
          <TouchableOpacity 
            style={styles.createFirstButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createFirstButtonText}>Create Folder</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={folders}
          renderItem={renderFolderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.foldersContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowCreateModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Folder</Text>
            <TouchableOpacity 
              onPress={handleCreateFolder}
              style={styles.modalSaveButton}
              disabled={!newFolderName.trim()}
            >
              <Text style={[
                styles.modalSaveText,
                !newFolderName.trim() && styles.modalSaveTextDisabled
              ]}>
                Create
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Folder Name</Text>
              <TextInput
                style={styles.textInput}
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder="Enter folder name..."
                placeholderTextColor="#999"
                autoFocus
                maxLength={30}
              />
            </View>

            <View style={styles.colorSection}>
              <Text style={styles.inputLabel}>Choose Color</Text>
              <View style={styles.colorGrid}>
                {folderColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.inputLabel}>Preview</Text>
              <View style={styles.previewCard}>
                <View style={[styles.previewColor, { backgroundColor: selectedColor }]} />
                <Text style={styles.previewText}>
                  {newFolderName.trim() || 'Folder Name'}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
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
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  foldersContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalSaveButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  modalSaveText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    textAlign: 'right',
  },
  modalSaveTextDisabled: {
    color: '#ccc',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  colorSection: {
    marginBottom: 32,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#333',
  },
  previewSection: {
    marginBottom: 32,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
  },
  previewColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
}); 