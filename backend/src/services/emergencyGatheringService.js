const { EmergencyGathering } = require('../models');
const { ValidationError, NotFoundError } = require('../utils/errors');
const { calculateDistance, calculateDistanceInMeters } = require('../utils/distance');
const { Op } = require('sequelize');

/**
 * Get all emergency gathering areas
 * @param {object} filters - Filter options
 * @returns {Promise<Object>} Gathering areas list
 */
const getGatheringAreas = async (filters = {}) => {
  const {
    type,
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

  const areas = await EmergencyGathering.findAndCountAll({
    where,
    order: [[sortField, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  // If latitude and longitude provided, calculate distances
  let areasWithDistance = areas.rows;
  if (latitude && longitude) {
    areasWithDistance = areas.rows.map((area) => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(area.latitude),
        parseFloat(area.longitude)
      );
      return {
        ...area.toJSON(),
        distance: parseFloat(distance.toFixed(2)), // Round to 2 decimal places
        distanceInMeters: Math.round(
          calculateDistanceInMeters(
            parseFloat(latitude),
            parseFloat(longitude),
            parseFloat(area.latitude),
            parseFloat(area.longitude)
          )
        ),
      };
    });

    // Sort by distance if coordinates provided
    areasWithDistance.sort((a, b) => a.distance - b.distance);

    // Filter by radius if provided
    if (radius) {
      areasWithDistance = areasWithDistance.filter(
        (area) => area.distance <= parseFloat(radius)
      );
    }
  } else {
    areasWithDistance = areas.rows.map((area) => area.toJSON());
  }

  return {
    areas: areasWithDistance,
    total: areas.count,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};

/**
 * Get nearby gathering areas (within radius)
 * @param {number} latitude - User latitude
 * @param {number} longitude - User longitude
 * @param {number} radius - Radius in kilometers (default: 10)
 * @param {object} filters - Additional filters
 * @returns {Promise<Object>} Nearby gathering areas
 */
const getNearbyGatheringAreas = async (latitude, longitude, radius = 10, filters = {}) => {
  if (!latitude || !longitude) {
    throw new ValidationError('Latitude and longitude are required');
  }

  const result = await getGatheringAreas({
    ...filters,
    latitude,
    longitude,
    radius,
    sort: 'distance', // Will be sorted by distance
  });

  return result;
};

/**
 * Get gathering area by ID
 * @param {string} areaId - Area ID
 * @param {number} latitude - Optional: user latitude for distance calculation
 * @param {number} longitude - Optional: user longitude for distance calculation
 * @returns {Promise<Object>} Gathering area
 */
const getGatheringAreaById = async (areaId, latitude = null, longitude = null) => {
  const area = await EmergencyGathering.findByPk(areaId);

  if (!area || !area.is_active) {
    throw new NotFoundError('Emergency gathering area');
  }

  let areaData = area.toJSON();

  // Calculate distance if coordinates provided
  if (latitude && longitude) {
    const distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(area.latitude),
      parseFloat(area.longitude)
    );
    areaData.distance = parseFloat(distance.toFixed(2));
    areaData.distanceInMeters = Math.round(
      calculateDistanceInMeters(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(area.latitude),
        parseFloat(area.longitude)
      )
    );
  }

  return areaData;
};

/**
 * Create emergency gathering area (Admin)
 * @param {object} data - Area data
 * @returns {Promise<Object>} Created area
 */
const createGatheringArea = async (data) => {
  const {
    name,
    description,
    address,
    latitude,
    longitude,
    type,
    capacity,
    contact_phone,
    facilities = [],
    is_active = true,
  } = data;

  if (!name || !address) {
    throw new ValidationError('Name and address are required');
  }

  if (latitude === undefined || longitude === undefined) {
    throw new ValidationError('Latitude and longitude are required');
  }

  const area = await EmergencyGathering.create({
    name,
    description,
    address,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    type: type || 'open_area',
    capacity: capacity ? parseInt(capacity) : null,
    contact_phone,
    facilities: Array.isArray(facilities) ? facilities : [],
    is_active,
  });

  return area.toJSON();
};

/**
 * Update emergency gathering area (Admin)
 * @param {string} areaId - Area ID
 * @param {object} data - Update data
 * @returns {Promise<Object>} Updated area
 */
const updateGatheringArea = async (areaId, data) => {
  const area = await EmergencyGathering.findByPk(areaId);

  if (!area) {
    throw new NotFoundError('Emergency gathering area');
  }

  const {
    name,
    description,
    address,
    latitude,
    longitude,
    type,
    capacity,
    contact_phone,
    facilities,
    is_active,
  } = data;

  if (name !== undefined) area.name = name;
  if (description !== undefined) area.description = description;
  if (address !== undefined) area.address = address;
  if (latitude !== undefined) area.latitude = parseFloat(latitude);
  if (longitude !== undefined) area.longitude = parseFloat(longitude);
  if (type !== undefined) area.type = type;
  if (capacity !== undefined) area.capacity = capacity ? parseInt(capacity) : null;
  if (contact_phone !== undefined) area.contact_phone = contact_phone;
  if (facilities !== undefined) area.facilities = Array.isArray(facilities) ? facilities : [];
  if (is_active !== undefined) area.is_active = is_active;

  await area.save();

  return area.toJSON();
};

/**
 * Delete emergency gathering area (Admin)
 * @param {string} areaId - Area ID
 * @returns {Promise<void>}
 */
const deleteGatheringArea = async (areaId) => {
  const area = await EmergencyGathering.findByPk(areaId);

  if (!area) {
    throw new NotFoundError('Emergency gathering area');
  }

  await area.destroy();
};

module.exports = {
  getGatheringAreas,
  getNearbyGatheringAreas,
  getGatheringAreaById,
  createGatheringArea,
  updateGatheringArea,
  deleteGatheringArea,
};

