const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const hashPassword = (plain) => bcrypt.hash(plain, 12);
const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

// Random temporary password (used later when HR registers an employee)
function generateTempPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < length; i++) out += chars[crypto.randomInt(chars.length)];
  return out;
}

module.exports = { hashPassword, comparePassword, generateTempPassword };