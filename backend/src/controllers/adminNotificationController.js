const {
  createNotification,
  createBulkNotifications,
  createNotificationForAllUsers,
} = require('../services/notificationService');
const { ValidationError } = require('../utils/errors');

/**
 * Create notification (Admin)
 * POST /api/admin/notifications
 */
const createNotificationAdmin = async (req, res, next) => {
  try {
    const { user_id, user_ids, title, message, type, data, action_url, send_to_all } = req.body;

    if (!title || !message) {
      throw new ValidationError('title and message are required');
    }

    let result;

    if (send_to_all === true || send_to_all === 'true') {
      // Send to all active users
      result = await createNotificationForAllUsers({
        title,
        message,
        type: type || 'info',
        data: data || null,
        action_url: action_url || null,
      });
    } else if (user_ids && Array.isArray(user_ids) && user_ids.length > 0) {
      // Send to specific users
      result = await createBulkNotifications(user_ids, {
        title,
        message,
        type: type || 'info',
        data: data || null,
        action_url: action_url || null,
      });
    } else if (user_id) {
      // Send to single user
      result = await createNotification({
        user_id,
        title,
        message,
        type: type || 'info',
        data: data || null,
        action_url: action_url || null,
      });
      result = [result];
    } else {
      throw new ValidationError('user_id, user_ids, or send_to_all must be provided');
    }

    res.status(201).json({
      success: true,
      message: 'Notification(s) created successfully',
      data: { notifications: result, count: result.length },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotificationAdmin,
};

