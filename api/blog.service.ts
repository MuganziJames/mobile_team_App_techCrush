import Config from '../constants/Config';
import apiClient from './axios';
import {
    BlogDetailResponse,
    BlogPost,
    BlogsQueryParams,
    BlogsResponse
} from './types';

class BlogService {
  // Get all blog posts with optional filters
  async getAllBlogs(params?: BlogsQueryParams): Promise<{
    success: boolean;
    data?: BlogPost[];
    total?: number;
    message?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/blog${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<BlogsResponse>(url);

      if (Config.enableLogging) {
        console.log('Blogs API response:', response.data);
      }

      return {
        success: response.data.status,
        data: response.data.data,
        total: response.data.total,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Get blogs error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch blog posts'
      };
    }
  }

  // Get published blog posts only
  async getPublishedBlogs(params?: Omit<BlogsQueryParams, 'status'>): Promise<{
    success: boolean;
    data?: BlogPost[];
    total?: number;
    message?: string;
  }> {
    return this.getAllBlogs({ ...params, status: 'Published' });
  }

  // Get blog post by ID
  async getBlogById(id: string): Promise<{
    success: boolean;
    data?: BlogPost;
    message?: string;
  }> {
    try {
      const response = await apiClient.get<BlogDetailResponse>(`/blog/${id}`);

      if (Config.enableLogging) {
        console.log('Blog detail API response:', response.data);
      }

      return {
        success: response.data.status,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Get blog by ID error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch blog post'
      };
    }
  }

  // Search blogs
  async searchBlogs(query: string, page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data?: BlogPost[];
    total?: number;
    message?: string;
  }> {
    return this.getPublishedBlogs({
      search: query,
      page,
      limit
    });
  }

  // Get blogs by category
  async getBlogsByCategory(category: string, page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data?: BlogPost[];
    total?: number;
    message?: string;
  }> {
    return this.getPublishedBlogs({
      category,
      page,
      limit
    });
  }

  // Get recent blogs
  async getRecentBlogs(limit: number = 10): Promise<{
    success: boolean;
    data?: BlogPost[];
    total?: number;
    message?: string;
  }> {
    return this.getPublishedBlogs({ limit });
  }
}

export default new BlogService(); 