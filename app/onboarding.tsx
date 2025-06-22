import Button from '@/components/ui/Button';
import PaginationDots from '@/components/ui/PaginationDots';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Discover Styles',
    description: 'Explore curated African designs tailored to your specific need.',
    backgroundImage: require('../assets/images/onboardingscreen4.png'),
  },
  {
    id: '2',
    title: 'Save to Sew',
    description: 'Bookmark and organize looks into themed folders for your tailor.',
    backgroundImage: require('../assets/images/onboardingscreen5.png'),
  },
  {
    id: '3',
    title: 'Read & Share Tips',
    description: 'Get tips, trends, and recaps – and share your favorites with ease.',
    backgroundImage: require('../assets/images/onboardingscreen6.jpg'),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const { completeOnboarding, rememberOnboarding } = useAuth();

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/signin');
  };

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef?.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // User completed onboarding, mark it as complete
      await completeOnboarding();
      router.replace('/signin');
    }
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={styles.slide}>
      <ImageBackground 
        source={item.backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Improved gradient overlay - smooth white fade from bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.9)', '#FFFFFF']}
          locations={[0, 0.4, 0.55, 0.7, 1]}
          style={styles.fadeOverlay}
          pointerEvents="none"
        />
        
        {/* Content positioned at bottom */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {/* Skip button positioned at top right - no background overlay */}
      <SafeAreaView style={styles.topContainer}>
        <View style={styles.backButton} />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      {/* Bottom controls positioned over the gradient */}
      <SafeAreaView style={styles.bottomContainer}>
        <View style={styles.paginationContainer}>
          <PaginationDots
            count={onboardingData.length}
            activeIndex={currentIndex}
          />
        </View>
        

        
        <View style={styles.buttonContainer}>
          <Button
            title="Sign Up"
            onPress={async () => {
              await completeOnboarding();
              router.replace('/signup');
            }}
            style={[styles.button, styles.signupButton]}
          />
          <Button
            title="Log In"
            onPress={async () => {
              await completeOnboarding();
              router.replace('/signin');
            }}
            style={[styles.button, styles.loginButton]}
            textStyle={styles.loginButtonText}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  skipButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    height,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fadeOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 180,
    left: 24,
    right: 24,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'left',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: Colors.black,
    textAlign: 'left',
    lineHeight: 22,
    opacity: 0.7,
    fontWeight: '400',

  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 50,
    alignItems: 'center',
    zIndex: 2,
  },
  paginationContainer: {
    marginBottom: 10,
  },

  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  loginButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
}); 