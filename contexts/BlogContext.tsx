import BlogService from '@/api/blog.service';
import { BlogPost } from '@/api/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface BlogContextType {
  // State
  blogs: BlogPost[];
  featuredBlogs: BlogPost[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBlogs: (refresh?: boolean) => Promise<void>;
  searchBlogs: (query: string) => Promise<BlogPost[]>;
  getBlogById: (id: string) => Promise<BlogPost | null>;
  refreshBlogs: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

interface BlogProviderProps {
  children: ReactNode;
}

export function BlogProvider({ children }: BlogProviderProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all published blogs
  const fetchBlogs = async (refresh: boolean = false) => {
    if (loading && !refresh) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await BlogService.getPublishedBlogs();
      
      if (response.success && response.data) {
        setBlogs(response.data);
        
        // For now, we'll consider the first few blogs as "featured"
        // You can modify this logic based on your API's featured field
        setFeaturedBlogs(response.data.slice(0, 3));
      } else {
        setError(response.message || 'Failed to fetch blogs');
      }
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      setError(error.message || 'An error occurred while fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  // Search blogs
  const searchBlogs = async (query: string): Promise<BlogPost[]> => {
    try {
      const response = await BlogService.searchBlogs(query);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (error: any) {
      console.error('Error searching blogs:', error);
      Alert.alert('Search Error', error.message || 'Failed to search blogs');
      return [];
    }
  };

  // Get blog by ID
  const getBlogById = async (id: string): Promise<BlogPost | null> => {
    try {
      // First check if we already have the blog in our state
      const existingBlog = blogs.find(blog => blog.id === id);
      if (existingBlog) {
        return existingBlog;
      }

      // If not found in state, fetch from API
      const response = await BlogService.getBlogById(id);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Blog not found');
      }
    } catch (error: any) {
      console.error('Error fetching blog by ID:', error);
      Alert.alert('Error', error.message || 'Failed to fetch blog');
      return null;
    }
  };

  // Refresh blogs
  const refreshBlogs = async () => {
    await fetchBlogs(true);
  };

  // Load blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const value: BlogContextType = {
    blogs,
    featuredBlogs,
    loading,
    error,
    fetchBlogs,
    searchBlogs,
    getBlogById,
    refreshBlogs,
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
} 