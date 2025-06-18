import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

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
          text: 'Nigeria 🇳🇬',
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
                      Alert.alert('Success', 'Phone number updated successfully!');
                    } else {
                      Alert.alert('Error', 'Please enter a valid Nigerian phone number (10-11 digits).');
                    }
                  }
                }
              ],
              'plain-text',
              user?.phone?.replace('+234', '') || ''
            );
          }
        },
        {
          text: 'Other Country',
          onPress: () => {
            Alert.alert('Coming Soon', 'Support for other countries coming soon!');
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleEditDate = () => {
    Alert.alert(
      'Edit Date of Birth',
      'Select your birth date:',
      [
        {
          text: 'January 1990',
          onPress: () => Alert.alert('Success', 'Date of birth updated to January 1990!')
        },
        {
          text: 'February 1991',
          onPress: () => Alert.alert('Success', 'Date of birth updated to February 1991!')
        },
        {
          text: 'March 1992',
          onPress: () => Alert.alert('Success', 'Date of birth updated to March 1992!')
        },
        {
          text: 'Custom Date',
          onPress: () => {
            Alert.prompt(
              'Custom Date',
              'Enter your birth date (DD/MM/YYYY):',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Save',
                  onPress: (value) => {
                    if (value && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                      Alert.alert('Success', `Date of birth updated to ${value}!`);
                    } else {
                      Alert.alert('Error', 'Please enter date in DD/MM/YYYY format.');
                    }
                  }
                }
              ],
              'default',
              '15/01/1990'
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
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
          text: 'Kano, Nigeria 🇳🇬',
          onPress: () => Alert.alert('Success', 'Location updated to Kano, Nigeria!')
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

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      return (nameParts[0]?.charAt(0) || '') + (nameParts[1]?.charAt(0) || '');
    }
    return 'AU';
  };

  // Get first name for greeting
  const getFirstName = () => {
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    return 'User';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E76E2C" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Orange Header with curved bottom */}
        <View style={styles.orangeHeader}>
          {/* Status bar area */}
          <View style={styles.statusBarArea} />
          
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
            <TouchableOpacity 
              style={styles.fieldGroup}
              onPress={() => handleEditField('Full Name', user?.name || '')}
              activeOpacity={0.7}
            >
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>
                  {user?.name || 'Not provided'}
                </Text>
                <Ionicons name="pencil" size={16} color={Colors.darkGray} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.fieldGroup}
              onPress={handleEditDate}
              activeOpacity={0.7}
            >
              <Text style={styles.fieldLabel}>Date Of Birth</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>Not provided</Text>
                <Ionicons name="pencil" size={16} color={Colors.darkGray} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.fieldGroup}
              onPress={() => handleEditField('Email', user?.email || '')}
              activeOpacity={0.7}
            >
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>{user?.email || 'Not provided'}</Text>
                <Ionicons name="pencil" size={16} color={Colors.darkGray} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.fieldGroup}
              onPress={handleEditPhone}
              activeOpacity={0.7}
            >
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.fieldContainer}>
                <View style={styles.phoneContainer}>
                  <Text style={styles.flagPrefix}>🇳🇬</Text>
                  <Text style={styles.fieldValue}>{user?.phone || 'Not provided'}</Text>
                </View>
                <Ionicons name="pencil" size={16} color={Colors.darkGray} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.fieldGroup}
              onPress={handleEditLocation}
              activeOpacity={0.7}
            >
              <Text style={styles.fieldLabel}>Location</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>Not provided</Text>
                <Ionicons name="pencil" size={16} color={Colors.darkGray} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.fieldGroup}
              onPress={handleEditAvatar}
              activeOpacity={0.7}
            >
              <Text style={styles.fieldLabel}>Profile Picture</Text>
              <View style={styles.fieldContainer}>
                <View style={styles.profilePictureContainer}>
                  <Ionicons name="camera" size={20} color={Colors.darkGray} />
                  <Text style={styles.fieldValue}>Current photo</Text>
                </View>
                <Ionicons name="pencil" size={16} color={Colors.darkGray} />
              </View>
            </TouchableOpacity>
          </View>

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
  // Orange header with curved bottom
  orangeHeader: {
    backgroundColor: '#E76E2C',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: 200, // Restored to 200px to accommodate avatar at y=144
    position: 'relative',
  },
  // Status bar area (44px on iPhone)
  statusBarArea: {
    height: 60,
  },
  // Navigation bar with back button, title, and menu
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12, // Restored to 12px
    height: 56, // Restored to 56px
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
    color: '#000000',
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
    top: 144, // Exact y position as specified
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
  bottomSpacing: {
    height: 100, // Increased for tab bar
  },
}); 