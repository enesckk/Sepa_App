import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { eventCategories } from '../services/mockEventsData';

interface CategoryChipBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryChipBar: React.FC<CategoryChipBarProps> = ({
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
        {eventCategories.map((category) => {
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
              onPress={() => onCategoryChange(category.id)}
            >
              <Animated.View
                style={[
                  styles.chip,
                  isSelected && styles.chipActive,
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
});

