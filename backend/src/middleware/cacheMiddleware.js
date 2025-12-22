const cacheService = require('../services/cacheService');

/**
 * Cache middleware for GET requests
 * @param {number} ttl - Time to live in seconds (default: 3600)
 * @param {function} keyGenerator - Function to generate cache key from request
 * @returns {function} Express middleware
 */
const cache = (ttl = 3600, keyGenerator = null) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key
      let cacheKey;
      if (keyGenerator) {
        cacheKey = keyGenerator(req);
      } else {
        // Default key generation
        cacheKey = `${req.path}:${JSON.stringify(req.query)}`;
      }

      // Try to get from cache
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        return res.status(200).json({
          success: true,
          data: cachedData,
          cached: true,
        });
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = function (data) {
        // Cache the response
        if (data.success && data.data) {
          cacheService.set(cacheKey, data.data, ttl).catch((err) => {
            console.error('Cache set error:', err.message);
          });
        }

        // Call original json method
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      next();
    }
  };
};

/**
 * Clear cache middleware
 * @param {function} keyGenerator - Function to generate cache key(s) to clear
 * @returns {function} Express middleware
 */
const clearCache = (keyGenerator = null) => {
  return async (req, res, next) => {
    try {
      if (keyGenerator) {
        const keys = keyGenerator(req);
        if (Array.isArray(keys)) {
          await cacheService.delMultiple(keys);
        } else if (typeof keys === 'string') {
          // Check if it's a pattern
          if (keys.includes('*')) {
            await cacheService.delByPattern(keys);
          } else {
            await cacheService.del(keys);
          }
        }
      }

      next();
    } catch (error) {
      console.error('Clear cache middleware error:', error.message);
      next();
    }
  };
};

module.exports = {
  cache,
  clearCache,
};

