const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getGolbucks,
  updatePassword,
  validateUpdateProfile,
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, validateUpdateProfile, updateProfile);

/**
 * @route   GET /api/users/golbucks
 * @desc    Get user golbucks balance
 * @access  Private
 */
router.get('/golbucks', authenticate, getGolbucks);

/**
 * @route   PUT /api/users/password
 * @desc    Update user password
 * @access  Private
 */
router.put('/password', authenticate, updatePassword);

module.exports = router;

