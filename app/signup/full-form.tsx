import CountryCodePicker, { COUNTRY_CODES } from '@/components/ui/CountryCodePicker';
import TextField from '@/components/ui/TextField';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SignUpFullForm() {
  const { register, isLoading: authLoading } = useAuth();
  const params = useLocalSearchParams();
  const email = params.email as string;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: email || '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAccountExistsModal, setShowAccountExistsModal] = useState(false);

  useEffect(() => {
    console.log('Email from params:', email);
    
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [email]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g., user@example.com)';
    } else {
      // Check for common email typos
      const email = formData.email.trim().toLowerCase();
      const emailDomain = email.split('@')[1];
      
      if (emailDomain && emailDomain.length < 4) {
        newErrors.email = 'Please check your email domain - it seems too short';
      }
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else {
      // Check for comprehensive password requirements
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(formData.password);
      
      if (!hasUpperCase) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!hasNumber) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!hasSpecialChar) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submit button pressed');
    Keyboard.dismiss();
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    setIsLoading(true);
    console.log('Form validation passed, proceeding with registration');
    
    try {
      // Submit the form
      const fullPhoneNumber = `${selectedCountry.dial_code}${formData.phone}`;
      
      console.log('Registering with data:', {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: fullPhoneNumber
      });
      
      const result = await register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Registration result:', result);
      
      if (result.success) {
        console.log('Registration successful, showing success modal');
        // Clear form data
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
        
        // Show success modal instead of auto-login
        setShowSuccessModal(true);
      } else {
        // Check if it's a duplicate registration error
        if (result.message?.toLowerCase().includes('already exists') || 
            result.message?.toLowerCase().includes('already registered') ||
            result.message?.toLowerCase().includes('user already exists') ||
            result.message?.toLowerCase().includes('email already') ||
            result.message?.toLowerCase().includes('duplicate')) {
          setShowAccountExistsModal(true);
        } else {
          // Show other errors with more helpful messaging
          Alert.alert(
            'Registration Failed', 
            result.message || 'Unable to create account. Please check your information and try again.'
          );
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Join MyStyleMag Today!</Text>
          <Text style={styles.subtitle}>
            Explore exclusive, modern and exquisite African Designs at your fingertips.
          </Text>
          
          <View style={styles.form}>
            <Text style={styles.fieldLabel}>First name</Text>
            <TextField
              placeholder="Adams"
              value={formData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              hasError={!!errors.firstName}
              errorText={errors.firstName}
              style={styles.textInput}
            />
            
            <Text style={styles.fieldLabel}>Last name</Text>
            <TextField
              placeholder="Agbaifa"
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              hasError={!!errors.lastName}
              errorText={errors.lastName}
              style={styles.textInput}
            />
            
            <Text style={styles.fieldLabel}>Email address</Text>
            <TextField
              placeholder="youremail@gmail.com"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              hasError={!!errors.email}
              errorText={errors.email}
              style={styles.textInput}
            />
            
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCodeContainer}>
                <CountryCodePicker
                  selectedCountry={selectedCountry}
                  onSelect={setSelectedCountry}
                />
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="7682 36713"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
              />
            </View>
            {!!errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                autoComplete="password-new"
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
            {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            
            {/* Password Requirements */}
            {formData.password.length > 0 && (
              <View style={styles.passwordRules}>
                <Text style={styles.passwordRulesTitle}>Password Requirements:</Text>
                
                {(() => {
                  const hasLength = formData.password.length >= 8;
                  const hasUpperCase = /[A-Z]/.test(formData.password);
                  const hasNumber = /[0-9]/.test(formData.password);
                  const hasSpecialChar = /[^A-Za-z0-9]/.test(formData.password);
                  
                  const completedRules = [hasLength, hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean).length;
                  const strengthColors = ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4ECDC4'];
                  const strengthTexts = ['Weak', 'Fair', 'Good', 'Strong'];
                  const strengthColor = strengthColors[Math.min(completedRules - 1, 3)] || '#E0E0E0';
                  const strengthText = strengthTexts[Math.min(completedRules - 1, 3)] || 'Too Weak';
                  
                  return (
                    <View style={styles.strengthIndicator}>
                      <View style={styles.strengthBar}>
                        <View 
                          style={[
                            styles.strengthFill, 
                            { 
                              width: `${(completedRules / 4) * 100}%`,
                              backgroundColor: strengthColor 
                            }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.strengthText, { color: strengthColor }]}>
                        {strengthText}
                      </Text>
                    </View>
                  );
                })()}
                
                <View style={styles.ruleRow}>
                  <Ionicons 
                    name={formData.password.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={formData.password.length >= 8 ? '#4ECDC4' : Colors.darkGray} 
                  />
                  <Text style={[styles.passwordRule, formData.password.length >= 8 && styles.ruleCompleted]}>
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.ruleRow}>
                  <Ionicons 
                    name={/[A-Z]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={/[A-Z]/.test(formData.password) ? '#4ECDC4' : Colors.darkGray} 
                  />
                  <Text style={[styles.passwordRule, /[A-Z]/.test(formData.password) && styles.ruleCompleted]}>
                    At least one uppercase letter
                  </Text>
                </View>
                <View style={styles.ruleRow}>
                  <Ionicons 
                    name={/[0-9]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={/[0-9]/.test(formData.password) ? '#4ECDC4' : Colors.darkGray} 
                  />
                  <Text style={[styles.passwordRule, /[0-9]/.test(formData.password) && styles.ruleCompleted]}>
                    At least one number
                  </Text>
                </View>
                <View style={styles.ruleRow}>
                  <Ionicons 
                    name={/[^A-Za-z0-9]/.test(formData.password) ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={/[^A-Za-z0-9]/.test(formData.password) ? '#4ECDC4' : Colors.darkGray} 
                  />
                  <Text style={[styles.passwordRule, /[^A-Za-z0-9]/.test(formData.password) && styles.ruleCompleted]}>
                    At least one special character
                  </Text>
                </View>
              </View>
            )}
            
            <Text style={styles.fieldLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                secureTextEntry={!confirmPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                autoComplete="password-new"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                <Ionicons 
                  name={confirmPasswordVisible ? "eye-off" : "eye"} 
                  size={22} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            {!!errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                {agreeToTerms && (
                  <View style={styles.checkboxInner}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
            {!!errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
            
            <TouchableOpacity
              style={[styles.submitButton, (isLoading || authLoading) && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading || authLoading}
              activeOpacity={0.7}
            >
              {(isLoading || authLoading) ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Registration Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            
            <Text style={styles.successModalTitle}>Account Created Successfully!</Text>
            <Text style={styles.modalMessage}>
              Welcome to MyStyleMag! Your account has been created successfully. 
              You can now sign in with your credentials to start exploring amazing African fashion and styles.
            </Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/signin');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.modalButtonText}>Continue to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Account Already Exists Modal */}
      <Modal
        visible={showAccountExistsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAccountExistsModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowAccountExistsModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Account Found</Text>
            <View style={styles.modalSpacer} />
          </View>

          <View style={styles.modalContent}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-circle" size={48} color={Colors.primary} />
              </View>
            </View>

            {/* Content */}
            <Text style={styles.accountExistsTitle}>Welcome Back!</Text>
            <Text style={styles.accountExistsMessage}>
              An account with{' '}
              <Text style={styles.emailHighlight}>{formData.email}</Text>
              {' '}already exists. Choose an option below to continue.
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.primaryActionButton}
                onPress={() => {
                  setShowAccountExistsModal(false);
                  router.replace('/signin');
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="log-in" size={20} color={Colors.white} />
                <Text style={styles.primaryActionText}>Sign In to Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryActionButton}
                onPress={() => setShowAccountExistsModal(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="mail" size={20} color={Colors.primary} />
                <Text style={styles.secondaryActionText}>Use Different Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tertiaryActionButton}
                onPress={() => {
                  setShowAccountExistsModal(false);
                  router.push('/forgot-password');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.tertiaryActionText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150, // Extra space for keyboard
  },
  content: {
    padding: 24,
    paddingBottom: 100, // Additional bottom padding for better scrolling
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  form: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 6,
  },
  textInput: {
    marginBottom: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  countryCodeContainer: {
    width: '30%',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.midGray,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.black,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderColor: Colors.midGray,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    marginBottom: 4,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.black,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  errorText: {
    color: Colors.errorRed,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.midGray,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: Colors.darkGray,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContainer: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalIconContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 60,
    padding: 12,
    marginBottom: 16,
  },
  successModalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    color: Colors.darkGray,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  modalSpacer: {
    width: 60,
  },
  modalContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    backgroundColor: Colors.lightGray,
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountExistsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  accountExistsMessage: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  emailHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryActionButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryActionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActionButton: {
    backgroundColor: Colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
  },
  secondaryActionText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tertiaryActionText: {
    color: Colors.darkGray,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  passwordRules: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  passwordRulesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 12,
  },
  strengthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginRight: 12,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 50,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  passwordRule: {
    fontSize: 13,
    color: Colors.darkGray,
    marginLeft: 10,
    flex: 1,
  },
  ruleCompleted: {
    color: '#4ECDC4',
    fontWeight: '500',
  },
}); 