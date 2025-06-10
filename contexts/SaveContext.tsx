import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types
interface LikedPost {
  id: number;
  title: string;
  date: string;
  image: string;
  category: string;
  likedAt: string;
}

interface LikeContextProps {
  likedPosts: LikedPost[];
  likePost: (post: LikedPost) => Promise<void>;
  unlikePost: (postId: number) => Promise<void>;
  isPostLiked: (postId: number) => boolean;
  clearAllLiked: () => Promise<void>;
}

// Context
const LikeContext = createContext<LikeContextProps | undefined>(undefined);

// Provider
export function LikeProvider({ children }: { children: ReactNode }) {
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);

  // Load liked posts from storage on mount
  useEffect(() => {
    const loadLikedPosts = async () => {
      try {
        const likedPostsString = await AsyncStorage.getItem('liked_posts');
        if (likedPostsString) {
          const posts = JSON.parse(likedPostsString);
          setLikedPosts(posts);
        }
      } catch (error) {
        console.error('Failed to load liked posts:', error);
      }
    };

    loadLikedPosts();
  }, []);

  // Save posts to storage whenever likedPosts changes
  useEffect(() => {
    const savePosts = async () => {
      try {
        await AsyncStorage.setItem('liked_posts', JSON.stringify(likedPosts));
      } catch (error) {
        console.error('Failed to save liked posts:', error);
      }
    };

    savePosts();
  }, [likedPosts]);

  const likePost = async (post: LikedPost) => {
    const postWithTimestamp = {
      ...post,
      likedAt: new Date().toISOString(),
    };
    
    setLikedPosts(prev => {
      // Check if post is already liked
      if (prev.some(p => p.id === post.id)) {
        return prev;
      }
      return [postWithTimestamp, ...prev];
    });
  };

  const unlikePost = async (postId: number) => {
    setLikedPosts(prev => prev.filter(post => post.id !== postId));
  };

  const isPostLiked = (postId: number) => {
    return likedPosts.some(post => post.id === postId);
  };

  const clearAllLiked = async () => {
    setLikedPosts([]);
  };

  const likeContext: LikeContextProps = {
    likedPosts,
    likePost,
    unlikePost,
    isPostLiked,
    clearAllLiked,
  };

  return (
    <LikeContext.Provider value={likeContext}>
      {children}
    </LikeContext.Provider>
  );
}

// Hook
export function useLike() {
  const context = useContext(LikeContext);
  if (context === undefined) {
    throw new Error('useLike must be used within a LikeProvider');
  }
  return context;
} 