import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types
interface User {  
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
}

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
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
  login: (params: LoginParams) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (params: RegisterParams) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  verifyOtp: (otp: string) => Promise<AuthResult>;
  setNewPassword: (password: string, confirmPassword: string) => Promise<AuthResult>;
}

// Context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isSignout: false,
  });

  // Load token and user from storage on mount
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        console.log('Bootstrapping auth state...');
        const token = await AsyncStorage.getItem('user_token');
        const userString = await AsyncStorage.getItem('user');
        
        if (token && userString) {
          const user = JSON.parse(userString);
          console.log('Restored auth state:', { user });
          setState({
            ...state,
            token,
            user,
            isLoading: false,
          });
        } else {
          console.log('No stored auth state found');
          setState({
            ...state,
            isLoading: false,
          });
        }
      } catch (e) {
        console.error('Failed to load auth state:', e);
        setState({
          ...state,
          isLoading: false,
        });
      }
    };

    bootstrapAsync();
  }, []);

  // Auth actions
  const authContext: AuthContextProps = {
    ...state,
    login: async ({ email, password }: LoginParams): Promise<AuthResult> => {
      console.log('Login attempt:', { email });
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Mock authentication - replace with your actual auth logic
        if (email && password) {
          const userData: User = {
            id: 'mock-user-id',
            email: email,
            firstName: 'John',
            lastName: 'Doe',
          };

          // Store authentication data
          await AsyncStorage.setItem('user_token', 'mock-token');
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          setState({
            user: userData,
            token: 'mock-token',
            isLoading: false,
            isSignout: false,
          });

          console.log('User logged in:', userData);
          return { 
            success: true, 
            message: 'Login successful',
            user: userData,
            token: 'mock-token'
          };
        } else {
          throw new Error('Invalid email or password');
        }
      } catch (error: any) {
        console.error('Login error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
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
        // Mock registration - replace with your actual auth logic
        const newUser: User = {
          id: 'mock-user-id',
          email: params.email,
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone || ''
        };
        
        // Store authentication data
        await AsyncStorage.setItem('user_token', 'mock-token');
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        
        setState({
          user: newUser,
          token: 'mock-token',
          isLoading: false,
          isSignout: false,
        });
        
        console.log('Registration successful:', { newUser });
      
        return {
          success: true,
          user: newUser,
          token: 'mock-token'
        };
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
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Clear stored authentication data
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user');
        
        setState({
          user: null,
          token: null,
          isLoading: false,
          isSignout: true,
        });
        
        console.log('User logged out successfully');
        router.replace('/');
      } catch (error) {
        console.error('Logout error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },

    resetPassword: async (email: string): Promise<AuthResult> => {
      console.log('Password reset requested for:', email);
      
      try {
        // Mock password reset
        return {
          success: true,
          message: 'Password reset email sent successfully'
        };
      } catch (error: any) {
        console.error('Password reset error:', error);
        return {
          success: false,
          message: error.message || 'An error occurred during password reset'
        };
      }
    },

    verifyOtp: async (otp: string): Promise<AuthResult> => {
      console.log('OTP verification:', otp);
      
      try {
        // Mock OTP verification
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } catch (error: any) {
        console.error('OTP verification error:', error);
        return {
          success: false,
          message: error.message || 'Invalid OTP'
        };
      }
    },

    setNewPassword: async (password: string, confirmPassword: string): Promise<AuthResult> => {
      console.log('Setting new password');
      
      try {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // Mock password update
        return {
          success: true,
          message: 'Password updated successfully'
        };
      } catch (error: any) {
        console.error('Set password error:', error);
        return {
          success: false,
          message: error.message || 'An error occurred while setting password'
        };
      }
    }
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