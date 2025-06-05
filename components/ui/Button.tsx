import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Button({ 
  title, 
  onPress, 
  variant = 'filled', 
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    variant === 'outline' ? styles.outlineButton : styles.filledButton,
    disabled && (variant === 'filled' ? styles.disabledFilledButton : styles.disabledOutlineButton),
    style,
  ];
  
  const textStyles = [
    styles.text,
    variant === 'outline' ? styles.outlineText : styles.filledText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Layout.buttonHeight,
    borderRadius: Layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filledButton: {
    backgroundColor: Colors.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  disabledFilledButton: {
    backgroundColor: Colors.disabledBg,
  },
  disabledOutlineButton: {
    borderColor: Colors.disabledBg,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  filledText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.disabledText,
  },
}); 