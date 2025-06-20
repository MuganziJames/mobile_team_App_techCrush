import Colors from '@/constants/Colors';
import { blogPosts, blogPostsContent } from '@/data/blogData';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import {
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

const { width } = Dimensions.get('window');

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const postId = parseInt(id as string);
  const post = blogPosts.find(p => p.id === postId);
  
  // Use the content from blogPostsContent but ensure we use the image from the post preview
  const content = blogPostsContent[postId as keyof typeof blogPostsContent];

  if (!post || !content) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Post not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    setShowShareModal(true);
  };

  const handleShareText = async () => {
    setIsSharing(true);
    setShowShareModal(false);
    try {
      const shareTitle = `${post.title} | AfriStyle`;
      const shareContent = `${post.title}\n\n${content.content.substring(0, 300)}...\n\n📱 Read the full article on AfriStyle - Discover African Fashion & Style`;
      
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
    setIsSharing(true);
    setShowShareModal(false);
    try {
      const shareTitle = `${post.title} | AfriStyle`;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(post.image, {
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

        {/* Hero Image - Use the image from the post preview */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: post.image }} 
            style={styles.heroImage} 
            resizeMode="cover"
          />

        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.date}>{post.date}</Text>
          
          <View style={styles.contentText}>
            {content.content.split('\n\n').map((paragraph, index) => (
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

            {/* Content */}
            <View style={styles.shareModalContent}>
              <Text style={styles.shareModalTitle}>Share Article</Text>
              <Text style={styles.shareModalSubtitle}>
                How would you like to share "{post.title}"?
              </Text>

              {/* Share Options */}
              <View style={styles.shareOptions}>
                <TouchableOpacity 
                  style={styles.shareOption}
                  onPress={handleShareText}
                  disabled={isSharing}
                >
                  <View style={styles.shareOptionIcon}>
                    <Ionicons name="text" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.shareOptionContent}>
                    <Text style={styles.shareOptionTitle}>Share Text</Text>
                    <Text style={styles.shareOptionDescription}>
                      Share article with title and excerpt
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.shareOption}
                  onPress={handleShareImage}
                  disabled={isSharing}
                >
                  <View style={styles.shareOptionIcon}>
                    <Ionicons name="image" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.shareOptionContent}>
                    <Text style={styles.shareOptionTitle}>Share Image</Text>
                    <Text style={styles.shareOptionDescription}>
                      Share the article's featured image
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowShareModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Decorative footer dots */}
            <View style={styles.modalFooter}>
              <View style={styles.decorativeDots}>
                <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: '#ddd' }]} />
                <View style={[styles.dot, { backgroundColor: '#ddd' }]} />
              </View>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  likeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    lineHeight: 32,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  contentText: {
    marginTop: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
    textAlign: 'justify',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  backButton: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bottomSpacing: {
    height: 100,
  },
  shareSection: {
    marginTop: 32,
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
  },
  sharePrompt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minWidth: 180,
  },
  shareIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  shareModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTopBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 10,
  },
  shareIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIconRing: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareModalContent: {
    width: '100%',
  },
  shareModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  shareModalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  shareOptions: {
    width: '100%',
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  shareOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shareOptionContent: {
    flex: 1,
  },
  shareOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  shareOptionDescription: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },

  cancelButton: {
    width: '100%',
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalFooter: {
    width: '100%',
    marginTop: 20,
  },
  decorativeDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
}); 