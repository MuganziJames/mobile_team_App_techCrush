import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsTabScreen() {
  const { logout, user } = useAuth();

  const handleAccountInfo = () => {
    Alert.alert(
      'Account Information',
      `Name: ${user?.name || 'Not provided'}\n` +
      `Email: ${user?.email || 'Not provided'}\n` +
      `Account ID: ${user?.id || 'N/A'}\n` +
      `Role: ${user?.role || 'User'}\n` +
      `Account Type: Premium Member`,
      [{ text: 'OK' }]
    );
  };

  const handlePrivacySecurity = () => {
    router.push('/privacy-security');
  };

  const handlePreference = () => {
    // Navigate to preferences screen (to be created)
    Alert.alert('Preferences', 'Preferences screen coming soon!');
  };

  const handleNotification = () => {
    // Navigate to notification settings (to be created)
    Alert.alert('Notifications', 'Notification settings coming soon!');
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      '📧 Email: support@afristyle.com\n' +
      '📞 Phone: +234 801 234 5678\n' +
      '🕒 Hours: Mon-Fri 9AM-6PM WAT\n\n' +
      '💬 Live Chat: Available in-app\n' +
      '📚 FAQ: Visit our help center\n' +
      '🎥 Video Tutorials: Coming soon\n\n' +
      '🌍 Follow us:\n' +
      '@AfriStyleApp on all social media',
      [
        { text: 'Email Support', onPress: () => Alert.alert('Email', 'Opening email app...') },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert('About AfriStyle', 'Version 1.0.0\n\nDiscover authentic African fashion and art from the comfort of your home.');
  };

  const handleTerms = () => {
    Alert.alert('Terms & Conditions', 'Terms & conditions coming soon!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy coming soon!');
  };

  const handleLogout = () => {
    console.log('Logout button pressed');
    
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            console.log('User confirmed logout');
            performLogout();
          }
        }
      ]
    );
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
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
            performLogout();
          }
        }
      ]
    );
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

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handlePrivacyPolicy}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="shield" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

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