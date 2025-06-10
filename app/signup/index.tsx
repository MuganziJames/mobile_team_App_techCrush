import TextField from '@/components/ui/TextField';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function SignUpEmailScreen() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    Keyboard.dismiss();
    
    // Basic validation
    const newErrors: { email?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate loading
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Proceed to full registration form
      console.log('Navigating to full-form with email:', email);
      router.push({
        pathname: '/signup/full-form',
        params: { email }
      });
    }, 1000);
  };

  const handleSocialSignUp = (provider: string) => {
    Alert.alert('Social Sign Up', `${provider} signup is not implemented yet.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Join AfriStyle Today!</Text>
          <Text style={styles.subtitle}>
            Explore exclusive, modern and exquisite African Designs at your fingertips.
          </Text>
          
          <View style={styles.form}>
            <Text style={styles.fieldLabel}>Email address</Text>
            <TextField
              placeholder="youremail@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              hasError={!!errors.email}
              errorText={errors.email}
              style={styles.textInput}
            />
            
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.disabledButton]}
              onPress={handleContinue}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Continue with Email</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or Sign Up with</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialSignUp('Google')}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialSignUp('Apple')}
            >
              <Ionicons name="logo-apple" size={20} color="#000" />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
            
            <Text style={styles.disclaimer}>
              By continuing, you agree to the{' '}
              <Text style={styles.link}>Terms of Service</Text>{' '}
              and <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Link href="/signin" style={styles.signInLink}>
                Log In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
    textAlign: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  form: {
    width: '100%',
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 6,
  },
  textInput: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#E9642C', // Orange color from the design
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E1E1',
  },
  dividerText: {
    color: Colors.darkGray,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    marginBottom: 16,
  },
  socialButtonText: {
    fontSize: 16,
    color: Colors.black,
    marginLeft: 8,
  },
  disclaimer: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  link: {
    color: '#E9642C',
    fontWeight: "500",
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  signInLink: {
    color: '#E9642C',
    fontWeight: "600",
  }
}); 