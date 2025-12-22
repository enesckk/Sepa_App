const { User } = require('../models');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

/**
 * Middleware to check if user is authenticated
 * Must be used after authenticate middleware
 */
const requireAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated (should be set by authenticate middleware)
    if (!req.userId) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // Get user from database
    const user = await User.findByPk(req.userId);

    if (!user) {
      return next(new UnauthorizedError('User not found'));
    }

    // Check if user is active
    if (!user.is_active) {
      return next(new ForbiddenError('User account is inactive'));
    }

    // Check if user has admin role
    // For now, we'll check if user has a role field, or use email-based check
    // In production, you should have a proper role system
    const isAdmin = user.role === 'admin' || user.role === 'super_admin' || 
                    user.email?.endsWith('@sehitkamil.bel.tr'); // Temporary: admin emails

    if (!isAdmin) {
      return next(new ForbiddenError('Admin access required'));
    }

    // Attach user to request
    req.adminUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireAdmin };

