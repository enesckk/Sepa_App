import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
  FlatList,
} from 'react-native';
import { RewardHeader } from '../components/RewardHeader';
import { RewardCategoryTabs, RewardCategory } from '../components/RewardCategoryTabs';
import { RewardItemCard } from '../components/RewardItemCard';
import { RewardDetailModal } from '../components/RewardDetailModal';
import { SuccessConfetti } from '../components/SuccessConfetti';
import { InviteBanner } from '../components/InviteBanner';
import { GolbucksDeductionAnimation } from '../components/GolbucksDeductionAnimation';
import { Colors } from '../constants/colors';
import { mockRewards, Reward } from '../services/mockRewardsData';

export const RewardMarketScreen: React.FC = () => {
  const [golbucks, setGolbucks] = useState(450);
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory>('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDeduction, setShowDeduction] = useState(false);
  const [deductionAmount, setDeductionAmount] = useState(0);

  const filteredRewards = useMemo(() => {
    if (selectedCategory === 'all') {
      return mockRewards;
    }
    return mockRewards.filter((reward) => reward.category === selectedCategory);
  }, [selectedCategory]);

  const handleRewardPress = (reward: Reward) => {
    setSelectedReward(reward);
    setModalVisible(true);
  };

  const handleBuy = (rewardId: string) => {
    const reward = mockRewards.find((r) => r.id === rewardId);
    if (reward && golbucks >= reward.price) {
      setDeductionAmount(reward.price);
      setGolbucks((prev) => prev - reward.price);
      setShowDeduction(true);
      setModalVisible(false);
      
      setTimeout(() => {
        setShowConfetti(true);
      }, 500);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReward(null);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  const handleDeductionComplete = () => {
    setShowDeduction(false);
  };

  const handleTaskPress = () => {
    // Navigate to tasks screen
    console.log('Navigate to tasks');
  };

  const handleInvitePress = () => {
    // Share invite link
    console.log('Share invite link');
  };

  const renderRewardCard = ({ item }: { item: Reward }) => (
    <RewardItemCard
      reward={item}
      onPress={handleRewardPress}
      onBuy={handleBuy}
      userGolbucks={golbucks}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <RewardHeader golbucks={golbucks} onTaskPress={handleTaskPress} />
      <RewardCategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InviteBanner onInvitePress={handleInvitePress} />

        {filteredRewards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Bu kategoride ödül bulunamadı
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

      <RewardDetailModal
        visible={modalVisible}
        reward={selectedReward}
        onClose={handleCloseModal}
        onConfirm={handleBuy}
        userGolbucks={golbucks}
      />

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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

