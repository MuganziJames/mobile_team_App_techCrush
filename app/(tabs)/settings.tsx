import ConfirmationModal from '@/components/ui/ConfirmationModal';
import ErrorModal from '@/components/ui/ErrorModal';
import ModalCard from '@/components/ui/ModalCard';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsTabScreen() {
  const { logout, user, deleteAccount } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [preferencesVisible, setPreferencesVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', message: '' });

  const handleAccountInfo = () => {
    setAccountVisible(true);
  };

  const handlePrivacySecurity = () => {
    router.push('/privacy-security');
  };

  const handlePreference = () => {
    setPreferencesVisible(true);
  };

  const handleNotification = () => {
    setNotificationsVisible(true);
  };

  const handleHelpSupport = () => setHelpVisible(true);

  const handleAbout = () => setAboutVisible(true);

  const handleTerms = () => {
    router.push('/terms');
  };

  const handlePrivacyPolicy = () => {
    setErrorMessage({
      title: 'Coming Soon',
      message: 'Privacy policy feature is coming soon!'
    });
    setErrorVisible(true);
  };

  const handleLogout = () => {
    setLogoutVisible(true);
  };

  const confirmLogout = () => {
    setLogoutVisible(false);
    performLogout();
  };

  const cancelLogout = () => {
    setLogoutVisible(false);
  };

  const performLogout = async () => {
    try {
      console.log('Starting logout process...');
      await logout();
      console.log('Logout completed successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteVisible(true);
  };

  const confirmDeleteAccount = async () => {
    setDeleteVisible(false);
    try {
      console.log('Starting delete account process...');
      const result = await deleteAccount();
      if (!result.success) {
        setErrorMessage({
          title: 'Delete Failed',
          message: result.message || 'Failed to delete account. Please try again.'
        });
        setErrorVisible(true);
      }
    } catch (error) {
      console.error('Delete account failed:', error);
      setErrorMessage({
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.'
      });
      setErrorVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Settings Items */}
        <View style={styles.settingsContainer}>
          
          {/* Account Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleAccountInfo}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Account Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handlePrivacySecurity}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Privacy and Security</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* App Settings Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handlePreference}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="options" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleNotification}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Support Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Support</Text>
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleHelpSupport}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="help-circle" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleAbout}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Legal Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Legal</Text>
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleTerms}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="document-text" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Privacy Policy - Commented out */}
          {/* <TouchableOpacity 
            style={styles.settingItem}
            onPress={handlePrivacyPolicy}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="shield" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity> */}

          {/* Danger Zone */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FF6B35' }]}>
              <Ionicons name="log-out" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Log Out</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FF3B30' }]}>
              <Ionicons name="trash" size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.settingText, { color: '#FF3B30' }]}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Logout confirmation Modal */}
      <ConfirmationModal
        visible={logoutVisible}
        iconName="log-out"
        title="Log Out"
        message="Are you sure  you want to log out?"
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />

      {/* Info & Support Modals */}
      <ModalCard
        visible={accountVisible}
        iconName="person"
        title="Account Information"
        message={`Name: ${user?.name || 'Not provided'}\nEmail: ${user?.email || 'Not provided'}\nAccount ID: ${user?.id || 'N/A'}\nRole: ${user?.role || 'User'}\nAccount Type: Premium Member`}
        onClose={() => setAccountVisible(false)}
      />

      <ModalCard
        visible={helpVisible}
        iconName="help-circle"
        title="Help & Support"
                    message={'Email: support@mystylemag.com\nPhone: +234 801 234 5678\nHours: Mon-Fri 9AM-6PM WAT\n\nLive Chat: Available in-app\nFAQ: Visit our help center'}
        onClose={() => setHelpVisible(false)}
      />

      <ModalCard
        visible={aboutVisible}
        iconName="information-circle"
                    title="About MyStyleMag"
        message={'Version 1.0.0\n\nDiscover authentic African fashion and art from the comfort of your home.'}
        onClose={() => setAboutVisible(false)}
      />

      {/* Coming Soon Modals */}
      <ModalCard
        visible={preferencesVisible}
        iconName="options"
        title="Preferences"
        message={'🎨 Customize Your Experience\n\n• Theme & Display Settings\n• Language Preferences\n• Content Recommendations\n• Accessibility Options\n\nWe\'re working hard to bring you these amazing customization features!\n\nExpected Launch: Q2 2025'}
        onClose={() => setPreferencesVisible(false)}
      />

      <ModalCard
        visible={notificationsVisible}
        iconName="notifications"
        title="Notification Settings"
        message={'🔔 Stay Connected\n\n• Push Notifications\n• Email Updates\n• Style Alerts & Trends\n• Sale & Promotion Notifications\n• Weekly Style Digest\n\nPersonalized notification controls are coming soon to help you stay updated with what matters most!\n\nExpected Launch: Q2 2025'}
        onClose={() => setNotificationsVisible(false)}
      />

      {/* Delete account confirmation */}
      <ConfirmationModal
        visible={deleteVisible}
        iconName="trash"
        iconBackground="#FF3B30"
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setDeleteVisible(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={errorVisible}
        title={errorMessage.title}
        message={errorMessage.message}
        buttonText="OK"
        onClose={() => setErrorVisible(false)}
      />
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
    paddingBottom: 100, // Space for tab bar
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F8F8F8',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  settingsContainer: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 1,
    borderRadius: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
}); 