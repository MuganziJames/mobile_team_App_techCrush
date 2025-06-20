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

// Sample style data - African Fashion Collection (same as feed)
const sampleStyles = [
  {
    id: 1,
    title: 'Elegant Ankara Evening Gown',
    image: 'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg',
    category: 'Evening Wear',
    tags: ['elegant', 'formal', 'ankara', 'african'],
    color: '#8B4513',
    description: 'A stunning Ankara evening gown that celebrates African heritage with modern elegance. This sophisticated piece features traditional African prints with contemporary tailoring, perfect for formal occasions, cultural events, and celebrations that honor African beauty and craftsmanship.'
  },
  {
    id: 2,
    title: 'Kente Casual Chic',
    image: 'https://images.pexels.com/photos/6192591/pexels-photo-6192591.jpeg',
    category: 'Casual',
    tags: ['kente', 'casual', 'comfortable', 'african'],
    color: '#DAA520',
    description: 'Light and stylish casual wear featuring authentic Kente patterns. This comfortable ensemble combines traditional African textiles with modern cuts, perfect for cultural events, everyday wear, or any occasion where you want to showcase your African pride with contemporary flair.'
  },
  {
    id: 3,
    title: 'Professional Dashiki Look',
    image: 'https://images.pexels.com/photos/2480382/pexels-photo-2480382.jpeg',
    category: 'Business',
    tags: ['professional', 'dashiki', 'formal', 'african'],
    color: '#2F4F4F',
    description: 'Sharp and professional business attire featuring modern Dashiki elements. This polished look combines traditional African aesthetics with contemporary tailoring, perfect for boardroom meetings, professional events, and showcasing cultural pride in corporate settings.'
  },
  {
    id: 4,
    title: 'Bohemian Mudcloth Style',
    image: 'https://images.pexels.com/photos/2036646/pexels-photo-2036646.jpeg',
    category: 'Bohemian',
    tags: ['boho', 'mudcloth', 'artistic', 'african'],
    color: '#8B4513',
    description: 'Free-spirited bohemian style featuring authentic African mudcloth patterns. This artistic look embraces traditional African textiles with flowing silhouettes, perfect for creative events, cultural festivals, or expressing your connection to African artistic heritage.'
  },
  {
    id: 5,
    title: 'Sporty African Print Athleisure',
    image: 'https://images.pexels.com/photos/3760610/pexels-photo-3760610.jpeg',
    category: 'Athleisure',
    tags: ['sporty', 'african print', 'active', 'comfortable'],
    color: '#FF6347',
    description: 'Dynamic athleisure wear featuring vibrant African prints and modern athletic cuts. This versatile outfit seamlessly blends traditional African patterns with contemporary sportswear, perfect for active lifestyles while celebrating African design heritage.'
  },
  {
    id: 6,
    title: 'Vintage African Inspired',
    image: 'https://images.pexels.com/photos/3286680/pexels-photo-3286680.jpeg',
    category: 'Vintage',
    tags: ['vintage', 'retro', 'african', 'classic', 'heritage'],
    color: '#8B4513',
    description: 'Timeless vintage African ensemble featuring traditional patterns and classic silhouettes. This sophisticated look combines authentic African textiles with retro styling, celebrating the golden era of African fashion while maintaining contemporary elegance and cultural pride.'
  },
  {
    id: 7,
    title: 'Modern African Minimalist',
    image: 'https://images.pexels.com/photos/3062595/pexels-photo-3062595.jpeg',
    category: 'Minimalist',
    tags: ['minimal', 'clean', 'modern', 'african'],
    color: '#F5F5F5',
    description: 'Clean and modern minimalist style with subtle African influences. This sophisticated approach combines neutral tones with carefully chosen African-inspired details, creating maximum impact through thoughtful design that celebrates African aesthetics with contemporary elegance.'
  },
  {
    id: 8,
    title: 'Afrocentric Street Style',
    image: 'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
    category: 'Street Style',
    tags: ['afrocentric', 'urban', 'trendy', 'african'],
    color: '#696969',
    description: 'Bold Afrocentric street style that celebrates African culture in urban settings. This contemporary look combines traditional African elements with modern streetwear trends, perfect for making a cultural statement while navigating city life with confidence and pride.'
  },
  {
    id: 9,
    title: 'African Print Romantic Dress',
    image: 'https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg',
    category: 'Romantic',
    tags: ['romantic', 'african print', 'feminine', 'floral'],
    color: '#FFB6C1',
    description: 'Dreamy romantic dress featuring beautiful African floral prints. This enchanting piece combines traditional African textile artistry with feminine silhouettes, perfect for special occasions, cultural celebrations, or any moment that calls for romantic African elegance.'
  },
  {
    id: 10,
    title: 'Afropunk Rebellion',
    image: 'https://images.pexels.com/photos/1456741/pexels-photo-1456741.jpeg',
    category: 'Punk',
    tags: ['afropunk', 'rebellious', 'alternative', 'african'],
    color: '#8B0000',
    description: 'Bold Afropunk style that merges African heritage with rebellious spirit. This fierce look combines traditional African elements with punk aesthetics, perfect for music festivals, alternative events, or expressing your unique blend of cultural pride and non-conformist attitude.'
  },
  {
    id: 11,
    title: 'Tropical African Paradise',
    image: 'https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg',
    category: 'Resort',
    tags: ['tropical', 'vacation', 'colorful', 'african'],
    color: '#00CED1',
    description: 'Vibrant tropical-inspired outfit featuring authentic African prints and colors. This colorful ensemble captures the essence of African paradise with bold patterns and breezy fabrics, perfect for beach vacations, resort wear, or bringing African sunshine to your wardrobe.'
  },
  {
    id: 12,
    title: 'African Gothic Elegance',
    image: 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg',
    category: 'Gothic',
    tags: ['gothic', 'dark', 'mysterious', 'african'],
    color: '#2F2F2F',
    description: 'Mysterious gothic elegance with African influences. This dramatic look combines rich African textiles with dark, sophisticated styling to create an aura of cultural mystery, perfect for evening events or expressing your unique blend of African heritage and gothic aesthetics.'
  },
  {
    id: 13,
    title: 'Afrocentric Academia Style',
    image: 'https://images.pexels.com/photos/2218786/pexels-photo-2218786.jpeg',
    category: 'Preppy',
    tags: ['preppy', 'academic', 'classic', 'african'],
    color: '#8B4513',
    description: 'Classic academic style celebrating African intellectual heritage. This sophisticated look features traditional African elements with scholarly charm, perfect for academic settings, cultural institutions, or any environment where African intelligence meets impeccable style and cultural pride.'
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