import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function OnboardingScreen4() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Image collage grid (3x3) */}
        <View style={styles.grid}>
          {Array.from({ length: 9 }).map((_, index) => (
            <View key={index} style={styles.gridItem}>
              <Image 
                source={{ uri: `https://source.unsplash.com/random/300x300/?african,fashion,style,${index}` }}
                style={styles.gridImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>
        {/* Gradient overlay */}
        <View style={styles.gradient} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Discover Styles</Text>
        <Text style={styles.description}>
          Explore curated African designs tailored to your specific need.
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
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '33.3%',
    height: '33.3%',
    padding: 1,
  },
  gridImage: {
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
    // In a real app, you'd use a LinearGradient component
    // But for this example, we're using a plain View with a background
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