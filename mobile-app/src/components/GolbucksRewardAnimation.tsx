import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

interface GolbucksRewardAnimationProps {
  visible: boolean;
  amount: number;
  onComplete: () => void;
}

export const GolbucksRewardAnimation: React.FC<GolbucksRewardAnimationProps> = ({
  visible,
  amount,
  onComplete,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const innerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      );
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSequence(
        withTiming(-50, { duration: 500 }),
        withTiming(-100, { duration: 500 })
      );

      timeoutRef.current = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        innerTimeoutRef.current = setTimeout(() => {
          onComplete();
        }, 300);
      }, 2000);
    } else {
      scale.value = 0;
      opacity.value = 0;
      translateY.value = 0;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (innerTimeoutRef.current) {
        clearTimeout(innerTimeoutRef.current);
        innerTimeoutRef.current = null;
      }
    };
  }, [visible, onComplete]);

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
        <Text style={styles.text}>Gölbucks +{amount}</Text>
        <Text style={styles.emoji}>🎉</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  badge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.surface,
  },
  emoji: {
    fontSize: 20,
  },
});

