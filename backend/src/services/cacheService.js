const redisClient = require('../config/redis');

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<Object|null>} Cached data or null
 */
const get = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return null;
    }

    const data = await redisClient.get(key);
    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Redis get error:', error.message);
    return null;
  }
};

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (default: 3600 = 1 hour)
 * @returns {Promise<boolean>} Success status
 */
const set = async (key, value, ttl = 3600) => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }

    const stringValue = JSON.stringify(value);
    await redisClient.setEx(key, ttl, stringValue);
    return true;
  } catch (error) {
    console.error('Redis set error:', error.message);
    return false;
  }
};

/**
 * Delete data from cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 */
const del = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }

    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error.message);
    return false;
  }
};

/**
 * Delete multiple keys from cache
 * @param {Array<string>} keys - Array of cache keys
 * @returns {Promise<number>} Number of deleted keys
 */
const delMultiple = async (keys) => {
  try {
    if (!redisClient.isOpen || !keys || keys.length === 0) {
      return 0;
    }

    const deletedCount = await redisClient.del(...keys);
    return deletedCount;
  } catch (error) {
    console.error('Redis delete multiple error:', error.message);
    return 0;
  }
};

/**
 * Delete all keys matching a pattern
 * @param {string} pattern - Pattern to match (e.g., 'events:*')
 * @returns {Promise<number>} Number of deleted keys
 */
const delByPattern = async (pattern) => {
  try {
    if (!redisClient.isOpen) {
      return 0;
    }

    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) {
      return 0;
    }

    const deletedCount = await redisClient.del(...keys);
    return deletedCount;
  } catch (error) {
    console.error('Redis delete by pattern error:', error.message);
    return 0;
  }
};

/**
 * Check if key exists in cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Exists status
 */
const exists = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }

    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    console.error('Redis exists error:', error.message);
    return false;
  }
};

/**
 * Get TTL (time to live) of a key
 * @param {string} key - Cache key
 * @returns {Promise<number>} TTL in seconds (-1 if no expiry, -2 if key doesn't exist)
 */
const getTTL = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return -2;
    }

    const ttl = await redisClient.ttl(key);
    return ttl;
  } catch (error) {
    console.error('Redis TTL error:', error.message);
    return -2;
  }
};

/**
 * Increment a numeric value in cache
 * @param {string} key - Cache key
 * @param {number} increment - Increment value (default: 1)
 * @returns {Promise<number>} New value
 */
const increment = async (key, increment = 1) => {
  try {
    if (!redisClient.isOpen) {
      return 0;
    }

    const newValue = await redisClient.incrBy(key, increment);
    return newValue;
  } catch (error) {
    console.error('Redis increment error:', error.message);
    return 0;
  }
};

/**
 * Cache key generators
 */
const cacheKeys = {
  // Events
  eventsList: (filters) => {
    const filterStr = JSON.stringify(filters || {});
    return `events:list:${Buffer.from(filterStr).toString('base64')}`;
  },
  eventById: (id) => `events:id:${id}`,
  eventRegistrations: (eventId) => `events:${eventId}:registrations`,

  // Stories
  storiesList: () => 'stories:list:active',
  storyById: (id) => `stories:id:${id}`,

  // News
  newsList: (filters) => {
    const filterStr = JSON.stringify(filters || {});
    return `news:list:${Buffer.from(filterStr).toString('base64')}`;
  },
  newsById: (id) => `news:id:${id}`,
  newsCategories: () => 'news:categories',

  // Places
  placesList: (filters) => {
    const filterStr = JSON.stringify(filters || {});
    return `places:list:${Buffer.from(filterStr).toString('base64')}`;
  },
  placeById: (id) => `places:id:${id}`,
  placesCategories: () => 'places:categories',

  // Surveys
  surveysList: () => 'surveys:list:active',
  surveyById: (id) => `surveys:id:${id}`,

  // Rewards
  rewardsList: () => 'rewards:list:active',
  rewardById: (id) => `rewards:id:${id}`,

  // Emergency Gathering
  emergencyGatheringList: (filters) => {
    const filterStr = JSON.stringify(filters || {});
    return `emergency-gathering:list:${Buffer.from(filterStr).toString('base64')}`;
  },
  emergencyGatheringById: (id) => `emergency-gathering:id:${id}`,

  // User
  userProfile: (userId) => `users:${userId}:profile`,
  userGolbucks: (userId) => `users:${userId}:golbucks`,

  // Dashboard stats
  dashboardStats: () => 'admin:dashboard:stats',
};

module.exports = {
  get,
  set,
  del,
  delMultiple,
  delByPattern,
  exists,
  getTTL,
  increment,
  cacheKeys,
};

