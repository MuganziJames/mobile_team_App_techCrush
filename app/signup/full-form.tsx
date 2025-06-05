import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        <Text style={styles.title}>Join AfriStyle Today!</Text>
        <Text style={styles.subtitle}>
          Explore exclusive, modern and exquisite African Designs at your fingertips.
        </Text>
        
        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <TextField
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                hasError={!!errors.firstName}
                errorText={errors.firstName}
              />
            </View>
            
            <View style={styles.nameField}>
              <TextField
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                hasError={!!errors.lastName}
                errorText={errors.lastName}
              />
            </View>
          </View>
          
          <TextField
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            hasError={!!errors.email}
            errorText={errors.email}
          />
          
          <TextField
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            keyboardType="phone-pad"
            hasError={!!errors.phone}
            errorText={errors.phone}
          />
          
          <TextField
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry
            hasError={!!errors.password}
            errorText={errors.password}
          />
          
          <TextField
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry
            hasError={!!errors.confirmPassword}
            errorText={errors.confirmPassword}
          />
          
          <TouchableOpacity 
            style={styles.checkboxContainer}
            activeOpacity={0.7}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
              {agreeToTerms && (
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          
          {errors.terms && (
            <Text style={styles.termsError}>{errors.terms}</Text>
          )}
          
          <Button
            title="Continue"
            onPress={handleSubmit}
            style={styles.button}
          />
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
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameField: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.midGray,
    marginRight: Layout.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: Typography.sizes.caption,
    color: Colors.darkGray,
  },
  link: {
    color: Colors.primary,
    fontWeight: "600",
  },
  termsError: {
    color: Colors.errorRed,
    fontSize: Typography.sizes.caption,
    marginBottom: Layout.spacing.sm,
    marginLeft: Layout.spacing.xs,
  },
  button: {
    marginTop: Layout.spacing.sm,
  },
}); 