const {
  getPlaces,
  getNearbyPlaces,
  getPlaceById,
  getPlaceCategories,
} = require('../services/placeService');

/**
 * Get all places
 * GET /api/places
 */
const getPlacesEndpoint = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      search: req.query.search,
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      radius: req.query.radius,
      limit: req.query.limit,
      offset: req.query.offset,
      sort: req.query.sort,
      order: req.query.order,
    };

    const result = await getPlaces(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get nearby places
 * GET /api/places/nearby
 */
const getNearbyPlacesEndpoint = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5, type, category } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Latitude and longitude are required',
      });
    }

    const filters = {
      type,
      category,
    };

    const result = await getNearbyPlaces(
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
 * Get place by ID
 * GET /api/places/:id
 */
const getPlaceByIdEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.query;

    const place = await getPlaceById(
      id,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null
    );

    res.status(200).json({
      success: true,
      data: {
        place,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get place categories
 * GET /api/places/categories
 */
const getPlaceCategoriesEndpoint = async (req, res, next) => {
  try {
    const categories = await getPlaceCategories();

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlaces: getPlacesEndpoint,
  getNearbyPlaces: getNearbyPlacesEndpoint,
  getPlaceById: getPlaceByIdEndpoint,
  getPlaceCategories: getPlaceCategoriesEndpoint,
};

