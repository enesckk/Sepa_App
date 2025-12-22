const { User } = require('../models');
const GolbucksTransaction = require('../models/GolbucksTransaction');
const { sequelize } = require('../config/database');
const { ValidationError } = require('../utils/errors');

/**
 * Add golbucks to user account
 * @param {string} userId - User ID
 * @param {number} amount - Amount to add (positive number)
 * @param {string} type - Transaction type
 * @param {string} description - Transaction description
 * @param {object} metadata - Additional metadata
 * @param {object} dbTransaction - Optional database transaction
 * @returns {Promise<Object>} Transaction result
 */
const addGolbucks = async (userId, amount, type, description = null, metadata = {}, dbTransaction = null) => {
  if (amount <= 0) {
    throw new ValidationError('Amount must be positive');
  }

  const transaction = dbTransaction || await sequelize.transaction();
  const shouldCommit = !dbTransaction;

  try {
    // Get user with lock
    const user = await User.findByPk(userId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Calculate new balance
    const newBalance = user.golbucks + amount;

    // Update user golbucks
    await user.update({ golbucks: newBalance }, { transaction });

    // Create transaction record
    const golbucksTransaction = await GolbucksTransaction.create(
      {
        user_id: userId,
        amount: amount,
        type: type,
        description: description,
        balance_after: newBalance,
        metadata: metadata,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      success: true,
      transaction: golbucksTransaction,
      newBalance: newBalance,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Deduct golbucks from user account
 * @param {string} userId - User ID
 * @param {number} amount - Amount to deduct (positive number)
 * @param {string} type - Transaction type
 * @param {string} description - Transaction description
 * @param {object} metadata - Additional metadata
 * @returns {Promise<Object>} Transaction result
 */
const deductGolbucks = async (userId, amount, type, description = null, metadata = {}) => {
  if (amount <= 0) {
    throw new ValidationError('Amount must be positive');
  }

  const transaction = await sequelize.transaction();

  try {
    // Get user with lock
    const user = await User.findByPk(userId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!user) {
      throw new ValidationError('User not found');
    }

    // Check if user has enough golbucks
    if (user.golbucks < amount) {
      throw new ValidationError('Insufficient golbucks balance');
    }

    // Calculate new balance
    const newBalance = user.golbucks - amount;

    // Update user golbucks
    await user.update({ golbucks: newBalance }, { transaction });

    // Create transaction record (negative amount)
    const golbucksTransaction = await GolbucksTransaction.create(
      {
        user_id: userId,
        amount: -amount, // Negative for deduction
        type: type,
        description: description,
        balance_after: newBalance,
        metadata: metadata,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      success: true,
      transaction: golbucksTransaction,
      newBalance: newBalance,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get golbucks transaction history
 * @param {string} userId - User ID
 * @param {number} limit - Number of transactions to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} Transaction history
 */
const getTransactionHistory = async (userId, limit = 50, offset = 0) => {
  const transactions = await GolbucksTransaction.findAndCountAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: limit,
    offset: offset,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });

  return {
    transactions: transactions.rows,
    total: transactions.count,
    limit: limit,
    offset: offset,
  };
};

/**
 * Get current golbucks balance
 * @param {string} userId - User ID
 * @returns {Promise<number>} Current balance
 */
const getBalance = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['golbucks'],
  });

  if (!user) {
    throw new ValidationError('User not found');
  }

  return user.golbucks;
};

module.exports = {
  addGolbucks,
  deductGolbucks,
  getTransactionHistory,
  getBalance,
};

