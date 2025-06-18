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
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignout: boolean;
  isAuthenticated: boolean;
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
  login: (params: LoginParams) => Promise<AuthResult>;
  logout: () => Promise<void>;
  register: (params: RegisterParams) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  verifyOtp: (email: string, resetToken: string) => Promise<AuthResult>;
  setNewPassword: (email: string, newPassword: string, resetToken: string) => Promise<AuthResult>;
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
  });

  // Load token and user from storage on mount
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        console.log('Bootstrapping auth state...');
        
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
          });
        } else {
          console.log('No valid auth state found');
          setState({
            user: null,
            token: null,
            isLoading: false,
            isSignout: false,
            isAuthenticated: false,
          });
        }
      } catch (e) {
        console.error('Failed to load auth state:', e);
        setState({
          user: null,
          token: null,
          isLoading: false,
          isSignout: false,
          isAuthenticated: false,
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
        const result = await authService.login({ email, password });
        
        if (result.success && result.user && result.token) {
          const user = convertApiUserToUser(result.user);
          
          setState({
            user,
            token: result.token,
            isLoading: false,
            isSignout: false,
            isAuthenticated: true,
          });

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
        
        setState({
          user: null,
          token: null,
          isLoading: false,
          isSignout: false,
          isAuthenticated: false,
        });
        
        console.log('Auth state cleared, navigating to signin...');
        
        // Navigate directly to signin screen
        setTimeout(() => {
          router.replace('/signin');
          console.log('Navigation to signin completed');
        }, 100);
        
      } catch (error) {
        console.error('Logout error:', error);
        // Still clear state even if API call fails
        setState({
          user: null,
          token: null,
          isLoading: false,
          isSignout: false,
          isAuthenticated: false,
        });
        
        console.log('Auth state cleared after error, navigating to signin...');
        // Navigate even if logout API call fails
        setTimeout(() => {
          router.replace('/signin');
          console.log('Navigation to signin completed after error');
        }, 100);
      }
    },

    resetPassword: async (email: string): Promise<AuthResult> => {
      console.log('Reset password attempt:', { email });
      
      try {
        const result = await authService.forgotPassword({ email });
        
        return {
          success: result.success,
          message: result.message
        };
      } catch (error: any) {
        console.error('Reset password error:', error);
        return {
          success: false,
          message: error.message || 'An error occurred during password reset'
        };
      }
    },

    verifyOtp: async (email: string, resetToken: string): Promise<AuthResult> => {
      console.log('Verify OTP attempt:', { email });
      
      try {
        const result = await authService.verifyResetToken({ email, resetToken });
        
        return {
          success: result.success,
          message: result.message
        };
      } catch (error: any) {
        console.error('Verify OTP error:', error);
        return {
          success: false,
          message: error.message || 'An error occurred during OTP verification'
        };
      }
    },

    setNewPassword: async (email: string, newPassword: string, resetToken: string): Promise<AuthResult> => {
      console.log('Set new password attempt:', { email });
      
      try {
        const result = await authService.changePassword({ 
          email, 
          newPassword, 
          resetToken 
        });
        
        return {
          success: result.success,
          message: result.message
        };
      } catch (error: any) {
        console.error('Set new password error:', error);
        return {
          success: false,
          message: error.message || 'An error occurred while setting new password'
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