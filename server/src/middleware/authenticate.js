const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Please log in');
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
  } catch {
    throw new ApiError(401, 'INVALID_TOKEN', 'Session expired or invalid. Please log in again');
  }

  // Always reload the user: role and active status come from the database, not the token
  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Account not available');
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId ? user.employeeId.toString() : null,
    mustChangePassword: user.mustChangePassword,
  };
  next();
});

module.exports = authenticate;