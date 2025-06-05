import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

type DividerProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export default function Divider({ label, style, labelStyle }: DividerProps) {
  if (!label) {
    return <View style={[styles.divider, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.line} />
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    width: '100%',
    marginVertical: Layout.spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: Layout.spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  label: {
    marginHorizontal: Layout.spacing.sm,
    color: Colors.midGray,
    fontSize: Typography.sizes.caption,
  },
}); 