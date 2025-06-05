import Colors from '@/constants/Colors';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type LogoProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Logo({ size = 160, style }: LogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 160 160">
        {/* Simplified African continent silhouette with woman's profile */}
        <Path
          d="M80 10 C45 10, 20 40, 20 80 C20 120, 45 150, 80 150 C115 150, 140 120, 140 80 C140 40, 115 10, 80 10 Z
          M70 40 C80 40, 90 45, 95 55 C100 65, 100 75, 95 85 C90 95, 80 100, 70 100 C60 100, 50 95, 45 85 C40 75, 40 65, 45 55 C50 45, 60 40, 70 40 Z"
          fill={Colors.primary}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 