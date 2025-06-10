import TopAppBar from '@/components/ui/TopAppBar';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function BlogScreen() {
  return (
    <View style={styles.container}>
      <TopAppBar title="Blog" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.center}>
          <Text style={styles.placeholder}>Blog Content Coming Soon</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.horizontalMargin,
    paddingTop: 8, // Reduced top padding to match other screens
    paddingBottom: Layout.spacing.lg + 88, // Extra padding for bottom tab bar
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: Typography.sizes.h1,
    fontWeight: '600',
    color: Colors.midGray,
  },
}); 