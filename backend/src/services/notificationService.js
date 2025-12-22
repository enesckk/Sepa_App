const { Notification, User } = require('../models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Create a notification
 * @param {object} notificationData - Notification data
 * @returns {Promise<Object>} Created notification
 */
const createNotification = async (notificationData) => {
  const { user_id, title, message, type, data, action_url } = notificationData;

  if (!user_id || !title || !message) {
    throw new ValidationError('user_id, title, and message are required');
  }

  const notification = await Notification.create({
    user_id,
    title,
    message,
    type: type || 'info',
    data: data || null,
    action_url: action_url || null,
    is_read: false,
  });

  return notification.toJSON();
};

/**
 * Create notifications for multiple users
 * @param {Array<string>} user_ids - Array of user IDs
 * @param {object} notificationData - Notification data (title, message, type, data, action_url)
 * @returns {Promise<Array>} Created notifications
 */
const createBulkNotifications = async (user_ids, notificationData) => {
  const { title, message, type, data, action_url } = notificationData;

  if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
    throw new ValidationError('user_ids must be a non-empty array');
  }

  if (!title || !message) {
    throw new ValidationError('title and message are required');
  }

  const notifications = user_ids.map((user_id) => ({
    user_id,
    title,
    message,
    type: type || 'info',
    data: data || null,
    action_url: action_url || null,
    is_read: false,
  }));

  const created = await Notification.bulkCreate(notifications);

  return created.map((n) => n.toJSON());
};

/**
 * Create notification for all active users
 * @param {object} notificationData - Notification data
 * @returns {Promise<Array>} Created notifications
 */
const createNotificationForAllUsers = async (notificationData) => {
  const activeUsers = await User.findAll({
    where: { is_active: true },
    attributes: ['id'],
  });

  const user_ids = activeUsers.map((user) => user.id);

  return await createBulkNotifications(user_ids, notificationData);
};

/**
 * Get user notifications
 * @param {string} user_id - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<Object>} Notifications list
 */
const getUserNotifications = async (user_id, filters = {}) => {
  const {
    is_read,
    type,
    limit = 50,
    offset = 0,
    sort = 'created_at',
    order = 'DESC',
  } = filters;

  const where = { user_id };

  if (is_read !== undefined) {
    where.is_read = is_read === 'true' || is_read === true;
  }

  if (type) {
    where.type = type;
  }

  const validSortFields = ['created_at', 'is_read'];
  const sortField = validSortFields.includes(sort) ? sort : 'created_at';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const notifications = await Notification.findAndCountAll({
    where,
    order: [[sortField, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  // Get unread count
  const unreadCount = await Notification.count({
    where: {
      user_id,
      is_read: false,
    },
  });

  return {
    notifications: notifications.rows.map((n) => n.toJSON()),
    total: notifications.count,
    unreadCount,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

/**
 * Mark notification as read
 * @param {string} notification_id - Notification ID
 * @param {string} user_id - User ID (for verification)
 * @returns {Promise<Object>} Updated notification
 */
const markNotificationAsRead = async (notification_id, user_id) => {
  const notification = await Notification.findOne({
    where: {
      id: notification_id,
      user_id,
    },
  });

  if (!notification) {
    throw new NotFoundError('Notification');
  }

  if (!notification.is_read) {
    notification.is_read = true;
    notification.read_at = new Date();
    await notification.save();
  }

  return notification.toJSON();
};

/**
 * Mark all notifications as read for a user
 * @param {string} user_id - User ID
 * @returns {Promise<number>} Number of updated notifications
 */
const markAllNotificationsAsRead = async (user_id) => {
  const [updatedCount] = await Notification.update(
    {
      is_read: true,
      read_at: new Date(),
    },
    {
      where: {
        user_id,
        is_read: false,
      },
    }
  );

  return updatedCount;
};

/**
 * Delete notification
 * @param {string} notification_id - Notification ID
 * @param {string} user_id - User ID (for verification)
 * @returns {Promise<boolean>} Success status
 */
const deleteNotification = async (notification_id, user_id) => {
  const notification = await Notification.findOne({
    where: {
      id: notification_id,
      user_id,
    },
  });

  if (!notification) {
    throw new NotFoundError('Notification');
  }

  await notification.destroy();
  return true;
};

/**
 * Delete all read notifications for a user
 * @param {string} user_id - User ID
 * @returns {Promise<number>} Number of deleted notifications
 */
const deleteAllReadNotifications = async (user_id) => {
  const deletedCount = await Notification.destroy({
    where: {
      user_id,
      is_read: true,
    },
  });

  return deletedCount;
};

module.exports = {
  createNotification,
  createBulkNotifications,
  createNotificationForAllUsers,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications,
};

