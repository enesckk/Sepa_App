const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');
const { uploadSingle } = require('../config/multer');

// Dashboard
const { getDashboardStats } = require('../controllers/adminController');
router.get('/dashboard-stats', authenticate, requireAdmin, getDashboardStats);

// Users
const { getUsers, updateUser, deleteUser } = require('../controllers/adminController');
router.get('/users', authenticate, requireAdmin, getUsers);
router.put('/users/:id', authenticate, requireAdmin, updateUser);
router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

// Events
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
} = require('../controllers/adminEventController');
router.post('/events', authenticate, requireAdmin, uploadSingle('image'), createEvent);
router.put('/events/:id', authenticate, requireAdmin, uploadSingle('image'), updateEvent);
router.delete('/events/:id', authenticate, requireAdmin, deleteEvent);
router.get('/events/:id/registrations', authenticate, requireAdmin, getEventRegistrations);

// Stories
const {
  createStory,
  updateStory,
  deleteStory,
} = require('../controllers/adminStoryController');
router.post('/stories', authenticate, requireAdmin, uploadSingle('image'), createStory);
router.put('/stories/:id', authenticate, requireAdmin, uploadSingle('image'), updateStory);
router.delete('/stories/:id', authenticate, requireAdmin, deleteStory);

// News
const { createNews, updateNews, deleteNews } = require('../controllers/adminNewsController');
router.post('/news', authenticate, requireAdmin, uploadSingle('image'), createNews);
router.put('/news/:id', authenticate, requireAdmin, uploadSingle('image'), updateNews);
router.delete('/news/:id', authenticate, requireAdmin, deleteNews);

// Applications
const {
  getApplications,
  updateApplicationStatus,
} = require('../controllers/adminApplicationController');
router.get('/applications', authenticate, requireAdmin, getApplications);
router.put('/applications/:id/status', authenticate, requireAdmin, updateApplicationStatus);

// Surveys
const {
  getSurveys,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/adminSurveyController');
router.get('/surveys', authenticate, requireAdmin, getSurveys);
router.post('/surveys', authenticate, requireAdmin, createSurvey);
router.put('/surveys/:id', authenticate, requireAdmin, updateSurvey);
router.delete('/surveys/:id', authenticate, requireAdmin, deleteSurvey);
router.post('/surveys/:id/questions', authenticate, requireAdmin, addQuestion);
router.put('/questions/:id', authenticate, requireAdmin, updateQuestion);
router.delete('/questions/:id', authenticate, requireAdmin, deleteQuestion);

// Rewards
const { createReward, updateReward, deleteReward } = require('../controllers/adminRewardController');
router.post('/rewards', authenticate, requireAdmin, uploadSingle('image'), createReward);
router.put('/rewards/:id', authenticate, requireAdmin, uploadSingle('image'), updateReward);
router.delete('/rewards/:id', authenticate, requireAdmin, deleteReward);

// Bill Supports
const {
  getBillSupports,
  updateBillSupportStatus,
} = require('../controllers/adminBillSupportController');
router.get('/bill-supports', authenticate, requireAdmin, getBillSupports);
router.put('/bill-supports/:id/status', authenticate, requireAdmin, updateBillSupportStatus);

// Notifications
const { createNotificationAdmin } = require('../controllers/adminNotificationController');
router.post('/notifications', authenticate, requireAdmin, createNotificationAdmin);

// Emergency Gathering
const {
  createGatheringArea,
  updateGatheringArea,
  deleteGatheringArea,
} = require('../controllers/emergencyGatheringController');
router.post('/emergency-gathering', authenticate, requireAdmin, createGatheringArea);
router.put('/emergency-gathering/:id', authenticate, requireAdmin, updateGatheringArea);
router.delete('/emergency-gathering/:id', authenticate, requireAdmin, deleteGatheringArea);

// Places
const {
  createPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/placeController');
router.post('/places', authenticate, requireAdmin, uploadSingle('image'), createPlace);
router.put('/places/:id', authenticate, requireAdmin, uploadSingle('image'), updatePlace);
router.delete('/places/:id', authenticate, requireAdmin, deletePlace);

module.exports = router;

