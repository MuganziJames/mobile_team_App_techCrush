import Colors from '@/constants/Colors';
import { Platform, StyleSheet, Switch, View } from 'react-native';

type ToggleSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function ToggleSwitch({
  value,
  onValueChange,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <View style={styles.container}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ 
          false: Platform.OS === 'ios' ? '#e9e9ea' : '#d3d3d3', 
          true: Platform.OS === 'ios' ? '#e9e9ea' : Colors.primary 
        }}
        thumbColor={
          Platform.OS === 'ios' 
            ? (value ? Colors.primary : '#ffffff')
            : (value ? '#ffffff' : '#f4f3f4')
        }
        ios_backgroundColor="#e9e9ea"
        style={Platform.OS === 'ios' ? styles.iosSwitch : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iosSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
}); 