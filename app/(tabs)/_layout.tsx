import { Tabs } from 'expo-router';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('window');

// Calculate appropriate tab bar height based on device
const getTabBarHeight = () => {
  // Base height for tab content
  const baseHeight = 60;
  
  // Add safe area padding for devices with home indicator
  if (Platform.OS === 'ios') {
    // For iOS devices with home indicator (iPhone X and newer)
    // We'll let the safe area handle the bottom padding
    return baseHeight + 16; // Small additional padding
  } else {
    // For Android devices
    return baseHeight + 12; // Smaller padding for Android
  }
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabBarHeight = getTabBarHeight();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
              height: tabBarHeight,
              zIndex: 2000,
              elevation: 10,
              paddingBottom: 0, // Let SafeAreaProvider handle safe area
            },
            default: {
              height: tabBarHeight,
              zIndex: 2000,
              elevation: 10,
              backgroundColor: '#FFFFFF',
              paddingBottom: 8, // Small padding for Android
            },
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="blog"
          options={{
            title: 'Blog',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons 
                name={focused ? "newspaper" : "newspaper-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="lookbook"
          options={{
            title: 'Lookbook',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons 
                name={focused ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons 
                name={focused ? "settings" : "settings-outline"} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
