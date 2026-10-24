const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../utils/password');

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn, algorithm: 'HS256' }
  );
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  const valid = user && user.isActive && (await comparePassword(password, user.passwordHash));
  // same message for every failure, so attackers cannot learn which emails exist
  if (!valid) throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

  user.lastLoginAt = new Date();
  await user.save();
  return { token: signToken(user), user: user.toJSON() };
}

async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');
  return user.toJSON();
}

async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId);
  if (!user || !(await comparePassword(currentPassword, user.passwordHash))) {
    throw new ApiError(400, 'INVALID_CURRENT_PASSWORD', 'Current password is incorrect');
  }
  if (currentPassword === newPassword) {
    throw new ApiError(422, 'SAME_PASSWORD', 'New password must be different from the current one');
  }
  user.passwordHash = await hashPassword(newPassword);
  user.mustChangePassword = false;
  await user.save();
}

module.exports = { login, getMe, changePassword };