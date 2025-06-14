import StyleCard from '@/components/StyleCard';
import { Style, useLookbook } from '@/contexts/LookbookContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Sample style data (same as feed)
const allStyles: Style[] = [
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

const categories = ['All', 'Evening Wear', 'Casual', 'Business', 'Bohemian', 'Athleisure', 'Vintage', 'Minimalist', 'Street Style'];
const colors = ['All', '#000000', '#87CEEB', '#2F4F4F', '#DEB887', '#FF6347', '#8B4513', '#F5F5F5', '#696969'];
const tags = ['All', 'elegant', 'casual', 'formal', 'summer', 'professional', 'boho', 'sporty', 'vintage', 'minimal', 'edgy'];

export default function SearchScreen() {
  const { 
    folders, 
    saveStyleToFolder, 
    isStyleSaved 
  } = useLookbook();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);

  // Filter styles based on search criteria
  const filteredStyles = allStyles.filter(style => {
    const matchesSearch = searchQuery === '' || 
      style.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || style.category === selectedCategory;
    const matchesColor = selectedColor === 'All' || style.color === selectedColor;
    const matchesTags = selectedTags.length === 0 || selectedTags.includes('All') ||
      selectedTags.some(tag => style.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesColor && matchesTags;
  });

  const handleTagToggle = (tag: string) => {
    if (tag === 'All') {
      setSelectedTags([]);
    } else {
      setSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    }
  };

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

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedColor('All');
    setSelectedTags([]);
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Search Styles</Text>
          <TouchableOpacity onPress={clearAllFilters} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search styles, categories, tags..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Color Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorChip,
                  selectedColor === color && styles.colorChipActive
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {color === 'All' ? (
                  <Text style={styles.colorChipText}>All</Text>
                ) : (
                  <View style={[styles.colorDot, { backgroundColor: color }]} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tags Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagChip,
                  (selectedTags.includes(tag) || (tag === 'All' && selectedTags.length === 0)) && styles.tagChipActive
                ]}
                onPress={() => handleTagToggle(tag)}
              >
                <Text style={[
                  styles.tagChipText,
                  (selectedTags.includes(tag) || (tag === 'All' && selectedTags.length === 0)) && styles.tagChipTextActive
                ]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            {filteredStyles.length} style{filteredStyles.length !== 1 ? 's' : ''} found
          </Text>
          
          {filteredStyles.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={60} color="#E0E0E0" />
              <Text style={styles.noResultsText}>No styles found</Text>
              <Text style={styles.noResultsSubtext}>
                Try adjusting your search criteria
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredStyles}
              renderItem={renderStyleCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
              scrollEnabled={false}
            />
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#FF6B35',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  colorChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorChipActive: {
    borderColor: '#FF6B35',
  },
  colorChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipActive: {
    backgroundColor: '#FF6B35',
  },
  tagChipText: {
    fontSize: 12,
    color: '#666',
  },
  tagChipTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  resultsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
