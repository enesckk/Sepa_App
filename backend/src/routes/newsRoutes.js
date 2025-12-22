const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsById,
  getNewsCategories,
} = require('../controllers/newsController');

/**
 * @route   GET /api/news
 * @desc    Get all news (with filters)
 * @access  Public
 * @query   category, search, limit, offset, sort, order
 */
router.get('/', getNews);

/**
 * @route   GET /api/news/categories
 * @desc    Get news categories with counts
 * @access  Public
 */
router.get('/categories', getNewsCategories);

/**
 * @route   GET /api/news/:id
 * @desc    Get news by ID (increments view count)
 * @access  Public
 */
router.get('/:id', getNewsById);

module.exports = router;

