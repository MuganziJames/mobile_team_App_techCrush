import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    AppState,
    Dimensions,
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

const { width } = Dimensions.get('window');

export default function VerifyOTPScreen() {
  const { verifyOtp, isLoading } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email as string;
  
  // Use a single string for the OTP instead of an array
  const [otpValue, setOtpValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Focus the input when the component mounts
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(focusTimer);
  }, []);

  // Handle app state changes to prevent focus conflicts
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        inputRef.current?.blur();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const handleSubmit = async () => {
    if (otpValue.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter all 6 digits of the verification code.');
      return;
    }
    
    const result = await verifyOtp(email, otpValue);
    
    if (result.success) {
      router.push({
        pathname: '/reset-password',
        params: { email, resetToken: otpValue }
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

  // Generate the display for the OTP boxes
  const renderOtpBoxes = () => {
    const boxes = [];
    
    for (let i = 0; i < 6; i++) {
      const isFocused = otpValue.length === i;
      const hasValue = otpValue.length > i;
      
      boxes.push(
        <View
          key={i}
          style={[
            styles.otpBox,
            isFocused && styles.otpBoxFocused,
            hasValue && styles.otpBoxFilled
          ]}
        >
          <Text style={styles.otpText}>
            {hasValue ? otpValue[i] : ''}
          </Text>
        </View>
      );
    }
    
    return boxes;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEnabled={true}
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit verification code sent to{'\n'}{email}
            </Text>
            
            {/* Hidden TextInput that captures all input */}
            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              value={otpValue}
              onChangeText={(text) => {
                // Only allow digits and limit to 6 characters
                const filtered = text.replace(/[^0-9]/g, '').slice(0, 6);
                setOtpValue(filtered);
              }}
              keyboardType="number-pad"
              maxLength={6}
              caretHidden
            />
            
            {/* Visual OTP boxes */}
            <TouchableOpacity 
              activeOpacity={0.9}
              style={styles.otpContainer}
              onPress={() => inputRef.current?.focus()}
            >
              {renderOtpBoxes()}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Didn't receive the code?
              </Text>
              <TouchableOpacity onPress={handleResendCode} activeOpacity={0.7}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 50 : 100,
    minHeight: Dimensions.get('window').height - 200,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    maxWidth: '90%',
  },
  // Hidden input that captures all keystrokes
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  // Container for the OTP boxes
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Math.min(width - 80, 340),
    marginBottom: 48,
  },
  // Individual OTP box
  otpBox: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.midGray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  otpBoxFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF8F5',
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  otpText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: Colors.darkGray,
    marginBottom: 8,
  },
  resendLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
}); 