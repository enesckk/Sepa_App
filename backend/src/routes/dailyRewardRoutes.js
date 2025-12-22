const express = require('express');
const router = express.Router();
const {
  getDailyRewardStatus,
  claimDailyReward,
} = require('../controllers/dailyRewardController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/rewards/daily/status
 * @desc    Get daily reward status
 * @access  Private
 */
router.get('/status', authenticate, getDailyRewardStatus);

/**
 * @route   POST /api/rewards/daily
 * @desc    Claim daily reward
 * @access  Private
 */
router.post('/', authenticate, claimDailyReward);

module.exports = router;

