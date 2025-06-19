import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacySettingsScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleChangePassword = () => {
    console.log('Change Password pressed');
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      'Deactivate Account',
      'Are you sure you want to temporarily deactivate your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Deactivate', style: 'destructive', onPress: () => console.log('Account deactivated') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to permanently delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') }
      ]
    );
  };

  const handleViewPrivacyPolicy = () => {
    router.push('/privacy-security');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Scrollable */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Privacy & Security</Text>
        </View>

        {/* Settings Items */}
        <View style={styles.settingsContainer}>
          
          {/* Biometric ID */}
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Biometric ID</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E0E0E0', true: '#FF6B35' }}
              thumbColor={biometricEnabled ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          {/* Face ID */}
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Face ID</Text>
            <Switch
              value={faceIdEnabled}
              onValueChange={setFaceIdEnabled}
              trackColor={{ false: '#E0E0E0', true: '#FF6B35' }}
              thumbColor={faceIdEnabled ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          {/* Google Authenticator */}
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Google Authenticator</Text>
            <Switch
              value={googleAuthEnabled}
              onValueChange={setGoogleAuthEnabled}
              trackColor={{ false: '#E0E0E0', true: '#FF6B35' }}
              thumbColor={googleAuthEnabled ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          {/* Privacy Policy */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleViewPrivacyPolicy}
            activeOpacity={0.7}
          >
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <Text style={styles.settingText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          {/* Deactivate Account */}
          <TouchableOpacity 
            style={styles.settingItemWithDescription}
            onPress={handleDeactivateAccount}
            activeOpacity={0.7}
          >
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Deactivate Account</Text>
              <Text style={styles.settingDescription}>
                Temporarily deactivate your account. Easily reactivate when you're ready.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity 
            style={styles.settingItemWithDescription}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingText}>Delete Account</Text>
              <Text style={styles.settingDescription}>
                Permanently remove your account and data. Proceed with caution.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // No top padding
  },
  // Header - Scrollable
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60, // Status bar space
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  settingsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24, // Minimal top spacing
  },
  // Individual setting item
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // Setting item with description
  settingItemWithDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 100, // Space for bottom tab bar
  },
}); 