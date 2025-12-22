const { Event, EventRegistration } = require('../models');
const { addGolbucks } = require('./golbucksService');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');

/**
 * Register user for an event
 * @param {string} userId - User ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} Registration result
 */
const registerForEvent = async (userId, eventId) => {
  const transaction = await sequelize.transaction();

  try {
    // Get event with lock
    const event = await Event.findByPk(eventId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!event) {
      throw new NotFoundError('Event');
    }

    if (!event.is_active) {
      throw new ValidationError('Event is not active');
    }

    // Check if event date has passed
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
      throw new ValidationError('Event date has passed');
    }

    // Check if user already registered
    const existingRegistration = await EventRegistration.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        status: {
          [Op.in]: ['registered', 'attended'],
        },
      },
      transaction,
    });

    if (existingRegistration) {
      throw new ValidationError('User already registered for this event');
    }

    // Check capacity
    if (event.capacity !== null && event.registered >= event.capacity) {
      throw new ValidationError('Event is full');
    }

    // Generate QR code and reference code
    const qrCode = `EVENT-${uuidv4()}`;
    const referenceCode = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create registration
    const registration = await EventRegistration.create(
      {
        user_id: userId,
        event_id: eventId,
        qr_code: qrCode,
        reference_code: referenceCode,
        status: 'registered',
      },
      { transaction }
    );

    // Update event registered count
    await event.update(
      {
        registered: event.registered + 1,
      },
      { transaction }
    );

    // Add golbucks reward if applicable
    let golbucksResult = null;
    if (event.golbucks_reward > 0) {
      golbucksResult = await addGolbucks(
        userId,
        event.golbucks_reward,
        'event_registration',
        `Etkinlik kaydı: ${event.title}`,
        { event_id: eventId, registration_id: registration.id },
        transaction
      );
    }

    await transaction.commit();

    // Reload registration with associations
    await registration.reload({
      include: [
        {
          model: Event,
          as: 'event',
        },
      ],
    });

    return {
      success: true,
      registration,
      golbucksReward: event.golbucks_reward,
      newBalance: golbucksResult ? golbucksResult.newBalance : null,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Cancel event registration
 * @param {string} userId - User ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} Cancellation result
 */
const cancelRegistration = async (userId, eventId) => {
  const transaction = await sequelize.transaction();

  try {
    // Get registration
    const registration = await EventRegistration.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        status: 'registered',
      },
      include: [
        {
          model: Event,
          as: 'event',
        },
      ],
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!registration) {
      throw new NotFoundError('Event registration');
    }

    // Check if event date has passed (can't cancel after event)
    const eventDate = new Date(registration.event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
      throw new ValidationError('Cannot cancel registration after event date');
    }

    // Update registration status
    await registration.update(
      {
        status: 'cancelled',
        cancelled_at: new Date(),
      },
      { transaction }
    );

    // Update event registered count
    const event = await Event.findByPk(eventId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (event) {
      await event.update(
        {
          registered: Math.max(0, event.registered - 1),
        },
        { transaction }
      );
    }

    await transaction.commit();

    return {
      success: true,
      message: 'Registration cancelled successfully',
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get user's event registrations
 * @param {string} userId - User ID
 * @param {string} status - Filter by status (optional)
 * @param {number} limit - Limit results
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} User registrations
 */
const getUserRegistrations = async (userId, status = null, limit = 50, offset = 0) => {
  const where = {
    user_id: userId,
  };

  if (status) {
    where.status = status;
  }

  const registrations = await EventRegistration.findAndCountAll({
    where,
    include: [
      {
        model: Event,
        as: 'event',
      },
    ],
    order: [['registration_date', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return {
    registrations: registrations.rows,
    total: registrations.count,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

/**
 * Check if user is registered for event
 * @param {string} userId - User ID
 * @param {string} eventId - Event ID
 * @returns {Promise<boolean>} True if registered
 */
const isUserRegistered = async (userId, eventId) => {
  const registration = await EventRegistration.findOne({
    where: {
      user_id: userId,
      event_id: eventId,
      status: {
        [Op.in]: ['registered', 'attended'],
      },
    },
  });

  return !!registration;
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getUserRegistrations,
  isUserRegistered,
};

