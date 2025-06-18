import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Config from '../constants/Config';
import { ApiError } from './types';

// Get API URL from configuration
const API_URL = Config.API_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle cookies and errors
apiClient.interceptors.response.use(
  async (response: AxiosResponse) => {
    // Handle cookies for authentication
    try {
      const cookies = response.headers['set-cookie'];
      if (cookies && cookies.length > 0) {
        // Store cookie info in AsyncStorage for reference
        await AsyncStorage.setItem('session_cookies', JSON.stringify(cookies));
        console.log('Session cookies received and stored');
      }
    } catch (error) {
      console.warn('Error handling cookies:', error);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      try {
        // Clear stored token and cookies
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('session_cookies');
        
        // Redirect to login or handle unauthorized access
        console.log('Unauthorized access - clearing auth data');
      } catch (clearError) {
        console.error('Error clearing auth data:', clearError);
      }
    }
    
    // Transform error for consistent handling
    const responseData = error.response?.data as any;
    const apiError: ApiError = {
      message: responseData?.message || error.message || 'An error occurred',
      statusCode: error.response?.status,
      error: responseData?.error || error.name,
    };
    
    return Promise.reject(apiError);
  }
);

// Helper function to set auth token
export const setAuthToken = async (token: string | null) => {
  try {
    if (token) {
      await AsyncStorage.setItem('accessToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      await AsyncStorage.removeItem('accessToken');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

// Helper function to clear all auth data
export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('session_cookies');
    delete apiClient.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export default apiClient; 