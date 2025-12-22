const {
  User,
  Event,
  EventRegistration,
  Application,
  BillSupport,
  Survey,
  Question,
  Story,
  News,
  Place,
  EmergencyGathering,
  Reward,
} = require('../models');
const { getDashboardStats } = require('../services/adminStatsService');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { Op } = require('sequelize');
const path = require('path');

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard-stats
 */
const getDashboardStatsEndpoint = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users (Admin)
 * GET /api/admin/users
 */
const getUsers = async (req, res, next) => {
  try {
    const {
      search,
      is_active,
      role,
      limit = 50,
      offset = 0,
      sort = 'created_at',
      order = 'DESC',
    } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    if (role) {
      where.role = role;
    }

    const validSortFields = ['created_at', 'name', 'email', 'golbucks'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [[sortField, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: {
        users: users.rows,
        total: users.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user (Admin)
 * PUT /api/admin/users/:id
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, mahalle, golbucks, role, is_active } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError('User');
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (mahalle !== undefined) user.mahalle = mahalle;
    if (golbucks !== undefined) user.golbucks = parseInt(golbucks);
    if (role !== undefined) user.role = role;
    if (is_active !== undefined) user.is_active = is_active;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          mahalle: user.mahalle,
          golbucks: user.golbucks,
          role: user.role,
          is_active: user.is_active,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin)
 * DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError('User');
    }

    // Don't allow deleting yourself
    if (user.id === req.userId) {
      throw new ValidationError('Cannot delete your own account');
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats: getDashboardStatsEndpoint,
  getUsers,
  updateUser,
  deleteUser,
};

