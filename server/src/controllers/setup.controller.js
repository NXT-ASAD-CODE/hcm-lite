const asyncHandler = require('../utils/asyncHandler');
const setupService = require('../services/setup.service');

exports.status = asyncHandler(async (req, res) => {
  res.json({ data: await setupService.getStatus() });
});

exports.create = asyncHandler(async (req, res) => {
  const { company, admin } = await setupService.createFirstAdmin(req.body);
  res.status(201).json({
    data: { companyName: company.companyName, admin: admin.toJSON() },
    message: 'Setup complete. You can now log in.',
  });
});