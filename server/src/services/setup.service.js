const CompanySettings = require('../models/CompanySettings.model');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const { hashPassword } = require('../utils/password');

async function getStatus() {
  const settings = await CompanySettings.findOne({ setupCompleted: true });
  const adminExists = await User.exists({ role: 'admin' });
  return { needsSetup: !settings && !adminExists };
}

async function createFirstAdmin({ companyName, adminName, adminEmail, adminPassword }) {
  const { needsSetup } = await getStatus();
  if (!needsSetup) {
    throw new ApiError(409, 'SETUP_ALREADY_DONE', 'Setup has already been completed');
  }

  // The unique "key" field makes a second concurrent setup fail with a duplicate error
  const settings = await CompanySettings.create({ companyName });

  try {
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: 'admin',
      mustChangePassword: false,
    });
    settings.setupCompleted = true;
    await settings.save();
    return { company: settings, admin };
  } catch (err) {
    await CompanySettings.deleteOne({ _id: settings._id }); // undo, so setup can be retried
    throw err;
  }
}

module.exports = { getStatus, createFirstAdmin };