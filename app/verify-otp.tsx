import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function VerifyOTPScreen() {
  const { verifyOtp, isLoading } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email as string;
  
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [focusedInput, setFocusedInput] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);
  
  useEffect(() => {
    // Focus first input on mount
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste of full OTP
      const otpArray = text.slice(0, 4).split('');
      const newOtp = [...otp];
      
      otpArray.forEach((digit, idx) => {
        if (idx + index < 4) {
          newOtp[idx + index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus last input or move to appropriate next input
      const nextIndex = Math.min(index + otpArray.length, 3);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Handle single digit input
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (text && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0 && otp[index] === '') {
      // If current input is empty, move to previous input
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter all 4 digits of the verification code.');
      return;
    }
    
    const result = await verifyOtp(email, otpString);
    
    if (result.success) {
      router.push({
        pathname: '/reset-password',
        params: { email, resetToken: otpString }
      });
    } else {
      Alert.alert('Error', result.message || 'Invalid verification code. Please try again.');
    }
  };

  const handleResendCode = async () => {
    router.replace({
      pathname: '/forgot-password'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>
              Enter the 4-digit verification code sent to {email}
            </Text>
            
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View
                  key={index}
                  style={[
                    styles.otpInputWrapper,
                    focusedInput === index && styles.otpInputWrapperFocused
                  ]}
                >
                  <TextInput
                    ref={ref => {
                      inputRefs.current[index] = ref;
                    }}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={text => handleOtpChange(text, index)}
                    keyboardType="number-pad"
                    maxLength={4} // Allow for paste of full OTP
                    onFocus={() => setFocusedInput(index)}
                    onBlur={() => setFocusedInput(-1)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace') {
                        handleBackspace(index);
                      }
                    }}
                  />
                </View>
              ))}
            </View>
            
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Didn't receive the code?{' '}
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: '90%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 32,
  },
  otpInputWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.midGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInputWrapperFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  resendLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
}); 