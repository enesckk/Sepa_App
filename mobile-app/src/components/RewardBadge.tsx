import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Gift } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface RewardBadgeProps {
  visible: boolean;
  amount: number;
  onComplete: () => void;
}

export const RewardBadge: React.FC<RewardBadgeProps> = ({
  visible,
  amount,
  onComplete,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      );
      opacity.value = withSpring(1, { damping: 15, stiffness: 150 });

      setTimeout(() => {
        opacity.value = withSpring(0, { damping: 15, stiffness: 150 });
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 2000);
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.badge, animatedStyle]}>
        <Gift size={24} color="#FFD700" />
        <Text style={styles.text}>Katılım: +{amount} Gölbucks</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
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
    color: Colors.primaryDark,
  },
});

