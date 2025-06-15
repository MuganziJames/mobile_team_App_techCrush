import { auth } from '@/app/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user) {
          throw new Error('No user returned from login');
        }

        const userData: User = {
          id: user.uid,
          email: user.email || '',
          firstName: '', // These will need to be fetched from your database
          lastName: '',  // These will need to be fetched from your database
        };

        // Store authentication data
        await AsyncStorage.setItem('user_token', user.uid);
        await AsyncStorage.setItem('user', JSON.stringify(userData));

        setState({
          user: userData,
          token: user.uid,
          isLoading: false,
          isSignout: false,
        });

        console.log('User logged in:', user);
        return { 
          success: true, 
          message: 'Login successful',
          user: userData,
          token: user.uid
        };
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
        const userCredential = await createUserWithEmailAndPassword(auth, params.email, params.password);
        const user = userCredential.user;
        
        if (!user) {
          throw new Error('Failed to create user');
        }
        
        const newUser: User = {
          id: user.uid,
          email: user.email || '',
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone || ''
        };
        
        // Store authentication data
        await AsyncStorage.setItem('user_token', user.uid);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        
        setState({
          user: newUser,
          token: user.uid,
          isLoading: false,
          isSignout: false,
        });
        
        console.log('Registration successful:', { newUser });
      
        return {
          success: true,
          user: newUser,
          token: user.uid
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
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        await signOut(auth);
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

    resetPassword: async (email: string): Promise<AuthResult> => {
      try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent' };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.message || 'Failed to send password reset email' 
        };
      }
    },

    verifyOtp: async (otp: string): Promise<AuthResult> => {
      // Implement OTP verification logic here
      return { success: false, message: 'OTP verification not implemented' };
    },

    setNewPassword: async (password: string, confirmPassword: string): Promise<AuthResult> => {
      if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      try {
        const user = auth.currentUser;
        if (!user) {
          return { success: false, message: 'No user is currently signed in' };
        }

        await updatePassword(user, password);
        return { success: true, message: 'Password updated successfully' };
      } catch (error: any) {
        return { 
          success: false, 
          message: error.message || 'Failed to update password' 
        };
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