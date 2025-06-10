import Colors from '@/constants/Colors';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        styles[type],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
    >
      <Text style={[styles.text, styles[`${type}Text`], styles[`${size}Text`], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  // Button types
  primary: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  tertiary: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  danger: {
    backgroundColor: Colors.errorRed,
    borderWidth: 0,
  },
  // Button sizes
  small: {
    height: 36,
    paddingHorizontal: 12,
  },
  medium: {
    height: 48,
    paddingHorizontal: 16,
  },
  large: {
    height: 56,
    paddingHorizontal: 24,
  },
  // Disabled state
  disabled: {
    backgroundColor: 'rgba(204, 204, 204, 0.3)',
    borderColor: 'rgba(204, 204, 204, 0.5)',
  },
  // Text styles
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.primary,
  },
  tertiaryText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.white,
  },
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
}); 