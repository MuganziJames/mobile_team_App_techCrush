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
    StatusBar,
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
    description: 'A stunning black evening dress perfect for formal occasions. This sophisticated piece features a sleek silhouette that flatters every figure, making it ideal for galas, dinner parties, and special events. The timeless design ensures you\'ll look effortlessly elegant.'
  },
  {
    id: 2,
    title: 'Casual Summer Outfit',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
    category: 'Casual',
    tags: ['summer', 'casual', 'comfortable'],
    color: '#87CEEB',
    description: 'Light and breezy summer outfit perfect for warm weather adventures. This comfortable ensemble combines style with practicality, featuring breathable fabrics and a relaxed fit that\'s perfect for beach days, picnics, or casual outings with friends.'
  },
  {
    id: 3,
    title: 'Professional Business Look',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
    category: 'Business',
    tags: ['professional', 'business', 'formal'],
    color: '#2F4F4F',
    description: 'Sharp and professional business attire that commands respect in the boardroom. This polished look features clean lines and sophisticated tailoring, perfect for important meetings, presentations, and networking events. Confidence meets style.'
  },
  {
    id: 4,
    title: 'Bohemian Chic Style',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop',
    category: 'Bohemian',
    tags: ['boho', 'artistic', 'free-spirited'],
    color: '#DEB887',
    description: 'Free-spirited bohemian style with artistic flair and creative expression. This look embraces flowing fabrics, earthy tones, and unique accessories that tell a story. Perfect for music festivals, art galleries, or any occasion where you want to express your creative soul.'
  },
  {
    id: 5,
    title: 'Sporty Athleisure',
    image: 'https://images.unsplash.com/photo-1506629905607-d9c297d3d45b?w=400&h=600&fit=crop',
    category: 'Athleisure',
    tags: ['sporty', 'comfortable', 'active'],
    color: '#FF6347',
    description: 'Comfortable athleisure wear designed for active lifestyles without compromising on style. This versatile outfit transitions seamlessly from gym to street, featuring moisture-wicking fabrics and trendy cuts that keep you looking fresh all day long.'
  },
  {
    id: 6,
    title: 'Vintage Inspired Look',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop',
    category: 'Vintage',
    tags: ['vintage', 'retro', 'classic'],
    color: '#8B4513',
    description: 'Classic vintage-inspired outfit with timeless appeal that never goes out of style. This carefully curated look draws inspiration from fashion\'s golden eras, featuring authentic details and quality craftsmanship that celebrates the elegance of bygone times.'
  },
  {
    id: 7,
    title: 'Modern Minimalist',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
    category: 'Minimalist',
    tags: ['minimal', 'clean', 'modern'],
    color: '#F5F5F5',
    description: 'Clean and modern minimalist style that proves less is more. This sophisticated approach to fashion focuses on quality over quantity, featuring neutral colors, simple silhouettes, and impeccable tailoring that creates maximum impact with minimal effort.'
  },
  {
    id: 8,
    title: 'Street Style Edge',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
    category: 'Street Style',
    tags: ['edgy', 'urban', 'trendy'],
    color: '#696969',
    description: 'Edgy street style with urban flair that captures the pulse of city fashion. This bold look combines unexpected elements and contemporary trends, perfect for making a statement while navigating the urban jungle with confidence and attitude.'
  },
  {
    id: 9,
    title: 'Romantic Floral Dress',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop',
    category: 'Romantic',
    tags: ['romantic', 'floral', 'feminine'],
    color: '#FFB6C1',
    description: 'Dreamy romantic floral dress that embodies feminine grace and natural beauty. This enchanting piece features delicate floral patterns and flowing fabrics that dance with every step, perfect for garden parties, brunch dates, or any occasion that calls for a touch of romance.'
  },
  {
    id: 10,
    title: 'Punk Rock Rebellion',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop',
    category: 'Punk',
    tags: ['punk', 'rebellious', 'alternative'],
    color: '#8B0000',
    description: 'Bold punk rock style that challenges conventions and embraces rebellion. This fierce look features leather, studs, and attitude, perfect for concerts, alternative events, or whenever you want to express your non-conformist spirit and rock the world with your unique style.'
  },
  {
    id: 11,
    title: 'Tropical Paradise Vibes',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
    category: 'Resort',
    tags: ['tropical', 'vacation', 'colorful'],
    color: '#00CED1',
    description: 'Vibrant tropical-inspired outfit that brings vacation vibes wherever you go. This colorful ensemble features bold prints and breezy fabrics that capture the essence of paradise, perfect for beach vacations, pool parties, or adding a splash of sunshine to your everyday wardrobe.'
  },
  {
    id: 12,
    title: 'Gothic Elegance',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop',
    category: 'Gothic',
    tags: ['gothic', 'dark', 'mysterious'],
    color: '#2F2F2F',
    description: 'Mysterious gothic elegance that embraces the beauty of darkness. This dramatic look combines rich textures, deep colors, and intricate details to create an aura of sophisticated mystery, perfect for evening events or expressing your darker aesthetic sensibilities.'
  },
  {
    id: 13,
    title: 'Preppy Academia Style',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop',
    category: 'Preppy',
    tags: ['preppy', 'academic', 'classic'],
    color: '#8B4513',
    description: 'Classic preppy academia style that channels intellectual sophistication. This timeless look features traditional patterns, quality fabrics, and scholarly charm, perfect for campus life, library sessions, or any setting where intelligence meets impeccable style and refined taste.'
  }
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
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header - now scrollable */}
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
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: width,
    height: width * 1.2,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
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