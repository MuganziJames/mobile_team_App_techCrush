import Config from '../constants/Config';
import apiClient from './axios';
import {
    AddOutfitToLookbookBody,
    CreateLookbookBody,
    Lookbook,
    LookbookDetailResponse,
    LookbooksResponse,
    LookbookWithOutfits,
    UpdateLookbookBody
} from './types';

class LookbookService {
  // Get all lookbooks
  async getAllLookbooks(): Promise<{
    success: boolean;
    data?: Lookbook[];
    total?: number;
    message?: string;
  }> {
    try {
      const response = await apiClient.get<LookbooksResponse>('/lookbook');

      if (Config.enableLogging) {
        console.log('Lookbooks API response:', response.data);
      }

      return {
        success: response.data.status,
        data: response.data.data,
        total: response.data.total,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Get lookbooks error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch lookbooks'
      };
    }
  }

  // Get lookbook by ID with outfits
  async getLookbookById(id: string): Promise<{
    success: boolean;
    data?: LookbookWithOutfits;
    totalOutfits?: number;
    message?: string;
  }> {
    try {
      const response = await apiClient.get<LookbookDetailResponse>(`/lookbook/${id}`);

      if (Config.enableLogging) {
        console.log('Lookbook detail API response:', response.data);
      }

      return {
        success: response.data.status,
        data: response.data.data,
        totalOutfits: response.data.totalOutfits,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Get lookbook by ID error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch lookbook'
      };
    }
  }

  // Create new lookbook
  async createLookbook(body: CreateLookbookBody): Promise<{
    success: boolean;
    data?: Lookbook;
    message?: string;
  }> {
    try {
      const response = await apiClient.post<{
        status: boolean;
        message: string;
        data: Lookbook;
      }>('/lookbook', body);

      if (Config.enableLogging) {
        console.log('Create lookbook API response:', response.data);
      }

      return {
        success: response.data.status,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Create lookbook error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create lookbook'
      };
    }
  }

  // Update lookbook
  async updateLookbook(id: string, body: UpdateLookbookBody): Promise<{
    success: boolean;
    data?: Lookbook;
    message?: string;
  }> {
    try {
      const response = await apiClient.patch<{
        status: boolean;
        message: string;
        data: Lookbook;
      }>(`/lookbook/${id}`, body);

      if (Config.enableLogging) {
        console.log('Update lookbook API response:', response.data);
      }

      return {
        success: response.data.status,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Update lookbook error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update lookbook'
      };
    }
  }

  // Delete lookbook
  async deleteLookbook(id: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await apiClient.delete<{
        status: boolean;
        message: string;
      }>(`/lookbook/${id}`);

      if (Config.enableLogging) {
        console.log('Delete lookbook API response:', response.data);
      }

      return {
        success: response.data.status,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Delete lookbook error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete lookbook'
      };
    }
  }

  // Add outfit to lookbook
  async addOutfitToLookbook(lookbookId: string, body: AddOutfitToLookbookBody): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await apiClient.post<{
        status: boolean;
        message: string;
      }>(`/lookbook/outfit/${lookbookId}`, body);

      if (Config.enableLogging) {
        console.log('Add outfit to lookbook API response:', response.data);
      }

      return {
        success: response.data.status,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Add outfit to lookbook error:', error);
      return {
        success: false,
        message: error.message || 'Failed to add outfit to lookbook'
      };
    }
  }

  // Remove outfit from lookbook
  async removeOutfitFromLookbook(lookbookId: string, body: AddOutfitToLookbookBody): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await apiClient.delete<{
        status: boolean;
        message: string;
      }>(`/lookbook/outfit/${lookbookId}`, { data: body });

      if (Config.enableLogging) {
        console.log('Remove outfit from lookbook API response:', response.data);
      }

      return {
        success: response.data.status,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Remove outfit from lookbook error:', error);
      return {
        success: false,
        message: error.message || 'Failed to remove outfit from lookbook'
      };
    }
  }
}

export default new LookbookService(); 