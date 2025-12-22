const express = require('express');
const router = express.Router();
const {
  getRewards,
  getRewardById,
  redeemReward,
  getMyRewards,
  useReward,
} = require('../controllers/rewardController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/rewards
 * @desc    Get all active rewards (public)
 * @access  Public
 */
router.get('/', getRewards);

/**
 * @route   GET /api/rewards/:id
 * @desc    Get reward by ID (public)
 * @access  Public
 */
router.get('/:id', getRewardById);

/**
 * @route   POST /api/rewards/:id/redeem
 * @desc    Redeem reward with golbucks
 * @access  Private
 */
router.post('/:id/redeem', authenticate, redeemReward);

/**
 * @route   GET /api/rewards/my
 * @desc    Get user's redeemed rewards
 * @access  Private
 */
router.get('/my', authenticate, getMyRewards);

/**
 * @route   PUT /api/rewards/my/:id/use
 * @desc    Mark reward as used
 * @access  Private
 */
router.put('/my/:id/use', authenticate, useReward);

module.exports = router;

