import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type LogoProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Logo({ size = 160, style }: LogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={require('../../assets/images/icon.png')}
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 