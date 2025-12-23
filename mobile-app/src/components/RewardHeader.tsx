import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gift, Plus, Package } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface RewardHeaderProps {
  golbucks: number;
  onTaskPress?: () => void;
  onMyRewardsPress?: () => void;
}

export const RewardHeader: React.FC<RewardHeaderProps> = ({
  golbucks,
  onTaskPress,
  onMyRewardsPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.pointsContainer}>
        <Gift size={28} color="#FFD700" />
        <View style={styles.pointsTextContainer}>
          <Text style={styles.pointsValue}>{golbucks}</Text>
          <Text style={styles.pointsLabel}>Gölbucks</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        {onMyRewardsPress && (
          <Pressable
            onPress={onMyRewardsPress}
            style={styles.myRewardsButton}
          >
            <Package size={18} color={Colors.primary} />
          </Pressable>
        )}
        <Pressable
          onPress={onTaskPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={[styles.taskButton, animatedStyle]}>
            <Plus size={18} color={Colors.surface} />
            <Text style={styles.taskButtonText}>Görev Yap, Puan Kazan</Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsTextContainer: {
    gap: 2,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  pointsLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  taskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  taskButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.surface,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  myRewardsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
});

