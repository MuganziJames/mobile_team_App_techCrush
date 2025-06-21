import StyleCard from '@/components/StyleCard';
import EmptyState from '@/components/ui/EmptyState';
import Colors from '@/constants/Colors';
import { useCategory } from '@/contexts/CategoryContext';
import { Style, useLookbook } from '@/contexts/LookbookContext';
import { useOutfit } from '@/contexts/OutfitContext';
import { outfitsToStyles } from '@/utils/outfitAdapter';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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

// Common tags for filtering
const tags = [
  'All', 
  'african', 
  'ankara', 
  'traditional', 
  'modern', 
  'elegant', 
  'casual', 
  'formal', 
  'professional', 
  'vintage', 
  'bohemian', 
  'romantic', 
  'sporty', 
  'colorful', 
  'vibrant', 
  'comfortable', 
  'stylish', 
  'chic', 
  'trendy', 
  'classic', 
  'contemporary', 
  'artistic', 
  'cultural'
];

export default function SearchScreen() {
  const { outfits, loading, searchOutfits } = useOutfit();
  const { categories } = useCategory();
  const { 
    folders, 
    saveStyleToFolder, 
    isStyleSaved 
  } = useLookbook();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [searchResults, setSearchResults] = useState<Style[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Convert outfits to styles for display
  const allStyles = outfitsToStyles(outfits);

  // Create categories array with API data
  const categoryOptions = ['All', ...categories.map(cat => cat.name)];

  // Filter styles based on search criteria
  const getFilteredStyles = () => {
    if (searchQuery.trim()) {
      return searchResults;
    }

    let filtered = allStyles;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(style => 
        style.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by tags
    if (selectedTags.length > 0 && !selectedTags.includes('All')) {
      filtered = filtered.filter(style =>
        selectedTags.some(tag => 
          style.tags.some(styleTag => 
            styleTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    return filtered;
  };

  const filteredStyles = getFilteredStyles();

  // Handle search with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const results = await searchOutfits(searchQuery);
          setSearchResults(outfitsToStyles(results));
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleTagToggle = (tag: string) => {
    if (tag === 'All') {
      setSelectedTags([]);
    } else {
      setSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev.filter(t => t !== 'All'), tag]
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
    setSelectedTags([]);
    setSearchResults([]);
  };

  const renderStyleCard = ({ item }: { item: Style }) => (
    <StyleCard
      style={item}
      onSave={handleSaveStyle}
      isSaved={isStyleSaved(item.id)}
    />
  );

  const renderSearchHeader = () => (
    <View style={componentStyles.searchContainer}>
      <View style={componentStyles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#999" style={componentStyles.searchIcon} />
            <TextInput
          style={componentStyles.searchInput}
          placeholder="Search styles..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={componentStyles.clearButton}
          >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
      
      {(selectedCategory !== 'All' || selectedTags.length > 0) && (
        <TouchableOpacity 
          style={componentStyles.clearFiltersButton}
          onPress={clearAllFilters}
        >
          <Text style={componentStyles.clearFiltersText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
        </View>
  );

  const renderFilters = () => (
    <View style={componentStyles.filtersContainer}>
      {/* Categories */}
      <View style={componentStyles.filterSection}>
        <Text style={componentStyles.filterTitle}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={componentStyles.filterScrollView}
        >
          {categoryOptions.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                componentStyles.filterChip,
                selectedCategory === category && componentStyles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                componentStyles.filterChipText,
                selectedCategory === category && componentStyles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      {/* Tags */}
      <View style={componentStyles.filterSection}>
        <Text style={componentStyles.filterTitle}>Tags</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={componentStyles.filterScrollView}
        >
          {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                componentStyles.filterChip,
                (selectedTags.includes(tag) || (tag === 'All' && selectedTags.length === 0)) && componentStyles.filterChipActive
                ]}
                onPress={() => handleTagToggle(tag)}
              >
                <Text style={[
                componentStyles.filterChipText,
                (selectedTags.includes(tag) || (tag === 'All' && selectedTags.length === 0)) && componentStyles.filterChipTextActive
                ]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading && allStyles.length === 0) {
      return (
        <View style={componentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={componentStyles.loadingText}>Loading styles...</Text>
          </View>
      );
    }

    if (isSearching) {
      return (
        <View style={componentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={componentStyles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (filteredStyles.length === 0) {
      const isFiltered = searchQuery.trim() || selectedCategory !== 'All' || selectedTags.length > 0;
      return (
        <View style={componentStyles.emptyContainer}>
          <EmptyState
            icon={isFiltered ? "search-outline" : "shirt-outline"}
            title={isFiltered ? "No Styles Found" : "No Styles Available"}
            description={isFiltered ? "Try adjusting your search or filters" : "Check back later for new styles"}
            actionText={isFiltered ? "Clear Filters" : "Refresh"}
            onActionPress={isFiltered ? clearAllFilters : undefined}
          />
        </View>
      );
    }

    // Return null for FlatList to handle the data
    return null;
  };

  const renderListHeader = () => (
    <View>
      {renderSearchHeader()}
      {renderFilters()}
      <View style={componentStyles.resultsContainer}>
        <Text style={componentStyles.resultsTitle}>
          {searchQuery.trim() ? `Search Results (${filteredStyles.length})` : `All Styles (${filteredStyles.length})`}
              </Text>
            </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading && allStyles.length === 0) {
      return (
        <View style={componentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={componentStyles.loadingText}>Loading styles...</Text>
        </View>
      );
    }

    if (isSearching) {
      return (
        <View style={componentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={componentStyles.loadingText}>Searching...</Text>
        </View>
      );
    }

    const isFiltered = searchQuery.trim() || selectedCategory !== 'All' || selectedTags.length > 0;
    return (
      <View style={componentStyles.emptyContainer}>
        <EmptyState
          icon={isFiltered ? "search-outline" : "shirt-outline"}
          title={isFiltered ? "No Styles Found" : "No Styles Available"}
          description={isFiltered ? "Try adjusting your search or filters" : "Check back later for new styles"}
          actionText={isFiltered ? "Clear Filters" : "Refresh"}
          onActionPress={isFiltered ? clearAllFilters : undefined}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={componentStyles.container}>
            <FlatList
              data={filteredStyles}
              renderItem={renderStyleCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
        columnWrapperStyle={componentStyles.row}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={componentStyles.flatListContent}
        showsVerticalScrollIndicator={false}
      />

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
                >
                  <View style={componentStyles.folderIcon}>
                    <Ionicons name="folder" size={24} color={Colors.primary} />
                  </View>
                  <Text style={componentStyles.folderName}>{item.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={componentStyles.separator} />}
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
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.darkGray,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginLeft: 8,
  },
  clearFiltersButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 16,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  filterScrollView: {
    paddingLeft: 16,
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  flatListContent: {
    paddingBottom: 20,
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
    color: Colors.primary,
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
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  folderIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  folderName: {
    fontSize: 16,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
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
