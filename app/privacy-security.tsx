import ListRow from '@/components/ui/ListRow';
import ToggleRow from '@/components/ui/ToggleRow';
import TopAppBar from '@/components/ui/TopAppBar';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PrivacySecurityScreen() {
  // Toggle states
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [googleAuthEnabled, setGoogleAuthEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TopAppBar title="Privacy & Security" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ToggleRow
          label="Biometric ID"
          iconName="finger-print"
          value={biometricsEnabled}
          onValueChange={setBiometricsEnabled}
        />
        
        <ToggleRow
          label="Face ID"
          iconName="scan"
          value={faceIdEnabled}
          onValueChange={setFaceIdEnabled}
        />
        
        <ToggleRow
          label="Google Authenticator"
          iconName="shield-checkmark"
          value={googleAuthEnabled}
          onValueChange={setGoogleAuthEnabled}
        />
        
        <ListRow
          label="Change Password"
          iconName="key"
          onPress={() => {}}
        />
        
        <View style={styles.helpTextContainer}>
          <Text style={styles.helpText}>Change your account password to a new one</Text>
        </View>
        
        <ListRow
          label="Disable Account"
          iconName="pause-circle"
          onPress={() => {}}
        />
        
        <View style={styles.helpTextContainer}>
          <Text style={styles.helpText}>Your account will be temporarily disabled</Text>
        </View>
        
        <ListRow
          label="Delete Account"
          iconName="trash"
          onPress={() => {}}
        />
        
        <View style={styles.helpTextContainer}>
          <Text style={styles.helpText}>Your account will be permanently deleted</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(231, 110, 44, 0.1)', // Light orange background
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.horizontalMargin,
    paddingBottom: Layout.spacing.lg + 88, // Extra padding for bottom tab bar
  },
  helpTextContainer: {
    paddingHorizontal: Layout.spacing.sm + 40, // Align with the label text
    marginTop: -4,
    marginBottom: Layout.spacing.sm,
  },
  helpText: {
    fontSize: Typography.sizes.caption,
    color: Colors.darkGray,
  },
}); 