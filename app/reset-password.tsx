import Button from '@/components/ui/Button';
import TextField from '@/components/ui/TextField';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const validatePasswords = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleResetPassword = () => {
    const newErrors = validatePasswords();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleLoginAfterReset = () => {
    setShowSuccessModal(false);
    router.replace('/signin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>
          Set your new password! Make sure your new password is different from your previous password.
        </Text>
        
        <TextField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          hasError={!!errors.password}
          errorText={errors.password}
          style={styles.input}
        />
        
        <TextField
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          hasError={!!errors.confirmPassword}
          errorText={errors.confirmPassword}
          style={styles.input}
        />
        
        <Button
          title="Set New Password"
          onPress={handleResetPassword}
          style={styles.button}
        />
      </View>
      
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color={Colors.primary} />
            </View>
            
            <Text style={styles.modalTitle}>Password changed successfully</Text>
            <Text style={styles.modalSubtitle}>
              Your password has been reset. You can now log in with your new password.
            </Text>
            
            <Button
              title="Log In"
              onPress={handleLoginAfterReset}
              style={styles.modalButton}
            />
          </View>
        </View>
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
    fontWeight: Typography.weights.semiBold,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.horizontalMargin,
  },
  modalContent: {
    width: 320,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius,
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: Layout.spacing.md,
  },
  modalTitle: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.semiBold,
    color: Colors.black,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.darkGray,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
  },
}); 