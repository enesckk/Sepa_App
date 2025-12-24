import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Gift } from 'lucide-react-native';
import { Colors } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DailyRewardModalProps {
  visible: boolean;
  amount: number;
  onClose: () => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  visible,
  amount,
  onClose,
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.9, { duration: 150 });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <Animated.View style={[styles.modalContainer, modalStyle]}>
          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.textSecondary} />
          </Pressable>

          {/* Content */}
          <View style={styles.content}>
            {/* Gift Icon */}
            <View style={styles.giftContainer}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark || Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.giftIcon}
              >
                <Gift size={48} color={Colors.surface} strokeWidth={2} />
              </LinearGradient>
            </View>

            {/* Title */}
            <Text style={styles.title}>Günlük Ödülünüz!</Text>
              <Text style={styles.subtitle}>
                Her gün giriş yaparak ödüller kazanın
              </Text>

            {/* Reward Amount */}
            <View style={styles.rewardBadge}>
                <Text style={styles.rewardAmount}>+{amount}</Text>
                <Text style={styles.rewardLabel}>Gölbucks</Text>
            </View>

            {/* Message */}
              <Text style={styles.message}>
              Ödülünüz hesabınıza eklendi!
              </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  giftContainer: {
    marginBottom: 20,
  },
  giftIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  rewardBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.surface,
    marginBottom: 4,
  },
  rewardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

