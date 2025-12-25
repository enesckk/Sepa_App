const {
  getGatheringAreas,
  getNearbyGatheringAreas,
  getGatheringAreaById,
  createGatheringArea,
  updateGatheringArea,
  deleteGatheringArea,
} = require('../services/emergencyGatheringService');

/**
 * Get all emergency gathering areas
 * GET /api/emergency-gathering
 */
const getGatheringAreasEndpoint = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      search: req.query.search,
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      radius: req.query.radius,
      limit: req.query.limit,
      offset: req.query.offset,
      sort: req.query.sort,
      order: req.query.order,
    };

    const result = await getGatheringAreas(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get nearby gathering areas
 * GET /api/emergency-gathering/nearby
 */
const getNearbyGatheringAreasEndpoint = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 10, type } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Latitude and longitude are required',
      });
    }

    const filters = {
      type,
    };

    const result = await getNearbyGatheringAreas(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radius),
      filters
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get gathering area by ID
 * GET /api/emergency-gathering/:id
 */
const getGatheringAreaByIdEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.query;

    const area = await getGatheringAreaById(
      id,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null
    );

    res.status(200).json({
      success: true,
      data: {
        area,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create emergency gathering area (Admin)
 * POST /api/admin/emergency-gathering
 */
const createGatheringAreaEndpoint = async (req, res, next) => {
  try {
    const area = await createGatheringArea(req.body);

    res.status(201).json({
      success: true,
      data: {
        area,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update emergency gathering area (Admin)
 * PUT /api/admin/emergency-gathering/:id
 */
const updateGatheringAreaEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const area = await updateGatheringArea(id, req.body);

    res.status(200).json({
      success: true,
      data: {
        area,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete emergency gathering area (Admin)
 * DELETE /api/admin/emergency-gathering/:id
 */
const deleteGatheringAreaEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteGatheringArea(id);

    res.status(200).json({
      success: true,
      message: 'Emergency gathering area deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGatheringAreas: getGatheringAreasEndpoint,
  getNearbyGatheringAreas: getNearbyGatheringAreasEndpoint,
  getGatheringAreaById: getGatheringAreaByIdEndpoint,
  createGatheringArea: createGatheringAreaEndpoint,
  updateGatheringArea: updateGatheringAreaEndpoint,
  deleteGatheringArea: deleteGatheringAreaEndpoint,
};

