import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gift, ShoppingBag } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Reward } from '../services/api/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2; // 2 columns with margins

interface RewardItemCardProps {
  reward: Reward;
  onPress: (reward: Reward) => void;
  onBuy: (rewardId: string) => void;
  userGolbucks: number;
}

export const RewardItemCard: React.FC<RewardItemCardProps> = ({
  reward,
  onPress,
  onBuy,
  userGolbucks,
}) => {
  const scale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handleBuyPress = () => {
    if (userGolbucks >= reward.points) {
      buttonScale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
      setTimeout(() => {
        buttonScale.value = withSpring(1, { damping: 10, stiffness: 200 });
        onBuy(reward.id);
      }, 100);
    }
  };

  const canAfford = userGolbucks >= reward.points;
  const isOutOfStock = reward.stock !== undefined && reward.stock !== null && reward.stock <= 0;

  return (
    <Pressable
      onPress={() => onPress(reward)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.cardWrapper}
    >
      <Animated.View
        style={[
          styles.card,
          !canAfford && styles.cardDisabled,
          isOutOfStock && styles.cardOutOfStock,
          cardAnimatedStyle,
        ]}
      >
        <View style={styles.imageContainer}>
          {reward.image_url ? (
            <Image source={{ uri: reward.image_url }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Gift size={40} color={Colors.textSecondary} />
            </View>
          )}
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Stokta Yok</Text>
            </View>
          )}
          {!canAfford && !isOutOfStock && (
            <View style={styles.insufficientOverlay}>
              <Text style={styles.insufficientText}>Yetersiz Puan</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {reward.title}
          </Text>

          <View style={styles.priceContainer}>
            <Gift size={16} color="#FFD700" />
            <Text style={styles.price}>{reward.points} Gölbucks</Text>
          </View>

          {reward.stock !== undefined && reward.stock > 0 && (
            <Text style={styles.stock}>
              {reward.stock} adet kaldı
            </Text>
          )}

          <Pressable
            onPress={handleBuyPress}
            disabled={!canAfford || isOutOfStock}
            style={styles.buyButtonContainer}
          >
            <Animated.View
              style={[
                styles.buyButton,
                !canAfford && styles.buyButtonDisabled,
                isOutOfStock && styles.buyButtonDisabled,
                buttonAnimatedStyle,
              ]}
            >
              <ShoppingBag size={16} color={Colors.surface} />
              <Text style={styles.buyButtonText}>Hemen Al</Text>
            </Animated.View>
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardOutOfStock: {
    opacity: 0.5,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  insufficientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(211, 47, 47, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insufficientText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    minHeight: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  stock: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  buyButtonContainer: {
    marginTop: 4,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buyButtonDisabled: {
    backgroundColor: Colors.textSecondary,
  },
  buyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.surface,
  },
});

