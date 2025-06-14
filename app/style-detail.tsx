import { useLookbook } from '@/contexts/LookbookContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Sample style data (same as feed)
const sampleStyles = [
  {
    id: 1,
    title: 'Elegant Evening Dress',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
    category: 'Evening Wear',
    tags: ['elegant', 'formal', 'black'],
    color: '#000000',
    description: 'A stunning black evening dress perfect for formal occasions. This sophisticated piece features a sleek silhouette that flatters every figure, making it ideal for galas, dinner parties, and special events.'
  },
  {
    id: 2,
    title: 'Casual Summer Outfit',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
    category: 'Casual',
    tags: ['summer', 'casual', 'comfortable'],
    color: '#87CEEB',
    description: 'Light and breezy summer outfit for everyday wear. Perfect for warm weather, this comfortable ensemble combines style with practicality for all your casual adventures.'
  },
  // Add more styles as needed...
];

export default function StyleDetailScreen() {
  const { id } = useLocalSearchParams();
  const { 
    folders, 
    saveStyleToFolder, 
    isStyleSaved, 
    getStyleFolder 
  } = useLookbook();
  
  const [showFolderModal, setShowFolderModal] = useState(false);

  const style = sampleStyles.find(s => s.id === parseInt(id as string));

  if (!style) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Style not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isSaved = isStyleSaved(style.id);
  const currentFolder = getStyleFolder(style.id);

  const handleSave = () => {
    if (isSaved) {
      Alert.alert(
        'Style Already Saved',
        'This style is already in your lookbook. What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Move to Different Folder', 
            onPress: () => setShowFolderModal(true)
          }
        ]
      );
    } else {
      setShowFolderModal(true);
    }
  };

  const handleFolderSelect = async (folderId: string) => {
    await saveStyleToFolder(style, folderId);
    setShowFolderModal(false);
    
    const folderName = folders.find(f => f.id === folderId)?.name || 'folder';
    Alert.alert(
      'Style Saved!',
      `"${style.title}" has been saved to ${folderName}.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
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

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: style.image }} style={styles.image} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{style.title}</Text>
            <Text style={styles.category}>{style.category}</Text>
          </View>

          {isSaved && currentFolder && (
            <View style={styles.savedIndicator}>
              <Ionicons name="bookmark" size={16} color="#FF6B35" />
              <Text style={styles.savedText}>
                Saved in {folders.find(f => f.id === currentFolder)?.name}
              </Text>
            </View>
          )}

          <View style={styles.colorSection}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorInfo}>
              <View 
                style={[styles.colorDot, { backgroundColor: style.color }]} 
              />
              <Text style={styles.colorText}>{style.color}</Text>
            </View>
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {style.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{style.description}</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.saveButton,
              isSaved && styles.saveButtonSaved
            ]}
            onPress={handleSave}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={isSaved ? "#FF6B35" : "#fff"} 
            />
            <Text style={[
              styles.saveButtonText,
              isSaved && styles.saveButtonTextSaved
            ]}>
              {isSaved ? 'Saved to Lookbook' : 'Save to Lookbook'}
            </Text>
          </TouchableOpacity>
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
            
            {folders.map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={styles.folderOption}
                onPress={() => handleFolderSelect(folder.id)}
              >
                <View 
                  style={[
                    styles.folderColorIndicator, 
                    { backgroundColor: folder.color }
                  ]} 
                />
                <Text style={styles.folderOptionText}>{folder.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: width,
    height: height * 0.6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  savedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  savedText: {
    fontSize: 14,
    color: '#FF6B35',
    marginLeft: 6,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  colorSection: {
    marginBottom: 20,
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  colorText: {
    fontSize: 16,
    color: '#333',
    textTransform: 'uppercase',
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  descriptionSection: {
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  saveButtonSaved: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButtonTextSaved: {
    color: '#FF6B35',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  folderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  folderColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  folderOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
}); 