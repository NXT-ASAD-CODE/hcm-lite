const { z } = require('zod');

const setupBody = z.object({
  companyName: z.string().trim().min(2).max(100),
  adminName: z.string().trim().min(2).max(100),
  adminEmail: z.string().trim().toLowerCase().email(),
  adminPassword: z.string().min(8).max(100),
});

module.exports = { setupBody };