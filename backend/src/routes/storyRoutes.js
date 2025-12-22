const express = require('express');
const router = express.Router();
const {
  getStories,
  getStoryById,
  viewStory,
  createStory,
  updateStory,
  deleteStory,
} = require('../controllers/storyController');
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../config/multer');

/**
 * @route   GET /api/stories
 * @desc    Get all active stories (public, but can check if user viewed)
 * @access  Public (optional auth to check viewed status)
 */
router.get('/', getStories);

/**
 * @route   GET /api/stories/:id
 * @desc    Get story by ID
 * @access  Public
 */
router.get('/:id', getStoryById);

/**
 * @route   POST /api/stories/:id/view
 * @desc    Record story view
 * @access  Private
 */
router.post('/:id/view', authenticate, viewStory);

/**
 * @route   POST /api/stories
 * @desc    Create story (Admin only - will add admin middleware later)
 * @access  Private (Admin)
 * @body    title, description, expires_at, order
 * @file    image (optional, or use image_url)
 */
router.post(
  '/',
  authenticate,
  uploadSingle('image'),
  createStory
);

/**
 * @route   PUT /api/stories/:id
 * @desc    Update story (Admin only)
 * @access  Private (Admin)
 * @body    title, description, image_url, expires_at, order, is_active
 * @file    image (optional)
 */
router.put(
  '/:id',
  authenticate,
  uploadSingle('image'),
  updateStory
);

/**
 * @route   DELETE /api/stories/:id
 * @desc    Delete story (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, deleteStory);

module.exports = router;

