import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ListRowProps = {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  showChevron?: boolean;
  rightComponent?: React.ReactNode;
};

export default function ListRow({
  label,
  iconName,
  onPress,
  showChevron = true,
  rightComponent,
}: ListRowProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={Colors.white} />
      </View>
      
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.rightContainer}>
        {rightComponent || (showChevron && (
          <Ionicons name="chevron-forward" size={20} color={Colors.midGray} />
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: Colors.lightGray,
    borderRadius: Layout.borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
    marginBottom: Layout.baseSpacing,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    marginLeft: Layout.spacing.sm,
  },
  rightContainer: {
    marginLeft: Layout.spacing.xs,
  },
}); 