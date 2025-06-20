import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Local images for African fashion styles
const styleImages = [
  require('../../assets/images/modernAfrican.jpg'),
  require('../../assets/images/elegantAfrican.jpg'),
  require('../../assets/images/kenteCasual.jpg'),
  require('../../assets/images/afroCentricStyle.jpg'),
];

export default function Screen4() {
  return (
    <View style={styles.container}>
      <View style={styles.imageGrid}>
        {styleImages.map((image, index) => (
          <Image 
            key={index}
            source={image}
            style={styles.gridImage}
          />
        ))}
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
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridImage: {
    width: '33.3%',
    height: '33.3%',
    padding: 1,
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