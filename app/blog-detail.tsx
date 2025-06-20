import { blogPosts, blogPostsContent } from '@/data/blogData';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
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
    setIsSharing(true);
    try {
      if (await Sharing.isAvailableAsync()) {
        const shareContent = `Check out this article: ${post.title}\n\n${content.content.substring(0, 200)}...\n\nRead more on AfriStyle`;
        
        await Sharing.shareAsync(post.image, {
          mimeType: 'image/jpeg',
          dialogTitle: `Share: ${post.title}`,
        });
      } else {
        console.log('Sharing is not available on this platform');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
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
}); 