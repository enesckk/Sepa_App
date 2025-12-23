import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { RewardHeader } from '../../src/components/RewardHeader';
import { RewardCategoryTabs, RewardCategory } from '../../src/components/RewardCategoryTabs';
import { RewardItemCard } from '../../src/components/RewardItemCard';
import { SuccessConfetti } from '../../src/components/SuccessConfetti';
import { InviteBanner } from '../../src/components/InviteBanner';
import { GolbucksDeductionAnimation } from '../../src/components/GolbucksDeductionAnimation';
import { Colors } from '../../src/constants/colors';
import { getRewards, redeemReward, Reward } from '../../src/services/api';
import { getGolbucksBalance } from '../../src/services/api';
import { parseApiError } from '../../src/utils/errorHandler';

export default function RewardMarketScreen() {
  const router = useRouter();
  const [golbucks, setGolbucks] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory>('all');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDeduction, setShowDeduction] = useState(false);
  const [deductionAmount, setDeductionAmount] = useState(0);
  const [redeeming, setRedeeming] = useState(false);

  const loadData = async () => {
    try {
      // Load rewards and golbucks balance in parallel
      const [rewardsResponse, balance] = await Promise.all([
        getRewards({ limit: 100, offset: 0 }),
        getGolbucksBalance(),
      ]);
      
      setRewards(rewardsResponse.rewards);
      setGolbucks(balance);
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Veriler yüklenirken bir hata oluştu');
      if (__DEV__) {
        console.error('[RewardMarketScreen] Load error:', apiError);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredRewards = useMemo(() => {
    if (selectedCategory === 'all') {
      return rewards;
    }
    return rewards.filter((reward) => reward.category === selectedCategory);
  }, [rewards, selectedCategory]);

  const handleRewardPress = (reward: Reward) => {
    router.push(`/reward-detail?id=${reward.id}`);
  };

  const handleBuy = async (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;

    if (golbucks < reward.points) {
      Alert.alert('Yetersiz Puan', `${reward.points - golbucks} Gölbucks daha gerekli`);
      return;
    }

    try {
      setRedeeming(true);
      const result = await redeemReward(rewardId);
      
      setDeductionAmount(reward.points);
      setGolbucks(result.newBalance);
      setShowDeduction(true);
      
      // Reload rewards to update stock
      await loadData();
      
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
            },
          ]
        );
      }, 500);
    } catch (err) {
      const apiError = parseApiError(err);
      Alert.alert('Hata', apiError.message || 'Ödül satın alınırken bir hata oluştu');
      if (__DEV__) {
        console.error('[RewardMarketScreen] Redeem error:', apiError);
      }
    } finally {
      setRedeeming(false);
    }
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  const handleDeductionComplete = () => {
    setShowDeduction(false);
  };

  const handleTaskPress = () => {
    // Navigate to tasks screen or show tasks modal
    if (__DEV__) {
      console.log('Navigate to tasks');
    }
  };

  const handleInvitePress = () => {
    // Share invite link
    if (__DEV__) {
      console.log('Share invite link');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <RewardHeader 
        golbucks={golbucks} 
        onTaskPress={handleTaskPress}
        onMyRewardsPress={() => router.push('/my-rewards')}
      />
      <RewardCategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <InviteBanner onInvitePress={handleInvitePress} />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : filteredRewards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedCategory === 'all'
                ? 'Henüz ödül bulunmuyor'
                : 'Bu kategoride ödül bulunamadı'}
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredRewards.map((reward) => (
              <RewardItemCard
                key={reward.id}
                reward={reward}
                onPress={handleRewardPress}
                onBuy={handleBuy}
                userGolbucks={golbucks}
              />
            ))}
          </View>
        )}
      </ScrollView>


      <SuccessConfetti
        visible={showConfetti}
        onComplete={handleConfettiComplete}
      />

      <GolbucksDeductionAnimation
        visible={showDeduction}
        amount={deductionAmount}
        onComplete={handleDeductionComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 60,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

