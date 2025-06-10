import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { StyleSheet, Text, View } from 'react-native';

type FormFieldProps = {
  label: string;
  value: string;
};

export default function FormField({ label, value }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    fontSize: Typography.sizes.caption,
    fontWeight: '500',
    color: Colors.darkGray,
    marginBottom: Layout.spacing.xs / 2,
    marginLeft: Layout.spacing.xs / 2,
  },
  fieldContainer: {
    height: Layout.textFieldHeight,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.midGray,
    borderRadius: Layout.borderRadius,
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.sm,
  },
  value: {
    fontSize: Typography.sizes.body,
    fontWeight: '400',
    color: Colors.black,
  },
}); 