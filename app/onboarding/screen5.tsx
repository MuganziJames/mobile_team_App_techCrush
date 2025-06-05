import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function OnboardingScreen5() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Single runway image */}
        <Image 
          source={{ uri: 'https://source.unsplash.com/random/800x1200/?african,fashion,runway' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        {/* Gradient overlay */}
        <View style={styles.gradient} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Save to Sew</Text>
        <Text style={styles.description}>
          Bookmark and organize looks into themed folders for your tailor.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    height: Layout.heroImageHeight,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'transparent',
    // Linear gradient from transparent to white
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: -90 },
    shadowOpacity: 1,
    shadowRadius: 90,
    elevation: 10,
  },
  textContainer: {
    padding: Layout.horizontalMargin,
    marginTop: Layout.spacing.md,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: "600",
    color: Colors.black,
    letterSpacing: Typography.tracking.h1,
    marginBottom: Layout.spacing.sm,
  },
  description: {
    fontSize: Typography.sizes.body,
    color: Colors.darkGray,
    marginBottom: Layout.spacing.lg,
  },
}); 