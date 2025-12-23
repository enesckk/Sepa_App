const { Event, EventRegistration } = require('../models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { Op } = require('sequelize');
const path = require('path');
const pushNotificationService = require('../services/pushNotificationService');

/**
 * Create event (Admin)
 * POST /api/admin/events
 */
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      latitude,
      longitude,
      category,
      is_free,
      price,
      capacity,
      golbucks_reward,
    } = req.body;

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/events/${req.file.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      category,
      is_free: is_free !== undefined ? is_free : false,
      price: price ? parseFloat(price) : null,
      capacity: capacity ? parseInt(capacity) : null,
      golbucks_reward: golbucks_reward ? parseInt(golbucks_reward) : 0,
      image_url,
      is_active: true,
      registered: 0,
    });

    // Send push notification to all users about new event
    try {
      await pushNotificationService.sendToAllUsers(
        {
          title: 'Yeni Etkinlik! 🎉',
          body: `${event.title} - ${new Date(event.date).toLocaleDateString('tr-TR')}`,
        },
        {
          type: 'event',
          event_id: event.id,
          action_url: `/events/${event.id}`,
        }
      );
    } catch (error) {
      console.error('Push notification error for new event:', error.message);
    }

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event },
    });
  } catch (error) {
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/events', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Update event (Admin)
 * PUT /api/admin/events/:id
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const event = await Event.findByPk(id);

    if (!event) {
      throw new NotFoundError('Event');
    }

    // Handle image upload
    if (req.file) {
      updateData.image_url = `/uploads/events/${req.file.filename}`;
    }

    // Parse numeric fields
    if (updateData.latitude) updateData.latitude = parseFloat(updateData.latitude);
    if (updateData.longitude) updateData.longitude = parseFloat(updateData.longitude);
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.capacity) updateData.capacity = parseInt(updateData.capacity);
    if (updateData.golbucks_reward) updateData.golbucks_reward = parseInt(updateData.golbucks_reward);

    await event.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: { event },
    });
  } catch (error) {
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/events', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Delete event (Admin)
 * DELETE /api/admin/events/:id
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      throw new NotFoundError('Event');
    }

    // Check if there are registrations
    const registrationsCount = await EventRegistration.count({
      where: { event_id: id, status: 'registered' },
    });

    if (registrationsCount > 0) {
      throw new ValidationError(
        `Cannot delete event with ${registrationsCount} active registrations`
      );
    }

    await event.destroy();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get event registrations (Admin)
 * GET /api/admin/events/:id/registrations
 */
const getEventRegistrations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    const event = await Event.findByPk(id);

    if (!event) {
      throw new NotFoundError('Event');
    }

    const where = { event_id: id };
    if (status) {
      where.status = status;
    }

    const registrations = await EventRegistration.findAndCountAll({
      where,
      include: [
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
      order: [['registration_date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: {
        event: {
          id: event.id,
          title: event.title,
          capacity: event.capacity,
          registered: event.registered,
        },
        registrations: registrations.rows,
        total: registrations.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
};

