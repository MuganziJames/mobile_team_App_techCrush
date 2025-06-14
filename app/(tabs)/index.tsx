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

// Sample style data
const sampleStyles: Style[] = [
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
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.firstName || 'User'}!
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
