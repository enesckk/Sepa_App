const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided. Please provide a valid token.',
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token is required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Find user
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'User account is inactive',
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired',
      });
    }

    // Handle database connection errors
    if (error.name === 'SequelizeConnectionRefusedError' || 
        error.name === 'SequelizeConnectionError' ||
        error.name === 'SequelizeHostNotFoundError') {
      console.error('Database connection error in auth middleware:', error.message);
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Veritabanı bağlantısı kurulamadı. Lütfen veritabanının çalıştığından emin olun.',
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication middleware
 * Doesn't fail if no token is provided, but attaches user if token is valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, jwtConfig.secret);
      const user = await User.findByPk(decoded.userId);

      if (user && user.is_active) {
        req.user = user;
        req.userId = user.id;
      }
    }

    next();
  } catch (error) {
    // Ignore errors in optional auth
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};

