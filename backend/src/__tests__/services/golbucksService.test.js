const {
  addGolbucks,
  deductGolbucks,
  getBalance,
  getTransactionHistory,
} = require('../../services/golbucksService');
const { User, GolbucksTransaction } = require('../../models');

// Mock models
jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
  },
  GolbucksTransaction: {
    create: jest.fn(),
    findAll: jest.fn(),
    sum: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

describe('Golbucks Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addGolbucks', () => {
    it('should add golbucks to user balance', async () => {
      const mockUser = {
        id: 'user-1',
        golbucks: 100,
        increment: jest.fn(),
      };

      User.findByPk.mockResolvedValue(mockUser);
      GolbucksTransaction.create.mockResolvedValue({ id: 'tx-1' });

      const result = await addGolbucks('user-1', 50, 'test', 'daily_reward');

      expect(User.findByPk).toHaveBeenCalledWith('user-1');
      expect(mockUser.increment).toHaveBeenCalledWith('golbucks', { by: 50 });
      expect(GolbucksTransaction.create).toHaveBeenCalled();
      expect(result).toHaveProperty('success', true);
    });

    it('should throw error if user not found', async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(addGolbucks('invalid-user', 50, 'test', 'daily_reward')).rejects.toThrow();
    });
  });

  describe('deductGolbucks', () => {
    it('should deduct golbucks from user balance', async () => {
      const mockUser = {
        id: 'user-1',
        golbucks: 100,
        decrement: jest.fn(),
      };

      User.findByPk.mockResolvedValue(mockUser);
      GolbucksTransaction.create.mockResolvedValue({ id: 'tx-1' });

      const result = await deductGolbucks('user-1', 30, 'test', 'reward_redemption');

      expect(User.findByPk).toHaveBeenCalledWith('user-1');
      expect(mockUser.decrement).toHaveBeenCalledWith('golbucks', { by: 30 });
      expect(GolbucksTransaction.create).toHaveBeenCalled();
      expect(result).toHaveProperty('success', true);
    });

    it('should throw error if insufficient balance', async () => {
      const mockUser = {
        id: 'user-1',
        golbucks: 10,
      };

      User.findByPk.mockResolvedValue(mockUser);

      await expect(deductGolbucks('user-1', 50, 'test', 'reward_redemption')).rejects.toThrow(
        'Insufficient'
      );
    });
  });

  describe('getBalance', () => {
    it('should return user golbucks balance', async () => {
      const mockUser = {
        id: 'user-1',
        golbucks: 150,
      };

      User.findByPk.mockResolvedValue(mockUser);

      const balance = await getBalance('user-1');

      expect(User.findByPk).toHaveBeenCalledWith('user-1');
      expect(balance).toBe(150);
    });
  });

  describe('getTransactionHistory', () => {
    it('should return transaction history', async () => {
      const mockTransactions = [
        { id: 'tx-1', amount: 50, type: 'daily_reward' },
        { id: 'tx-2', amount: -30, type: 'reward_redemption' },
      ];

      GolbucksTransaction.findAll.mockResolvedValue(mockTransactions);

      const history = await getTransactionHistory('user-1');

      expect(GolbucksTransaction.findAll).toHaveBeenCalled();
      expect(history).toHaveLength(2);
    });
  });
});

