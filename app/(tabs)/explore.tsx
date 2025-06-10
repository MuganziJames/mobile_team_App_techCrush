import { useLike } from '@/contexts/SaveContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LikedScreen() {
  const { likedPosts, unlikePost, clearAllLiked } = useLike();

  const handlePostPress = (postId: number) => {
    router.push({
      pathname: '/blog-detail',
      params: { id: postId }
    });
  };

  const handleUnlike = (postId: number) => {
    unlikePost(postId);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Liked Posts',
      'Are you sure you want to remove all liked posts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => clearAllLiked() 
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header - Now scrollable */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Liked Posts</Text>
          {likedPosts.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {likedPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No Liked Posts</Text>
            <Text style={styles.emptySubtitle}>
              Like blog posts you enjoy by tapping the heart icon
            </Text>
            <TouchableOpacity 
              style={styles.browseBlogButton}
              onPress={() => router.push('/(tabs)/blog')}
            >
              <Text style={styles.browseBlogButtonText}>Browse Blog</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.countText}>
              {likedPosts.length} liked post{likedPosts.length !== 1 ? 's' : ''}
            </Text>
            
            {likedPosts.map((post) => (
              <View key={post.id} style={styles.postItem}>
                <TouchableOpacity 
                  style={styles.postContent}
                  onPress={() => handlePostPress(post.id)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: post.image }} style={styles.postImage} />
                  <View style={styles.postInfo}>
                    <Text style={styles.postTitle} numberOfLines={2}>
                      {post.title}
                    </Text>
                    <Text style={styles.postDate}>{post.date}</Text>
                    <Text style={styles.likedDate}>
                      Liked on {formatDate(post.likedAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.unlikeButton}
                  onPress={() => handleUnlike(post.id)}
                >
                  <Ionicons name="heart" size={24} color="#FF6B35" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  browseBlogButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseBlogButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  countText: {
    fontSize: 16,
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  postContent: {
    flex: 1,
    flexDirection: 'row',
  },
  postImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  postInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    lineHeight: 22,
  },
  postDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  likedDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  unlikeButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
});
