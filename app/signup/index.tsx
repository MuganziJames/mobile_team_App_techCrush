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

export default function SignUpEmailScreen() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleContinue = () => {
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
    
    // Proceed to full registration form
    router.push({
      pathname: '/signup/full-form',
      params: { email }
    });
  };

  const handleSocialSignUp = (provider: string) => {
    console.log(`Sign up with ${provider}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Join AfriStyle Today!</Text>
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
          
          <Button
            title="Continue with Email"
            onPress={handleContinue}
            style={styles.button}
          />
          
          <Divider label="or Sign Up with" style={styles.divider} />
          
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => handleSocialSignUp('Google')}
            >
              <Ionicons name="logo-google" size={20} color={Colors.darkGray} />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => handleSocialSignUp('Apple')}
            >
              <Ionicons name="logo-apple" size={20} color={Colors.darkGray} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.disclaimer}>
            By continuing, you agree to the{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Link href="/signin" style={styles.signInLink}>
              Log in
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
    fontWeight: Typography.weights.semiBold,
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
  disclaimer: {
    marginTop: Layout.spacing.lg,
    fontSize: Typography.sizes.caption,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  link: {
    color: Colors.primary,
    fontWeight: Typography.weights.semiBold,
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
  signInLink: {
    color: Colors.primary,
    fontWeight: Typography.weights.semiBold,
  },
}); 