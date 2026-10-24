const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'hr', 'employee'], required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    mustChangePassword: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash; // never send the hash to the client
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);