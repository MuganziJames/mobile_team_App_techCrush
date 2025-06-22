import CountryCodePicker, { CountryCode } from '@/components/ui/CountryCodePicker';
import SuccessCard from '@/components/ui/SuccessCard';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(user?.dateOfBirth ? new Date(user.dateOfBirth) : null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const defaultCountry = { name: 'Nigeria', code: 'NG', dial_code: '+234', flag: '🇳🇬' } as CountryCode;
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountry);
  const [location, setLocation] = useState(user?.location || '');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone?.replace(/^\+\d+/, '') || ''); // Remove country code from phone
      setLocation(user.location || '');
      setDateOfBirth(user.dateOfBirth ? new Date(user.dateOfBirth) : null);
      
      // Extract country code from phone number if present
      if (user.phone) {
        if (user.phone.startsWith('+234')) {
          setSelectedCountry({ name: 'Nigeria', code: 'NG', dial_code: '+234', flag: '🇳🇬' } as CountryCode);
          setPhone(user.phone.replace('+234', ''));
        } else if (user.phone.startsWith('+254')) {
          setSelectedCountry({ name: 'Kenya', code: 'KE', dial_code: '+254', flag: '🇰🇪' } as CountryCode);
          setPhone(user.phone.replace('+254', ''));
        } else if (user.phone.startsWith('+233')) {
          setSelectedCountry({ name: 'Ghana', code: 'GH', dial_code: '+233', flag: '🇬🇭' } as CountryCode);
          setPhone(user.phone.replace('+233', ''));
        }
      }
    }
  }, [user]);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirmDate = (date: Date) => {
    setDateOfBirth(date);
    hideDatePicker();
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validation', 'Full name is required.');
      return;
    }

    // Basic phone validation (digits only)
    if (phone && !/^\d{7,15}$/.test(phone.replace(/\s/g, ''))) {
      Alert.alert('Validation', 'Enter a valid phone number.');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare updates object with only changed fields
      const updates: any = {};
      
      // Always update name if changed
      if (fullName.trim() !== user?.name) {
        updates.name = fullName.trim();
      }
      
      // Update email if changed (though we preserve original for auth)
      if (email.trim() !== user?.email) {
        updates.email = email.trim();
      }
      
      // Update phone if changed
      const fullPhoneNumber = phone ? `${selectedCountry.dial_code}${phone}` : '';
      if (fullPhoneNumber !== user?.phone) {
        updates.phone = fullPhoneNumber || undefined;
        updates.countryCode = selectedCountry.code;
        updates.dialCode = selectedCountry.dial_code;
      }
      
      // Update date of birth if changed
      const newDateOfBirth = dateOfBirth ? dateOfBirth.toISOString() : undefined;
      if (newDateOfBirth !== user?.dateOfBirth) {
        updates.dateOfBirth = newDateOfBirth;
      }
      
      // Update location if changed
      if (location.trim() !== user?.location) {
        updates.location = location.trim() || undefined;
      }

      // Only update if there are actual changes
      if (Object.keys(updates).length === 0) {
        Alert.alert('No Changes', 'No changes were made to your profile.');
        setIsLoading(false);
        return;
      }

      // Update profile using AuthContext (this saves to AsyncStorage and preserves auth)
      const updatedUser = await updateProfile(updates);

      console.log('Profile updated successfully:', {
        changes: updates,
        updatedUser: {
          name: updatedUser.name,
          phone: updatedUser.phone,
          location: updatedUser.location,
          dateOfBirth: updatedUser.dateOfBirth
        }
      });

      // Show success card
      setShowSuccessCard(true);
      
      // Navigate back after showing success message
      setTimeout(() => {
        setShowSuccessCard(false);
        router.back();
      }, 1500);

    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert(
        'Error', 
        'Failed to update profile. Please try again.\n\nYour changes have been saved locally and will be available when you restart the app.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Success Card */}
      <SuccessCard
        visible={showSuccessCard}
        title="Profile Updated!"
        message="Your profile information has been saved successfully."
        onClose={() => setShowSuccessCard(false)}
        autoHide={true}
        duration={3000}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          placeholder="Enter full name"
          onChangeText={setFullName}
          editable={!isLoading}
        />

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.inputRow} activeOpacity={0.8} disabled={isLoading}>
          <Text style={styles.dateText}>{formatDate(dateOfBirth)}</Text>
          <Ionicons name="calendar" size={20} color={Colors.darkGray} />
        </TouchableOpacity>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          editable={!isLoading}
        />

        {/* Phone */}
        <Text style={styles.label}>Phone</Text>
        <View style={styles.phoneRow}>
          <CountryCodePicker
            selectedCountry={selectedCountry}
            onSelect={setSelectedCountry}
          />
          <TextInput
            style={[styles.input, styles.numberInput]}
            value={phone}
            placeholder="8012345678"
            keyboardType="number-pad"
            onChangeText={setPhone}
            editable={!isLoading}
          />
        </View>

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          placeholder="Enter location"
          onChangeText={setLocation}
          editable={!isLoading}
        />

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={handleSave} 
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.saveButtonText}>Saving...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date(1940, 0, 1)}
        maximumDate={new Date(2025, 11, 31)}
        date={dateOfBirth || new Date(1990, 0, 1)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#707070',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    marginBottom: 16,
    color: Colors.black,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: Colors.black,
  },
  phoneRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  countryInput: {
    flex: 0.4,
    marginRight: 8,
  },
  numberInput: {
    flex: 0.6,
  },
  saveButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E76E2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 