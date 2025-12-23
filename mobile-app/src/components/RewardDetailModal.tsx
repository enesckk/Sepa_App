import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { X, Gift, Calendar } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';
import { Reward } from '../services/api/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;

interface RewardDetailModalProps {
  visible: boolean;
  reward: Reward | null;
  onClose: () => void;
  onConfirm: (rewardId: string) => void;
  userGolbucks: number;
  redeeming?: boolean;
}

export const RewardDetailModal: React.FC<RewardDetailModalProps> = ({
  visible,
  reward,
  onClose,
  onConfirm,
  userGolbucks,
  redeeming = false,
}) => {
  const translateY = useSharedValue(MODAL_HEIGHT);
  const opacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(MODAL_HEIGHT, { damping: 20, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleConfirm = () => {
    if (reward && userGolbucks >= reward.price) {
      buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
      setTimeout(() => {
        buttonScale.value = withSpring(1, { damping: 10, stiffness: 200 });
        onConfirm(reward.id);
      }, 100);
    }
  };

  if (!reward) return null;

  const canAfford = userGolbucks >= reward.points;
  const validityDate = reward.validity_days
    ? new Date(Date.now() + reward.validity_days * 24 * 60 * 60 * 1000)
    : null;

  const formatDate = (date: Date) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.modal, modalAnimatedStyle]}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {reward.image_url ? (
            <Image source={{ uri: reward.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Gift size={60} color={Colors.textSecondary} />
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.priceBadge}>
              <Gift size={20} color="#FFD700" />
              <Text style={styles.priceText}>{reward.points} Gölbucks</Text>
            </View>

            <Text style={styles.title}>{reward.title}</Text>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Açıklama</Text>
              <Text style={styles.description}>{reward.description}</Text>
            </View>

            {validityDate && (
              <View style={styles.infoRow}>
                <Calendar size={20} color={Colors.primary} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Geçerlilik Tarihi</Text>
                  <Text style={styles.infoValue}>{formatDate(validityDate)}</Text>
                </View>
              </View>
            )}

            {reward.partner_name && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Anlaşmalı İşletme:</Text>
                <Text style={styles.infoValue}>{reward.partner_name}</Text>
              </View>
            )}

            {reward.stock !== undefined && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Stok:</Text>
                <Text style={styles.infoValue}>{reward.stock} adet</Text>
              </View>
            )}

            {/* QR code and reference code will be shown after purchase in my-rewards screen */}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {!canAfford && (
            <View style={styles.insufficientContainer}>
              <Text style={styles.insufficientText}>
                Yetersiz puan! {reward.points - userGolbucks} Gölbucks daha gerekli.
              </Text>
            </View>
          )}
          {canAfford && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              disabled={!canAfford || redeeming}
            >
              <Animated.View style={[styles.confirmButtonInner, buttonAnimatedStyle]}>
                {redeeming ? (
                  <ActivityIndicator size="small" color={Colors.surface} />
                ) : (
                  <>
                    <Gift size={20} color={Colors.surface} />
                    <Text style={styles.confirmButtonText}>
                      Onayla ve Harca ({reward.points} Gölbucks)
                    </Text>
                  </>
                )}
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
    lineHeight: 32,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  codeSection: {
    marginTop: 8,
  },
  codeContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  codeText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
    letterSpacing: 2,
  },
  codeSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  insufficientContainer: {
    backgroundColor: Colors.error,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  insufficientText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.surface,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
});

