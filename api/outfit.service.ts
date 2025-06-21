import Config from '../constants/Config';
import apiClient from './axios';
import {
    Outfit,
    OutfitDetailResponse,
    OutfitsQueryParams,
    OutfitsResponse
} from './types';

class OutfitService {
  // Get all outfits with optional filters
  async getAllOutfits(params?: OutfitsQueryParams): Promise<{
    success: boolean;
    data?: Outfit[];
    total?: number;
    message?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/outfits${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<OutfitsResponse>(url);

      if (Config.enableLogging) {
        console.log('Outfits API response:', response.data);
      }

      return {
        success: response.data.status,
        data: response.data.data,
        total: response.data.total,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Get outfits error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch outfits'
      };
    }
  }

  // Get outfit by ID
  async getOutfitById(id: string): Promise<{
    success: boolean;
    data?: Outfit;
    message?: string;
  }> {
    try {
      const response = await apiClient.get<OutfitDetailResponse>(`/outfits/${id}`);

      if (Config.enableLogging) {
        console.log('Outfit detail API response:', response.data);
      }

      return {
        success: response.data.status,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Get outfit by ID error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch outfit'
      };
    }
  }

  // Search outfits
  async searchOutfits(query: string, page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data?: Outfit[];
    total?: number;
    message?: string;
  }> {
    return this.getAllOutfits({
      search: query,
      page,
      limit
    });
  }

  // Get outfits by category
  async getOutfitsByCategory(category: string, page: number = 1, limit: number = 10): Promise<{
    success: boolean;
    data?: Outfit[];
    total?: number;
    message?: string;
  }> {
    return this.getAllOutfits({
      category,
      page,
      limit
    });
  }

  // Get recent outfits
  async getRecentOutfits(limit: number = 10): Promise<{
    success: boolean;
    data?: Outfit[];
    total?: number;
    message?: string;
  }> {
    return this.getAllOutfits({ limit });
  }
}

export default new OutfitService(); 