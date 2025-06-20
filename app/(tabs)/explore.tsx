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

// Sample style data - African Fashion Collection (same as feed)
const allStyles: Style[] = [
  {
    id: 1,
    title: 'Elegant Ankara Evening Gown',
    image: require('../../assets/images/modernAfrican.jpg'),
    category: 'Evening Wear',
    tags: ['elegant', 'formal', 'ankara', 'african'],
    color: '#8B4513',
    description: 'A stunning Ankara evening gown that celebrates African heritage with modern elegance. This sophisticated piece features traditional African prints with contemporary tailoring, perfect for formal occasions, cultural events, and celebrations that honor African beauty and craftsmanship.'
  },
  {
    id: 2,
    title: 'Kente Casual Chic',
    image: require('../../assets/images/elegantAfrican.jpg'),
    category: 'Casual',
    tags: ['kente', 'casual', 'comfortable', 'african'],
    color: '#DAA520',
    description: 'Light and stylish casual wear featuring authentic Kente patterns. This comfortable ensemble combines traditional African textiles with modern cuts, perfect for cultural events, everyday wear, or any occasion where you want to showcase your African pride with contemporary flair.'
  },
  {
    id: 3,
    title: 'Professional Dashiki Look',
    image: require('../../assets/images/tropicalAfricanParadise.jpg'),
    category: 'Business',
    tags: ['professional', 'dashiki', 'formal', 'african'],
    color: '#2F4F4F',
    description: 'Sharp and professional business attire featuring modern Dashiki elements. This polished look combines traditional African aesthetics with contemporary tailoring, perfect for boardroom meetings, professional events, and showcasing cultural pride in corporate settings.'
  },
  {
    id: 4,
    title: 'Bohemian Mudcloth Style',
    image: require('../../assets/images/kenteCasual.jpg'),
    category: 'Bohemian',
    tags: ['boho', 'mudcloth', 'artistic', 'african'],
    color: '#8B4513',
    description: 'Free-spirited bohemian style featuring authentic African mudcloth patterns. This artistic look embraces traditional African textiles with flowing silhouettes, perfect for creative events, cultural festivals, or expressing your connection to African artistic heritage.'
  },
  {
    id: 5,
    title: 'Sporty African Print Athleisure',
    image: require('../../assets/images/afroPunk.jpg'),
    category: 'Athleisure',
    tags: ['sporty', 'african print', 'active', 'comfortable'],
    color: '#FF6347',
    description: 'Dynamic athleisure wear featuring vibrant African prints and modern athletic cuts. This versatile outfit seamlessly blends traditional African patterns with contemporary sportswear, perfect for active lifestyles while celebrating African design heritage.'
  },
  {
    id: 6,
    title: 'Vintage African Inspired',
    image: require('../../assets/images/vintageAfrican.jpg'),
    category: 'Vintage',
    tags: ['vintage', 'retro', 'african', 'classic', 'heritage'],
    color: '#8B4513',
    description: 'Timeless vintage African ensemble featuring traditional patterns and classic silhouettes. This sophisticated look combines authentic African textiles with retro styling, celebrating the golden era of African fashion while maintaining contemporary elegance and cultural pride.'
  },
  {
    id: 7,
    title: 'Modern African Minimalist',
    image: require('../../assets/images/bohemianCloth.jpg'),
    category: 'Minimalist',
    tags: ['minimal', 'clean', 'modern', 'african'],
    color: '#F5F5F5',
    description: 'Clean and modern minimalist style with subtle African influences. This sophisticated approach combines neutral tones with carefully chosen African-inspired details, creating maximum impact through thoughtful design that celebrates African aesthetics with contemporary elegance.'
  },
  {
    id: 8,
    title: 'Afrocentric Street Style',
    image: require('../../assets/images/danshikiLook.jpg'),
    category: 'Street Style',
    tags: ['afrocentric', 'urban', 'trendy', 'african'],
    color: '#696969',
    description: 'Bold Afrocentric street style that celebrates African culture in urban settings. This contemporary look combines traditional African elements with modern streetwear trends, perfect for making a cultural statement while navigating city life with confidence and pride.'
  },
  {
    id: 9,
    title: 'African Print Romantic Dress',
    image: require('../../assets/images/afroCentricStyle.jpg'),
    category: 'Romantic',
    tags: ['romantic', 'african print', 'feminine', 'floral'],
    color: '#FFB6C1',
    description: 'Dreamy romantic dress featuring beautiful African floral prints. This enchanting piece combines traditional African textile artistry with feminine silhouettes, perfect for special occasions, cultural celebrations, or any moment that calls for romantic African elegance.'
  },
  {
    id: 10,
    title: 'Afropunk Rebellion',
    image: require('../../assets/images/africaGothicElegance.jpg'),
    category: 'Punk',
    tags: ['afropunk', 'rebellious', 'alternative', 'african'],
    color: '#8B0000',
    description: 'Bold Afropunk style that merges African heritage with rebellious spirit. This fierce look combines traditional African elements with punk aesthetics, perfect for music festivals, alternative events, or expressing your unique blend of cultural pride and non-conformist attitude.'
  },
  {
    id: 11,
    title: 'Tropical African Paradise',
    image: require('../../assets/images/AfricanPrintRomanticDress.jpg'),
    category: 'Resort',
    tags: ['tropical', 'vacation', 'colorful', 'african'],
    color: '#00CED1',
    description: 'Vibrant tropical-inspired outfit featuring authentic African prints and colors. This colorful ensemble captures the essence of African paradise with bold patterns and breezy fabrics, perfect for beach vacations, resort wear, or bringing African sunshine to your wardrobe.'
  },
  {
    id: 12,
    title: 'African Gothic Elegance',
    image: require('../../assets/images/africaGothicElegance.jpg'),
    category: 'Gothic',
    tags: ['gothic', 'dark', 'mysterious', 'african'],
    color: '#2F2F2F',
    description: 'Mysterious gothic elegance with African influences. This dramatic look combines rich African textiles with dark, sophisticated styling to create an aura of cultural mystery, perfect for evening events or expressing your unique blend of African heritage and gothic aesthetics.'
  },
  {
    id: 13,
    title: 'Afrocentric Academia Style',
    image: require('../../assets/images/afroCentricStyle.jpg'),
    category: 'Preppy',
    tags: ['preppy', 'academic', 'classic', 'african'],
    color: '#8B4513',
    description: 'Classic academic style celebrating African intellectual heritage. This sophisticated look features traditional African elements with scholarly charm, perfect for academic settings, cultural institutions, or any environment where African intelligence meets impeccable style and cultural pride.'
  }
];

const categories = ['All', 'Evening Wear', 'Casual', 'Business', 'Bohemian', 'Athleisure', 'Vintage', 'Minimalist', 'Street Style', 'Romantic', 'Punk', 'Resort', 'Gothic', 'Preppy'];
const colors = ['All', '#000000', '#87CEEB', '#2F4F4F', '#DEB887', '#FF6347', '#8B4513', '#F5F5F5', '#696969', '#FFB6C1', '#8B0000', '#00CED1', '#2F2F2F'];
const tags = ['All', 'elegant', 'casual', 'formal', 'summer', 'professional', 'boho', 'sporty', 'vintage', 'minimal', 'edgy', 'romantic', 'floral', 'feminine', 'punk', 'rebellious', 'alternative', 'tropical', 'vacation', 'colorful', 'gothic', 'dark', 'mysterious', 'preppy', 'academic', 'classic'];

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

        {/* Clear All Filters */}
        <View style={styles.clearAllContainer}>
          <TouchableOpacity onPress={clearAllFilters} style={styles.clearAllButton}>
            <Ionicons name="refresh-outline" size={16} color="#007AFF" />
            <Text style={styles.clearAllText}>Clear All Filters</Text>
          </TouchableOpacity>
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
    paddingTop: 42,
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
  clearAllContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  clearAllText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#007AFF',
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
