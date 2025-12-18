import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { rewardCategories } from '../services/mockRewardsData';

export type RewardCategory = 'all' | 'physical' | 'digital' | 'partner';

interface RewardCategoryTabsProps {
  selectedCategory: RewardCategory;
  onCategoryChange: (category: RewardCategory) => void;
}

export const RewardCategoryTabs: React.FC<RewardCategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {rewardCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const scale = useSharedValue(isSelected ? 1 : 0.95);

          React.useEffect(() => {
            scale.value = withSpring(isSelected ? 1 : 0.95, {
              damping: 15,
              stiffness: 150,
            });
          }, [isSelected]);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
          }));

          return (
            <Pressable
              key={category.id}
              onPress={() => onCategoryChange(category.id as RewardCategory)}
            >
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
        })}
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
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  icon: {
    fontSize: 16,
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

