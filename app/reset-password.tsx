import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
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

export default function ResetPasswordScreen() {
  const { setNewPassword, isLoading } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const resetToken = params.resetToken as string;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    const result = await setNewPassword(email, password, resetToken);
    
    if (result.success) {
      setShowSuccessModal(true);
    } else {
      Alert.alert('❌ Error', result.message || 'Failed to reset password. Please try again.');
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, text: '', color: Colors.darkGray };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { strength, text: 'Weak', color: '#FF6B6B' };
    if (strength <= 3) return { strength, text: 'Fair', color: '#FFD93D' };
    if (strength <= 4) return { strength, text: 'Good', color: '#6BCF7F' };
    return { strength, text: 'Strong', color: '#4ECDC4' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEnabled={true}
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Create a new secure password for your account
            </Text>
            
            <View style={styles.form}>
              <Text style={styles.label}>New Password</Text>
              <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  textContentType="newPassword"
                  autoComplete="password-new"
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={passwordVisible ? "eye-off" : "eye"} 
                    size={22} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.errorContainer}>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>
              
              {/* Password Strength Indicator */}
              <View style={[styles.strengthContainer, { opacity: password.length > 0 ? 1 : 0 }]}>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill, 
                      { 
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.text}
                </Text>
              </View>
              
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm new password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  secureTextEntry={!confirmPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  textContentType="newPassword"
                  autoComplete="password-new"
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={confirmPasswordVisible ? "eye-off" : "eye"} 
                    size={22} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.errorContainer}>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>
              
              <View style={styles.passwordRules}>
                <Text style={styles.passwordRulesTitle}>Password Requirements:</Text>
                <View style={styles.ruleRow}>
                  <Ionicons 
                    name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={password.length >= 8 ? '#4ECDC4' : Colors.darkGray} 
                  />
                  <Text style={[styles.passwordRule, password.length >= 8 && styles.ruleCompleted]}>
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.ruleRow}>
                  <Ionicons 
                    name={/[0-9]/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={/[0-9]/.test(password) ? '#4ECDC4' : Colors.darkGray} 
                  />
                  <Text style={[styles.passwordRule, /[0-9]/.test(password) && styles.ruleCompleted]}>
                    At least one number
                  </Text>
                </View>
                <View style={styles.ruleRow}>
                  <Ionicons 
                    name={/[^A-Za-z0-9]/.test(password) ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={/[^A-Za-z0-9]/.test(password) ? '#4ECDC4' : Colors.darkGray} 
                  />
                  <Text style={[styles.passwordRule, /[^A-Za-z0-9]/.test(password) && styles.ruleCompleted]}>
                    At least one special character
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark" size={40} color={Colors.white} />
              </View>
            </View>

            {/* Content */}
            <Text style={styles.successTitle}>Password Reset Successful!</Text>
            <Text style={styles.successMessage}>
              Your password has been reset successfully. You can now login with your new password.
            </Text>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/signin');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="log-in" size={20} color={Colors.white} />
              <Text style={styles.loginButtonText}>Continue to Login</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 80,
    minHeight: Dimensions.get('window').height - 200,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGray,
    marginBottom: 40,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.midGray,
    marginBottom: 8,
  },
  inputError: {
    borderColor: Colors.errorRed,
    backgroundColor: '#FFF5F5',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  eyeIcon: {
    padding: 8,
  },
  errorContainer: {
    minHeight: 20,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.errorRed,
    fontSize: 14,
    fontWeight: '500',
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginRight: 12,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
  },
  passwordRules: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  passwordRulesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 16,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  passwordRule: {
    fontSize: 14,
    color: Colors.darkGray,
    marginLeft: 12,
    flex: 1,
  },
  ruleCompleted: {
    color: '#4ECDC4',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    minWidth: 200,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 