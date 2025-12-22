import React, { useEffect, useRef } from 'react';
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
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Gift, Star } from 'lucide-react-native';
import { Colors } from '../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const giftScale = useSharedValue(0);
  const giftRotation = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  const textScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Modal açılış animasyonu
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });

      // Hediye ikonu animasyonu
      giftScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.3, { damping: 8, stiffness: 200 }),
          withSpring(1, { damping: 12, stiffness: 150 })
        )
      );
      giftRotation.value = withDelay(
        200,
        withSequence(
          withSpring(-15, { damping: 8 }),
          withSpring(15, { damping: 8 }),
          withSpring(0, { damping: 12 })
        )
      );

      // Sparkle animasyonu
      sparkleOpacity.value = withDelay(
        400,
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.5, { duration: 500 }),
          withTiming(1, { duration: 500 })
        )
      );

      // Metin animasyonu
      textScale.value = withDelay(
        600,
        withSpring(1, { damping: 12, stiffness: 150 })
      );
    } else {
      // Modal kapanış animasyonu
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0, { duration: 200 });
      giftScale.value = 0;
      giftRotation.value = 0;
      sparkleOpacity.value = 0;
      textScale.value = 0;
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const giftStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: giftScale.value },
      { rotate: `${giftRotation.value}deg` },
    ],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
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
            {/* Sparkles Background */}
            <Animated.View style={[styles.sparklesContainer, sparkleStyle]}>
              <Star size={80} color={Colors.secondary} fill={Colors.secondary} opacity={0.3} />
            </Animated.View>

            {/* Gift Icon */}
            <Animated.View style={giftStyle}>
              <LinearGradient
                colors={[Colors.secondary, Colors.orange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.giftContainer}
              >
                <Gift size={64} color={Colors.surface} strokeWidth={2.5} />
              </LinearGradient>
            </Animated.View>

            {/* Title */}
            <Animated.View style={textStyle}>
              <Text style={styles.title}>Günlük Ödülünüz! 🎉</Text>
              <Text style={styles.subtitle}>
                Her gün giriş yaparak ödüller kazanın
              </Text>
            </Animated.View>

            {/* Reward Amount */}
            <Animated.View style={textStyle}>
              <LinearGradient
                colors={[Colors.success, Colors.successDark || Colors.success]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rewardBadge}
              >
                <Text style={styles.rewardAmount}>+{amount}</Text>
                <Text style={styles.rewardLabel}>Gölbucks</Text>
              </LinearGradient>
            </Animated.View>

            {/* Message */}
            <Animated.View style={textStyle}>
              <Text style={styles.message}>
                Ödülünüz hesabınıza eklendi! Gölmarket'ten alışveriş yapabilirsiniz.
              </Text>
            </Animated.View>
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
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
      },
      android: {
        elevation: 20,
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
  sparklesContainer: {
    position: 'absolute',
    top: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  rewardBadge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  rewardAmount: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.surface,
    marginBottom: 4,
  },
  rewardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.surface,
    opacity: 0.95,
  },
  message: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

