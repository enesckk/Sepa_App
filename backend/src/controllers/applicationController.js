const {
  createApplication,
  getUserApplications,
  getApplicationById,
} = require('../services/applicationService');
const { ValidationError } = require('../utils/errors');
const path = require('path');

/**
 * Create application
 * POST /api/applications
 */
const createApplicationEndpoint = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { type, subject, description, location, latitude, longitude } = req.body;

    // Get uploaded file path if exists
    let image_url = null;
    if (req.file) {
      // File path relative to uploads directory
      image_url = `/uploads/applications/${req.file.filename}`;
    }

    const applicationData = {
      type,
      subject,
      description,
      image_url,
      location,
      latitude,
      longitude,
    };

    const application = await createApplication(userId, applicationData);

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: {
        application,
      },
    });
  } catch (error) {
    // Delete uploaded file if application creation failed
    if (req.file) {
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/applications', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

/**
 * Get user's applications
 * GET /api/applications
 */
const getUserApplicationsEndpoint = async (req, res, next) => {
  try {
    const userId = req.userId;
    const filters = {
      type: req.query.type,
      status: req.query.status,
      search: req.query.search,
      limit: req.query.limit,
      offset: req.query.offset,
      sort: req.query.sort,
      order: req.query.order,
    };

    const result = await getUserApplications(userId, filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get application by ID
 * GET /api/applications/:id
 */
const getApplicationByIdEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const application = await getApplicationById(id, userId);

    res.status(200).json({
      success: true,
      data: {
        application,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication: createApplicationEndpoint,
  getUserApplications: getUserApplicationsEndpoint,
  getApplicationById: getApplicationByIdEndpoint,
};

