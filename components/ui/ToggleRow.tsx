import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import ToggleSwitch from './ToggleSwitch';

type ToggleRowProps = {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function ToggleRow({
  label,
  iconName,
  value,
  onValueChange,
  disabled = false,
}: ToggleRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={Colors.white} />
      </View>
      
      <Text style={styles.label}>{label}</Text>
      
      <ToggleSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: Colors.lightGray,
    borderRadius: Layout.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
    marginBottom: Layout.baseSpacing,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    marginLeft: Layout.spacing.sm,
  },
}); 