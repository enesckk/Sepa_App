const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload (userId, email, etc.)
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId || payload.id,
      email: payload.email,
      type: 'access',
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
    }
  );
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload (userId, email, etc.)
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId || payload.id,
      email: payload.email,
      type: 'refresh',
    },
    jwtConfig.refreshSecret,
    {
      expiresIn: jwtConfig.refreshExpiresIn,
    }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {boolean} isRefresh - Is this a refresh token?
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh ? jwtConfig.refreshSecret : jwtConfig.secret;
  return jwt.verify(token, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};

