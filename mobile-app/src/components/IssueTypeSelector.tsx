import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { IssueType } from '../services/mockApplicationsData';

interface IssueTypeSelectorProps {
  selectedType: string | null;
  onSelect: (typeId: string) => void;
  types: IssueType[];
}

export const IssueTypeSelector: React.FC<IssueTypeSelectorProps> = ({
  selectedType,
  onSelect,
  types,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kategori Seçin</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {types.map((type) => {
          const isSelected = selectedType === type.id;
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
              key={type.id}
              onPress={() => onSelect(type.id)}
            >
              <Animated.View
                style={[
                  styles.chip,
                  isSelected && styles.chipActive,
                  animatedStyle,
                ]}
              >
                <Text style={styles.icon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.chipLabel,
                    isSelected && styles.labelActive,
                  ]}
                >
                  {type.label}
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 20,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
});

