import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

export type FilterType = 'all' | 'today' | 'free' | 'family';

interface FilterBarProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'Tüm Etkinlikler' },
  { id: 'today', label: 'Bugün' },
  { id: 'free', label: 'Ücretsiz' },
  { id: 'family', label: 'Aile Dostu' },
];

// Separate component for each filter to fix hook violations
interface FilterChipItemProps {
  filter: { id: FilterType; label: string };
  isSelected: boolean;
  onPress: () => void;
}

const FilterChipItem: React.FC<FilterChipItemProps> = ({
  filter,
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
          styles.filterChip,
          isSelected && styles.filterChipActive,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.filterText,
            isSelected && styles.filterTextActive,
          ]}
        >
          {filter.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <FilterChipItem
            key={filter.id}
            filter={filter}
            isSelected={selectedFilter === filter.id}
            onPress={() => onFilterChange(filter.id)}
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
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
});

