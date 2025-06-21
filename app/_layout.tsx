import { AuthProvider } from '@/contexts/AuthContext';
import { BlogProvider } from '@/contexts/BlogContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { LookbookProvider } from '@/contexts/LookbookContext';
import { OutfitProvider } from '@/contexts/OutfitContext';
import { LikeProvider } from '@/contexts/SaveContext';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load only required icon fonts, skip SpaceMono to avoid the download error
  const [loaded, error] = useFonts({
    ...Platform.select({
      ios: {
        ...Ionicons.font,
        ...FontAwesome.font,
      },
      android: {
        // On Android, we'll use the pre-loaded system fonts
      },
      default: {
        ...Ionicons.font,
        ...FontAwesome.font,
      }
    })
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      // Continue with app initialization even if fonts fail
      SplashScreen.hideAsync().catch(e => {
        console.warn('Error hiding splash screen:', e);
      });
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(e => {
        console.warn('Error hiding splash screen:', e);
      });
    }
  }, [loaded]);

  // Continue with app initialization after a short delay even if font loading fails
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded && error) {
        console.log('Proceeding with app initialization despite font loading error');
        SplashScreen.hideAsync().catch(e => {
          console.warn('Error hiding splash screen:', e);
        });
      }
    }, 2000); // 2 second timeout
    
    return () => clearTimeout(timer);
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <CategoryProvider>
        <BlogProvider>
          <OutfitProvider>
            <LikeProvider>
              <LookbookProvider>
                <RootLayoutNav />
              </LookbookProvider>
            </LikeProvider>
          </OutfitProvider>
        </BlogProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="signup/index" options={{ headerShown: false }} />
        <Stack.Screen name="signup/full-form" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-security" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-settings" options={{ headerShown: false }} />
        <Stack.Screen name="blog-detail" options={{ headerShown: false }} />
        <Stack.Screen name="style-detail" options={{ headerShown: false }} />
        <Stack.Screen name="lookbook-folder" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="terms" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
