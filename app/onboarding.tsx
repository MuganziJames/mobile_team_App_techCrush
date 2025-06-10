import Button from '@/components/ui/Button';
import PaginationDots from '@/components/ui/PaginationDots';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to AfriStyle',
    description: 'Discover authentic African fashion and art from the comfort of your home.',
    icon: 'shirt-outline',
  },
  {
    id: '2',
    title: 'Browse Curated Collections',
    description: 'Explore unique pieces from talented African designers and artisans.',
    icon: 'grid-outline',
  },
  {
    id: '3',
    title: 'Secure Shopping Experience',
    description: 'Shop with confidence with our secure payment system and reliable delivery.',
    icon: 'shield-checkmark-outline',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSkip = () => {
    router.replace('/signin');
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef?.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/signin');
    }
  };

  const handleDemoPress = () => {
    router.replace('/demo-credentials');
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={120} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

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

      <View style={styles.bottomContainer}>
        <PaginationDots
          count={onboardingData.length}
          activeIndex={currentIndex}
        />
        
        <Button
          title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          style={styles.button}
        />
        
        <TouchableOpacity 
          style={styles.demoButton}
          onPress={handleDemoPress}
        >
          <Text style={styles.demoButtonText}>Demo Login Info</Text>
        </TouchableOpacity>
        
        {showDemoInfo && (
          <View style={styles.demoInfoCard}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Email: <Text style={styles.demoHighlight}>user@example.com</Text></Text>
            <Text style={styles.demoText}>Password: <Text style={styles.demoHighlight}>password123</Text></Text>
            <Text style={styles.demoNote}>* You can also create a new account</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  skipContainer: {
    alignItems: 'flex-end',
    padding: 16,
  },
  skipText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginTop: 24,
  },
  demoButton: {
    marginTop: 16,
    padding: 8,
  },
  demoButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  demoInfoCard: {
    backgroundColor: '#FFFAF0',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    width: '100%',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 4,
  },
  demoHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
  demoNote: {
    fontSize: 12,
    color: Colors.midGray,
    marginTop: 8,
    fontStyle: 'italic',
  },
}); 