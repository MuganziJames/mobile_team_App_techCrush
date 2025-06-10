import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Alert,
    Clipboard,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function DemoCredentialsScreen() {
  const credentials = {
    email: 'demo@example.com',
    password: 'password123'
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert(`${label} Copied`, `The ${label.toLowerCase()} has been copied to your clipboard.`);
  };

  const goToSignIn = () => {
    router.replace('/signin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="information-circle" size={60} color={Colors.primary} />
            <Text style={styles.title}>Demo Credentials</Text>
            <Text style={styles.subtitle}>
              Use these credentials to test the app functionality
            </Text>
          </View>
          
          <View style={styles.credentialsContainer}>
            <View style={styles.credentialItem}>
              <Text style={styles.credentialLabel}>Email:</Text>
              <View style={styles.credentialValueContainer}>
                <Text style={styles.credentialValue}>{credentials.email}</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(credentials.email, 'Email')}
                >
                  <Ionicons name="copy-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.credentialItem}>
              <Text style={styles.credentialLabel}>Password:</Text>
              <View style={styles.credentialValueContainer}>
                <Text style={styles.credentialValue}>{credentials.password}</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(credentials.password, 'Password')}
                >
                  <Ionicons name="copy-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How to use:</Text>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumberContainer}>
                <Text style={styles.instructionNumber}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Copy the email and password by tapping the copy icon
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumberContainer}>
                <Text style={styles.instructionNumber}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Go to the sign-in screen by tapping the button below
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.instructionNumberContainer}>
                <Text style={styles.instructionNumber}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Paste the credentials into the login form
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.signInButton}
            onPress={goToSignIn}
            activeOpacity={0.7}
          >
            <Text style={styles.signInButtonText}>Go to Sign In</Text>
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  credentialsContainer: {
    width: '100%',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  credentialItem: {
    marginBottom: 16,
  },
  credentialLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGray,
    marginBottom: 4,
  },
  credentialValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
  },
  credentialValue: {
    fontSize: 16,
    color: Colors.black,
    flex: 1,
  },
  copyButton: {
    padding: 8,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  signInButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 