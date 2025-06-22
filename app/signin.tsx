import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SignInScreen() {
  const { login, tryAutoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // Try auto-login when component mounts
  useEffect(() => {
    const attemptAutoLogin = async () => {
      setIsLoading(true);
      try {
        const autoLoginSuccess = await tryAutoLogin();
        if (autoLoginSuccess) {
          console.log('Auto-login successful, navigating to tabs');
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Auto-login error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    attemptAutoLogin();
  }, []);

  const showError = (message: string) => {
    setLoginError(message);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto hide after 5 seconds
    setTimeout(() => {
      hideError();
    }, 5000);
  };

  const hideError = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setLoginError('');
    });
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    console.log('Sign in button pressed');
    Keyboard.dismiss();
    
    if (!validateForm()) {
      console.log('Login validation failed');
      return;
    }
    
    setIsLoading(true);
    console.log('Login validation passed, proceeding with login');
    
    try {
      console.log('Attempting login with:', { email, password, rememberMe });
      const result = await login({ email, password }, rememberMe);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to tabs');
        // Clear form data
        setEmail('');
        setPassword('');
        
        // Navigate to home screen
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
      } else {
        // Show error
        showError(result.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <SafeAreaView style={{flex:1}}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Explore exclusive, modern and exquisite African Designs at your fingertips.
          </Text>

          {/* Error Banner */}
          {loginError ? (
            <Animated.View
              style={[
                styles.errorBanner,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.errorContent}>
                <Ionicons name="alert-circle" size={20} color={Colors.white} />
                <Text style={styles.errorBannerText}>{loginError}</Text>
                <TouchableOpacity onPress={hideError} style={styles.errorCloseButton}>
                  <Ionicons name="close" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : null}
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
                              <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (loginError) hideError();
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                                  <TextInput
                    style={[styles.passwordInput, errors.password && styles.inputError]}
                    placeholder="********"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (loginError) hideError();
                    }}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    autoComplete="password"
                  />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons 
                    name={passwordVisible ? "eye-off" : "eye"} 
                    size={22} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
            
            {/* Remember Me Toggle */}
            <TouchableOpacity 
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && (
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                )}
              </View>
              <Text style={styles.rememberText}>
                Remember me
              </Text>
            </TouchableOpacity>
            
            <Link href="/forgot-password" style={styles.forgotPasswordLink}>
              Forgot Password?
            </Link>
            
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.disabledButton]}
              onPress={handleSignIn}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Link href="/signup" style={styles.signUpLink}>
                Sign Up
              </Link>
            </Text>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.black,
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.black,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.midGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: Colors.lightGray,
    color: Colors.black,
  },
  inputError: {
    borderColor: Colors.errorRed,
  },
  errorText: {
    color: Colors.errorRed,
    fontSize: 12,
    marginTop: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.midGray,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: Colors.midGray,
    backgroundColor: Colors.white,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rememberText: {
    fontSize: 14,
    color: Colors.darkGray,
    fontWeight: '500',
  },
  forgotPasswordLink: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'right',
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  signUpLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
  errorBanner: {
    backgroundColor: Colors.errorRed,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  errorBannerText: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    lineHeight: 20,
  },
  errorCloseButton: {
    padding: 4,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 100, // Space for bottom navigation and safe area
  },
}); 