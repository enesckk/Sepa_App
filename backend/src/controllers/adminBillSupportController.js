const { BillSupport } = require('../models');
const { NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Get all bill supports (Admin)
 * GET /api/admin/bill-supports
 */
const getBillSupports = async (req, res, next) => {
  try {
    const {
      bill_type,
      status,
      search,
      limit = 50,
      offset = 0,
      sort = 'created_at',
      order = 'DESC',
    } = req.query;

    const where = {};

    if (bill_type) {
      where.bill_type = bill_type;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { description: { [Op.iLike]: `%${search}%` } },
        { reference_number: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const validSortFields = ['created_at', 'updated_at', 'amount', 'status'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const billSupports = await BillSupport.findAndCountAll({
      where,
      include: [
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
      order: [[sortField, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: {
        billSupports: billSupports.rows,
        total: billSupports.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update bill support status (Admin)
 * PUT /api/admin/bill-supports/:id/status
 */
const updateBillSupportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    const billSupport = await BillSupport.findByPk(id);

    if (!billSupport) {
      throw new NotFoundError('Bill support');
    }

    if (status) {
      billSupport.status = status;
    }

    if (admin_response) {
      billSupport.admin_response = admin_response;
      billSupport.admin_response_date = new Date();
    }

    await billSupport.save();

    res.status(200).json({
      success: true,
      message: 'Bill support status updated successfully',
      data: { billSupport },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBillSupports,
  updateBillSupportStatus,
};

