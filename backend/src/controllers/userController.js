const { User } = require('../models');
const { ValidationError, NotFoundError, UnauthorizedError } = require('../utils/errors');
const { body, validationResult } = require('express-validator');

/**
 * Get user profile
 * GET /api/users/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/users/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, phone, mahalle } = req.body;

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        errors: errors.array(),
      });
    }

    // Update allowed fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (mahalle !== undefined) updateData.mahalle = mahalle;

    // Update user
    await user.update(updateData);

    // Reload user to get updated data
    await user.reload();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user golbucks balance
 * GET /api/users/golbucks
 */
const getGolbucks = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        golbucks: user.golbucks,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update password
 * PUT /api/users/password
 */
const updatePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      throw new ValidationError('Current password and new password are required');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('New password must be at least 6 characters');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Update password (will be hashed by model hook)
    await user.update({ password: newPassword });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Profile update validation
 */
const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone must be maximum 20 characters'),
  body('mahalle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Mahalle must be maximum 100 characters'),
];

module.exports = {
  getProfile,
  updateProfile,
  getGolbucks,
  updatePassword,
  validateUpdateProfile,
};

