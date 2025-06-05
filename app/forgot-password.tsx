import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const handleBack = () => {
    router.back();
  };

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
    
    // Navigate to verification screen
    router.push({
      pathname: '/verify-otp',
      params: { email, type: 'reset-password' }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Forgot your password? Don't worry! Just enter your email below, and we'll 
          send you a verification code to reset your password.
        </Text>
        
        <TextField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          hasError={!!errors.email}
          errorText={errors.email}
          style={styles.input}
        />
        
        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: Layout.horizontalMargin,
    height: 56,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: Layout.horizontalMargin,
    paddingTop: Layout.spacing.md,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: "600",
    color: Colors.black,
    letterSpacing: Typography.tracking.h1,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.darkGray,
    marginBottom: Layout.spacing.lg,
  },
  input: {
    marginBottom: Layout.spacing.md,
  },
  button: {
    marginTop: Layout.spacing.sm,
  },
}); 