const express = require('express');
const router = express.Router();
const {
  getGatheringAreas,
  getNearbyGatheringAreas,
  getGatheringAreaById,
} = require('../controllers/emergencyGatheringController');

/**
 * @route   GET /api/emergency-gathering
 * @desc    Get all emergency gathering areas (with filters)
 * @access  Public
 * @query   type, search, latitude, longitude, radius, limit, offset, sort, order
 */
router.get('/', getGatheringAreas);

/**
 * @route   GET /api/emergency-gathering/nearby
 * @desc    Get nearby gathering areas (within radius)
 * @access  Public
 * @query   latitude, longitude, radius (default: 10km), type
 */
router.get('/nearby', getNearbyGatheringAreas);

/**
 * @route   GET /api/emergency-gathering/:id
 * @desc    Get gathering area by ID
 * @access  Public
 * @query   latitude, longitude (optional, for distance calculation)
 */
router.get('/:id', getGatheringAreaById);

module.exports = router;

