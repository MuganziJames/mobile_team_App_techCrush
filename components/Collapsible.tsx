import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
};

export default function Collapsible({ title, children, initialExpanded = false }: CollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const theme = useColorScheme() || 'light';

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.darkGray}
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.midGray,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});
