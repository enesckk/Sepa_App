const { Place, sequelize } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');
const { calculateDistance, calculateDistanceInMeters } = require('../utils/distance');

/**
 * Get all places with filters
 * @param {object} filters - Filter options
 * @returns {Promise<Object>} Places list
 */
const getPlaces = async (filters = {}) => {
  const {
    type,
    category,
    search,
    latitude,
    longitude,
    radius, // in kilometers
    limit = 50,
    offset = 0,
    sort = 'name',
    order = 'ASC',
  } = filters;

  const where = {
    is_active: true,
  };

  // Type filter
  if (type) {
    where.type = type;
  }

  // Category filter
  if (category) {
    where.category = category;
  }

  // Search filter
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { address: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Sort options
  const validSortFields = ['name', 'created_at', 'type'];
  const sortField = validSortFields.includes(sort) ? sort : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const places = await Place.findAndCountAll({
    where,
    order: [[sortField, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  // If latitude and longitude provided, calculate distances
  let placesWithDistance = places.rows;
  if (latitude && longitude) {
    placesWithDistance = places.rows.map((place) => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(place.latitude),
        parseFloat(place.longitude)
      );
      return {
        ...place.toJSON(),
        distance: parseFloat(distance.toFixed(2)), // Round to 2 decimal places
        distanceInMeters: Math.round(calculateDistanceInMeters(
          parseFloat(latitude),
          parseFloat(longitude),
          parseFloat(place.latitude),
          parseFloat(place.longitude)
        )),
      };
    });

    // Sort by distance if coordinates provided
    placesWithDistance.sort((a, b) => a.distance - b.distance);

    // Filter by radius if provided
    if (radius) {
      placesWithDistance = placesWithDistance.filter(
        (place) => place.distance <= parseFloat(radius)
      );
    }
  } else {
    placesWithDistance = places.rows.map((place) => place.toJSON());
  }

  return {
    places: placesWithDistance,
    total: places.count,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

/**
 * Get nearby places (within radius)
 * @param {number} latitude - User latitude
 * @param {number} longitude - User longitude
 * @param {number} radius - Radius in kilometers (default: 5)
 * @param {object} filters - Additional filters
 * @returns {Promise<Object>} Nearby places
 */
const getNearbyPlaces = async (latitude, longitude, radius = 5, filters = {}) => {
  if (!latitude || !longitude) {
    throw new ValidationError('Latitude and longitude are required');
  }

  const result = await getPlaces({
    ...filters,
    latitude,
    longitude,
    radius,
    sort: 'distance', // Will be sorted by distance
  });

  return result;
};

/**
 * Get place by ID
 * @param {string} placeId - Place ID
 * @param {number} latitude - Optional: user latitude for distance calculation
 * @param {number} longitude - Optional: user longitude for distance calculation
 * @returns {Promise<Object>} Place
 */
const getPlaceById = async (placeId, latitude = null, longitude = null) => {
  const place = await Place.findByPk(placeId);

  if (!place || !place.is_active) {
    throw new NotFoundError('Place');
  }

  let placeData = place.toJSON();

  // Calculate distance if coordinates provided
  if (latitude && longitude) {
    const distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(place.latitude),
      parseFloat(place.longitude)
    );
    placeData.distance = parseFloat(distance.toFixed(2));
    placeData.distanceInMeters = Math.round(
      calculateDistanceInMeters(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(place.latitude),
        parseFloat(place.longitude)
      )
    );
  }

  return placeData;
};

/**
 * Get place categories
 * @returns {Promise<Array>} List of categories
 */
const getPlaceCategories = async () => {
  const categories = await Place.findAll({
    attributes: [
      [sequelize.fn('DISTINCT', sequelize.col('type')), 'type'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    where: {
      is_active: true,
    },
    group: ['type'],
    raw: true,
  });

  return categories.map((cat) => ({
    type: cat.type,
    count: parseInt(cat.count),
  }));
};

module.exports = {
  getPlaces,
  getNearbyPlaces,
  getPlaceById,
  getPlaceCategories,
};

