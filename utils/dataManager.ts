import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  USER_DATA: 'user',
  LOOKBOOK_FOLDERS: 'lookbook_folders',
  LOOKBOOK_STYLES: 'lookbook_styles',
  LIKED_POSTS: 'liked_posts',
  USER_PREFERENCES: 'user_preferences',
  APP_SETTINGS: 'app_settings',
  ONBOARDING_STATUS: 'hasCompletedOnboarding',
  ONBOARDING_REMEMBER: 'hasRememberedOnboarding',
  AUTH_STATUS: 'isAuthenticated',
  SAVED_CREDENTIALS: {
    EMAIL: 'rememberedEmail',
    PASSWORD: 'rememberedPassword',
    AUTO_LOGIN: 'autoLoginEnabled',
  },
} as const;

// Data Manager Class
class DataManager {
  /**
   * Generic method to save data to AsyncStorage
   */
  async saveData<T>(key: string, data: T): Promise<boolean> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      console.log(`Data saved successfully for key: ${key}`);
      return true;
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Generic method to load data from AsyncStorage
   */
  async loadData<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      if (jsonData) {
        return JSON.parse(jsonData) as T;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  async removeData(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Data removed successfully for key: ${key}`);
      return true;
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all app data (useful for logout or reset)
   */
  async clearAllData(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      console.log('All app data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing all app data:', error);
      return false;
    }
  }

  /**
   * Backup user data to a single object
   */
  async backupUserData(): Promise<Record<string, any> | null> {
    try {
      const keys = [
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.LOOKBOOK_FOLDERS,
        STORAGE_KEYS.LOOKBOOK_STYLES,
        STORAGE_KEYS.LIKED_POSTS,
        STORAGE_KEYS.USER_PREFERENCES,
        STORAGE_KEYS.APP_SETTINGS,
        STORAGE_KEYS.ONBOARDING_STATUS,
        STORAGE_KEYS.ONBOARDING_REMEMBER,
        STORAGE_KEYS.AUTH_STATUS,
        STORAGE_KEYS.SAVED_CREDENTIALS.EMAIL,
        STORAGE_KEYS.SAVED_CREDENTIALS.PASSWORD,
        STORAGE_KEYS.SAVED_CREDENTIALS.AUTO_LOGIN,
      ];
      const backup: Record<string, any> = {};
      
      for (const key of keys) {
        const data = await this.loadData(key);
        if (data !== null) {
          backup[key] = data;
        }
      }
      
      backup.backupDate = new Date().toISOString();
      console.log('User data backup created successfully');
      return backup;
    } catch (error) {
      console.error('Error creating user data backup:', error);
      return null;
    }
  }

  /**
   * Restore user data from backup
   */
  async restoreUserData(backup: Record<string, any>): Promise<boolean> {
    try {
      for (const [key, value] of Object.entries(backup)) {
        if (key !== 'backupDate') {
          await this.saveData(key, value);
        }
      }
      console.log('User data restored successfully from backup');
      return true;
    } catch (error) {
      console.error('Error restoring user data from backup:', error);
      return false;
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{ totalKeys: number; estimatedSize: string }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      const sizeInKB = (totalSize / 1024).toFixed(2);
      
      return {
        totalKeys: keys.length,
        estimatedSize: `${sizeInKB} KB`,
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { totalKeys: 0, estimatedSize: '0 KB' };
    }
  }

  /**
   * Check if data exists for a key
   */
  async hasData(key: string): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data !== null;
    } catch (error) {
      console.error(`Error checking data existence for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Batch save multiple data items
   */
  async batchSave(items: Array<{ key: string; data: any }>): Promise<boolean> {
    try {
      const pairs: [string, string][] = items.map(item => [item.key, JSON.stringify(item.data)]);
      await AsyncStorage.multiSet(pairs);
      console.log(`Batch saved ${items.length} items successfully`);
      return true;
    } catch (error) {
      console.error('Error in batch save:', error);
      return false;
    }
  }

  /**
   * Batch load multiple data items
   */
  async batchLoad(keys: string[]): Promise<Record<string, any>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};
      
      pairs.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch (parseError) {
            console.error(`Error parsing data for key ${key}:`, parseError);
            result[key] = null;
          }
        } else {
          result[key] = null;
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error in batch load:', error);
      return {};
    }
  }
}

// Export singleton instance
export const dataManager = new DataManager();

// Convenience functions for common operations
export const saveUserData = (userData: any) => 
  dataManager.saveData(STORAGE_KEYS.USER_DATA, userData);

export const loadUserData = () => 
  dataManager.loadData(STORAGE_KEYS.USER_DATA);

export const saveLookbookData = (folders: any[], styles: any[]) => 
  dataManager.batchSave([
    { key: STORAGE_KEYS.LOOKBOOK_FOLDERS, data: folders },
    { key: STORAGE_KEYS.LOOKBOOK_STYLES, data: styles },
  ]);

export const loadLookbookData = () => 
  dataManager.batchLoad([STORAGE_KEYS.LOOKBOOK_FOLDERS, STORAGE_KEYS.LOOKBOOK_STYLES]);

export const saveAppSettings = (settings: any) => 
  dataManager.saveData(STORAGE_KEYS.APP_SETTINGS, settings);

export const loadAppSettings = () => 
  dataManager.loadData(STORAGE_KEYS.APP_SETTINGS, {});

// Export default
export default dataManager; 