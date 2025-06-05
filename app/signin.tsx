import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import TextField from '@/components/ui/TextField';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSignIn = () => {
    // Basic validation
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Proceed with sign in
    console.log('Sign in with:', { email, password });
    // Navigate to home screen or show error
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleSocialSignIn = (provider: string) => {
    console.log(`Sign in with ${provider}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Welcome back to AfriStyle</Text>
        <Text style={styles.subtitle}>
          Explore exclusive, modern and exquisite African Designs at your fingertips.
        </Text>
        
        <View style={styles.form}>
          <TextField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            hasError={!!errors.email}
            errorText={errors.email}
          />
          
          <TextField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            hasError={!!errors.password}
            errorText={errors.password}
          />
          
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <Button
            title="Log In"
            onPress={handleSignIn}
            style={styles.button}
          />
          
          <Divider label="or Log in with" style={styles.divider} />
          
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => handleSocialSignIn('Google')}
            >
              <Ionicons name="logo-google" size={20} color={Colors.darkGray} />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => handleSocialSignIn('Apple')}
            >
              <Ionicons name="logo-apple" size={20} color={Colors.darkGray} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Link href="/signup" style={styles.signUpLink}>
              Sign Up
            </Link>
          </Text>
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
    padding: Layout.horizontalMargin,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: "600",
    color: Colors.black,
    letterSpacing: Typography.tracking.h1,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.darkGray,
    marginBottom: Layout.spacing.lg,
  },
  form: {
    width: '100%',
    marginTop: Layout.spacing.md,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: Layout.spacing.md,
  },
  forgotPasswordText: {
    fontSize: Typography.sizes.caption,
    color: Colors.midGray,
  },
  button: {
    marginTop: Layout.spacing.sm,
  },
  divider: {
    marginVertical: Layout.spacing.lg,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.buttonHeight,
    borderRadius: Layout.borderRadius,
    borderWidth: 1,
    borderColor: Colors.midGray,
    paddingHorizontal: Layout.spacing.md,
    flex: 0.48,
  },
  googleButton: {
    marginRight: Layout.spacing.xs,
  },
  appleButton: {
    marginLeft: Layout.spacing.xs,
  },
  socialButtonText: {
    fontSize: Typography.sizes.body,
    color: Colors.darkGray,
    marginLeft: Layout.spacing.xs,
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.sizes.body,
    color: Colors.darkGray,
  },
  signUpLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
}); 