const { User } = require('../models');
const DailyReward = require('../models/DailyReward');
const { addGolbucks } = require('./golbucksService');
const { sequelize } = require('../config/database');

// Constants
const DAILY_REWARD_AMOUNT = 10; // Günlük ödül: 10 puan
const STREAK_BONUS_DAYS = 7; // 7 gün üst üste
const STREAK_BONUS_AMOUNT = 20; // Streak bonusu: 20 puan

/**
 * Check if user can claim daily reward today
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Reward status
 */
const checkDailyRewardStatus = async (userId) => {
  let dailyReward = await DailyReward.findOne({
    where: { user_id: userId },
  });

  // Create daily reward record if doesn't exist
  if (!dailyReward) {
    dailyReward = await DailyReward.create({
      user_id: userId,
      last_reward_date: null,
      current_streak: 0,
      longest_streak: 0,
      total_rewards: 0,
    });
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastRewardDate = dailyReward.last_reward_date
    ? new Date(dailyReward.last_reward_date).toISOString().split('T')[0]
    : null;

  const canClaim = lastRewardDate !== today;
  const isStreak = canClaim && lastRewardDate && isConsecutiveDay(lastRewardDate, today);

  return {
    canClaim,
    lastRewardDate,
    currentStreak: dailyReward.current_streak,
    longestStreak: dailyReward.longest_streak,
    totalRewards: dailyReward.total_rewards,
    isStreak,
    willGetStreakBonus: isStreak && dailyReward.current_streak === STREAK_BONUS_DAYS - 1,
  };
};

/**
 * Claim daily reward
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Reward result
 */
const claimDailyReward = async (userId) => {
  const transaction = await sequelize.transaction();

  try {
    // Check if can claim
    const status = await checkDailyRewardStatus(userId);
    if (!status.canClaim) {
      throw new Error('Daily reward already claimed today');
    }

    // Get or create daily reward record
    let dailyReward = await DailyReward.findOne({
      where: { user_id: userId },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!dailyReward) {
      dailyReward = await DailyReward.create(
        {
          user_id: userId,
          last_reward_date: null,
          current_streak: 0,
          longest_streak: 0,
          total_rewards: 0,
        },
        { transaction }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const lastRewardDate = dailyReward.last_reward_date
      ? new Date(dailyReward.last_reward_date).toISOString().split('T')[0]
      : null;

    // Calculate streak
    let newStreak = 1;
    let streakBonus = 0;

    if (lastRewardDate && isConsecutiveDay(lastRewardDate, today)) {
      // Consecutive day - increment streak
      newStreak = dailyReward.current_streak + 1;
    } else {
      // Not consecutive - reset streak
      newStreak = 1;
    }

    // Check for streak bonus (7 days)
    if (newStreak === STREAK_BONUS_DAYS) {
      streakBonus = STREAK_BONUS_AMOUNT;
    }

    // Update longest streak if needed
    const newLongestStreak = Math.max(dailyReward.longest_streak, newStreak);

    // Update daily reward record
    await dailyReward.update(
      {
        last_reward_date: today,
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        total_rewards: dailyReward.total_rewards + 1,
      },
      { transaction }
    );

    // Add daily reward golbucks
    const dailyRewardResult = await addGolbucks(
      userId,
      DAILY_REWARD_AMOUNT,
      'daily_reward',
      `Günlük giriş ödülü - ${newStreak}. gün`,
      { streak: newStreak },
      transaction
    );

    // Add streak bonus if applicable
    let streakBonusResult = null;
    if (streakBonus > 0) {
      streakBonusResult = await addGolbucks(
        userId,
        streakBonus,
        'streak_bonus',
        `${STREAK_BONUS_DAYS} gün üst üste giriş bonusu!`,
        { streak: newStreak },
        transaction
      );
    }

    await transaction.commit();

    return {
      success: true,
      dailyReward: DAILY_REWARD_AMOUNT,
      streakBonus: streakBonus,
      totalReward: DAILY_REWARD_AMOUNT + streakBonus,
      newStreak: newStreak,
      newBalance: streakBonusResult
        ? streakBonusResult.newBalance
        : dailyRewardResult.newBalance,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Check if two dates are consecutive days
 * @param {string} date1 - First date (YYYY-MM-DD)
 * @param {string} date2 - Second date (YYYY-MM-DD)
 * @returns {boolean} True if consecutive
 */
const isConsecutiveDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

module.exports = {
  checkDailyRewardStatus,
  claimDailyReward,
  DAILY_REWARD_AMOUNT,
  STREAK_BONUS_DAYS,
  STREAK_BONUS_AMOUNT,
};

