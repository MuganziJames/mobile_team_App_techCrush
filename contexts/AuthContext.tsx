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
}

// Demo credentials
const DEMO_USER: User = {
  id: 'demo-123',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  phone: '+1234567890'
};

const DEMO_PASSWORD = 'password123';
const DEMO_TOKEN = 'demo-token-123456';

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
        // For demo purposes - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if using demo credentials
        if (email.toLowerCase() === DEMO_USER.email && password === DEMO_PASSWORD) {
          console.log('Demo login successful');
          
          // Store authentication data
          await AsyncStorage.setItem('user_token', DEMO_TOKEN);
          await AsyncStorage.setItem('user', JSON.stringify(DEMO_USER));
          
          setState({
            user: DEMO_USER,
            token: DEMO_TOKEN,
            isLoading: false,
            isSignout: false,
          });
          
          return {
            success: true,
            user: DEMO_USER,
            token: DEMO_TOKEN
          };
        }
        
        // In a real app, this would be an API call
        // For demo, we'll reject any non-demo credentials
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: 'Invalid credentials. Try using demo@example.com with password123'
        };
      } catch (error) {
        console.error('Login error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: 'An error occurred during login'
        };
      }
    },
    
    register: async (params: RegisterParams): Promise<AuthResult> => {
      console.log('Register attempt:', { email: params.email });
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // For demo purposes - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo, create a simulated user
        const newUser: User = {
          id: 'user-' + Math.random().toString(36).substring(2, 9),
          email: params.email,
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone
        };
        
        const token = 'token-' + Math.random().toString(36).substring(2, 15);
        
        // Store authentication data
        await AsyncStorage.setItem('user_token', token);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        
        setState({
          user: newUser,
          token: token,
          isLoading: false,
          isSignout: false,
        });
        
        console.log('Registration successful:', { newUser });
        
        return {
          success: true,
          user: newUser,
          token: token
        };
      } catch (error) {
        console.error('Registration error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: 'An error occurred during registration'
        };
      }
    },
    
    logout: async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Clear stored data
        await AsyncStorage.removeItem('user_token');
        await AsyncStorage.removeItem('user');
        
        setState({
          user: null,
          token: null,
          isLoading: false,
          isSignout: true,
        });
        
        // Navigate to the sign-in screen
        router.replace('/signin');
      } catch (error) {
        console.error('Logout error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
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