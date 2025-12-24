const {
  createBillSupport,
  getUserBillSupports,
  getBillSupportById,
  getPublicBillSupports,
  supportBillSupport,
} = require('../services/billSupportService');
const path = require('path');

/**
 * Create bill support request
 * POST /api/bill-supports
 */
const createBillSupportEndpoint = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { bill_type, amount, description } = req.body;

    // Get uploaded file path if exists
    let image_url = null;
    if (req.file) {
      // File path relative to uploads directory
      image_url = `/uploads/bills/${req.file.filename}`;
    }

    const billData = {
      bill_type,
      amount,
      description,
      image_url,
    };

    const billSupport = await createBillSupport(userId, billData);

    res.status(201).json({
      success: true,
      message: 'Bill support request created successfully',
      data: {
        billSupport,
      },
    });
  } catch (error) {
    // Delete uploaded file if bill support creation failed
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/bills', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Get user's bill supports
 * GET /api/bill-supports
 */
const getUserBillSupportsEndpoint = async (req, res, next) => {
  try {
    const userId = req.userId;
    const filters = {
      bill_type: req.query.bill_type,
      status: req.query.status,
      search: req.query.search,
      limit: req.query.limit,
      offset: req.query.offset,
      sort: req.query.sort,
      order: req.query.order,
    };

    const result = await getUserBillSupports(userId, filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get bill support by ID
 * GET /api/bill-supports/:id
 */
const getBillSupportByIdEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const billSupport = await getBillSupportById(id, userId);

    res.status(200).json({
      success: true,
      data: {
        billSupport,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get public bill supports (for support tab)
 * GET /api/bill-supports/public
 */
const getPublicBillSupportsEndpoint = async (req, res, next) => {
  try {
    const filters = {
      bill_type: req.query.bill_type,
      status: req.query.status || 'pending',
      search: req.query.search,
      limit: req.query.limit,
      offset: req.query.offset,
      sort: req.query.sort,
      order: req.query.order,
    };

    const result = await getPublicBillSupports(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Support a bill
 * POST /api/bill-supports/:id/support
 */
const supportBillSupportEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supporterId = req.userId;
    const { amount, payment_method = 'direct', notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Support amount is required and must be greater than 0',
      });
    }

    // supportBillSupport now handles golbucks deduction internally within a transaction
    const transaction = await supportBillSupport(id, supporterId, {
      amount,
      payment_method,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Bill supported successfully',
      data: {
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBillSupport: createBillSupportEndpoint,
  getUserBillSupports: getUserBillSupportsEndpoint,
  getBillSupportById: getBillSupportByIdEndpoint,
  getPublicBillSupports: getPublicBillSupportsEndpoint,
  supportBillSupport: supportBillSupportEndpoint,
};

