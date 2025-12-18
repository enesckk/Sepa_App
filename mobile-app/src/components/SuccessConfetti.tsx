import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

interface SuccessConfettiProps {
  visible: boolean;
  onComplete: () => void;
}

export const SuccessConfetti: React.FC<SuccessConfettiProps> = ({
  visible,
  onComplete,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      );
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSequence(
        withTiming(-20, { duration: 400 }),
        withTiming(0, { duration: 400 })
      );
      rotation.value = withSequence(
        withSpring(-10, { damping: 10 }),
        withSpring(10, { damping: 10 }),
        withSpring(0, { damping: 10 })
      );

      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 });
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 3000);
    } else {
      scale.value = 0;
      opacity.value = 0;
      translateY.value = 0;
      rotation.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.confettiContainer, animatedStyle]}>
        {/* Confetti particles */}
        {[...Array(20)].map((_, i) => {
          const particleX = useSharedValue(Math.random() * 400 - 200);
          const particleY = useSharedValue(Math.random() * 400 - 200);
          const particleRotation = useSharedValue(Math.random() * 360);
          const particleDelay = i * 50;

          useEffect(() => {
            if (visible) {
              particleX.value = withDelay(
                particleDelay,
                withSpring(Math.random() * 400 - 200, { damping: 10 })
              );
              particleY.value = withDelay(
                particleDelay,
                withSpring(Math.random() * 400 - 200, { damping: 10 })
              );
              particleRotation.value = withDelay(
                particleDelay,
                withSpring(Math.random() * 360, { damping: 10 })
              );
            }
          }, [visible]);

          const particleStyle = useAnimatedStyle(() => ({
            transform: [
              { translateX: particleX.value },
              { translateY: particleY.value },
              { rotate: `${particleRotation.value}deg` },
            ],
          }));

          return (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][
                    i % 5
                  ],
                },
                particleStyle,
              ]}
            />
          );
        })}

        <View style={styles.messageContainer}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.message}>Tebrikler!</Text>
          <Text style={styles.submessage}>
            Ödül hesabına yüklendi
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confettiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  messageContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  message: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  submessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

