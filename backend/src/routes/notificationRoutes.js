const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications,
} = require('../controllers/notificationController');

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications
 * @access  Private
 * @query   is_read, type, limit, offset, sort, order
 */
router.get('/', authenticate, getUserNotifications);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', authenticate, markNotificationAsRead);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', authenticate, markAllNotificationsAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', authenticate, deleteNotification);

/**
 * @route   DELETE /api/notifications/read-all
 * @desc    Delete all read notifications
 * @access  Private
 */
router.delete('/read-all', authenticate, deleteAllReadNotifications);

module.exports = router;

