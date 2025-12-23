const { getMessaging } = require('../config/firebase');
const { User } = require('../models');
const { Op } = require('sequelize');

/**
 * Send push notification to a single device
 * @param {string} fcmToken - FCM token
 * @param {object} notification - Notification object { title, body }
 * @param {object} data - Additional data payload
 * @returns {Promise<object>} Send result
 */
const sendToDevice = async (fcmToken, notification, data = {}) => {
  const messaging = getMessaging();
  if (!messaging) {
    throw new Error('Firebase Messaging is not initialized');
  }

  if (!fcmToken) {
    throw new Error('FCM token is required');
  }

  const message = {
    token: fcmToken,
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: {
      ...data,
      // Convert all data values to strings (FCM requirement)
      ...Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {}),
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  try {
    const response = await messaging.send(message);
    return {
      success: true,
      messageId: response,
    };
  } catch (error) {
    // Handle invalid token errors
    if (error.code === 'messaging/invalid-registration-token' || 
        error.code === 'messaging/registration-token-not-registered') {
      // Remove invalid token from user
      await User.update(
        { fcm_token: null },
        { where: { fcm_token: { [Op.eq]: fcmToken } } }
      );
    }
    throw error;
  }
};

/**
 * Send push notification to multiple devices
 * @param {Array<string>} fcmTokens - Array of FCM tokens
 * @param {object} notification - Notification object { title, body }
 * @param {object} data - Additional data payload
 * @returns {Promise<object>} Send results
 */
const sendToMultipleDevices = async (fcmTokens, notification, data = {}) => {
  const messaging = getMessaging();
  if (!messaging) {
    throw new Error('Firebase Messaging is not initialized');
  }

  if (!fcmTokens || fcmTokens.length === 0) {
    throw new Error('FCM tokens array is required');
  }

  // FCM allows max 500 tokens per batch
  const batchSize = 500;
  const batches = [];
  for (let i = 0; i < fcmTokens.length; i += batchSize) {
    batches.push(fcmTokens.slice(i, i + batchSize));
  }

  const results = {
    successCount: 0,
    failureCount: 0,
    responses: [],
  };

  for (const batch of batches) {
    const message = {
      tokens: batch,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: {
        ...data,
        ...Object.keys(data).reduce((acc, key) => {
          acc[key] = String(data[key]);
          return acc;
        }, {}),
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await messaging.sendEachForMulticast(message);
      results.successCount += response.successCount;
      results.failureCount += response.failureCount;
      results.responses.push(response);

      // Remove invalid tokens
      if (response.failureCount > 0) {
        const invalidTokens = [];
        response.responses.forEach((resp, index) => {
          if (!resp.success) {
            const errorCode = resp.error?.code;
            if (errorCode === 'messaging/invalid-registration-token' ||
                errorCode === 'messaging/registration-token-not-registered') {
              invalidTokens.push(batch[index]);
            }
          }
        });

        if (invalidTokens.length > 0) {
          await User.update(
            { fcm_token: null },
            { where: { fcm_token: { [Op.in]: invalidTokens } } }
          );
        }
      }
    } catch (error) {
      results.failureCount += batch.length;
      console.error('Batch send error:', error.message);
    }
  }

  return results;
};

/**
 * Send push notification to a topic
 * @param {string} topic - Topic name
 * @param {object} notification - Notification object { title, body }
 * @param {object} data - Additional data payload
 * @returns {Promise<object>} Send result
 */
const sendToTopic = async (topic, notification, data = {}) => {
  const messaging = getMessaging();
  if (!messaging) {
    throw new Error('Firebase Messaging is not initialized');
  }

  const message = {
    topic: topic,
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: {
      ...data,
      ...Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {}),
    },
    android: {
      priority: 'high',
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };

  try {
    const response = await messaging.send(message);
    return {
      success: true,
      messageId: response,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Send push notification to all active users
 * @param {object} notification - Notification object { title, body }
 * @param {object} data - Additional data payload
 * @returns {Promise<object>} Send results
 */
const sendToAllUsers = async (notification, data = {}) => {
  // Get all users with FCM tokens
  const users = await User.findAll({
    where: {
      fcm_token: { [Op.ne]: null },
      is_active: true,
    },
    attributes: ['fcm_token'],
  });

  const fcmTokens = users
    .map((user) => user.fcm_token)
    .filter((token) => token !== null && token !== undefined);

  if (fcmTokens.length === 0) {
    return {
      successCount: 0,
      failureCount: 0,
      message: 'No active users with FCM tokens found',
    };
  }

  return await sendToMultipleDevices(fcmTokens, notification, data);
};

/**
 * Subscribe device to a topic
 * @param {string|Array<string>} fcmTokens - FCM token(s)
 * @param {string} topic - Topic name
 * @returns {Promise<object>} Subscribe result
 */
const subscribeToTopic = async (fcmTokens, topic) => {
  const messaging = getMessaging();
  if (!messaging) {
    throw new Error('Firebase Messaging is not initialized');
  }

  const tokens = Array.isArray(fcmTokens) ? fcmTokens : [fcmTokens];

  try {
    const response = await messaging.subscribeToTopic(tokens, topic);
    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Unsubscribe device from a topic
 * @param {string|Array<string>} fcmTokens - FCM token(s)
 * @param {string} topic - Topic name
 * @returns {Promise<object>} Unsubscribe result
 */
const unsubscribeFromTopic = async (fcmTokens, topic) => {
  const messaging = getMessaging();
  if (!messaging) {
    throw new Error('Firebase Messaging is not initialized');
  }

  const tokens = Array.isArray(fcmTokens) ? fcmTokens : [fcmTokens];

  try {
    const response = await messaging.unsubscribeFromTopic(tokens, topic);
    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendToDevice,
  sendToMultipleDevices,
  sendToTopic,
  sendToAllUsers,
  subscribeToTopic,
  unsubscribeFromTopic,
};

