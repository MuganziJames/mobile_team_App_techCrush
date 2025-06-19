// Fallback for using MaterialIcons on Android and web.

import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

// Fallback icon component that doesn't rely on vector-icons
function FallbackIcon({ name, size, color }: { name: string; size: number; color: string }) {
  // Use the first letter of the icon name as a fallback
  const letter = name.charAt(0).toUpperCase();
  
  return (
    <View style={[
      styles.fallbackIcon, 
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '33' }
    ]}>
      <Text style={[styles.fallbackText, { color, fontSize: size * 0.6 }]}>
        {letter}
      </Text>
    </View>
  );
}

export default function IconSymbol({
  name,
  size = 24,
  color = Colors.black,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}) {
  // Try to render Ionicons, fall back to our custom component if it fails
  try {
    return <Ionicons name={name} size={size} color={color} />;
  } catch (error) {
    console.warn(`Failed to render icon: ${name}`, error);
    return <FallbackIcon name={name} size={size} color={color} />;
  }
}

const styles = StyleSheet.create({
  fallbackIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontWeight: 'bold',
  },
});
