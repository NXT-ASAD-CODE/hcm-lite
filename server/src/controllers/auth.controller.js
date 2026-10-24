const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

exports.login = asyncHandler(async (req, res) => {
  res.json({ data: await authService.login(req.body) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ data: await authService.getMe(req.user.id) });
});

exports.changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  res.json({ message: 'Password changed' });
});