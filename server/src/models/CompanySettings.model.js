const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema(
  {
    // singleton key: the unique index guarantees only ONE company document exists
    key: { type: String, default: 'company', unique: true, immutable: true },
    companyName: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: '' },
    contact: { type: String, trim: true, default: '' },
    timezone: { type: String, default: 'Asia/Karachi' },
    officeStart: { type: String, default: '09:00' },
    graceMinutes: { type: Number, default: 15 },
    halfDayHours: { type: Number, default: 5 },
    weekendDays: { type: [Number], default: [0, 6] }, // Sun=0 ... Sat=6
    officeLatitude: { type: Number, default: null },
    officeLongitude: { type: Number, default: null },
    radiusMeters: { type: Number, default: 150 },
    setupCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanySettings', companySettingsSchema);