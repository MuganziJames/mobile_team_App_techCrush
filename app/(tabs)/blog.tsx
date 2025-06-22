import { BlogPost } from '@/api/types';
import EmptyState from '@/components/ui/EmptyState';
import Colors from '@/constants/Colors';
import { useBlog } from '@/contexts/BlogContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
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
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    blogs,
    featuredBlogs,
    loading,
    error,
    refreshBlogs,
    searchBlogs
  } = useBlog();

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await searchBlogs(searchQuery.trim());
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleBack = () => {
    setShowAll(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handlePostPress = (postId: string) => {
    router.push({
      pathname: '/blog-detail',
      params: { id: postId }
    });
  };

  const handleShare = async (post: BlogPost) => {
    try {
      const shareTitle = `${post.title} | MyStyleMag`;
      const shareContent = `Check out this article: ${post.title}\n\nCategory: ${post.category.name}\nBy: ${post.creator.name}\n\n📱 Read more on MyStyleMag - Discover African Fashion & Style`;
      
      await Share.share({
        title: shareTitle,
        message: shareContent,
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert("Error", "Failed to share the article. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show loading state
  if (loading && blogs.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading blogs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && blogs.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <EmptyState
          icon="alert-circle-outline"
          title="Something went wrong"
          description={error}
          actionText="Try Again"
          onActionPress={refreshBlogs}
        />
      </SafeAreaView>
    );
  }

  if (showAll) {
    const postsToShow = searchQuery ? searchResults : blogs;
    
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshBlogs}
              colors={[Colors.primary]}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Blogs</Text>
            <View style={styles.searchButton} />
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

          {/* Search Loading */}
          {isSearching && (
            <View style={styles.searchLoadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.searchLoadingText}>Searching...</Text>
            </View>
          )}

          {/* Results */}
          {postsToShow.length === 0 && !isSearching ? (
            <EmptyState
              icon="document-text-outline"
              title={searchQuery ? "No posts found" : "No blogs available"}
              description={searchQuery ? "Try searching with different keywords" : "Check back later for new content"}
              actionText={searchQuery ? "Clear Search" : "Refresh"}
              onActionPress={searchQuery ? () => setSearchQuery('') : refreshBlogs}
            />
          ) : (
            postsToShow.map((post) => (
              <View key={post.id} style={styles.allPostItem}>
                <TouchableOpacity 
                  style={styles.allPostContent}
                  onPress={() => handlePostPress(post.id)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: post.imageUrl }} style={styles.allPostImage} />
                  <View style={styles.allPostInfo}>
                    <Text style={styles.allPostTitle}>{post.title}</Text>
                    <View style={styles.dateContainer}>
                      <Ionicons name="calendar-outline" size={12} color="#999" />
                      <Text style={styles.allPostDate}>{formatDate(post.createdAt)}</Text>
                    </View>
                    <Text style={styles.allPostCategory}>{post.category.name}</Text>
                    <Text style={styles.allPostAuthor}>By {post.creator.name}</Text>
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
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshBlogs}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.mainHeader}>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Blog</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleOrange}>Ideas </Text>
              <Text style={styles.subtitleBlack}>that </Text>
              <Text style={styles.subtitleOrange}>Inspire</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleShowAll}
          >
            <Ionicons name="search-outline" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {/* Featured Section */}
        {featuredBlogs.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured</Text>
            </View>

            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              style={styles.featuredContainer}
              onScroll={(event) => {
                const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentSlide(slideIndex);
              }}
              scrollEventThrottle={16}
            >
              {featuredBlogs.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.featuredCard}
                  onPress={() => handlePostPress(post.id)}
                  activeOpacity={0.9}
                >
                  <Image source={{ uri: post.imageUrl }} style={styles.featuredImage} />
                  <View style={styles.featuredOverlay}>
                    <Text style={styles.featuredCategory}>{post.category.name}</Text>
                    <Text style={styles.featuredTitle}>{post.title}</Text>
                    <Text style={styles.featuredDate}>{formatDate(post.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              {featuredBlogs.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentSlide === index && styles.paginationDotActive
                  ]}
                />
              ))}
            </View>
          </>
        )}

        {/* Popular Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest</Text>
          {blogs.length > 4 && (
            <TouchableOpacity onPress={handleShowAll}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          )}
        </View>

        {blogs.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="No blogs available"
            description="Check back later for new content"
            actionText="Refresh"
            onActionPress={refreshBlogs}
          />
        ) : (
          blogs.slice(0, 4).map((post) => (
            <View key={post.id} style={styles.popularItem}>
              <TouchableOpacity 
                style={styles.popularContent}
                onPress={() => handlePostPress(post.id)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: post.imageUrl }} style={styles.popularImage} />
                <View style={styles.popularInfo}>
                  <Text style={styles.popularTitle}>{post.title}</Text>
                  <View style={styles.popularMeta}>
                    <Text style={styles.popularDate}>{formatDate(post.createdAt)}</Text>
                    <Text style={styles.popularCategory}>{post.category.name}</Text>
                  </View>
                  <Text style={styles.popularAuthor}>By {post.creator.name}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.popularActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleShare(post)}
                >
                  <Ionicons 
                    name="share-outline" 
                    size={20} 
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  searchLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  searchLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleSection: {
    flexDirection: 'column',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  subtitleContainer: {
    flexDirection: 'row',
  },
  subtitleOrange: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  subtitleBlack: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  seeAllText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  featuredContainer: {
    paddingLeft: 20,
  },
  featuredCard: {
    width: width - 40,
    height: 240,
    marginRight: 20,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  featuredCategory: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featuredDate: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  popularContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  popularInfo: {
    flex: 1,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    lineHeight: 22,
  },
  popularMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  popularDate: {
    fontSize: 12,
    color: '#999',
    marginRight: 12,
  },
  popularCategory: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  popularAuthor: {
    fontSize: 12,
    color: '#666',
  },
  popularActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allPostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  allPostContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  allPostImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  allPostInfo: {
    flex: 1,
  },
  allPostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    lineHeight: 22,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  allPostDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  allPostCategory: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  allPostAuthor: {
    fontSize: 12,
    color: '#666',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 