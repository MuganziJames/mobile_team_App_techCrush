import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

// Fallback icon component that doesn't rely on vector-icons
function FallbackIcon({ name, size, color }: { name: string; size: number; color: string }) {
  // Use the first letter of the icon name as a fallback
  const letter = typeof name === 'string' ? name.charAt(0).toUpperCase() : 'I';
  
  return (
    <View style={[
      styles.fallbackIcon, 
      { width: size, height: size, borderRadius: size / 2, backgroundColor: `${color}33` }
    ]}>
      <Text style={[styles.fallbackText, { color, fontSize: size * 0.6 }]}>
        {letter}
      </Text>
    </View>
  );
}

export default function SafeIcon({
  name,
  size = 24,
  color = Colors.black,
}: {
  name: any; // Accept any name to avoid type errors
  size?: number;
  color?: string;
}) {
  // Try to render Ionicons, fall back to our custom component if it fails
  try {
    return <Ionicons name={name} size={size} color={color} />;
  } catch (error) {
    console.warn(`Failed to render icon: ${name}`, error);
    return <FallbackIcon name={String(name)} size={size} color={color} />;
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