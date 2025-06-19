import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type CountryCode = {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
};

// Popular country codes first, then alphabetical
const COUNTRY_CODES: CountryCode[] = [
  { name: "United States", code: "US", dial_code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "CA", dial_code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "AU", dial_code: "+61", flag: "🇦🇺" },
  { name: "India", code: "IN", dial_code: "+91", flag: "🇮🇳" },
  { name: "Nigeria", code: "NG", dial_code: "+234", flag: "🇳🇬" },
  { name: "South Africa", code: "ZA", dial_code: "+27", flag: "🇿🇦" },
  { name: "Kenya", code: "KE", dial_code: "+254", flag: "🇰🇪" },
  { name: "Ghana", code: "GH", dial_code: "+233", flag: "🇬🇭" },
  { name: "Egypt", code: "EG", dial_code: "+20", flag: "🇪🇬" },
  { name: "Morocco", code: "MA", dial_code: "+212", flag: "🇲🇦" },
  { name: "Algeria", code: "DZ", dial_code: "+213", flag: "🇩🇿" },
  { name: "Angola", code: "AO", dial_code: "+244", flag: "🇦🇴" },
  { name: "Benin", code: "BJ", dial_code: "+229", flag: "🇧🇯" },
  { name: "Botswana", code: "BW", dial_code: "+267", flag: "🇧🇼" },
  { name: "Burkina Faso", code: "BF", dial_code: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", dial_code: "+257", flag: "🇧🇮" },
  { name: "Cameroon", code: "CM", dial_code: "+237", flag: "🇨🇲" },
  { name: "Cape Verde", code: "CV", dial_code: "+238", flag: "🇨🇻" },
  { name: "Central African Republic", code: "CF", dial_code: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "TD", dial_code: "+235", flag: "🇹🇩" },
  { name: "Comoros", code: "KM", dial_code: "+269", flag: "🇰🇲" },
  { name: "Congo (DRC)", code: "CD", dial_code: "+243", flag: "🇨🇩" },
  { name: "Congo (Republic)", code: "CG", dial_code: "+242", flag: "🇨🇬" },
  { name: "Côte d'Ivoire", code: "CI", dial_code: "+225", flag: "🇨🇮" },
  { name: "Djibouti", code: "DJ", dial_code: "+253", flag: "🇩🇯" },
  { name: "Eritrea", code: "ER", dial_code: "+291", flag: "🇪🇷" },
  { name: "Eswatini", code: "SZ", dial_code: "+268", flag: "🇸🇿" },
  { name: "Ethiopia", code: "ET", dial_code: "+251", flag: "🇪��" },
  { name: "Gabon", code: "GA", dial_code: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", dial_code: "+220", flag: "🇬🇲" },
  { name: "Guinea", code: "GN", dial_code: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", dial_code: "+245", flag: "🇬🇼" },
  { name: "Lesotho", code: "LS", dial_code: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", dial_code: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "LY", dial_code: "+218", flag: "🇱🇾" },
  { name: "Madagascar", code: "MG", dial_code: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", dial_code: "+265", flag: "🇲🇼" },
  { name: "Mali", code: "ML", dial_code: "+223", flag: "🇲🇱" },
  { name: "Mauritania", code: "MR", dial_code: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", dial_code: "+230", flag: "🇲��" },
  { name: "Mozambique", code: "MZ", dial_code: "+258", flag: "🇲🇿" },
  { name: "Namibia", code: "NA", dial_code: "+264", flag: "🇳🇦" },
  { name: "Niger", code: "NE", dial_code: "+227", flag: "🇳🇪" },
  { name: "Rwanda", code: "RW", dial_code: "+250", flag: "🇷🇼" },
  { name: "São Tomé and Príncipe", code: "ST", dial_code: "+239", flag: "🇸🇹" },
  { name: "Senegal", code: "SN", dial_code: "+221", flag: "🇸🇳" },
  { name: "Seychelles", code: "SC", dial_code: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", dial_code: "+232", flag: "🇸🇱" },
  { name: "Somalia", code: "SO", dial_code: "+252", flag: "🇸🇴" },
  { name: "South Sudan", code: "SS", dial_code: "+211", flag: "🇸🇸" },
  { name: "Sudan", code: "SD", dial_code: "+249", flag: "🇸🇩" },
  { name: "Tanzania", code: "TZ", dial_code: "+255", flag: "🇹🇿" },
  { name: "Togo", code: "TG", dial_code: "+228", flag: "🇹🇬" },
  { name: "Tunisia", code: "TN", dial_code: "+216", flag: "🇹🇳" },
  { name: "Uganda", code: "UG", dial_code: "+256", flag: "��🇬" },
  { name: "Zambia", code: "ZM", dial_code: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", dial_code: "+263", flag: "🇿🇼" },
  { name: "Brazil", code: "BR", dial_code: "+55", flag: "🇧🇷" },
  { name: "China", code: "CN", dial_code: "+86", flag: "🇨🇳" },
  { name: "France", code: "FR", dial_code: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "DE", dial_code: "+49", flag: "🇩🇪" },
  { name: "Italy", code: "IT", dial_code: "+39", flag: "🇮🇹" },
  { name: "Japan", code: "JP", dial_code: "+81", flag: "🇯🇵" },
  { name: "Mexico", code: "MX", dial_code: "+52", flag: "🇲🇽" },
  { name: "Netherlands", code: "NL", dial_code: "+31", flag: "🇳🇱" },
  { name: "Russia", code: "RU", dial_code: "+7", flag: "🇷🇺" },
  { name: "Spain", code: "ES", dial_code: "+34", flag: "🇪🇸" },
  { name: "Sweden", code: "SE", dial_code: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", dial_code: "+41", flag: "🇨🇭" },
  { name: "Turkey", code: "TR", dial_code: "+90", flag: "🇹🇷" },
  { name: "United Arab Emirates", code: "AE", dial_code: "+971", flag: "🇦🇪" },
];

type CountryCodePickerProps = {
  selectedCountry: CountryCode;
  onSelect: (country: CountryCode) => void;
};

export default function CountryCodePicker({ selectedCountry, onSelect }: CountryCodePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = searchQuery 
    ? COUNTRY_CODES.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dial_code.includes(searchQuery) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COUNTRY_CODES;

  const renderItem = ({ item }: { item: CountryCode }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        onSelect(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text style={styles.countryName}>{item.name}</Text>
      <Text style={styles.dialCode}>{item.dial_code}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{selectedCountry.flag}</Text>
        <Text style={styles.dialCode}>{selectedCountry.dial_code}</Text>
        <Ionicons name="chevron-down" size={16} color={Colors.midGray} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.darkGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={Colors.midGray} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search country or code"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            </View>

            <FlatList
              data={filteredCountries}
              renderItem={renderItem}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
              showsVerticalScrollIndicator={true}
              initialNumToRender={15}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

// Export the country codes for use in other components
export { COUNTRY_CODES };

const styles = StyleSheet.create({
  container: {
    height: Layout.textFieldHeight,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.midGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 16,
    marginRight: 8,
  },
  dialCode: {
    fontSize: 14,
    color: Colors.black,
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: Layout.borderRadius,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    height: '100%',
    fontSize: 16,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    marginLeft: 8,
  },
}); 