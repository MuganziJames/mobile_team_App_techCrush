import StyleCard from '@/components/StyleCard';
import EmptyState from '@/components/ui/EmptyState';
import SuccessCard from '@/components/ui/SuccessCard';
import Colors from '@/constants/Colors';
import { useCategory } from '@/contexts/CategoryContext';
import { Style, useLookbook } from '@/contexts/LookbookContext';
import { useOutfit } from '@/contexts/OutfitContext';
import { outfitsToStyles } from '@/utils/outfitAdapter';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
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
  const { outfits, loading } = useOutfit();
  const { categories } = useCategory();
  const { 
    folders, 
    saveStyleToFolder, 
    isStyleSaved,
    removeStyleFromFolder,
    getStyleFolder
  } = useLookbook();
  
  const [searchInput, setSearchInput] = useState(''); // What user types
  const [searchQuery, setSearchQuery] = useState(''); // What actually gets searched
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  
  // Convert outfits to styles for display - memoize to prevent unnecessary recalculations
  const allStyles = useMemo(() => outfitsToStyles(outfits), [outfits]);

  // Create categories array with API data - memoize to prevent unnecessary recreations
  const categoryOptions = useMemo(() => ['All', ...categories.map(cat => cat.name)], [categories]);

  // Frontend search function
  const searchStyles = (styles: Style[], query: string): Style[] => {
    if (!query.trim()) return styles;
    
    const searchTerm = query.toLowerCase().trim();
    
    return styles.filter(style => {
      // Search in title
      const titleMatch = style.title.toLowerCase().includes(searchTerm);
      
      // Search in description
      const descriptionMatch = style.description?.toLowerCase().includes(searchTerm) || false;
      
      // Search in category
      const categoryMatch = style.category.toLowerCase().includes(searchTerm);
      
      // Search in tags
      const tagMatch = style.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
      
      return titleMatch || descriptionMatch || categoryMatch || tagMatch;
    });
  };

  // Filter styles based on search criteria - only recalculate when search query or filters change
  const filteredStyles = useMemo(() => {    
    let filtered = allStyles;

    // Apply search filter first (only when there's an active search query)
    if (searchQuery.trim()) {
      filtered = searchStyles(filtered, searchQuery);
    }

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
  }, [allStyles, searchQuery, selectedCategory, selectedTags]); // Only depend on actual search query, not input

  // Handle search when user presses Enter
  const handleSearchSubmit = useCallback(() => {
    setSearchQuery(searchInput.trim());
  }, [searchInput]);

  // Handle clearing search
  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    if (tag === 'All') {
      setSelectedTags([]);
    } else {
      setSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev.filter(t => t !== 'All'), tag]
      );
    }
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSaveStyle = useCallback(async (style: Style) => {
    if (isStyleSaved(style.id)) {
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
      }
    } else {
      // Style not saved - show folder selection
      setSelectedStyle(style);
      setShowFolderModal(true);
    }
  }, [isStyleSaved, getStyleFolder, folders, removeStyleFromFolder]);

  const handleFolderSelect = useCallback(async (folderId: string) => {
    if (selectedStyle) {
      await saveStyleToFolder(selectedStyle, folderId);
      setShowFolderModal(false);
      setSelectedStyle(null);
      
      const folderName = folders.find(f => f.id === folderId)?.name || 'folder';
      setSuccessMessage({
        title: 'Style Saved!',
        message: `"${selectedStyle.title}" has been saved to ${folderName}.`
      });
      setShowSuccessCard(true);
    }
  }, [selectedStyle, saveStyleToFolder, folders]);

  const clearAllFilters = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTags([]);
  }, []);

  // Handle text input changes
  const handleTextInputChange = useCallback((text: string) => {
    setSearchInput(text);
  }, []);

  const renderStyleCard = useCallback(({ item }: { item: Style }) => (
    <StyleCard
      style={item}
      onSave={handleSaveStyle}
      isSaved={isStyleSaved(item.id)}
    />
  ), [handleSaveStyle, isStyleSaved]);

  const renderFilters = useCallback(() => (
    <View style={componentStyles.filtersContainer}>
      {/* Categories */}
      <View style={componentStyles.filterSection}>
        <Text style={componentStyles.filterTitle}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={componentStyles.filterScrollView}
        >
          {categoryOptions.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[
                  componentStyles.filterChip,
                  isActive && componentStyles.filterChipActive
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={[
                  componentStyles.filterChipText,
                  isActive && componentStyles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
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
          {tags.map((tag) => {
            const isActive = selectedTags.includes(tag) || (tag === 'All' && selectedTags.length === 0);
            return (
              <TouchableOpacity
                key={tag}
                style={[
                  componentStyles.filterChip,
                  isActive && componentStyles.filterChipActive
                ]}
                onPress={() => handleTagToggle(tag)}
              >
                <Text style={[
                  componentStyles.filterChipText,
                  isActive && componentStyles.filterChipTextActive
                ]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  ), [selectedCategory, selectedTags, categoryOptions, handleTagToggle, handleCategorySelect]);

  const renderFiltersAndResults = useCallback(() => (
    <View>
      {renderFilters()}
      <View style={componentStyles.resultsContainer}>
        <Text style={componentStyles.resultsTitle}>
          {searchQuery.trim() ? 
            `Search Results for "${searchQuery}" (${filteredStyles.length})` : 
            `All Styles (${filteredStyles.length})`
          }
        </Text>
      </View>
    </View>
  ), [filteredStyles, searchQuery, renderFilters]);

  const renderEmptyComponent = useCallback(() => {
    if (loading && allStyles.length === 0) {
      return (
        <View style={componentStyles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={componentStyles.loadingText}>Loading styles...</Text>
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
  }, [loading, allStyles, searchQuery, selectedCategory, selectedTags, clearAllFilters]);

  return (
    <SafeAreaView style={componentStyles.container}>
      <SuccessCard
        visible={showSuccessCard}
        title={successMessage.title}
        message={successMessage.message}
        onClose={() => setShowSuccessCard(false)}
      />
      
      {/* Search Header - Outside FlatList to prevent keyboard dismissal */}
      <View style={componentStyles.searchContainer}>
        <View style={componentStyles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={componentStyles.searchIcon} />
          <TextInput
            style={componentStyles.searchInput}
            placeholder="Search styles... (Press Enter to search)"
            value={searchInput}
            onChangeText={handleTextInputChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            placeholderTextColor="#999"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity 
              onPress={handleClearSearch}
              style={componentStyles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Show current active search query if different from input */}
        {searchQuery && searchQuery !== searchInput && (
          <View style={componentStyles.activeSearchContainer}>
            <Text style={componentStyles.activeSearchText}>
              Searching for: "{searchQuery}"
            </Text>
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        {(searchQuery || selectedCategory !== 'All' || selectedTags.length > 0) && (
          <TouchableOpacity 
            style={componentStyles.clearFiltersButton}
            onPress={clearAllFilters}
          >
            <Text style={componentStyles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={filteredStyles}
        renderItem={renderStyleCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={componentStyles.row}
        ListHeaderComponent={renderFiltersAndResults}
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
  activeSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  activeSearchText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
});
