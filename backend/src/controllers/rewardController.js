const { Reward, UserReward } = require('../models');
const { deductGolbucks } = require('../services/golbucksService');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all active rewards
 * GET /api/rewards
 */
const getRewards = async (req, res, next) => {
  try {
    const { category, minPoints, maxPoints, limit = 50, offset = 0 } = req.query;

    const where = {
      is_active: true,
    };

    if (category) {
      where.category = category;
    }

    if (minPoints || maxPoints) {
      where.points = {};
      if (minPoints) where.points[Op.gte] = parseInt(minPoints);
      if (maxPoints) where.points[Op.lte] = parseInt(maxPoints);
    }

    const rewards = await Reward.findAndCountAll({
      where,
      order: [['points', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: {
        rewards: rewards.rows,
        total: rewards.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reward by ID
 * GET /api/rewards/:id
 */
const getRewardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reward = await Reward.findByPk(id);

    if (!reward || !reward.is_active) {
      throw new NotFoundError('Reward');
    }

    res.status(200).json({
      success: true,
      data: {
        reward,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Redeem reward (purchase with golbucks)
 * POST /api/rewards/:id/redeem
 */
const redeemReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Get reward
    const reward = await Reward.findByPk(id);

    if (!reward || !reward.is_active) {
      throw new NotFoundError('Reward');
    }

    // Check stock
    if (reward.stock !== null && reward.stock <= 0) {
      throw new ValidationError('Reward is out of stock');
    }

    // Deduct golbucks
    const deductionResult = await deductGolbucks(
      userId,
      reward.points,
      'reward_purchase',
      `Ödül satın alındı: ${reward.title}`,
      { reward_id: id }
    );

    // Calculate expiration date
    let expiresAt = null;
    if (reward.validity_days) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + reward.validity_days);
    }

    // Generate QR code and reference code
    const qrCode = `QR-${uuidv4()}`;
    const referenceCode = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create user reward
    const userReward = await UserReward.create({
      user_id: userId,
      reward_id: id,
      qr_code: qrCode,
      reference_code: referenceCode,
      expires_at: expiresAt,
      is_used: false,
    });

    // Update stock if applicable
    if (reward.stock !== null) {
      await reward.update({ stock: reward.stock - 1 });
    }

    // Load reward details
    await userReward.reload({
      include: [
        {
          model: Reward,
          as: 'reward',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Reward redeemed successfully',
      data: {
        userReward,
        newBalance: deductionResult.newBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's redeemed rewards
 * GET /api/rewards/my
 */
const getMyRewards = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { is_used, limit = 50, offset = 0 } = req.query;

    const where = {
      user_id: userId,
    };

    if (is_used !== undefined) {
      where.is_used = is_used === 'true';
    }

    const userRewards = await UserReward.findAndCountAll({
      where,
      include: [
        {
          model: Reward,
          as: 'reward',
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: {
        rewards: userRewards.rows,
        total: userRewards.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark reward as used
 * PUT /api/rewards/my/:id/use
 */
const useReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const userReward = await UserReward.findOne({
      where: {
        id,
        user_id: userId,
      },
      include: [
        {
          model: Reward,
          as: 'reward',
        },
      ],
    });

    if (!userReward) {
      throw new NotFoundError('User reward');
    }

    if (userReward.is_used) {
      throw new ValidationError('Reward already used');
    }

    // Check expiration
    if (userReward.expires_at && new Date(userReward.expires_at) < new Date()) {
      throw new ValidationError('Reward has expired');
    }

    await userReward.update({
      is_used: true,
      redeemed_at: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Reward marked as used',
      data: {
        userReward,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRewards,
  getRewardById,
  redeemReward,
  getMyRewards,
  useReward,
};

