import ListRow from '@/components/ui/ListRow';
import TopAppBar from '@/components/ui/TopAppBar';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

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
          onPress: () => {
            // Implement logout functionality
            router.replace('/signin');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TopAppBar title="Settings" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ListRow 
          label="Account Information" 
          iconName="person-circle" 
          onPress={() => router.push('/(tabs)/profile')}
        />
        
        <ListRow 
          label="Privacy and Security" 
          iconName="shield-checkmark" 
          onPress={() => router.push('/privacy-security')}
        />
        
        <ListRow 
          label="Preference" 
          iconName="options" 
          onPress={() => {}}
        />
        
        <ListRow 
          label="Notification" 
          iconName="notifications" 
          onPress={() => {}}
        />
        
        <ListRow 
          label="Help & Support" 
          iconName="help-buoy" 
          onPress={() => {}}
        />
        
        <ListRow 
          label="Log Out" 
          iconName="log-out" 
          onPress={handleLogout}
        />
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
    padding: Layout.horizontalMargin,
    paddingBottom: Layout.spacing.lg + 88, // Extra padding for bottom tab bar
  },
}); 