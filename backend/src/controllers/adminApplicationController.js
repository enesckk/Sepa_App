const { Application } = require('../models');
const { NotFoundError } = require('../utils/errors');

/**
 * Get all applications (Admin)
 * GET /api/admin/applications
 */
const getApplications = async (req, res, next) => {
  try {
    const {
      type,
      status,
      search,
      limit = 50,
      offset = 0,
      sort = 'created_at',
      order = 'DESC',
    } = req.query;

    const where = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { subject: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { reference_number: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const validSortFields = ['created_at', 'updated_at', 'status'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const applications = await Application.findAndCountAll({
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
        applications: applications.rows,
        total: applications.count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status (Admin)
 * PUT /api/admin/applications/:id/status
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    const application = await Application.findByPk(id);

    if (!application) {
      throw new NotFoundError('Application');
    }

    if (status) {
      application.status = status;
    }

    if (admin_response) {
      application.admin_response = admin_response;
      application.admin_response_date = new Date();
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: { application },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  updateApplicationStatus,
};

