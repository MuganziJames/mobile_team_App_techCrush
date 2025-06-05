import Button from '@/components/ui/Button';
import OTPInput from '@/components/ui/OTPInput';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OTP_LENGTH = 6;

export default function VerifyOTPScreen() {
  const { email, type } = useLocalSearchParams<{ email: string; type: string }>();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Start countdown timer
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (otp.length !== OTP_LENGTH) return;
    
    if (type === 'reset-password') {
      router.push('/reset-password');
    } else {
      // Handle other verification types
      console.log('Verification complete for:', type);
    }
  };

  const handleResendCode = () => {
    if (timer > 0 || isResending) return;
    
    setIsResending(true);
    
    // Simulate API call
    setTimeout(() => {
      setTimer(30);
      setIsResending(false);
      console.log('Resending code to:', email);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We have sent a verification code to{' '}
          <Text style={styles.emailText}>{email}</Text>
        </Text>
        
        <OTPInput
          length={OTP_LENGTH}
          value={otp}
          onChange={setOtp}
          style={styles.otpInput}
        />
        
        <TouchableOpacity 
          onPress={handleResendCode} 
          disabled={timer > 0 || isResending}
          style={styles.resendContainer}
        >
          <Text style={styles.resendText}>
            Didn't get the code?{' '}
            <Text style={[
              styles.resendButton,
              (timer > 0 || isResending) && styles.resendDisabled
            ]}>
              {timer > 0 ? `Resend Code (${timer}s)` : 'Resend Code'}
            </Text>
          </Text>
        </TouchableOpacity>
        
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={otp.length !== OTP_LENGTH}
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
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.semiBold,
    color: Colors.black,
    letterSpacing: Typography.tracking.h1,
    marginBottom: Layout.spacing.sm,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.darkGray,
    marginBottom: Layout.spacing.lg,
    alignSelf: 'flex-start',
  },
  emailText: {
    fontWeight: Typography.weights.semiBold,
  },
  otpInput: {
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  resendContainer: {
    marginBottom: Layout.spacing.lg,
  },
  resendText: {
    fontSize: Typography.sizes.caption,
    color: Colors.darkGray,
  },
  resendButton: {
    color: Colors.primary,
    fontWeight: Typography.weights.semiBold,
  },
  resendDisabled: {
    color: Colors.midGray,
  },
  button: {
    width: '100%',
  },
}); 