const {
  createNotification,
  createBulkNotifications,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications,
} = require('../services/notificationService');

/**
 * Get user notifications
 * GET /api/notifications
 */
const getUserNotificationsEndpoint = async (req, res, next) => {
  try {
    const userId = req.userId;
    const filters = {
      is_read: req.query.is_read,
      type: req.query.type,
      limit: req.query.limit,
      offset: req.query.offset,
      sort: req.query.sort,
      order: req.query.order,
    };

    const result = await getUserNotifications(userId, filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
const markNotificationAsReadEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const notification = await markNotificationAsRead(id, userId);

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * PUT /api/notifications/read-all
 */
const markAllNotificationsAsReadEndpoint = async (req, res, next) => {
  try {
    const userId = req.userId;

    const updatedCount = await markAllNotificationsAsRead(userId);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: { updatedCount },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
const deleteNotificationEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await deleteNotification(id, userId);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all read notifications
 * DELETE /api/notifications/read-all
 */
const deleteAllReadNotificationsEndpoint = async (req, res, next) => {
  try {
    const userId = req.userId;

    const deletedCount = await deleteAllReadNotifications(userId);

    res.status(200).json({
      success: true,
      message: 'All read notifications deleted',
      data: { deletedCount },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserNotifications: getUserNotificationsEndpoint,
  markNotificationAsRead: markNotificationAsReadEndpoint,
  markAllNotificationsAsRead: markAllNotificationsAsReadEndpoint,
  deleteNotification: deleteNotificationEndpoint,
  deleteAllReadNotifications: deleteAllReadNotificationsEndpoint,
};

