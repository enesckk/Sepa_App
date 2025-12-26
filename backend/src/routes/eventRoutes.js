const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  registerForEvent,
  cancelEventRegistration,
  getMyRegistrations,
} = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/events
 * @desc    Get all events (with filters)
 * @access  Public
 * @query   category, date_from, date_to, is_free, search, limit, offset, sort, order
 */
router.get('/', getEvents);

/**
 * @route   GET /api/events/my-registrations
 * @desc    Get user's event registrations
 * @access  Private
 * @query   status, limit, offset
 */
router.get('/my-registrations', authenticate, getMyRegistrations);

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Public
 */
router.get('/:id', getEventById);

/**
 * @route   POST /api/events/:id/register
 * @desc    Register for an event
 * @access  Private
 */
router.post('/:id/register', authenticate, registerForEvent);

/**
 * @route   DELETE /api/events/:id/register
 * @desc    Cancel event registration
 * @access  Private
 */
router.delete('/:id/register', authenticate, cancelEventRegistration);

module.exports = router;

