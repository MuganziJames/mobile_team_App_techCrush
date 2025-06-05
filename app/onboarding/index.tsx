import Button from '@/components/ui/Button';
import PaginationDots from '@/components/ui/PaginationDots';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OnboardingScreen4 from './screen4';
import OnboardingScreen5 from './screen5';
import OnboardingScreen6 from './screen6';

export default function OnboardingIndex() {
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const screens = [
    <OnboardingScreen4 />,
    <OnboardingScreen5 />,
    <OnboardingScreen6 />,
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      router.replace('/signup');
    }
  };

  const handleSkip = () => {
    router.replace('/signup');
  };

  const handleSignIn = () => {
    router.replace('/signin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        {screens[currentScreen]}
        
        <View style={styles.footer}>
          <PaginationDots 
            total={screens.length} 
            current={currentScreen}
            style={styles.pagination}
          />
          
          <Button 
            title="Sign Up" 
            onPress={handleNext}
            style={styles.button}
          />
          
          {currentScreen === screens.length - 1 && (
            <Button
              title="Log In"
              onPress={handleSignIn}
              variant="outline"
              style={styles.loginButton}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  skipButton: {
    position: 'absolute',
    top: Layout.statusBarHeight,
    right: Layout.horizontalMargin,
    zIndex: 10,
    padding: Layout.spacing.xs,
  },
  skipText: {
    fontSize: Typography.sizes.caption,
    color: Colors.midGray,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: Layout.horizontalMargin,
    paddingBottom: Layout.homeIndicatorHeight + Layout.spacing.md,
  },
  pagination: {
    marginBottom: Layout.spacing.md,
  },
  button: {
    marginBottom: Layout.spacing.sm,
  },
  loginButton: {
    marginTop: Layout.spacing.xs,
  },
}); 