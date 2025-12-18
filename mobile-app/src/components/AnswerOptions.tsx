import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  selectedIds,
  onSelect,
  type,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);
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
            key={option.id}
            onPress={() => onSelect(option.id)}
          >
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
      })}
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

