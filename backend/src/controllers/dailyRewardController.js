const {
  checkDailyRewardStatus,
  claimDailyReward,
  DAILY_REWARD_AMOUNT,
  STREAK_BONUS_DAYS,
  STREAK_BONUS_AMOUNT,
} = require('../services/dailyRewardService');

/**
 * Get daily reward status
 * GET /api/rewards/daily/status
 */
const getDailyRewardStatus = async (req, res, next) => {
  try {
    const userId = req.userId;

    const status = await checkDailyRewardStatus(userId);

    res.status(200).json({
      success: true,
      data: {
        canClaim: status.canClaim,
        lastRewardDate: status.lastRewardDate,
        currentStreak: status.currentStreak,
        longestStreak: status.longestStreak,
        totalRewards: status.totalRewards,
        isStreak: status.isStreak,
        willGetStreakBonus: status.willGetStreakBonus,
        dailyRewardAmount: DAILY_REWARD_AMOUNT,
        streakBonusDays: STREAK_BONUS_DAYS,
        streakBonusAmount: STREAK_BONUS_AMOUNT,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Claim daily reward
 * POST /api/rewards/daily
 */
const claimDailyRewardEndpoint = async (req, res, next) => {
  try {
    const userId = req.userId;

    const result = await claimDailyReward(userId);

    res.status(200).json({
      success: true,
      message: 'Daily reward claimed successfully',
      data: {
        dailyReward: result.dailyReward,
        streakBonus: result.streakBonus,
        totalReward: result.totalReward,
        newStreak: result.newStreak,
        newBalance: result.newBalance,
      },
    });
  } catch (error) {
    if (error.message === 'Daily reward already claimed today') {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: error.message,
      });
    }
    next(error);
  }
};

module.exports = {
  getDailyRewardStatus,
  claimDailyReward: claimDailyRewardEndpoint,
};

