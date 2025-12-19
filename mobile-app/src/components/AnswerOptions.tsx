import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { SurveyOption } from '../services/mockSurveysData';

interface AnswerOptionsProps {
  options: SurveyOption[];
  selectedIds: string[];
  onSelect: (optionId: string) => void;
  type: 'single' | 'multiple';
}

// Separate component for each option to fix hook violations
interface AnswerOptionItemProps {
  option: SurveyOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
}

const AnswerOptionItem: React.FC<AnswerOptionItemProps> = ({
  option,
  isSelected,
  onSelect,
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
    <Pressable onPress={() => onSelect(option.id)}>
      <Animated.View
        style={[
          styles.option,
          isSelected && styles.optionSelected,
          animatedStyle,
        ]}
      >
        <View style={styles.optionContent}>
          <View
            style={[
              styles.checkbox,
              isSelected && styles.checkboxSelected,
            ]}
          >
            {isSelected && <Check size={16} color={Colors.surface} />}
          </View>
          <Text
            style={[
              styles.optionText,
              isSelected && styles.optionTextSelected,
            ]}
          >
            {option.text}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  selectedIds,
  onSelect,
  type,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <AnswerOptionItem
          key={option.id}
          option={option}
          isSelected={selectedIds.includes(option.id)}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 20,
  },
  option: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 16,
  },
  optionSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
});

