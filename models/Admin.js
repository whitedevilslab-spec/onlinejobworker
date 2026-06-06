const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'moderator', 'support'],
      default: 'moderator',
    },
    permissions: {
      type: [String],
      default: [],
    },
    workersApproved: {
      type: Number,
      default: 0,
    },
    bookingsMonitored: {
      type: Number,
      default: 0,
    },
    disputesResolved: {
      type: Number,
      default: 0,
    },
    lastActive: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index
adminSchema.index({ userId: 1 });
adminSchema.index({ role: 1 });

module.exports = mongoose.model('Admin', adminSchema);
