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
    description: 'A stunning black evening dress perfect for formal occasions.'
  },
  {
    id: 2,
    title: 'Casual Summer Outfit',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
    category: 'Casual',
    tags: ['summer', 'casual', 'comfortable'],
    color: '#87CEEB',
    description: 'Light and breezy summer outfit for everyday wear.'
  },
  {
    id: 3,
    title: 'Professional Business Look',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
    category: 'Business',
    tags: ['professional', 'business', 'formal'],
    color: '#2F4F4F',
    description: 'Sharp and professional business attire.'
  },
  {
    id: 4,
    title: 'Bohemian Chic Style',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop',
    category: 'Bohemian',
    tags: ['boho', 'artistic', 'free-spirited'],
    color: '#DEB887',
    description: 'Free-spirited bohemian style with artistic flair.'
  },
  {
    id: 5,
    title: 'Sporty Athleisure',
    image: 'https://images.unsplash.com/photo-1506629905607-d9c297d3d45b?w=400&h=600&fit=crop',
    category: 'Athleisure',
    tags: ['sporty', 'comfortable', 'active'],
    color: '#FF6347',
    description: 'Comfortable athleisure wear for active lifestyles.'
  },
  {
    id: 6,
    title: 'Vintage Inspired Look',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop',
    category: 'Vintage',
    tags: ['vintage', 'retro', 'classic'],
    color: '#8B4513',
    description: 'Classic vintage-inspired outfit with timeless appeal.'
  },
  {
    id: 7,
    title: 'Modern Minimalist',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
    category: 'Minimalist',
    tags: ['minimal', 'clean', 'modern'],
    color: '#F5F5F5',
    description: 'Clean and modern minimalist style.'
  },
  {
    id: 8,
    title: 'Street Style Edge',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
    category: 'Street Style',
    tags: ['edgy', 'urban', 'trendy'],
    color: '#696969',
    description: 'Edgy street style with urban flair.'
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
