import Colors from '@/constants/Colors';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type LogoProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  showText?: boolean;
};

export default function Logo({ size = 160, style, showText = true }: LogoProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../assets/images/MyStyleMag.png')}
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />
      {showText && (
        <Text style={[styles.logoText, { fontSize: size * 0.15 }]}>
          MyStyleMag
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: '700',
    color: Colors.black,
    marginTop: 16,
    letterSpacing: 1,
  },
}); 