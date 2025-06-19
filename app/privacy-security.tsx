import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacyPolicyScreen() {
  const sections = [
    {
      heading: '1. Information We Collect',
      body: `We may collect the following types of information:

a. Personal Information
• Name, email address, and phone number
• Gender, age, or location (if you provide them)
• Payment information (processed securely via third-party providers)

b. Usage Data
• Device type and operating system
• App activity logs (e.g., login, browsing, purchases)
• IP address and device identifiers

c. User-Generated Content
• Photos, reviews, posts, or other content you voluntarily upload to the app`
    },
    {
      heading: '2. How We Use Your Information',
      body: `We use your data to:
• Create and manage your account
• Personalize your experience
• Process payments and deliver services
• Provide customer support
• Improve and develop our app features
• Send updates, promotions, or app-related notifications`
    },
    {
      heading: '3. How We Share Your Information',
      body: `We do not sell your personal data. However, we may share your data with:
• Service providers (e.g., payment processors, hosting services)
• Analytics tools to help improve our app (e.g., Google Analytics, Firebase)
• Legal authorities, if required by law or to protect our rights`
    },
    {
      heading: '4. Data Security',
      body: `We use industry-standard security measures to protect your information, including:
• Encryption of sensitive data
• Secure cloud storage
• Authentication and access controls

However, no system is 100% secure. Use AfriStyle at your own risk, and help keep your data safe by protecting your account credentials.`
    },
    {
      heading: '5. Your Rights',
      body: `Depending on your location, you may have the right to:
• Access the personal data we hold about you
• Correct or update your information
• Delete your data (right to be forgotten)
• Object to data processing or withdraw consent

To make a request, contact us at support@afristyle.app.`
    },
    {
      heading: '6. Data Retention',
      body: 'We retain your data only as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required or permitted by law.'
    },
    {
      heading: '7. Children\'s Privacy',
      body: 'AfriStyle is not intended for users under 13. We do not knowingly collect data from children under this age. If we learn we have collected data from a child, we will delete it promptly.'
    },
    {
      heading: '8. Third-Party Links and Services',
      body: 'Our app may contain links to external sites or integrate third-party services. We are not responsible for the privacy practices of those third parties.'
    },
    {
      heading: '9. Changes to This Policy',
      body: 'We may update this Privacy Policy from time to time. Any changes will be posted here, and we may notify you through the app or by email.'
    },
    {
      heading: '10. Contact Us',
      body: `If you have questions or concerns about your privacy or this policy, please reach out to us:

AfriStyle Team
Email: support@afristyle.app
Phone: +234 801 234 5678
Location: Lagos, Nigeria`
    }
  ];

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Scrollable */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.effectiveDate}>Effective Date: 20 June 2025</Text>
          
          <Text style={styles.introText}>
            At AfriStyle, your privacy matters. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our mobile application ("App").
          </Text>
          
          <Text style={styles.introText}>
            By using AfriStyle, you agree to the practices described in this Privacy Policy.
          </Text>

          {sections.map((s) => (
            <View key={s.heading} style={styles.section}>
              <Text style={styles.sectionHeading}>{s.heading}</Text>
              <Text style={styles.sectionBody}>{s.body}</Text>
            </View>
          ))}
          
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // No top padding
  },
  // Header - Scrollable
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60, // Status bar space
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  effectiveDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333333',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100, // Space for bottom tab bar
  },
}); 