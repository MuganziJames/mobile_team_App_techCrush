import apiClient from './axios';
import { CategoriesResponse, Category } from './types';

export const categoryService = {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<CategoriesResponse>('/category');
      
      if (response.data.status && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const categories = await this.getAllCategories();
      return categories.find(category => category.id === id) || null;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  },

  // Get category by name (case-insensitive)
  async getCategoryByName(name: string): Promise<Category | null> {
    try {
      const categories = await this.getAllCategories();
      return categories.find(category => 
        category.name.toLowerCase() === name.toLowerCase()
      ) || null;
    } catch (error) {
      console.error('Error fetching category by name:', error);
      throw error;
    }
  }
}; 