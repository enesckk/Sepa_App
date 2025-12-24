import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Gift, Calendar, ShoppingBag } from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { getRewardById, redeemReward, Reward } from '../src/services/api';
import { getGolbucksBalance } from '../src/services/api';
import { parseApiError } from '../src/utils/errorHandler';
import { SuccessConfetti } from '../src/components/SuccessConfetti';
import { GolbucksDeductionAnimation } from '../src/components/GolbucksDeductionAnimation';

export default function RewardDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reward, setReward] = useState<Reward | null>(null);
  const [golbucks, setGolbucks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDeduction, setShowDeduction] = useState(false);
  const [deductionAmount, setDeductionAmount] = useState(0);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rewardData, balance] = await Promise.all([
        getRewardById(id!),
        getGolbucksBalance(),
      ]);
      setReward(rewardData);
      setGolbucks(balance);
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Ödül yüklenirken bir hata oluştu');
      if (__DEV__) {
        console.error('[RewardDetailScreen] Load error:', apiError);
      }
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!reward) return;

    if (golbucks < reward.points) {
      Alert.alert('Yetersiz Puan', `${reward.points - golbucks} Gölbucks daha gerekli`);
      return;
    }

    if (reward.stock !== undefined && reward.stock !== null && reward.stock <= 0) {
      Alert.alert('Stokta Yok', 'Bu ödül stokta bulunmuyor');
      return;
    }

    try {
      setRedeeming(true);
      const result = await redeemReward(reward.id);
      
      setDeductionAmount(reward.points);
      setGolbucks(result.newBalance);
      setShowDeduction(true);
      
      setTimeout(() => {
        setShowConfetti(true);
        Alert.alert(
          'Başarılı!',
          'Ödül satın alındı. "Ödüllerim" sayfasından QR kodunu görebilirsiniz.',
          [
            {
              text: 'Ödüllerim',
              onPress: () => router.push('/my-rewards'),
            },
            {
              text: 'Tamam',
              onPress: () => router.back(),
            },
          ]
        );
      }, 500);
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Ödül satın alınırken bir hata oluştu');
      if (__DEV__) {
        console.error('[RewardDetailScreen] Redeem error:', apiError);
      }
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!reward) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ödül bulunamadı</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canAfford = golbucks >= reward.points;
  const isOutOfStock = reward.stock !== undefined && reward.stock !== null && reward.stock <= 0;
  const validityDate = reward.validity_days
    ? new Date(Date.now() + reward.validity_days * 24 * 60 * 60 * 1000)
    : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryDisplay = (category: string) => {
    const categoryMap: Record<string, string> = {
      partner: 'Anlaşmalı İşletmeler',
      digital: 'Dijital Kuponlar',
      physical: 'Fiziksel Ödüller',
      experience: 'Deneyimler',
      discount: 'İndirimler',
      other: 'Diğer',
    };
    return categoryMap[category] || category;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Ödül Detayı</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        {reward.image_url ? (
          <Image source={{ uri: reward.image_url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Gift size={60} color={Colors.textSecondary} />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Price Badge */}
          <View style={styles.priceBadge}>
            <Gift size={20} color="#FFD700" />
            <Text style={styles.priceText}>{reward.points} Gölbucks</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{reward.title}</Text>

          {/* Category */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{getCategoryDisplay(reward.category)}</Text>
          </View>

          {/* Description */}
          {reward.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Açıklama</Text>
              <Text style={styles.description}>{reward.description}</Text>
            </View>
          )}

          {/* Validity Date */}
          {validityDate && (
            <View style={styles.infoRow}>
              <Calendar size={20} color={Colors.primary} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Geçerlilik Tarihi</Text>
                <Text style={styles.infoValue}>{formatDate(validityDate)}</Text>
              </View>
            </View>
          )}

          {/* Partner Name */}
          {reward.partner_name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Anlaşmalı İşletme:</Text>
              <Text style={styles.infoValue}>{reward.partner_name}</Text>
            </View>
          )}

          {/* Stock */}
          {reward.stock !== null && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Stok:</Text>
              <Text style={[styles.infoValue, isOutOfStock && styles.outOfStockText]}>
                {isOutOfStock ? 'Stokta Yok' : `${reward.stock} adet kaldı`}
              </Text>
            </View>
          )}

          {/* User Balance */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Mevcut Gölbucks:</Text>
            <Text style={styles.balanceValue}>{golbucks}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {!canAfford && (
          <View style={styles.insufficientContainer}>
            <Text style={styles.insufficientText}>
              Yetersiz puan! {reward.points - golbucks} Gölbucks daha gerekli.
            </Text>
          </View>
        )}
        {isOutOfStock && (
          <View style={styles.insufficientContainer}>
            <Text style={styles.insufficientText}>Bu ödül stokta bulunmuyor</Text>
          </View>
        )}
        {canAfford && !isOutOfStock && (
          <Pressable
            style={[styles.redeemButton, redeeming && styles.redeemButtonDisabled]}
            onPress={handleRedeem}
            disabled={redeeming}
          >
            {redeeming ? (
              <ActivityIndicator size="small" color={Colors.surface} />
            ) : (
              <>
                <ShoppingBag size={20} color={Colors.surface} />
                <Text style={styles.redeemButtonText}>
                  Satın Al ({reward.points} Gölbucks)
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      <SuccessConfetti
        visible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      <GolbucksDeductionAnimation
        visible={showDeduction}
        amount={deductionAmount}
        onComplete={() => setShowDeduction(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
  },
  headerSpacer: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 60,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.border,
  },
  imagePlaceholder: {
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
    marginBottom: 12,
    lineHeight: 32,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  section: {
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
  outOfStockText: {
    color: '#EF4444',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
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
    ...Platform.select({
      ios: {
        paddingBottom: 40,
      },
      android: {
        paddingBottom: 20,
      },
    }),
  },
  insufficientContainer: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  insufficientText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.surface,
    textAlign: 'center',
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  redeemButtonDisabled: {
    opacity: 0.5,
  },
  redeemButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
});

