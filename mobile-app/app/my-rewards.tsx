import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, QrCode, Check, Calendar, X } from 'lucide-react-native';
import { Colors } from '../src/constants/colors';
import { getMyRewards, useReward, UserReward } from '../src/services/api';
import { parseApiError } from '../src/utils/errorHandler';

const getStatusDisplay = (userReward: UserReward): { text: string; color: string; icon: React.ReactNode } => {
  if (userReward.is_used) {
    return {
      text: 'Kullanıldı',
      color: Colors.textSecondary,
      icon: <Check size={16} color={Colors.textSecondary} />,
    };
  }
  
  if (userReward.expires_at && new Date(userReward.expires_at) < new Date()) {
    return {
      text: 'Süresi Doldu',
      color: '#EF4444',
      icon: <X size={16} color="#EF4444" />,
    };
  }
  
  return {
    text: 'Kullanılabilir',
    color: Colors.success,
    icon: <QrCode size={16} color={Colors.success} />,
  };
};

export default function MyRewardsScreen() {
  const router = useRouter();
  const [rewards, setRewards] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReward, setSelectedReward] = useState<UserReward | null>(null);
  const [showQR, setShowQR] = useState(false);

  const loadRewards = async () => {
    try {
      const response = await getMyRewards({ limit: 100, offset: 0 });
      setRewards(response.rewards);
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Ödüller yüklenirken bir hata oluştu');
      if (__DEV__) {
        console.error('[MyRewardsScreen] Load error:', apiError);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadRewards();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadRewards();
  };

  const handleUseReward = async (userRewardId: string) => {
    Alert.alert(
      'Ödülü Kullan',
      'Bu ödülü kullanıldı olarak işaretlemek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kullan',
          onPress: async () => {
            try {
              await useReward(userRewardId);
              Alert.alert('Başarılı', 'Ödül kullanıldı olarak işaretlendi');
              await loadRewards();
            } catch (err) {
              const apiError = parseApiError(err);
              Alert.alert('Hata', apiError.message || 'Ödül kullanılırken bir hata oluştu');
              if (__DEV__) {
                console.error('[MyRewardsScreen] Use reward error:', apiError);
              }
            }
          },
        },
      ]
    );
  };

  const handleShowQR = (reward: UserReward) => {
    setSelectedReward(reward);
    setShowQR(true);
  };

  const filteredRewards = rewards;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Ödüllerim</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Rewards List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : filteredRewards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎁</Text>
            <Text style={styles.emptyText}>Henüz ödül satın almadınız</Text>
            <Text style={styles.emptySubtext}>
              Gölmarket'ten ödül satın alarak burada görebilirsiniz
            </Text>
            <Pressable
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)/rewards')}
            >
              <Text style={styles.browseButtonText}>Ödüllere Göz At</Text>
            </Pressable>
          </View>
        ) : (
          filteredRewards.map((userReward) => {
            const reward = userReward.reward;
            const statusDisplay = getStatusDisplay(userReward);
            const isExpired = userReward.expires_at && new Date(userReward.expires_at) < new Date();
            const canUse = !userReward.is_used && !isExpired;

            return (
              <View key={userReward.id} style={styles.rewardCard}>
                <View style={styles.rewardHeader}>
                  {reward?.image_url ? (
                    <Image
                      source={{ uri: reward.image_url }}
                      style={styles.rewardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.rewardImage, styles.imagePlaceholder]}>
                      <QrCode size={24} color={Colors.textSecondary} />
                    </View>
                  )}
                  <View style={styles.rewardInfo}>
                    <Text style={styles.rewardTitle} numberOfLines={2}>
                      {reward?.title || 'Ödül'}
                    </Text>
                    {reward?.partner_name && (
                      <Text style={styles.partnerName}>{reward.partner_name}</Text>
                    )}
                    <View style={[styles.statusBadge, { backgroundColor: statusDisplay.color + '20' }]}>
                      {statusDisplay.icon}
                      <Text style={[styles.statusText, { color: statusDisplay.color }]}>
                        {statusDisplay.text}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Reference Code */}
                {userReward.reference_code && (
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Referans Kodu:</Text>
                    <Text style={styles.codeValue}>{userReward.reference_code}</Text>
                  </View>
                )}

                {/* Expires At */}
                {userReward.expires_at && (
                  <View style={styles.infoRow}>
                    <Calendar size={16} color={Colors.textSecondary} />
                    <Text style={styles.infoText}>
                      Geçerlilik: {new Date(userReward.expires_at).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                )}

                {/* Actions */}
                <View style={styles.actionsContainer}>
                  {canUse && userReward.qr_code && (
                    <Pressable
                      style={styles.qrButton}
                      onPress={() => handleShowQR(userReward)}
                    >
                      <QrCode size={18} color={Colors.primary} />
                      <Text style={styles.qrButtonText}>QR Kod Göster</Text>
                    </Pressable>
                  )}
                  {canUse && (
                    <Pressable
                      style={styles.useButton}
                      onPress={() => handleUseReward(userReward.id)}
                    >
                      <Check size={18} color={Colors.success} />
                      <Text style={styles.useButtonText}>Kullanıldı İşaretle</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* QR Code Modal */}
      {showQR && selectedReward && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>QR Kod</Text>
              <Pressable onPress={() => setShowQR(false)} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </Pressable>
            </View>
            <View style={styles.qrContainer}>
              <QrCode size={120} color={Colors.text} />
              <Text style={styles.qrCodeText}>{selectedReward.qr_code}</Text>
              <Text style={styles.qrSubtext}>
                Ödülü kullanırken bu QR kodu gösterin
              </Text>
              {selectedReward.reference_code && (
                <View style={styles.referenceContainer}>
                  <Text style={styles.referenceLabel}>Referans Kodu:</Text>
                  <Text style={styles.referenceValue}>{selectedReward.reference_code}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
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
    paddingVertical: 60,
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
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 60,
  },
  rewardCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  rewardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  codeContainer: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  qrButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '20',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  qrButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  useButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.success + '20',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  useButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrCodeText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    letterSpacing: 2,
  },
  qrSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  referenceContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    width: '100%',
  },
  referenceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 1,
  },
});

