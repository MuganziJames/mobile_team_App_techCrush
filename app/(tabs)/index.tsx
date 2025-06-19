import StyleCard from '@/components/StyleCard';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Style, useLookbook } from '@/contexts/LookbookContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Sample style data - African Fashion Collection
const sampleStyles: Style[] = [
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
    image: 'https://images.pexels.com/photos/3021550/pexels-photo-3021550.jpeg',
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
    image: 'https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg',
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
    tags: ['vintage', 'retro', 'african', 'classic'],
    color: '#8B4513',
    description: 'Classic vintage-inspired outfit celebrating African fashion heritage. This timeless look draws from traditional African garments reinterpreted for modern wear, featuring authentic patterns and quality craftsmanship that honors the rich history of African fashion.'
  },
  {
    id: 7,
    title: 'Modern African Minimalist',
    image: 'https://images.pexels.com/photos/1937336/pexels-photo-1937336.jpeg',
    category: 'Minimalist',
    tags: ['minimal', 'clean', 'modern', 'african'],
    color: '#F5F5F5',
    description: 'Clean and modern minimalist style with subtle African influences. This sophisticated approach combines neutral tones with carefully chosen African-inspired details, creating maximum impact through thoughtful design that celebrates African aesthetics with contemporary elegance.'
  },
  {
    id: 8,
    title: 'Afrocentric Street Style',
    image: 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg',
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
    image: 'https://images.pexels.com/photos/935985/pexels-photo-935985.jpeg',
    category: 'Punk',
    tags: ['afropunk', 'rebellious', 'alternative', 'african'],
    color: '#8B0000',
    description: 'Bold Afropunk style that merges African heritage with rebellious spirit. This fierce look combines traditional African elements with punk aesthetics, perfect for music festivals, alternative events, or expressing your unique blend of cultural pride and non-conformist attitude.'
  },
  {
    id: 11,
    title: 'Tropical African Paradise',
    image: 'https://images.pexels.com/photos/1456741/pexels-photo-1456741.jpeg',
    category: 'Resort',
    tags: ['tropical', 'vacation', 'colorful', 'african'],
    color: '#00CED1',
    description: 'Vibrant tropical-inspired outfit featuring authentic African prints and colors. This colorful ensemble captures the essence of African paradise with bold patterns and breezy fabrics, perfect for beach vacations, resort wear, or bringing African sunshine to your wardrobe.'
  },
  {
    id: 12,
    title: 'African Gothic Elegance',
    image: 'https://images.pexels.com/photos/2060241/pexels-photo-2060241.jpeg',
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

export default function FeedScreen() {
  const { user } = useAuth();
  const { 
    folders, 
    saveStyleToFolder, 
    isStyleSaved 
  } = useLookbook();
  
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);

  const handleSaveStyle = (style: Style) => {
    if (isStyleSaved(style.id)) {
      Alert.alert(
        'Style Already Saved',
        'This style is already in your lookbook. What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Move to Different Folder', 
            onPress: () => {
              setSelectedStyle(style);
              setShowFolderModal(true);
            }
          }
        ]
      );
    } else {
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
      Alert.alert(
        'Style Saved!',
        `"${selectedStyle.title}" has been saved to ${folderName}.`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderStyleCard = ({ item }: { item: Style }) => (
    <StyleCard
      style={item}
      onSave={handleSaveStyle}
      isSaved={isStyleSaved(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Style Feed</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="search-outline" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </Text>
        <Text style={styles.subText}>
          Discover new styles and save them to your lookbook
        </Text>
      </View>

      <FlatList
        data={sampleStyles}
        renderItem={renderStyleCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      />

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
              Choose a folder for "{selectedStyle?.title}"
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
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  feedContent: {
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
