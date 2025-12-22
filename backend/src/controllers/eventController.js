const { Event, EventRegistration } = require('../models');
const {
  registerForEvent,
  cancelRegistration,
  getUserRegistrations,
  isUserRegistered,
} = require('../services/eventService');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Get all events
 * GET /api/events
 */
const getEvents = async (req, res, next) => {
  try {
    const {
      category,
      date_from,
      date_to,
      is_free,
      search,
      limit = 50,
      offset = 0,
      sort = 'date',
      order = 'ASC',
    } = req.query;

    const where = {
      is_active: true,
    };

    // Category filter
    if (category) {
      where.category = category;
    }

    // Date range filter
    if (date_from || date_to) {
      where.date = {};
      if (date_from) {
        where.date[Op.gte] = date_from;
      }
      if (date_to) {
        where.date[Op.lte] = date_to;
      }
    } else {
      // Default: only future events
      where.date = {
        [Op.gte]: new Date().toISOString().split('T')[0],
      };
    }

    // Free events filter
    if (is_free !== undefined) {
      where.is_free = is_free === 'true';
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Sort options
    const validSortFields = ['date', 'title', 'created_at', 'registered'];
    const sortField = validSortFields.includes(sort) ? sort : 'date';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const events = await Event.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: {
        events: events.rows,
        total: events.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get event by ID
 * GET /api/events/:id
 */
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId || null; // Optional: to check if user is registered

    const event = await Event.findByPk(id, {
      include: [
        {
          model: EventRegistration,
          as: 'registrations',
          attributes: ['id', 'status', 'registration_date'],
          required: false,
        },
      ],
    });

    if (!event || !event.is_active) {
      throw new NotFoundError('Event');
    }

    // Check if user is registered (if authenticated)
    let userRegistered = false;
    if (userId) {
      userRegistered = await isUserRegistered(userId, id);
    }

    // Calculate available spots
    const availableSpots =
      event.capacity !== null ? event.capacity - event.registered : null;

    res.status(200).json({
      success: true,
      data: {
        event: {
          ...event.toJSON(),
          availableSpots,
          isRegistered: userRegistered,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register for event
 * POST /api/events/:id/register
 */
const registerForEventEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await registerForEvent(userId, id);

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      data: {
        registration: result.registration,
        golbucksReward: result.golbucksReward,
        newBalance: result.newBalance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel event registration
 * DELETE /api/events/:id/register
 */
const cancelEventRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await cancelRegistration(userId, id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's event registrations
 * GET /api/events/my-registrations
 */
const getMyRegistrations = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { status, limit = 50, offset = 0 } = req.query;

    const result = await getUserRegistrations(userId, status, limit, offset);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  registerForEvent: registerForEventEndpoint,
  cancelEventRegistration,
  getMyRegistrations,
};

