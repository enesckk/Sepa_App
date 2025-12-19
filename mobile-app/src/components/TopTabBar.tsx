import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { PlaceType, placeCategories } from '../services/mockLocationsData';

interface TopTabBarProps {
  selectedTab: PlaceType;
  onTabChange: (tab: PlaceType) => void;
}

// Separate component for each tab to fix hook violations
interface TabItemProps {
  category: { id: string; label: string; icon: string };
  isSelected: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(isSelected ? 1 : 0.95);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1 : 0.95, {
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    });
  }, [isSelected, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.tab,
          isSelected && styles.tabActive,
          animatedStyle,
        ]}
      >
        <Text style={styles.icon}>{category.icon}</Text>
        <Text
          style={[
            styles.label,
            isSelected && styles.labelActive,
          ]}
        >
          {category.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export const TopTabBar: React.FC<TopTabBarProps> = ({
  selectedTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {placeCategories.map((category) => (
          <TabItem
            key={category.id}
            category={category}
            isSelected={selectedTab === category.id}
            onPress={() => onTabChange(category.id as PlaceType)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});

