const { BillSupport } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Generate unique reference number for bill support
 * Format: BILL-YYYYMMDD-XXXXX
 */
const generateReferenceNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `BILL-${dateStr}-${random}`;
};

/**
 * Create bill support request
 * @param {string} userId - User ID
 * @param {object} billData - Bill support data
 * @returns {Promise<Object>} Created bill support
 */
const createBillSupport = async (userId, billData) => {
  const { bill_type, amount, description, image_url } = billData;

  // Validate required fields
  if (!bill_type || amount === undefined || amount === null) {
    throw new ValidationError('Bill type and amount are required');
  }

  if (amount < 0) {
    throw new ValidationError('Amount must be positive');
  }

  // Generate reference number
  let referenceNumber = generateReferenceNumber();
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  // Ensure unique reference number
  while (!isUnique && attempts < maxAttempts) {
    const existing = await BillSupport.findOne({
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

  // Create bill support
  const billSupport = await BillSupport.create({
    user_id: userId,
    bill_type,
    amount: parseFloat(amount),
    description: description || null,
    image_url: image_url || null,
    status: 'pending',
    reference_number: referenceNumber,
  });

  // Reload with user association
  await billSupport.reload({
    include: [
      {
        model: require('../models').User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone'],
      },
    ],
  });

  return billSupport;
};

/**
 * Get user's bill supports
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<Object>} User bill supports
 */
const getUserBillSupports = async (userId, filters = {}) => {
  const {
    bill_type,
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

  // Bill type filter
  if (bill_type) {
    where.bill_type = bill_type;
  }

  // Status filter
  if (status) {
    where.status = status;
  }

  // Search filter
  if (search) {
    where[Op.or] = [
      { description: { [Op.iLike]: `%${search}%` } },
      { reference_number: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Sort options
  const validSortFields = ['created_at', 'updated_at', 'amount', 'status'];
  const sortField = validSortFields.includes(sort) ? sort : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const billSupports = await BillSupport.findAndCountAll({
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
    billSupports: billSupports.rows,
    total: billSupports.count,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

/**
 * Get bill support by ID
 * @param {string} billSupportId - Bill support ID
 * @param {string} userId - User ID (optional, for authorization)
 * @returns {Promise<Object>} Bill support
 */
const getBillSupportById = async (billSupportId, userId = null) => {
  const where = { id: billSupportId };

  // If userId provided, ensure user owns the bill support
  if (userId) {
    where.user_id = userId;
  }

  const billSupport = await BillSupport.findOne({
    where,
    include: [
      {
        model: require('../models').User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'mahalle'],
      },
    ],
  });

  if (!billSupport) {
    throw new NotFoundError('Bill support');
  }

  return billSupport;
};

module.exports = {
  createBillSupport,
  getUserBillSupports,
  getBillSupportById,
  generateReferenceNumber,
};

