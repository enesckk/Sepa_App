const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const rewardRoutes = require('./rewardRoutes');
const dailyRewardRoutes = require('./dailyRewardRoutes');
const eventRoutes = require('./eventRoutes');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API info route
router.get('/', (req, res) => {
  res.json({
    message: 'Şehitkamil Belediyesi API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        me: 'GET /api/auth/me',
      },
      users: {
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile',
        golbucks: 'GET /api/users/golbucks',
        golbucksHistory: 'GET /api/users/golbucks/history',
        updatePassword: 'PUT /api/users/password',
      },
      rewards: {
        list: 'GET /api/rewards',
        getById: 'GET /api/rewards/:id',
        redeem: 'POST /api/rewards/:id/redeem',
        myRewards: 'GET /api/rewards/my',
        useReward: 'PUT /api/rewards/my/:id/use',
      },
      dailyReward: {
        status: 'GET /api/rewards/daily/status',
        claim: 'POST /api/rewards/daily',
      },
      events: {
        list: 'GET /api/events',
        getById: 'GET /api/events/:id',
        register: 'POST /api/events/:id/register',
        cancel: 'DELETE /api/events/:id/register',
        myRegistrations: 'GET /api/events/my-registrations',
      },
    },
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/rewards', rewardRoutes);
router.use('/rewards/daily', dailyRewardRoutes);
router.use('/events', eventRoutes);

module.exports = router;

