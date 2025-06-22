import SafeIcon from '@/components/ui/SafeIcon';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TermsScreen() {
  const sections = [
    {
      heading: '1. Eligibility',
      body: 'You must be at least 13 years of age to use MyStyleMag. By using the App, you confirm that you meet the eligibility criteria.'
    },
    {
      heading: '2. User Accounts',
      body: 'You may be required to create an account to access certain features. You agree to provide accurate, current, and complete information and to keep your account information updated. You are responsible for maintaining the confidentiality of your login credentials.'
    },
    {
      heading: '3. Acceptable Use',
      body: `You agree not to:\n• Use the App for any unlawful purpose.\n• Post or share content that is abusive, offensive, or infringes on others' rights.\n• Attempt to hack, disrupt, or misuse the App or its services.\n\nWe reserve the right to suspend or terminate accounts that violate these terms.`
    },
    {
      heading: '4. Content Ownership',
      body: 'All content available through the App, including images, text, logos, and code, is the property of MyStyleMag or its content providers. You may not copy, reproduce, or distribute content without permission.'
    },
    {
      heading: '5. User-Generated Content',
      body: 'By submitting content (e.g., photos, reviews) you grant MyStyleMag a non-exclusive, worldwide, royalty-free licence to use, display, and share that content for promotional and operational purposes. You are solely responsible for anything you upload.'
    },
    {
      heading: '6. Purchases & Payments',
      body: 'If MyStyleMag offers e-commerce features, all transactions must be completed using secure payment methods. Prices are displayed in your local currency and you agree to pay all charges incurred by you or your account.'
    },
    {
      heading: '7. Privacy',
      body: 'We are committed to protecting your privacy. Please review our Privacy Policy to understand how we collect, use, and protect your personal data.'
    },
    {
      heading: '8. Termination',
      body: 'We may suspend or terminate your access to the App at any time, with or without notice, for conduct that violates these Terms or is harmful to our interests.'
    },
    {
      heading: '9. Disclaimer',
      body: 'MyStyleMag is provided "as-is" and "as-available." We make no warranties regarding the accuracy, reliability, or availability of the App or its content.'
    },
    {
      heading: '10. Limitation of Liability',
      body: 'To the maximum extent permitted by law, MyStyleMag and its affiliates will not be liable for any indirect, incidental, or consequential damages arising out of your use of the App.'
    },
    {
      heading: '11. Changes to Terms',
      body: 'We may update these Terms from time to time. We will notify you via the App or e-mail. Continued use of MyStyleMag after changes are made constitutes your acceptance of the new Terms.'
    },
    {
      heading: '12. Contact Us',
      body: 'Email: support@mystylemag.app\nPhone: +234 801 234 5678\nAddress: Lagos, Nigeria'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Back button only for accessibility */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <SafeIcon name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.mainHeading}>Terms & Conditions</Text>
          <Text style={styles.effectiveDate}>Effective Date: 19 June 2025</Text>
          
          <Text style={styles.introText}>
                Welcome to MyStyleMag. These Terms & Conditions govern your use of our application and services.
    By using MyStyleMag, you agree to these terms in their entirety.
          </Text>
          
          {sections.map((s) => (
            <View key={s.heading} style={styles.section}>
              <Text style={styles.sectionHeading}>{s.heading}</Text>
              <Text style={styles.sectionBody}>{s.body}</Text>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  effectiveDate: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 16,
    textAlign: 'center',
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.darkGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 14,
    color: Colors.darkGray,
    lineHeight: 20,
  },
}); 