const { Reward } = require('../models');
const { NotFoundError } = require('../utils/errors');
const path = require('path');
const pushNotificationService = require('../services/pushNotificationService');

/**
 * Create reward (Admin)
 * POST /api/admin/rewards
 */
const createReward = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      points,
      stock,
      validity_days,
      partner_name,
    } = req.body;

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/rewards/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const reward = await Reward.create({
      title,
      description: description || null,
      category,
      points: parseInt(points),
      stock: stock ? parseInt(stock) : null,
      validity_days: validity_days ? parseInt(validity_days) : null,
      partner_name: partner_name || null,
      image_url,
      is_active: true,
    });

    // Send push notification to all users about new reward
    try {
      await pushNotificationService.sendToAllUsers(
        {
          title: 'Yeni Ödül! 🎁',
          body: `${reward.title} - ${reward.points} Gölbucks`,
        },
        {
          type: 'reward',
          reward_id: reward.id,
          action_url: `/rewards/${reward.id}`,
        }
      );
    } catch (error) {
      console.error('Push notification error for new reward:', error.message);
    }

    res.status(201).json({
      success: true,
      message: 'Reward created successfully',
      data: { reward },
    });
  } catch (error) {
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/rewards', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Update reward (Admin)
 * PUT /api/admin/rewards/:id
 */
const updateReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const reward = await Reward.findByPk(id);

    if (!reward) {
      throw new NotFoundError('Reward');
    }

    if (req.file) {
      updateData.image_url = `/uploads/rewards/${req.file.filename}`;
    }

    if (updateData.points) updateData.points = parseInt(updateData.points);
    if (updateData.stock !== undefined) {
      updateData.stock = updateData.stock ? parseInt(updateData.stock) : null;
    }
    if (updateData.validity_days !== undefined) {
      updateData.validity_days = updateData.validity_days
        ? parseInt(updateData.validity_days)
        : null;
    }

    await reward.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Reward updated successfully',
      data: { reward },
    });
  } catch (error) {
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/rewards', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Delete reward (Admin)
 * DELETE /api/admin/rewards/:id
 */
const deleteReward = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reward = await Reward.findByPk(id);

    if (!reward) {
      throw new NotFoundError('Reward');
    }

    await reward.destroy();

    res.status(200).json({
      success: true,
      message: 'Reward deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReward,
  updateReward,
  deleteReward,
};

