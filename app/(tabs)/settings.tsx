import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { logout } = useAuth();
  
  const handleBackPress = () => {
    router.back();
  };

  const handleAccountInfo = () => {
    console.log('Account Information pressed');
  };

  const handlePrivacySecurity = () => {
    router.push('/privacy-security');
  };

  const handlePreference = () => {
    console.log('Preference pressed');
  };

  const handleNotification = () => {
    console.log('Notification pressed');
  };

  const handleHelpSupport = () => {
    console.log('Help & Support pressed');
  };

  const handleLogout = () => {
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
          onPress: () => logout()
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
        {/* Header - Now scrollable */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Settings</Text>
          
          <View style={styles.headerSpacer} />
        </View>
        {/* Settings Items */}
        <View style={styles.settingsContainer}>
          
          {/* Account Information */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleAccountInfo}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Account Information</Text>
          </TouchableOpacity>

          {/* Privacy and Security */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handlePrivacySecurity}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Privacy and Security</Text>
          </TouchableOpacity>

          {/* Preference */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handlePreference}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="options" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Preference</Text>
          </TouchableOpacity>

          {/* Notification */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleNotification}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Notification</Text>
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleHelpSupport}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="help-circle" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Help & Support</Text>
          </TouchableOpacity>

          {/* Log Out */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="log-out" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.settingText}>Log Out</Text>
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
  // Header with back button and title
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8, // Reduced from 16px to 8px
    backgroundColor: '#F8F8F8',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40, // Balance the back button
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8, // Reduced from 24px to 8px
  },
  settingsContainer: {
    paddingHorizontal: 24,
  },
  // Individual setting item
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  // Orange circular icon container
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D85A1F', // Darker orange color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  bottomSpacing: {
    height: 100, // Space for bottom tab bar
  },
}); 