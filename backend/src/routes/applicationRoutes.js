const express = require('express');
const router = express.Router();
const {
  createApplication,
  getUserApplications,
  getApplicationById,
  addComment,
} = require('../controllers/applicationController');
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../config/multer');

/**
 * @route   POST /api/applications
 * @desc    Create new application (complaint, request, marriage, muhtar message)
 * @access  Private
 * @body    type, subject, description, location, latitude, longitude
 * @file    image (optional)
 */
router.post(
  '/',
  authenticate,
  uploadSingle('image'),
  createApplication
);

/**
 * @route   GET /api/applications
 * @desc    Get user's applications
 * @access  Private
 * @query   type, status, search, limit, offset, sort, order
 */
router.get('/', authenticate, getUserApplications);

/**
 * @route   GET /api/applications/:id
 * @desc    Get application by ID
 * @access  Private
 */
router.get('/:id', authenticate, getApplicationById);

/**
 * @route   POST /api/applications/:id/comment
 * @desc    Add comment to application (by user)
 * @access  Private
 * @body    comment
 */
router.post('/:id/comment', authenticate, addComment);

module.exports = router;

