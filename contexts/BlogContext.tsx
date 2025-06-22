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

  // Enhanced search with better ranking
  const searchBlogs = async (query: string): Promise<BlogPost[]> => {
    try {
      // First try backend search
      const response = await BlogService.searchBlogs(query);
      
      if (response.success && response.data) {
        // Apply client-side ranking for better results
        const rankedResults = rankSearchResults(response.data, query);
        return rankedResults;
      } else {
        // Fallback to local search if backend fails
        const localResults = searchLocalBlogs(query);
        return localResults;
      }
    } catch (error: any) {
      console.error('Error searching blogs:', error);
      // Fallback to local search
      const localResults = searchLocalBlogs(query);
      return localResults;
    }
  };

  // Local search function for fallback
  const searchLocalBlogs = (query: string): BlogPost[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    const matchingBlogs = blogs.filter(blog => {
      const titleMatch = blog.title.toLowerCase().includes(searchTerm);
      const contentMatch = blog.content.toLowerCase().includes(searchTerm);
      const categoryMatch = blog.category.name.toLowerCase().includes(searchTerm);
      const creatorMatch = blog.creator.name.toLowerCase().includes(searchTerm);
      
      return titleMatch || contentMatch || categoryMatch || creatorMatch;
    });

    return rankSearchResults(matchingBlogs, query);
  };

  // Ranking function to prioritize results
  const rankSearchResults = (results: BlogPost[], query: string): BlogPost[] => {
    const searchTerm = query.toLowerCase().trim();
    
    return results.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Title exact match gets highest priority
      if (a.title.toLowerCase() === searchTerm) scoreA += 100;
      if (b.title.toLowerCase() === searchTerm) scoreB += 100;

      // Title starts with search term
      if (a.title.toLowerCase().startsWith(searchTerm)) scoreA += 50;
      if (b.title.toLowerCase().startsWith(searchTerm)) scoreB += 50;

      // Title contains search term
      if (a.title.toLowerCase().includes(searchTerm)) scoreA += 30;
      if (b.title.toLowerCase().includes(searchTerm)) scoreB += 30;

      // Category match
      if (a.category.name.toLowerCase().includes(searchTerm)) scoreA += 20;
      if (b.category.name.toLowerCase().includes(searchTerm)) scoreB += 20;

      // Creator match
      if (a.creator.name.toLowerCase().includes(searchTerm)) scoreA += 15;
      if (b.creator.name.toLowerCase().includes(searchTerm)) scoreB += 15;

      // Content match (lower priority)
      if (a.content.toLowerCase().includes(searchTerm)) scoreA += 10;
      if (b.content.toLowerCase().includes(searchTerm)) scoreB += 10;

      // Newer articles get slight boost
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (dateA > dateB) scoreA += 5;
      if (dateB > dateA) scoreB += 5;

      // Higher views get slight boost
      if (a.views > b.views) scoreA += 2;
      if (b.views > a.views) scoreB += 2;

      return scoreB - scoreA; // Sort by score descending
    });
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