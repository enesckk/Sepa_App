const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const rewardRoutes = require('./rewardRoutes');
const dailyRewardRoutes = require('./dailyRewardRoutes');
const eventRoutes = require('./eventRoutes');
const applicationRoutes = require('./applicationRoutes');
const billSupportRoutes = require('./billSupportRoutes');
const storyRoutes = require('./storyRoutes');
const placeRoutes = require('./placeRoutes');
const surveyRoutes = require('./surveyRoutes');
const newsRoutes = require('./newsRoutes');
const emergencyGatheringRoutes = require('./emergencyGatheringRoutes');
const adminRoutes = require('./adminRoutes');
const notificationRoutes = require('./notificationRoutes');

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
        saveFcmToken: 'POST /api/users/fcm-token',
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
      applications: {
        create: 'POST /api/applications',
        list: 'GET /api/applications',
        getById: 'GET /api/applications/:id',
        addComment: 'POST /api/applications/:id/comment',
      },
      billSupports: {
        create: 'POST /api/bill-supports',
        list: 'GET /api/bill-supports',
        public: 'GET /api/bill-supports/public',
        getById: 'GET /api/bill-supports/:id',
        support: 'POST /api/bill-supports/:id/support',
      },
      stories: {
        list: 'GET /api/stories',
        getById: 'GET /api/stories/:id',
        view: 'POST /api/stories/:id/view',
        create: 'POST /api/stories (Admin)',
        update: 'PUT /api/stories/:id (Admin)',
        delete: 'DELETE /api/stories/:id (Admin)',
      },
      places: {
        list: 'GET /api/places',
        nearby: 'GET /api/places/nearby',
        categories: 'GET /api/places/categories',
        getById: 'GET /api/places/:id',
      },
      surveys: {
        list: 'GET /api/surveys',
        getById: 'GET /api/surveys/:id',
        submit: 'POST /api/surveys/:id/submit',
        myAnswers: 'GET /api/surveys/:id/my-answers',
      },
      news: {
        list: 'GET /api/news',
        categories: 'GET /api/news/categories',
        getById: 'GET /api/news/:id',
      },
      emergencyGathering: {
        list: 'GET /api/emergency-gathering',
        nearby: 'GET /api/emergency-gathering/nearby',
        getById: 'GET /api/emergency-gathering/:id',
      },
      notifications: {
        list: 'GET /api/notifications',
        markRead: 'PUT /api/notifications/:id/read',
        markAllRead: 'PUT /api/notifications/read-all',
        delete: 'DELETE /api/notifications/:id',
        deleteAllRead: 'DELETE /api/notifications/read-all',
      },
      admin: {
        dashboard: 'GET /api/admin/dashboard-stats',
        users: {
          list: 'GET /api/admin/users',
          update: 'PUT /api/admin/users/:id',
          delete: 'DELETE /api/admin/users/:id',
        },
        events: {
          create: 'POST /api/admin/events',
          update: 'PUT /api/admin/events/:id',
          delete: 'DELETE /api/admin/events/:id',
          registrations: 'GET /api/admin/events/:id/registrations',
        },
        stories: {
          create: 'POST /api/admin/stories',
          update: 'PUT /api/admin/stories/:id',
          delete: 'DELETE /api/admin/stories/:id',
        },
        news: {
          create: 'POST /api/admin/news',
          update: 'PUT /api/admin/news/:id',
          delete: 'DELETE /api/admin/news/:id',
        },
        applications: {
          list: 'GET /api/admin/applications',
          updateStatus: 'PUT /api/admin/applications/:id/status',
        },
        surveys: {
          create: 'POST /api/admin/surveys',
          update: 'PUT /api/admin/surveys/:id',
          delete: 'DELETE /api/admin/surveys/:id',
          addQuestion: 'POST /api/admin/surveys/:id/questions',
          updateQuestion: 'PUT /api/admin/questions/:id',
          deleteQuestion: 'DELETE /api/admin/questions/:id',
        },
        rewards: {
          create: 'POST /api/admin/rewards',
          update: 'PUT /api/admin/rewards/:id',
          delete: 'DELETE /api/admin/rewards/:id',
        },
        billSupports: {
          list: 'GET /api/admin/bill-supports',
          updateStatus: 'PUT /api/admin/bill-supports/:id/status',
        },
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
router.use('/applications', applicationRoutes);
router.use('/bill-supports', billSupportRoutes);
router.use('/stories', storyRoutes);
router.use('/places', placeRoutes);
router.use('/surveys', surveyRoutes);
router.use('/news', newsRoutes);
router.use('/emergency-gathering', emergencyGatheringRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

