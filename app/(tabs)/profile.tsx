import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [localUser, setLocalUser] = useState(user);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [countryCode, setCountryCode] = useState('NG+234');

  // Function to refresh user data from storage
  const refreshUserData = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setLocalUser(userData);
        console.log('Profile data refreshed from storage:', userData);
      } else if (user) {
        // Fallback to context user if no storage data
        setLocalUser(user);
        console.log('Using context user data:', user);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Fallback to context user on error
      if (user) {
        setLocalUser(user);
      }
    }
  }, [user]);

  // Update local user when context user changes
  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  // Ensure status bar settings are applied when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Refresh user data when screen is focused (this ensures profile edits are reflected)
      refreshUserData();

      // Apply status bar settings when screen is focused
      const applyStatusBarSettings = () => {
        StatusBar.setBarStyle('light-content', true);
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setTranslucent(true);
      };

      // Apply immediately and with a small delay to ensure it takes effect
      applyStatusBarSettings();
      const timer = setTimeout(applyStatusBarSettings, 100);

      // Cleanup function when screen loses focus
      return () => {
        clearTimeout(timer);
        // Reset to proper settings for other screens with white backgrounds
        StatusBar.setBarStyle('dark-content', true);
        StatusBar.setBackgroundColor('#FFFFFF', true);
        StatusBar.setTranslucent(false);
      };
    }, [refreshUserData])
  );

  const handleEditAvatar = () => {
    Alert.alert('Edit Avatar', 'Avatar editing feature coming soon!');
  };

  const handleEditField = (fieldName: string, currentValue: string) => {
    setEditingField(fieldName);
    setTempValue(currentValue);
    
    Alert.prompt(
      `Edit ${fieldName}`,
      `Enter your new ${fieldName.toLowerCase()}:`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setEditingField(null);
            setTempValue('');
          }
        },
        {
          text: 'Save',
          onPress: (value) => {
            if (value && value.trim()) {
              // TODO: Implement actual API call to update user data
              Alert.alert(
                'Success',
                `${fieldName} updated successfully!\n\nNote: This is a demo. In the full version, this would sync with your account.`,
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert('Error', 'Please enter a valid value.');
            }
            setEditingField(null);
            setTempValue('');
          }
        }
      ],
      'plain-text',
      currentValue
    );
  };

  const handleEditPhone = () => {
    Alert.alert(
      'Edit Phone Number',
      'Choose your country and enter your phone number:',
      [
        {
          text: 'Nigeria (NG+234)',
          onPress: () => {
            Alert.prompt(
              'Edit Phone Number',
              'Enter your Nigerian phone number:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Save',
                  onPress: (value) => {
                    if (value && /^\d{10,11}$/.test(value.replace(/\s/g, ''))) {
                      setPhoneNumber(value);
                      setCountryCode('NG+234');
                      Alert.alert('Success', 'Phone number updated successfully!');
                    } else {
                      Alert.alert('Error', 'Please enter a valid Nigerian phone number (10-11 digits).');
                    }
                  }
                }
              ],
              'plain-text',
              phoneNumber.replace(/^\+234/, '') || ''
            );
          }
        },
        {
          text: 'Kenya (KE+254)',
          onPress: () => {
            Alert.prompt(
              'Edit Phone Number',
              'Enter your Kenyan phone number:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Save',
                  onPress: (value) => {
                    if (value && /^\d{9,10}$/.test(value.replace(/\s/g, ''))) {
                      setPhoneNumber(value);
                      setCountryCode('KE+254');
                      Alert.alert('Success', 'Phone number updated successfully!');
                    } else {
                      Alert.alert('Error', 'Please enter a valid Kenyan phone number (9-10 digits).');
                    }
                  }
                }
              ],
              'plain-text',
              phoneNumber.replace(/^\+254/, '') || ''
            );
          }
        },
        {
          text: 'Ghana (GH+233)',
          onPress: () => {
            Alert.prompt(
              'Edit Phone Number',
              'Enter your Ghanaian phone number:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Save',
                  onPress: (value) => {
                    if (value && /^\d{9,10}$/.test(value.replace(/\s/g, ''))) {
                      setPhoneNumber(value);
                      setCountryCode('GH+233');
                      Alert.alert('Success', 'Phone number updated successfully!');
                    } else {
                      Alert.alert('Error', 'Please enter a valid Ghanaian phone number (9-10 digits).');
                    }
                  }
                }
              ],
              'plain-text',
              phoneNumber.replace(/^\+233/, '') || ''
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirmDate = (date: Date) => {
    setBirthDate(date);
    hideDatePicker();
    Alert.alert('Success', 'Date of birth updated successfully!');
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not provided';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditLocation = () => {
    Alert.alert(
      'Edit Location',
      'Choose your location:',
      [
        {
          text: 'Lagos, Nigeria 🇳🇬',
          onPress: () => Alert.alert('Success', 'Location updated to Lagos, Nigeria!')
        },
        {
          text: 'Abuja, Nigeria 🇳🇬',
          onPress: () => Alert.alert('Success', 'Location updated to Abuja, Nigeria!')
        },
        {
          text: 'Nairobi, Kenya 🇰🇪',
          onPress: () => Alert.alert('Success', 'Location updated to Nairobi, Kenya!')
        },
        {
          text: 'Accra, Ghana 🇬🇭',
          onPress: () => Alert.alert('Success', 'Location updated to Accra, Ghana!')
        },
        {
          text: 'Custom Location',
          onPress: () => {
            Alert.prompt(
              'Custom Location',
              'Enter your location:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Save',
                  onPress: (value) => {
                    if (value && value.trim()) {
                      Alert.alert('Success', `Location updated to ${value}!`);
                    } else {
                      Alert.alert('Error', 'Please enter a valid location.');
                    }
                  }
                }
              ],
              'default',
              'Lagos, Nigeria'
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (localUser?.name) {
      const nameParts = localUser.name.split(' ');
      return (nameParts[0]?.charAt(0) || '') + (nameParts[1]?.charAt(0) || '');
    }
    return 'AU';
  };

  // Get first name for greeting
  const getFirstName = () => {
    if (localUser?.name) {
      return localUser.name.split(' ')[0];
    }
    return 'User';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Orange Header with curved bottom - extends to screen edges */}
        <View style={styles.orangeHeader}>
          {/* Navigation bar */}
          <View style={styles.navBar}>
            <View style={styles.backButton} />
            
            <Text style={styles.headerTitle}>My Profile</Text>
            
            <View style={styles.menuButton} />
          </View>
        </View>

        {/* Avatar positioned absolutely to overlap header and content */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>
                {getInitials()}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editBadge}
              onPress={handleEditAvatar}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={12} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content below header with top padding for avatar space */}
        <View style={styles.contentContainer}>
          {/* Greeting */}
          <Text style={styles.greeting}>Hey {getFirstName()},</Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>
                  {localUser?.name || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Date Of Birth</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>{localUser?.dateOfBirth ? new Date(localUser.dateOfBirth).toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'}) : 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>{localUser?.email || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>{localUser?.phone || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Location</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>{localUser?.location || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Profile Picture</Text>
              <View style={styles.fieldContainer}>
                <View style={styles.profilePictureContainer}>
                  <Ionicons name="camera" size={20} color={Colors.darkGray} />
                  <Text style={styles.fieldValue}>Current photo</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* Bottom spacing for home indicator */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Orange header with curved bottom - extends to full screen
  orangeHeader: {
    backgroundColor: '#E76E2C',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    height: 240, // Increased to account for status bar area
    position: 'relative',
    paddingTop: 60, // Add padding for status bar area
  },
  // Navigation bar with back button, title, and menu
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.44,
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Avatar positioned absolutely at y=144px, horizontally centered
  avatarContainer: {
    position: 'absolute',
    top: 184, // Adjusted for increased header height (was 144, now 144 + 40)
    left: 0,
    right: 0,
    alignItems: 'center', // Horizontally center
    zIndex: 10, // Ensure it's above other content
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E76E2C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  // Content container with top padding to account for overlapping avatar
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 80, // Restored to 80px to account for avatar overlap
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#707070',
    marginBottom: 8,
  },
  fieldContainer: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.black,
    flex: 1,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagPrefix: {
    fontSize: 16,
    marginRight: 8,
  },
  profilePictureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  editProfileButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E76E2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  bottomSpacing: {
    height: 100, // Increased for tab bar
  },
}); 