import { useLike } from '@/contexts/SaveContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: 'The Fashionistas Guide to Style and Sophistication.',
    date: 'Jan 23, 2025',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
    category: 'Fashion',
    featured: true
  },
  {
    id: 2,
    title: 'AI-Powered Fashion: Trends, Tips, and Inspiration.',
    date: 'Mar 25, 2025',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    category: 'Technology',
    featured: true
  },
  {
    id: 3,
    title: 'Fashion Fails & Wins.',
    date: 'Jan 03, 2025',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
    category: 'Fashion',
    featured: true
  },
  {
    id: 4,
    title: 'Embracing Individuality.',
    date: 'Jun 01, 2025',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop',
    category: 'Lifestyle'
  },
  {
    id: 5,
    title: 'Style Sanctuary: A Haven for Fashion Lovers.',
    date: 'Mar 05, 2025',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
    category: 'Fashion'
  },
  {
    id: 6,
    title: 'The Latest Trends, News, and Must-Haves.',
    date: 'Apr 23, 2025',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
    category: 'Trends'
  },
  {
    id: 7,
    title: 'The Fashion Scene: Where Style Meets Culture.',
    date: 'Feb 15, 2025',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=300&fit=crop',
    category: 'Culture'
  },
  {
    id: 8,
    title: 'Gloss & Glam',
    date: 'Feb 17, 2025',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop',
    category: 'Beauty'
  }
];

export default function BlogScreen() {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { likePost, unlikePost, isPostLiked } = useLike();

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

  const handleLike = async (post: any) => {
    if (isPostLiked(post.id)) {
      await unlikePost(post.id);
    } else {
      await likePost({
        id: post.id,
        title: post.title,
        date: post.date,
        image: post.image,
        category: post.category,
        likedAt: new Date().toISOString()
      });
    }
  };

  const handlePostPress = (postId: number) => {
    router.push({
      pathname: '/blog-detail',
      params: { id: postId }
    });
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
              style={styles.likedButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Ionicons name="heart-outline" size={24} color="#000" />
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
                <TouchableOpacity 
                  style={styles.likeButton}
                  onPress={() => handleLike(post)}
                >
                  <Ionicons 
                    name={isPostLiked(post.id) ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isPostLiked(post.id) ? "#FF6B35" : "#999"} 
                  />
                </TouchableOpacity>
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
            style={styles.likedButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="heart-outline" size={24} color="#000" />
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
                <TouchableOpacity
                  style={styles.featuredLikeButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleLike(post);
                  }}
                >
                  <Ionicons 
                    name={isPostLiked(post.id) ? "heart" : "heart-outline"} 
                    size={24} 
                    color="#fff" 
                  />
                </TouchableOpacity>
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
              <Image source={{ uri: post.image }} style={styles.popularImage} />
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
  likedButton: {
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
  featuredLikeButton: {
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
  popularImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  // All posts view styles
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
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  allPostInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  allPostTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  allPostDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    marginLeft: 4,
  },
  allPostCategory: {
    fontSize: 12,
    color: '#999',
  },
  likeButton: {
    padding: 4,
  },
  bottomSpacing: {
    height: 100,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  noResultsSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
}); 