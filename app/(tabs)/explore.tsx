import Collapsible from '@/components/Collapsible';
import TopAppBar from '@/components/ui/TopAppBar';
import Colors from '@/constants/Colors';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <TopAppBar title="Explore" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Categories</Text>
        
        <Collapsible title="Traditional Wear">
          <View style={styles.collapsibleContent}>
            <Text style={styles.collapsibleText}>Agbada</Text>
            <Text style={styles.collapsibleText}>Kaftan</Text>
            <Text style={styles.collapsibleText}>Dashiki</Text>
            <Text style={styles.collapsibleText}>Ankara Dresses</Text>
          </View>
        </Collapsible>
        
        <Collapsible title="Modern Fashion">
          <View style={styles.collapsibleContent}>
            <Text style={styles.collapsibleText}>Contemporary Designs</Text>
            <Text style={styles.collapsibleText}>Fusion Wear</Text>
            <Text style={styles.collapsibleText}>Urban Styles</Text>
          </View>
        </Collapsible>
        
        <Collapsible title="Accessories">
          <View style={styles.collapsibleContent}>
            <Text style={styles.collapsibleText}>Jewelry</Text>
            <Text style={styles.collapsibleText}>Bags</Text>
            <Text style={styles.collapsibleText}>Headwraps</Text>
            <Text style={styles.collapsibleText}>Footwear</Text>
          </View>
        </Collapsible>
        
        <Collapsible title="Home Decor">
          <View style={styles.collapsibleContent}>
            <Text style={styles.collapsibleText}>Wall Art</Text>
            <Text style={styles.collapsibleText}>Textiles</Text>
            <Text style={styles.collapsibleText}>Sculptures</Text>
            <Text style={styles.collapsibleText}>Baskets & Pottery</Text>
          </View>
        </Collapsible>
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16,
  },
  collapsibleContent: {
    paddingVertical: 8,
  },
  collapsibleText: {
    fontSize: 16,
    color: Colors.darkGray,
    marginBottom: 8,
  },
});
