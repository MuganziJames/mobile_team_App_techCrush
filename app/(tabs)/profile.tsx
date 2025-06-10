import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleBackPress = () => {
    router.back();
  };

  const handleMenuPress = () => {
    // Handle kebab menu press
    console.log('Menu pressed');
  };

  const handleEditAvatar = () => {
    // Handle edit avatar press
    console.log('Edit avatar pressed');
  };

  const handleDeleteProfile = () => {
    // Handle delete profile press
    console.log('Delete profile pressed');
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
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#000000" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>My Profile</Text>
            
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={handleMenuPress}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Avatar positioned absolutely to overlap header and content */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>
                {user?.firstName?.charAt(0) || 'A'}
                {user?.lastName?.charAt(0) || 'U'}
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
          <Text style={styles.greeting}>Hey {user?.firstName || 'Adams23'},</Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>
                  {user?.firstName} {user?.lastName}
                </Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Date Of Birth</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>January 15, 1990</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.fieldContainer}>
                <View style={styles.phoneContainer}>
                  <Text style={styles.flagPrefix}>🇳🇬</Text>
                  <Text style={styles.fieldValue}>{user?.phone || '+234 801 234 5678'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Location</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldValue}>Lagos, Nigeria</Text>
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

          {/* Delete Profile Button */}
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>Delete Profile</Text>
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
  // Orange header with curved bottom
  orangeHeader: {
    backgroundColor: '#E76E2C',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    height: 200, // Fixed height to ensure avatar positioning works
    position: 'relative',
  },
  // Status bar area (44px on iPhone)
  statusBarArea: {
    height: 44,
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
    top: 144, // Top edge at y=144px
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
    paddingTop: 80, // Space for the overlapping avatar (96px height / 2 + some margin)
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
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.black,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagPrefix: {
    fontSize: 16,
    marginRight: 8,
  },
  profilePictureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E76E2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  bottomSpacing: {
    height: 34,
  },
}); 