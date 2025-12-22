const { getTransactionHistory, getBalance } = require('../services/golbucksService');

/**
 * Get golbucks transaction history
 * GET /api/users/golbucks/history
 */
const getGolbucksHistory = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { limit = 50, offset = 0 } = req.query;

    const history = await getTransactionHistory(
      userId,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current golbucks balance
 * GET /api/users/golbucks
 */
const getGolbucksBalance = async (req, res, next) => {
  try {
    const userId = req.userId;

    const balance = await getBalance(userId);

    res.status(200).json({
      success: true,
      data: {
        golbucks: balance,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGolbucksHistory,
  getGolbucksBalance,
};

