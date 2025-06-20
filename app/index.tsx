import Logo from '@/components/ui/Logo';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  const { user, isLoading, hasCompletedOnboarding } = useAuth();
  const hasNavigated = useRef(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Prevent multiple navigations
    if (hasNavigated.current) {
      return;
    }

    // Wait for auth to finish loading
    if (isLoading) {
      return;
    }

    // Add a small delay for smooth transition
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        setShowLoader(false);
        
        // Small additional delay before navigation to prevent flicker
        setTimeout(() => {
          if (user) {
            // User is logged in, go to main app
            router.replace('/(tabs)');
          } else if (hasCompletedOnboarding) {
            // User has completed onboarding but not logged in, go to signin
            router.replace('/signin');
          } else {
            // User hasn't completed onboarding, show onboarding
            router.replace('/onboarding');
          }
        }, 200);
      }
    }, 1800);
    
    return () => clearTimeout(timer);
  }, [user, isLoading, hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      <Logo size={240} />
      {(isLoading || showLoader) && (
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