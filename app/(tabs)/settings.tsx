import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingItemIcon}>
                <Ionicons name="notifications" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.settingItemText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.midGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingItemIcon}>
                <Ionicons name="moon" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.settingItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: Colors.midGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingItemIcon}>
                <Ionicons name="help-circle" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.settingItemText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingItemIcon}>
                <Ionicons name="chatbox" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.settingItemText}>Contact Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingItemIcon}>
                <Ionicons name="document-text" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.settingItemText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingItemIcon}>
                <Ionicons name="document-text" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.settingItemText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.white} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.black,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingItemText: {
    fontSize: 16,
    color: Colors.black,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    height: 50,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 32,
  },
}); 