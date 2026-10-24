const ApiError = require('../utils/ApiError');

// Usage: authorizeRoles('admin', 'hr')
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to do this'));
  }
  next();
};

module.exports = authorizeRoles;