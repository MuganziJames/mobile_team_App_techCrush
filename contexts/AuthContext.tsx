import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import authService from '../api/auth.service';
import { User as ApiUser } from '../api/types';

// Types - Updated to match API
interface User {  
  id: number;
  name: string;
  email: string;
  role?: string;
  // Legacy compatibility
  _id?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string; // ISO string or formatted date
  location?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  hasRememberedOnboarding: boolean;
}

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  hasRememberedOnboarding: boolean;
  login: (params: LoginParams, rememberMe?: boolean) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (params: RegisterParams) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  verifyOtp: (email: string, resetToken: string) => Promise<AuthResult>;
  setNewPassword: (email: string, newPassword: string, resetToken: string) => Promise<AuthResult>;
  updateProfile: (updates: Partial<User>) => void;
  completeOnboarding: () => Promise<void>;
  rememberOnboarding: () => Promise<void>;
  checkOnboardingStatus: () => Promise<boolean>;
  tryAutoLogin: () => Promise<boolean>;
}

// Context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Helper function to convert API user to local user format
const convertApiUserToUser = (apiUser: ApiUser): User => {
  const nameParts = apiUser.name.split(' ');
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    // Legacy compatibility
    _id: apiUser.id.toString(),
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
  };
};

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isSignout: false,
    isAuthenticated: false,
    hasCompletedOnboarding: false,
    hasRememberedOnboarding: false,
  });

  // Load token and user from storage on mount
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        console.log('Bootstrapping auth state...');
        
        // Check onboarding completion status first
        const onboardingCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
        const hasCompletedOnboarding = onboardingCompleted === 'true';
        
        // Check if user has chosen to remember onboarding
        const rememberedOnboarding = await AsyncStorage.getItem('hasRememberedOnboarding');
        const hasRememberedOnboarding = rememberedOnboarding === 'true';
        
        // Use auth service to bootstrap authentication
        const { user: apiUser, token } = await authService.bootstrapAuth();
        
        if (token && apiUser) {
          const user = convertApiUserToUser(apiUser);
          console.log('Restored auth state:', { user });
          setState({
            user,
            token,
            isLoading: false,
            isSignout: false,
            isAuthenticated: true,
            hasCompletedOnboarding,
            hasRememberedOnboarding,
          });
        } else {
          console.log('No valid auth state found');
          setState({
            user: null,
            token: null,
            isLoading: false,
            isSignout: false,
            isAuthenticated: false,
            hasCompletedOnboarding,
            hasRememberedOnboarding,
          });
        }
      } catch (e) {
        console.error('Auth check error:', e);
        // Check onboarding status even on error
        const onboardingCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
        const hasCompletedOnboarding = onboardingCompleted === 'true';
        
        // Check if user has chosen to remember onboarding
        const rememberedOnboarding = await AsyncStorage.getItem('hasRememberedOnboarding');
        const hasRememberedOnboarding = rememberedOnboarding === 'true';
        
        // Clear any stale auth data
        setState({
          user: null,
          token: null,
          isLoading: false,
          isSignout: false,
          isAuthenticated: false,
          hasCompletedOnboarding,
          hasRememberedOnboarding,
        });
      }
    };

    bootstrapAsync();
  }, []);

  // Auth actions
  const authContext: AuthContextProps = {
    ...state,
    
    /**
     * Update the currently authenticated user's profile locally and persist to storage.
     * This ensures data persists across app sessions.
     */
    updateProfile: async (updates: Partial<User>) => {
      try {
        const updatedUser = state.user ? { ...state.user, ...updates } : null;
        
        if (updatedUser) {
          // Update state
          setState(prev => ({
            ...prev,
            user: updatedUser,
          }));
          
          // Persist to AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
          console.log('Profile updated and saved to storage:', updatedUser);
          
          // Optionally, you could also call an API endpoint here to sync with server
          // await authService.updateProfile(updates);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },
    
    login: async ({ email, password }: LoginParams, rememberMe: boolean = false): Promise<AuthResult> => {
      console.log('Login attempt:', { email, rememberMe });
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const result = await authService.login({ email, password });
        
        if (result.success && result.user && result.token) {
          const user = convertApiUserToUser(result.user);
          
          // Save credentials for auto-login if remember me is checked
          if (rememberMe) {
            try {
              await AsyncStorage.setItem('rememberedEmail', email);
              await AsyncStorage.setItem('rememberedPassword', password);
              await AsyncStorage.setItem('autoLoginEnabled', 'true');
              console.log('Credentials saved for auto-login');
            } catch (error) {
              console.error('Error saving credentials:', error);
            }
          }
          
          setState(prev => ({
            ...prev,
            user,
            token: result.token || null,
            isLoading: false,
            isSignout: false,
            isAuthenticated: true,
          }));

          console.log('User logged in:', user);
          return { 
            success: true, 
            message: result.message,
            user,
            token: result.token
          };
        } else {
          throw new Error(result.message || 'Login failed');
        }
      } catch (error: any) {
        console.error('Login error:', error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          isAuthenticated: false 
        }));
        return {
          success: false,
          message: error.message || 'An error occurred during login'
        };
      }
    },
    
    register: async (params: RegisterParams): Promise<AuthResult> => {
      console.log('Register attempt:', { email: params.email });
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const result = await authService.register(params);
        
        if (result.success) {
          console.log('Registration successful');
          setState(prev => ({ ...prev, isLoading: false }));
          
          return {
            success: true,
            message: result.message,
            user: result.user ? convertApiUserToUser(result.user) : undefined
          };
        } else {
          throw new Error(result.message || 'Registration failed');
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: error.message || 'An error occurred during registration'
        };
      }
    },

    logout: async () => {
      console.log('Logout initiated');
      setState(prev => ({ ...prev, isLoading: true, isSignout: true }));
      
      try {
        console.log('Calling logout API...');
        await authService.logout();
        console.log('Logout API completed successfully');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear saved credentials on logout
        try {
          await AsyncStorage.removeItem('rememberedEmail');
          await AsyncStorage.removeItem('rememberedPassword');
          await AsyncStorage.removeItem('autoLoginEnabled');
          console.log('Saved credentials cleared');
        } catch (error) {
          console.error('Error clearing saved credentials:', error);
        }
        
        // Always clear state even if API call fails
        setState({
          user: null,
          token: null,
          isLoading: false,
          isSignout: false,
          isAuthenticated: false,
          hasCompletedOnboarding: false,
          hasRememberedOnboarding: false,
        });
        
        console.log('Auth state cleared, navigating to signin...');
        
        // Navigate directly to signin screen
        setTimeout(() => {
          router.replace('/signin');
          console.log('Navigation to signin completed');
        }, 100);
      }
    },

    resetPassword: async (email: string): Promise<AuthResult> => {
      console.log('Reset password for:', email);
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const result = await authService.forgotPassword({ email });
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: result.success,
          message: result.message
        };
      } catch (error: any) {
        console.error('Reset password error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: error.message || 'An error occurred during password reset'
        };
      }
    },

    verifyOtp: async (email: string, resetToken: string): Promise<AuthResult> => {
      console.log('Verify OTP for:', email);
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const result = await authService.verifyResetToken({ email, resetToken });
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: result.success,
          message: result.message
        };
      } catch (error: any) {
        console.error('Verify OTP error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: error.message || 'An error occurred during OTP verification'
        };
      }
    },

    setNewPassword: async (email: string, newPassword: string, resetToken: string): Promise<AuthResult> => {
      console.log('Set new password for:', email);
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const result = await authService.changePassword({ 
          email, 
          password: newPassword, 
          resetToken 
        });
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: result.success,
          message: result.message
        };
      } catch (error: any) {
        console.error('Set new password error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: error.message || 'An error occurred while setting new password'
        };
      }
    },

    completeOnboarding: async () => {
      try {
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setState(prev => ({
          ...prev,
          hasCompletedOnboarding: true,
        }));
        console.log('Onboarding completed and saved');
      } catch (error) {
        console.error('Error saving onboarding completion:', error);
      }
    },

    rememberOnboarding: async () => {
      try {
        await AsyncStorage.setItem('hasRememberedOnboarding', 'true');
        setState(prev => ({
          ...prev,
          hasRememberedOnboarding: true,
        }));
        console.log('Onboarding remembered and saved');
      } catch (error) {
        console.error('Error saving onboarding remember preference:', error);
      }
    },

    checkOnboardingStatus: async () => {
      try {
        const completed = await AsyncStorage.getItem('hasCompletedOnboarding');
        return completed === 'true';
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        return false;
      }
    },

    tryAutoLogin: async (): Promise<boolean> => {
      try {
        const autoLoginEnabled = await AsyncStorage.getItem('autoLoginEnabled');
        if (autoLoginEnabled !== 'true') {
          return false;
        }

        const email = await AsyncStorage.getItem('rememberedEmail');
        const password = await AsyncStorage.getItem('rememberedPassword');
        
        if (!email || !password) {
          return false;
        }

        console.log('Attempting auto-login for:', email);
        const result = await authService.login({ email, password });
        
        if (result.success && result.user && result.token) {
          const user = convertApiUserToUser(result.user);
          
          setState(prev => ({
            ...prev,
            user,
            token: result.token || null,
            isLoading: false,
            isSignout: false,
            isAuthenticated: true,
          }));

          console.log('Auto-login successful for:', user.email);
          return true;
        } else {
          // Clear invalid credentials
          await AsyncStorage.removeItem('rememberedEmail');
          await AsyncStorage.removeItem('rememberedPassword');
          await AsyncStorage.removeItem('autoLoginEnabled');
          return false;
        }
      } catch (error) {
        console.error('Auto-login error:', error);
        // Clear credentials on error
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.removeItem('rememberedPassword');
        await AsyncStorage.removeItem('autoLoginEnabled');
        return false;
      }
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 