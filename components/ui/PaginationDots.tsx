import Colors from '@/constants/Colors';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type PaginationDotsProps = {
  total: number;
  current: number;
  style?: StyleProp<ViewStyle>;
};

export default function PaginationDots({ total, current, style }: PaginationDotsProps) {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === current ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    backgroundColor: Colors.inactiveDot,
  },
}); 