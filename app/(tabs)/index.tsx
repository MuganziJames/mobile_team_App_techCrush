import StyleCard from '@/components/StyleCard';
import EmptyState from '@/components/ui/EmptyState';
import SuccessCard from '@/components/ui/SuccessCard';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Style, useLookbook } from '@/contexts/LookbookContext';
import { useOutfit } from '@/contexts/OutfitContext';
import { outfitsToStyles } from '@/utils/outfitAdapter';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function FeedScreen() {
  const { user } = useAuth();
  const { outfits, loading, error, refreshOutfits } = useOutfit();
  const { 
    folders, 
    saveStyleToFolder, 
    isStyleSaved,
    removeStyleFromFolder,
    getStyleFolder
  } = useLookbook();
  
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  
  // Convert outfits to styles for display
  const styleItems = outfitsToStyles(outfits);

  const handleSaveStyle = async (style: Style) => {
    if (isStyleSaved(style.id)) {
      // Style is already saved - directly remove it
      const folderId = getStyleFolder(style.id);
      const folderName = folders.find(f => f.id === folderId)?.name || 'lookbook';
      
      if (folderId) {
        await removeStyleFromFolder(style.id, folderId);
        setSuccessMessage({
          title: 'Style Removed!',
          message: `"${style.title}" has been removed from ${folderName}.`
        });
        setShowSuccessCard(true);
      }
    } else {
      // Style not saved - show folder selection
      setSelectedStyle(style);
      setShowFolderModal(true);
    }
  };

  const handleFolderSelect = async (folderId: string) => {
    if (selectedStyle) {
      await saveStyleToFolder(selectedStyle, folderId);
      setShowFolderModal(false);
      setSelectedStyle(null);
      
      const folderName = folders.find(f => f.id === folderId)?.name || 'folder';
      setSuccessMessage({
        title: 'Style Saved!',
        message: `"${selectedStyle.title}" has been saved to ${folderName}.`
      });
      setShowSuccessCard(true);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOutfits();
    setRefreshing(false);
  };

  const handleSearchPress = () => {
    router.push('/(tabs)/explore');
  };

  const renderStyleCard = ({ item }: { item: Style }) => (
    <StyleCard
      style={item}
      onSave={handleSaveStyle}
      isSaved={isStyleSaved(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={componentStyles.headerContainer}>
      <View style={componentStyles.welcomeSection}>
        <View style={componentStyles.titleRow}>
          <View style={componentStyles.titleContent}>
            <Text style={componentStyles.welcomeText}>
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </Text>
            <Text style={componentStyles.subText}>
              Discover new styles and save them to your lookbook
            </Text>
          </View>
          <TouchableOpacity 
            style={componentStyles.searchIconButton}
            onPress={handleSearchPress}
            activeOpacity={0.7}
          >
            <Ionicons name="search-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={componentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={componentStyles.loadingText}>Loading styles...</Text>
        </View>
      );
    }

    if (error && styleItems.length === 0) {
      return (
        <EmptyState
          icon="alert-circle-outline"
          title="Unable to Load Styles"
          description={error}
          actionText="Try Again"
          onActionPress={refreshOutfits}
        />
      );
    }

    if (styleItems.length === 0) {
      return (
        <EmptyState
          icon="shirt-outline"
          title="No Styles Available"
          description="Check back later for new styles and outfits"
          actionText="Refresh"
          onActionPress={refreshOutfits}
        />
      );
    }

    return (
      <FlatList
        data={styleItems}
        renderItem={renderStyleCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={componentStyles.row}
        contentContainerStyle={componentStyles.feedContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={componentStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SuccessCard
        visible={showSuccessCard}
        title={successMessage.title}
        message={successMessage.message}
        onClose={() => setShowSuccessCard(false)}
      />
      
      {renderContent()}

      <Modal
        visible={showFolderModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFolderModal(false)}
      >
        <SafeAreaView style={componentStyles.modalContainer}>
          <View style={componentStyles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowFolderModal(false)}
              style={componentStyles.modalCloseButton}
            >
              <Text style={componentStyles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={componentStyles.modalTitle}>Save to Folder</Text>
            <View style={componentStyles.modalCloseButton} />
          </View>

          <View style={componentStyles.modalContent}>
            <Text style={componentStyles.modalSubtitle}>
              Choose a folder for "{selectedStyle?.title}"
            </Text>
            
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={componentStyles.folderItem}
                  onPress={() => handleFolderSelect(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={componentStyles.folderIcon}>
                    <Ionicons name="folder" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={componentStyles.folderName}>{item.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={componentStyles.emptyState}>
                  <Ionicons name="folder-open-outline" size={60} color="#E0E0E0" />
                  <Text style={componentStyles.emptyStateText}>No folders yet</Text>
                  <Text style={componentStyles.emptyStateSubtext}>
                    Create a folder in your lookbook first
                  </Text>
                </View>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.darkGray,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  feedContent: {
    paddingTop: 42,
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleContent: {
    flex: 1,
    paddingRight: 16,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 16,
  },
  searchIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#F8F8F8',
  },
  modalCloseButton: {
    width: 60,
    height: 40,
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 1,
    borderRadius: 8,
  },
  folderIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  folderName: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
