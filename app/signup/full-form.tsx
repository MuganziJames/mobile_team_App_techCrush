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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: fullPhoneNumber,
      });
      
      console.log('Registration result:', result);
      
      if (result.success) {
        console.log('Registration successful, navigating to tabs');
        // Clear form data
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
        
        // Navigate to home screen
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
      } else {
        // Show error
        Alert.alert('Registration Failed', result.message || 'Failed to create account');
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
          <Text style={styles.title}>Join AfriStyle Today!</Text>
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
                placeholder="•••••••••••"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={!passwordVisible}
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
            
            <Text style={styles.fieldLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="•••••••••••"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                secureTextEntry={!confirmPasswordVisible}
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
    paddingTop: 16,
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
}); 