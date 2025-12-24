const { BillSupport, BillSupportTransaction, User } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { deductGolbucks } = require('./golbucksService');

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
    supported_amount: 0,
    supported_by_count: 0,
    is_public: true,
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

/**
 * Get public bill supports (visible to all users for support)
 * @param {object} filters - Filter options
 * @returns {Promise<Object>} Public bill supports
 */
const getPublicBillSupports = async (filters = {}) => {
  const {
    bill_type,
    status = 'pending',
    search,
    limit = 50,
    offset = 0,
    sort = 'created_at',
    order = 'DESC',
  } = filters;

  const where = {
    is_public: true,
    status: status,
  };

  // Bill type filter
  if (bill_type) {
    where.bill_type = bill_type;
  }

  // Search filter
  if (search) {
    where[Op.or] = [
      { description: { [Op.iLike]: `%${search}%` } },
      { reference_number: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Sort options
  const validSortFields = ['created_at', 'updated_at', 'amount', 'supported_amount', 'supported_by_count'];
  const sortField = validSortFields.includes(sort) ? sort : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const billSupports = await BillSupport.findAndCountAll({
    where,
    order: [[sortField, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'mahalle'],
      },
      {
        model: BillSupportTransaction,
        as: 'transactions',
        attributes: ['id', 'amount', 'created_at'],
        include: [
          {
            model: User,
            as: 'supporter',
            attributes: ['id', 'name'],
          },
        ],
        required: false,
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
 * Support a bill (contribute money to someone's bill)
 * @param {string} billSupportId - Bill support ID
 * @param {string} supporterId - User ID who is supporting
 * @param {object} supportData - Support data (amount, payment_method, notes)
 * @returns {Promise<Object>} Created transaction
 */
const supportBillSupport = async (billSupportId, supporterId, supportData) => {
  const { amount, payment_method = 'direct', notes } = supportData;

  // Validate amount
  if (!amount || amount <= 0) {
    throw new ValidationError('Support amount must be greater than 0');
  }

  // Use a database transaction to ensure atomicity
  return await sequelize.transaction(async (t) => {
    // Get bill support with lock to prevent race conditions
    const billSupport = await BillSupport.findByPk(billSupportId, {
      lock: t.LOCK.UPDATE,
      transaction: t,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!billSupport) {
      throw new NotFoundError('Bill support');
    }

    // Check if bill is public and pending
    if (!billSupport.is_public) {
      throw new ValidationError('This bill is not available for public support');
    }

    if (billSupport.status !== 'pending') {
      throw new ValidationError('This bill is no longer accepting support');
    }

    // Check if user is trying to support their own bill
    if (billSupport.user_id === supporterId) {
      throw new ValidationError('You cannot support your own bill');
    }

    // Check if user already supported this bill
    const existingTransaction = await BillSupportTransaction.findOne({
      where: {
        bill_support_id: billSupportId,
        supporter_id: supporterId,
      },
      transaction: t,
    });

    if (existingTransaction) {
      throw new ValidationError('You have already supported this bill');
    }

    // Check if remaining amount is sufficient
    const remainingAmount = parseFloat(billSupport.amount) - parseFloat(billSupport.supported_amount || 0);
    if (parseFloat(amount) > remainingAmount) {
      throw new ValidationError(`Maximum support amount is ${remainingAmount.toFixed(2)} ₺`);
    }

    // Handle payment method - deduct golbucks within the same transaction
    if (payment_method === 'golbucks') {
      const golbucksNeeded = Math.ceil(parseFloat(amount));
      
      // Deduct golbucks within the same transaction
      await deductGolbucks(
        supporterId,
        golbucksNeeded,
        'bill_support',
        `Bill support contribution: ${billSupport.reference_number || billSupportId}`,
        { billSupportId: billSupport.id },
        t // Pass the transaction
      );
    }

    // Create bill support transaction
    const billSupportTransaction = await BillSupportTransaction.create(
      {
        bill_support_id: billSupportId,
        supporter_id: supporterId,
        amount: parseFloat(amount),
        payment_method,
        status: payment_method === 'golbucks' ? 'completed' : 'completed',
        notes: notes || null,
      },
      { transaction: t }
    );

    // Update bill support totals
    const newSupportedAmount = parseFloat(billSupport.supported_amount || 0) + parseFloat(amount);
    const newSupportedByCount = (billSupport.supported_by_count || 0) + 1;

    await billSupport.update(
      {
        supported_amount: newSupportedAmount,
        supported_by_count: newSupportedByCount,
        // If fully supported, update status to approved
        status: newSupportedAmount >= parseFloat(billSupport.amount) ? 'approved' : billSupport.status,
      },
      { transaction: t }
    );

    // Reload transaction with associations
    await billSupportTransaction.reload({
      include: [
        {
          model: BillSupport,
          as: 'billSupport',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: User,
          as: 'supporter',
          attributes: ['id', 'name'],
        },
      ],
      transaction: t,
    });

    return billSupportTransaction;
  });
};

module.exports = {
  createBillSupport,
  getUserBillSupports,
  getBillSupportById,
  getPublicBillSupports,
  supportBillSupport,
  generateReferenceNumber,
};

