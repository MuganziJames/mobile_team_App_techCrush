import Logo from '@/components/ui/Logo';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Check if user is already logged in
      const timer = setTimeout(() => {
        if (user) {
          // User is logged in, go to main app
          router.replace('/(tabs)');
        } else {
          // User is not logged in, go to onboarding
          router.replace('/onboarding');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading]);

  return (
    <View style={styles.container}>
      <Logo size={240} />
      {isLoading && (
        <ActivityIndicator 
          style={styles.loader} 
          color={Colors.primary} 
          size="large" 
        />
      )}
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
  loader: {
    position: 'absolute',
    bottom: 80,
  }
}); 