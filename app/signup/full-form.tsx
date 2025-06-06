import TextField from '@/components/ui/TextField';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function SignUpFullForm() {
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
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
    
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit the form
    console.log('Form submitted:', formData);
    // Navigate to success screen or home
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
                <Ionicons name="flag-outline" size={16} color="#666" />
                <Text style={styles.countryCode}>+1</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="(+44) 7682 36713"
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
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Continue</Text>
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
    marginTop: 12,
  },
  textInput: {
    marginBottom: 4,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    height: 50,
    borderColor: '#E1E1E1',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#E1E1E1',
    width: 80,
  },
  countryCode: {
    fontSize: 14,
    marginRight: 4,
    marginLeft: 4,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: '#E1E1E1',
    borderWidth: 1,
    borderRadius: 8,
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
    color: '#E53935',
    fontSize: 12,
    marginBottom: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E9642C',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: '#E9642C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.darkGray,
    lineHeight: 18,
  },
  termsLink: {
    color: '#E9642C',
  },
  submitButton: {
    backgroundColor: '#E9642C',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  }
}); 