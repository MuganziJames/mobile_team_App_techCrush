import { useLookbook } from '@/contexts/LookbookContext';
import { blogPosts } from '@/data/blogData';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function BlogScreen() {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { 
    folders, 
    saveStyleToFolder, 
    isStyleSaved 
  } = useLookbook();

  const featuredPosts = blogPosts.filter(post => post.featured);
  const popularPosts = blogPosts.slice(0, 4);

  // Filter posts based on search query
  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleBack = () => {
    setShowAll(false);
  };

  const handleSave = (post: any) => {
    const style = {
      id: post.id,
      title: post.title,
      image: post.image,
      category: post.category,
      tags: [post.category.toLowerCase()],
      color: '#FF6B35',
      description: post.title
    };

    if (isStyleSaved(post.id)) {
      Alert.alert(
        'Post Already Saved',
        'This post is already in your lookbook. What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Move to Different Folder', 
            onPress: () => {
              setSelectedPost(style);
              setShowFolderModal(true);
            }
          }
        ]
      );
    } else {
      setSelectedPost(style);
      setShowFolderModal(true);
    }
  };

  const handleFolderSelect = async (folderId: string) => {
    if (selectedPost) {
      await saveStyleToFolder(selectedPost, folderId);
      setShowFolderModal(false);
      setSelectedPost(null);
      
      const folderName = folders.find((f: any) => f.id === folderId)?.name || 'folder';
      Alert.alert(
        'Post Saved!',
        `"${selectedPost.title}" has been saved to ${folderName}.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handlePostPress = (postId: number) => {
    router.push({
      pathname: '/blog-detail',
      params: { id: postId }
    });
  };

  const handleShare = async (post: any) => {
    try {
      const shareTitle = `${post.title} | AfriStyle`;
      const shareContent = `Check out this article: ${post.title}\n\nCategory: ${post.category}\nPublished: ${post.date}\n\n📱 Read more on AfriStyle - Discover African Fashion & Style`;
      
      await Share.share({
        title: shareTitle,
        message: shareContent,
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert("Error", "Failed to share the article. Please try again.");
    }
  };

  if (showAll) {
    const postsToShow = searchQuery ? filteredPosts : blogPosts;
    
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header - Now scrollable */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All</Text>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search posts..."
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

          {postsToShow.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={60} color="#E0E0E0" />
              <Text style={styles.noResultsText}>No posts found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching with different keywords
              </Text>
            </View>
          ) : (
            postsToShow.map((post) => (
              <View key={post.id} style={styles.allPostItem}>
                <TouchableOpacity 
                  style={styles.allPostContent}
                  onPress={() => handlePostPress(post.id)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: post.image }} style={styles.allPostImage} />
                  <View style={styles.allPostInfo}>
                    <Text style={styles.allPostTitle}>{post.title}</Text>
                    <View style={styles.dateContainer}>
                      <Ionicons name="calendar-outline" size={12} color="#999" />
                      <Text style={styles.allPostDate}>{post.date}</Text>
                    </View>
                    <Text style={styles.allPostCategory}>{post.category}</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.postActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleShare(post)}
                  >
                    <Ionicons 
                      name="share-outline" 
                      size={22} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleSave(post)}
                  >
                    <Ionicons 
                      name={isStyleSaved(post.id) ? "bookmark" : "bookmark-outline"} 
                      size={22} 
                      color={isStyleSaved(post.id) ? "#FF6B35" : "#666"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header - Now scrollable */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blog</Text>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            <Text style={styles.subtitleHighlight}>Ideas</Text>
            <Text> That </Text>
            <Text style={styles.subtitleHighlight}>Inspire</Text>
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
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

        {/* Featured Posts Carousel */}
      <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 32));
            setCurrentSlide(slideIndex);
          }}
        >
          {featuredPosts.map((post) => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.featuredCard}
              onPress={() => handlePostPress(post.id)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: post.image }} style={styles.featuredImage} />
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredTitle}>{post.title}</Text>
                <View style={styles.featuredActions}>
                  <TouchableOpacity
                    style={styles.featuredActionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleShare(post);
                    }}
                  >
                    <Ionicons 
                      name="share-outline" 
                      size={22} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.featuredActionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleSave(post);
                    }}
                  >
                    <Ionicons 
                      name={isStyleSaved(post.id) ? "bookmark" : "bookmark-outline"} 
                      size={22} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Carousel Indicators */}
        <View style={styles.indicators}>
          {featuredPosts.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentSlide ? styles.activeIndicator : styles.inactiveIndicator
              ]}
            />
          ))}
        </View>

        {/* Popular Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular</Text>
          <TouchableOpacity onPress={handleShowAll}>
            <Text style={styles.showAllText}>Show All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.popularGrid}>
          {popularPosts.map((post) => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.popularItem}
              onPress={() => handlePostPress(post.id)}
              activeOpacity={0.7}
            >
              <View style={styles.popularImageContainer}>
                <Image source={{ uri: post.image }} style={styles.popularImage} />
                <TouchableOpacity 
                  style={styles.popularSaveButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleSave(post);
                  }}
                >
                  <Ionicons 
                    name={isStyleSaved(post.id) ? "bookmark" : "bookmark-outline"} 
                    size={16} 
                    color={isStyleSaved(post.id) ? "#FF6B35" : "#fff"} 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.popularInfo}>
                <Text style={styles.popularTitle} numberOfLines={2}>
                  {post.title}
                </Text>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={12} color="#999" />
                  <Text style={styles.popularDate}>{post.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

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
              Choose a folder for "{selectedPost?.title}"
            </Text>
            
            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.folderItem}
                  onPress={() => handleFolderSelect(item.id)}
                >
                  <View style={styles.folderIcon}>
                    <Ionicons name="folder" size={24} color="#FF6B35" />
                  </View>
                  <Text style={styles.folderName}>{item.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Ionicons name="folder-open-outline" size={60} color="#E0E0E0" />
                  <Text style={styles.emptyStateText}>No folders yet</Text>
                  <Text style={styles.emptyStateSubtext}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  headerSpacer: {
    width: 40,
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  subtitleHighlight: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  carousel: {
    marginBottom: 16,
  },
  featuredCard: {
    width: width - 32,
    height: 200,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  featuredActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredActionButton: {
    padding: 4,
    marginRight: 8,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FF6B35',
  },
  inactiveIndicator: {
    backgroundColor: '#E0E0E0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  showAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  popularGrid: {
    paddingHorizontal: 16,
  },
  popularItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularImageContainer: {
    position: 'relative',
  },
  popularImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  popularInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  popularDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 20,
  },
  allPostItem: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  allPostContent: {
    flex: 1,
    flexDirection: 'row',
  },
  allPostImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  allPostInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  allPostTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  allPostDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  allPostCategory: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
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
    color: '#FF6B35',
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
  popularSaveButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 