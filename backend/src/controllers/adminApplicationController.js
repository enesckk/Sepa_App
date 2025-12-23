const { Application, User } = require('../models');
const { NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');
const notificationService = require('../services/notificationService');

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
          model: User,
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

    // Reload application with user data
    await application.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // Send push notification to user about status change
    try {
      const statusMessages = {
        pending: 'Başvurunuz alındı ve inceleniyor',
        in_progress: 'Başvurunuz işleme alındı',
        completed: 'Başvurunuz tamamlandı',
        rejected: 'Başvurunuz reddedildi',
      };

      await notificationService.createNotification({
        user_id: application.user_id,
        title: 'Başvuru Durumu Güncellendi',
        message: statusMessages[status] || `Başvurunuzun durumu "${status}" olarak güncellendi`,
        type: 'application',
        data: {
          application_id: application.id,
          reference_number: application.reference_number,
          status: status,
        },
        action_url: `/applications/${application.id}`,
      });
    } catch (error) {
      console.error('Push notification error for application status:', error.message);
    }

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

