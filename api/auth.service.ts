import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { clearAuthData, setAuthToken } from './axios';
import {
    ApiResponse,
    ChangePasswordBody,
    ForgotPasswordBody,
    LoginBody,
    LoginResponse,
    RegisterBody,
    User,
    VerifyResetTokenBody
} from './types';

class AuthService {
  // Register new user
  async register(data: RegisterBody): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/register', data);
      
      return {
        success: true,
        message: response.data.message || 'Registration successful',
        user: response.data.data
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  // Login user
  async login(data: LoginBody): Promise<{ success: boolean; message?: string; user?: User; token?: string }> {
    try {
      const response = await apiClient.post<LoginResponse>('/login', data);
      
      const { accessToken, user } = response.data;
      
      // Store token and user data
      await setAuthToken(accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      console.log('Login successful:', { user, token: accessToken });
      
      return {
        success: true,
        message: 'Login successful',
        user,
        token: accessToken
      };
    } catch (error: any) {
      console.error('Login error:', error);
      await clearAuthData();
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  // Logout user
  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      // Call logout endpoint
      await apiClient.get('/logout');
      
      // Clear local data
      await clearAuthData();
      
      console.log('Logout successful');
      
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Clear local data even if API call fails
      await clearAuthData();
      
      return {
        success: true, // Return success even if API fails, as local data is cleared
        message: 'Logged out locally'
      };
    }
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordBody): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post<ApiResponse>('/forgotPassword', data);
      
      return {
        success: true,
        message: response.data.message || 'Password reset instructions sent to your email'
      };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send password reset instructions'
      };
    }
  }

  // Verify reset token
  async verifyResetToken(data: VerifyResetTokenBody): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post<ApiResponse>('/verifyResetToken', data);
      
      return {
        success: true,
        message: response.data.message || 'Reset token verified successfully'
      };
    } catch (error: any) {
      console.error('Verify reset token error:', error);
      return {
        success: false,
        message: error.message || 'Invalid or expired reset token'
      };
    }
  }

  // Change password
  async changePassword(data: ChangePasswordBody): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post<ApiResponse>('/changePassword', data);
      
      return {
        success: true,
        message: response.data.message || 'Password changed successfully'
      };
    } catch (error: any) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.message || 'Failed to change password'
      };
    }
  }

  // Check authentication status
  async authCheck(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const response = await apiClient.get<User>('/auth');
      
      // Store/update user data
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      
      return {
        success: true,
        user: response.data
      };
    } catch (error: any) {
      console.error('Auth check error:', error);
      
      // Clear auth data on failure
      await clearAuthData();
      
      return {
        success: false,
        message: error.message || 'Authentication failed'
      };
    }
  }

  // Bootstrap auth - run at app startup
  async bootstrapAuth(): Promise<{ user: User | null; token: string | null }> {
    try {
      // Get stored token
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        console.log('No stored token found');
        return { user: null, token: null };
      }
      
      // Set token in axios headers
      await setAuthToken(token);
      
      // Verify token with server
      const authResult = await this.authCheck();
      
      if (authResult.success && authResult.user) {
        console.log('Bootstrap auth successful:', authResult.user);
        return { user: authResult.user, token };
      } else {
        console.log('Bootstrap auth failed - clearing stored data');
        await clearAuthData();
        return { user: null, token: null };
      }
    } catch (error) {
      console.error('Bootstrap auth error:', error);
      await clearAuthData();
      return { user: null, token: null };
    }
  }

  // Get stored user data
  async getStoredUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  // Get stored token
  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }
}

// Export singleton instance
export default new AuthService(); 