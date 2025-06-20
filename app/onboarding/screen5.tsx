import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function OnboardingScreen5() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/AfricanPrintRomanticDress.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
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
  image: {
    width: '100%',
    height: '100%',
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