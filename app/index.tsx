import Logo from '@/components/ui/Logo';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    // Navigate to onboarding after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Logo size={160} />
      <Text style={styles.title}>AfriStyle</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: Layout.spacing.md,
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.semiBold,
    color: Colors.black,
    letterSpacing: Typography.tracking.h1,
  },
}); 