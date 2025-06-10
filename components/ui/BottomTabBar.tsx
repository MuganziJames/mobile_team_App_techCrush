import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabItem = {
  name: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isActive?: boolean;
};

type BottomTabBarProps = {
  tabs: TabItem[];
};

export default function BottomTabBar({ tabs }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <SafeAreaView style={styles.content}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              onPress={tab.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.iconName}
                size={24}
                color={tab.isActive ? Colors.primary : Colors.midGray}
              />
              <Text
                style={[
                  styles.tabLabel,
                  tab.isActive && styles.activeTabLabel,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  content: {
    height: 87, // 88px - 1px divider
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 54,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: Colors.midGray,
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '500',
  },
}); 