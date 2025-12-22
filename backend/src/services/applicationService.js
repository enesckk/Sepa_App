const { Application } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique reference number
 * Format: APP-YYYYMMDD-XXXXX
 */
const generateReferenceNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `APP-${dateStr}-${random}`;
};

/**
 * Create application
 * @param {string} userId - User ID
 * @param {object} applicationData - Application data
 * @returns {Promise<Object>} Created application
 */
const createApplication = async (userId, applicationData) => {
  const {
    type,
    subject,
    description,
    image_url,
    location,
    latitude,
    longitude,
  } = applicationData;

  // Validate required fields
  if (!type || !subject || !description) {
    throw new ValidationError('Type, subject, and description are required');
  }

  // Generate reference number
  let referenceNumber = generateReferenceNumber();
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  // Ensure unique reference number
  while (!isUnique && attempts < maxAttempts) {
    const existing = await Application.findOne({
      where: { reference_number: referenceNumber },
    });
    if (!existing) {
      isUnique = true;
    } else {
      referenceNumber = generateReferenceNumber();
      attempts++;
    }
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique reference number');
  }

  // Create application
  const application = await Application.create({
    user_id: userId,
    type,
    subject,
    description,
    image_url: image_url || null,
    location: location || null,
    latitude: latitude ? parseFloat(latitude) : null,
    longitude: longitude ? parseFloat(longitude) : null,
    status: 'pending',
    reference_number: referenceNumber,
  });

  // Reload with user association
  await application.reload({
    include: [
      {
        model: require('../models').User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone'],
      },
    ],
  });

  return application;
};

/**
 * Get user's applications
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<Object>} User applications
 */
const getUserApplications = async (userId, filters = {}) => {
  const {
    type,
    status,
    search,
    limit = 50,
    offset = 0,
    sort = 'created_at',
    order = 'DESC',
  } = filters;

  const where = {
    user_id: userId,
  };

  // Type filter
  if (type) {
    where.type = type;
  }

  // Status filter
  if (status) {
    where.status = status;
  }

  // Search filter
  if (search) {
    where[Op.or] = [
      { subject: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { reference_number: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Sort options
  const validSortFields = ['created_at', 'updated_at', 'subject', 'status'];
  const sortField = validSortFields.includes(sort) ? sort : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const applications = await Application.findAndCountAll({
    where,
    order: [[sortField, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      {
        model: require('../models').User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });

  return {
    applications: applications.rows,
    total: applications.count,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

/**
 * Get application by ID
 * @param {string} applicationId - Application ID
 * @param {string} userId - User ID (optional, for authorization)
 * @returns {Promise<Object>} Application
 */
const getApplicationById = async (applicationId, userId = null) => {
  const where = { id: applicationId };

  // If userId provided, ensure user owns the application
  if (userId) {
    where.user_id = userId;
  }

  const application = await Application.findOne({
    where,
    include: [
      {
        model: require('../models').User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'mahalle'],
      },
    ],
  });

  if (!application) {
    throw new NotFoundError('Application');
  }

  return application;
};

module.exports = {
  createApplication,
  getUserApplications,
  getApplicationById,
  generateReferenceNumber,
};

