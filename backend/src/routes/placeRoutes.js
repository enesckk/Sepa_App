const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getNearbyPlaces,
  getPlaceById,
  getPlaceCategories,
} = require('../controllers/placeController');

/**
 * @route   GET /api/places
 * @desc    Get all places (with filters)
 * @access  Public
 * @query   type, category, search, latitude, longitude, radius, limit, offset, sort, order
 */
router.get('/', getPlaces);

/**
 * @route   GET /api/places/nearby
 * @desc    Get nearby places (within radius)
 * @access  Public
 * @query   latitude, longitude, radius (default: 5km), type, category
 */
router.get('/nearby', getNearbyPlaces);

/**
 * @route   GET /api/places/categories
 * @desc    Get place categories with counts
 * @access  Public
 */
router.get('/categories', getPlaceCategories);

/**
 * @route   GET /api/places/:id
 * @desc    Get place by ID
 * @access  Public
 * @query   latitude, longitude (optional, for distance calculation)
 */
router.get('/:id', getPlaceById);

module.exports = router;

