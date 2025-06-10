import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import TopAppBar from '@/components/ui/TopAppBar';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  // Mock user data
  const user = {
    fullName: 'Abdul Aziz',
    username: 'Hey Abdul_Z',
    dateOfBirth: 'May 22, 2004',
    email: 'unnuimail@gmail.com',
    phone: '+1 (123) 456-7890',
    profilePicture: 'https://i.pravatar.cc/150?img=8',
    country: 'US (+1)',
    phoneNumber: '(123) 456-7890',
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement delete functionality
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TopAppBar 
        title="My Profile" 
        rightComponent={<Ionicons name="ellipsis-vertical" size={24} color={Colors.black} />}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.username}>{user.username}</Text>
        </View>
        
        <View style={styles.formContainer}>
          <FormField label="Full Name" value={user.fullName} />
          <FormField label="Date of Birth" value={user.dateOfBirth} />
          <FormField label="Email address" value={user.email} />
          
          <View style={styles.phoneSection}>
            <Text style={styles.sectionLabel}>Phone Number</Text>
            <View style={styles.phoneRow}>
              <View style={[styles.fieldContainer, styles.countryField]}>
                <Text style={styles.fieldValue}>{user.country}</Text>
              </View>
              <View style={[styles.fieldContainer, styles.phoneField]}>
                <Text style={styles.fieldValue}>{user.phoneNumber}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.photoSection}>
            <Text style={styles.sectionLabel}>Profile Picture</Text>
            <View style={styles.photoContainer}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={24} color={Colors.darkGray} />
              </View>
            </View>
          </View>
          
          <Button
            title="Delete Profile"
            onPress={handleDeleteProfile}
            style={styles.deleteButton}
          />
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
  contentContainer: {
    paddingBottom: Layout.spacing.lg + 88, // Extra padding for bottom tab bar
  },
  header: {
    height: Layout.window.height * 0.25,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: 'center',
    paddingTop: Layout.spacing.sm,
  },
  avatarContainer: {
    marginTop: Layout.spacing.md,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.white,
    overflow: 'hidden',
  },
  avatar: {
    width: 80,
    height: 80,
  },
  username: {
    marginTop: Layout.spacing.sm,
    color: Colors.white,
    fontSize: Typography.sizes.body,
    fontWeight: '600',
  },
  formContainer: {
    padding: Layout.horizontalMargin,
    marginTop: Layout.spacing.md,
  },
  phoneSection: {
    marginBottom: Layout.spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: '500',
    color: Colors.darkGray,
    marginBottom: Layout.spacing.xs / 2,
    marginLeft: Layout.spacing.xs / 2,
  },
  phoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldContainer: {
    height: Layout.textFieldHeight,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.midGray,
    borderRadius: Layout.borderRadius,
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.sm,
  },
  countryField: {
    width: '30%',
    marginRight: Layout.spacing.xs,
  },
  phoneField: {
    flex: 1,
  },
  fieldValue: {
    fontSize: Typography.sizes.body,
    fontWeight: '400',
    color: Colors.black,
  },
  photoSection: {
    marginBottom: Layout.spacing.md,
  },
  photoContainer: {
    marginVertical: Layout.spacing.xs,
  },
  photoPlaceholder: {
    height: 48,
    width: '100%',
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.midGray,
    borderRadius: Layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginTop: Layout.spacing.md,
    backgroundColor: Colors.primary,
  },
}); 