import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="settings-outline" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {user?.firstName?.charAt(0) || ''}
                {user?.lastName?.charAt(0) || ''}
              </Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Ionicons name="person-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Ionicons name="location-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Shipping Addresses</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Ionicons name="card-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Payment Methods</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Ionicons name="time-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Order History</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Ionicons name="heart-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Wishlist</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
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
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.darkGray,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
}); 