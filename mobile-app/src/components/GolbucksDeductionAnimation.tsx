import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Gift } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface GolbucksDeductionAnimationProps {
  visible: boolean;
  amount: number;
  onComplete: () => void;
}

export const GolbucksDeductionAnimation: React.FC<GolbucksDeductionAnimationProps> = ({
  visible,
  amount,
  onComplete,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      );
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSequence(
        withTiming(30, { duration: 400 }),
        withTiming(0, { duration: 400 })
      );

      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        setTimeout(() => {
          onComplete();
        }, 300);
      }, 1500);
    } else {
      scale.value = 0;
      opacity.value = 0;
      translateY.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.badge, animatedStyle]}>
        <Gift size={20} color={Colors.error} />
        <Text style={styles.text}>-{amount} Gölbucks</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.error,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
});

