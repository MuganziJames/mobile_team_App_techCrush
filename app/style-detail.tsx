import { Outfit } from '@/api/types';
import EmptyState from '@/components/ui/EmptyState';
import SuccessCard from '@/components/ui/SuccessCard';
import { useLookbook } from '@/contexts/LookbookContext';
import { useOutfit } from '@/contexts/OutfitContext';
import { outfitToStyle } from '@/utils/outfitAdapter';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import fallback image at the top to avoid require resolution issues
const fallbackImage = require('../assets/images/modernAfrican.jpg');

const { width, height } = Dimensions.get('window');

export default function StyleDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getOutfitById } = useOutfit();
  const { 
    folders, 
    saveStyleToFolder, 
    isStyleSaved, 
    getStyleFolder,
    removeStyleFromFolder
  } = useLookbook();
  
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });

  // Load outfit data
  useEffect(() => {
    const loadOutfit = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Convert the style ID back to outfit ID if needed
        const outfitData = await getOutfitById(id as string);
        if (outfitData) {
          setOutfit(outfitData);
        } else {
          setError('Style not found');
        }
      } catch (err) {
        console.error('Error loading outfit:', err);
        setError('Failed to load style');
      } finally {
        setLoading(false);
      }
    };

    loadOutfit();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading style...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !outfit) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <EmptyState
          icon="alert-circle-outline"
          title="Style Not Found"
          description={error || "The style you're looking for doesn't exist"}
          actionText="Go Back"
          onActionPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  // Convert outfit to style format
  const style = outfitToStyle(outfit);
  const isSaved = isStyleSaved(style.id);
  const currentFolder = getStyleFolder(style.id);

  const handleSave = async () => {
    if (isSaved) {
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
        
        // Hide success card after 2 seconds
        setTimeout(() => {
          setShowSuccessCard(false);
        }, 2000);
      }
    } else {
      // Style not saved - show folder selection
      setShowFolderModal(true);
    }
  };

  const handleFolderSelect = async (folderId: string) => {
    await saveStyleToFolder(style, folderId);
    setShowFolderModal(false);
    
    const folderName = folders.find(f => f.id === folderId)?.name || 'folder';
    setSuccessMessage({
      title: 'Style Saved!',
      message: `"${style.title}" has been saved to ${folderName}.`
    });
    setShowSuccessCard(true);
    
    // Hide success card after 2 seconds
    setTimeout(() => {
      setShowSuccessCard(false);
    }, 2000);
  };

  const handleShare = async () => {
    try {
      const shareContent = `Check out this amazing ${style.category} style: ${style.title}\n\n${style.description}\n\n#AfricanFashion #Style #Fashion`;
      
      // For now, just show an alert since Share API might need platform-specific setup
      Alert.alert(
        'Share Style',
        shareContent,
        [
          { text: 'Copy', onPress: () => {
            // In a real app, you'd copy to clipboard here
            Alert.alert('Copied!', 'Style details copied to clipboard');
          }},
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share style');
    }
  };

  // Use first image from outfit or fallback
  const imageSource = outfit.imageUrls && outfit.imageUrls.length > 0 
    ? { uri: outfit.imageUrls[0] } 
    : fallbackImage;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={24} color="#000" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleSave}
            >
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={isSaved ? "#FF6B35" : "#000"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.mainImage} />
          
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{style.category}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{style.title}</Text>
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            {style.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Color Indicator */}
          <View style={styles.colorSection}>
            <Text style={styles.sectionTitle}>Color Theme</Text>
            <View style={styles.colorIndicator}>
              <View 
                style={[styles.colorDot, { backgroundColor: style.color }]} 
              />
              <Text style={styles.colorText}>{style.color}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{style.description}</Text>
          </View>

          {/* Creator Info */}
          {outfit.creator && (
            <View style={styles.creatorSection}>
              <Text style={styles.sectionTitle}>Created By</Text>
              <Text style={styles.creatorName}>{outfit.creator.name}</Text>
              <Text style={styles.createdDate}>
                {new Date(outfit.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}

          {/* Save Status */}
          {isSaved && currentFolder && (
            <View style={styles.saveStatus}>
              <Ionicons name="bookmark" size={20} color="#FF6B35" />
              <Text style={styles.saveStatusText}>
                Saved in {folders.find(f => f.id === currentFolder)?.name || 'folder'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Folder Selection Modal */}
      <Modal
        visible={showFolderModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFolderModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowFolderModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Save to Folder</Text>
            <View style={styles.modalCloseButton} />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Choose a folder for "{style.title}"
            </Text>
            
            <ScrollView style={styles.folderList}>
              {folders.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={styles.folderItem}
                  onPress={() => handleFolderSelect(folder.id)}
                >
                  <View style={styles.folderIcon}>
                    <Ionicons name="folder" size={24} color="#FF6B35" />
                  </View>
                  <Text style={styles.folderName}>{folder.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {folders.length === 0 && (
              <View style={styles.emptyFolders}>
                <Ionicons name="folder-open-outline" size={60} color="#E0E0E0" />
                <Text style={styles.emptyFoldersText}>No folders yet</Text>
                <Text style={styles.emptyFoldersSubtext}>
                  Create a folder in your lookbook first
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Success Card */}
      <SuccessCard 
        visible={showSuccessCard}
        title={successMessage.title}
        message={successMessage.message}
        onClose={() => setShowSuccessCard(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    height: height * 0.6,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    lineHeight: 34,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  tagText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  colorSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  colorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  colorText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  creatorSection: {
    marginBottom: 24,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 14,
    color: '#999',
  },
  saveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.2)',
  },
  saveStatusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCloseButton: {
    width: 60,
    height: 40,
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#FF6B35',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  folderList: {
    flex: 1,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  folderIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  folderName: {
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  emptyFolders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyFoldersText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
  },
  emptyFoldersSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
}); 