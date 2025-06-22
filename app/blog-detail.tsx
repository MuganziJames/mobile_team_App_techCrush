import { BlogPost } from '@/api/types';
import EmptyState from '@/components/ui/EmptyState';
import Colors from '@/constants/Colors';
import { useBlog } from '@/contexts/BlogContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getBlogById } = useBlog();

  const postId = id as string;

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError('Blog post ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const blogPost = await getBlogById(postId);
        
        if (blogPost) {
          setPost(blogPost);
        } else {
          setError('Blog post not found');
        }
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        setError(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, getBlogById]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    setShowShareModal(true);
  };

  const handleShareText = async () => {
    if (!post) return;
    
    setIsSharing(true);
    setShowShareModal(false);
    try {
      const shareTitle = `${post.title} | MyStyleMag`;
      const shareContent = `${post.title}\n\n${post.content.substring(0, 300)}...\n\nBy ${post.creator.name}\nCategory: ${post.category.name}\n\n📱 Read the full article on MyStyleMag - Discover African Fashion & Style`;
      
      await Share.share({
        title: shareTitle,
        message: shareContent,
      });
    } catch (error) {
      console.error('Error sharing text:', error);
      Alert.alert("Error", "Failed to share the article. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareImage = async () => {
    if (!post) return;
    
    setIsSharing(true);
    setShowShareModal(false);
    try {
      const shareTitle = `${post.title} | MyStyleMag`;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(post.imageUrl, {
          mimeType: 'image/jpeg',
          dialogTitle: shareTitle,
        });
      } else {
        Alert.alert("Not Available", "Image sharing is not available on this device.");
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert("Error", "Failed to share the image. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading article...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="alert-circle-outline"
          title="Article not found"
          description={error || "The article you're looking for doesn't exist or has been removed."}
          actionText="Go Back"
          onActionPress={handleBack}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.headerButton, isSharing && styles.headerButtonDisabled]} 
              onPress={handleShare}
              disabled={isSharing}
            >
              <Ionicons 
                name={isSharing ? "hourglass-outline" : "share-outline"} 
                size={24} 
                color={isSharing ? "#ccc" : "#fff"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: post.imageUrl }} style={styles.heroImage} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.metaContainer}>
            <Text style={styles.category}>{post.category.name}</Text>
            <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
          </View>
          
          <Text style={styles.title}>{post.title}</Text>
          
          <View style={styles.authorContainer}>
            <Text style={styles.author}>By {post.creator.name}</Text>
            <Text style={styles.views}>{post.views} views</Text>
          </View>
          
          <View style={styles.contentText}>
            {post.content.split('\n\n').map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>

          {/* Share Button at the end of content */}
          <View style={styles.shareSection}>
            <Text style={styles.sharePrompt}>Enjoyed this article?</Text>
            <TouchableOpacity 
              style={styles.shareButton} 
              onPress={handleShare}
              disabled={isSharing}
            >
              <Ionicons 
                name="share-social" 
                size={20} 
                color="#fff" 
                style={styles.shareIcon}
              />
              <Text style={styles.shareButtonText}>
                {isSharing ? 'Sharing...' : 'Share with Friends'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Custom Share Modal */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.shareModal}>
            {/* Decorative header */}
            <View style={styles.shareModalHeader}>
              <View style={styles.modalTopBar} />
              <View style={styles.shareIconContainer}>
                <View style={styles.shareIconRing}>
                  <Ionicons name="share-social" size={28} color={Colors.primary} />
                </View>
              </View>
            </View>

            <View style={styles.shareModalContent}>
              <Text style={styles.shareModalTitle}>Share Article</Text>
              <Text style={styles.shareModalSubtitle}>
                Choose how you'd like to share this article
              </Text>

              <View style={styles.shareOptions}>
                <TouchableOpacity 
                  style={styles.shareOption}
                  onPress={handleShareText}
                  disabled={isSharing}
                >
                  <View style={styles.shareOptionIcon}>
                    <Ionicons name="text-outline" size={24} color={Colors.primary} />
                  </View>
                  <Text style={styles.shareOptionText}>Share Text</Text>
                  <Text style={styles.shareOptionSubtext}>Share article content</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.shareOption}
                  onPress={handleShareImage}
                  disabled={isSharing}
                >
                  <View style={styles.shareOptionIcon}>
                    <Ionicons name="image-outline" size={24} color={Colors.primary} />
                  </View>
                  <Text style={styles.shareOptionText}>Share Image</Text>
                  <Text style={styles.shareOptionSubtext}>Share article image</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.shareModalClose}
                onPress={() => setShowShareModal(false)}
              >
                <Text style={styles.shareModalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
  },
  heroContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    lineHeight: 32,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  author: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  views: {
    fontSize: 12,
    color: '#999',
  },
  contentText: {
    marginBottom: 32,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
    textAlign: 'justify',
  },
  shareSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sharePrompt: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shareIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  shareModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 350,
    overflow: 'hidden',
  },
  shareModalHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  modalTopBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 16,
  },
  shareIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIconRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shareModalContent: {
    padding: 20,
  },
  shareModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  shareModalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  shareOptions: {
    marginBottom: 24,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    marginBottom: 12,
  },
  shareOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shareOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  shareOptionSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  shareModalClose: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareModalCloseText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
}); 