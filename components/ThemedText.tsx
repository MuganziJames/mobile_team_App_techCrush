import { useThemeColor } from '@/hooks/useThemeColor';
import { Platform, Text, TextProps } from 'react-native';

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  fontFamily?: 'normal' | 'mono';
};

export type ThemedTextProps = ThemeProps & TextProps;

export default function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, fontFamily = 'normal', ...otherProps } = props;
  const color = useThemeColor('text', { light: lightColor, dark: darkColor });

  // Use system fonts instead of SpaceMono to avoid loading issues
  const fontFamilyStyle = fontFamily === 'mono' 
    ? { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' } 
    : {};

  return <Text style={[{ color }, fontFamilyStyle, style]} {...otherProps} />;
}
