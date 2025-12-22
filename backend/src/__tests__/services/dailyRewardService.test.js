const { checkAndClaimDailyReward, getDailyRewardStatus } = require('../../services/dailyRewardService');
const { User, DailyReward } = require('../../models');
const { addGolbucks } = require('../../services/golbucksService');

jest.mock('../../models');
jest.mock('../../services/golbucksService');

describe('Daily Reward Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAndClaimDailyReward', () => {
    it('should claim daily reward for first time', async () => {
      const mockUser = { id: 'user-1', golbucks: 0 };
      const mockDailyReward = null;

      User.findByPk.mockResolvedValue(mockUser);
      DailyReward.findOne.mockResolvedValue(mockDailyReward);
      DailyReward.create.mockResolvedValue({
        id: 'dr-1',
        last_reward_date: new Date(),
        current_streak: 1,
        total_rewards: 1,
      });
      addGolbucks.mockResolvedValue({ success: true });

      const result = await checkAndClaimDailyReward('user-1');

      expect(DailyReward.create).toHaveBeenCalled();
      expect(addGolbucks).toHaveBeenCalledWith('user-1', 10, 'Daily login reward', 'daily_reward');
      expect(result).toHaveProperty('rewarded', true);
      expect(result).toHaveProperty('points', 10);
      expect(result).toHaveProperty('streak', 1);
    });

    it('should continue streak if claimed within 24 hours', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const mockDailyReward = {
        id: 'dr-1',
        last_reward_date: yesterday,
        current_streak: 5,
        total_rewards: 5,
        save: jest.fn(),
      };

      User.findByPk.mockResolvedValue({ id: 'user-1' });
      DailyReward.findOne.mockResolvedValue(mockDailyReward);
      addGolbucks.mockResolvedValue({ success: true });

      const result = await checkAndClaimDailyReward('user-1');

      expect(mockDailyReward.save).toHaveBeenCalled();
      expect(result).toHaveProperty('streak', 6);
    });

    it('should reset streak if not claimed within 24 hours', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const mockDailyReward = {
        id: 'dr-1',
        last_reward_date: twoDaysAgo,
        current_streak: 5,
        total_rewards: 5,
        save: jest.fn(),
      };

      User.findByPk.mockResolvedValue({ id: 'user-1' });
      DailyReward.findOne.mockResolvedValue(mockDailyReward);
      addGolbucks.mockResolvedValue({ success: true });

      const result = await checkAndClaimDailyReward('user-1');

      expect(result).toHaveProperty('streak', 1);
    });

    it('should give bonus for 7-day streak', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const mockDailyReward = {
        id: 'dr-1',
        last_reward_date: yesterday,
        current_streak: 6,
        total_rewards: 6,
        save: jest.fn(),
      };

      User.findByPk.mockResolvedValue({ id: 'user-1' });
      DailyReward.findOne.mockResolvedValue(mockDailyReward);
      addGolbucks.mockResolvedValue({ success: true });

      const result = await checkAndClaimDailyReward('user-1');

      expect(addGolbucks).toHaveBeenCalledWith('user-1', 30, expect.any(String), 'daily_reward');
      expect(result).toHaveProperty('points', 30);
      expect(result).toHaveProperty('streak', 7);
      expect(result).toHaveProperty('bonus', true);
    });

    it('should not reward if already claimed today', async () => {
      const today = new Date();

      const mockDailyReward = {
        id: 'dr-1',
        last_reward_date: today,
        current_streak: 1,
        total_rewards: 1,
      };

      User.findByPk.mockResolvedValue({ id: 'user-1' });
      DailyReward.findOne.mockResolvedValue(mockDailyReward);

      const result = await checkAndClaimDailyReward('user-1');

      expect(addGolbucks).not.toHaveBeenCalled();
      expect(result).toHaveProperty('rewarded', false);
    });
  });

  describe('getDailyRewardStatus', () => {
    it('should return daily reward status', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const mockDailyReward = {
        id: 'dr-1',
        last_reward_date: yesterday,
        current_streak: 5,
        longest_streak: 7,
        total_rewards: 10,
      };

      DailyReward.findOne.mockResolvedValue(mockDailyReward);

      const status = await getDailyRewardStatus('user-1');

      expect(status).toHaveProperty('currentStreak', 5);
      expect(status).toHaveProperty('longestStreak', 7);
      expect(status).toHaveProperty('totalRewards', 10);
      expect(status).toHaveProperty('canClaim', true);
    });
  });
});

