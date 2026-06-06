const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
        'cleaning',
        'plumbing',
        'electrical',
        'carpentry',
        'painting',
        'gardening',
        'cooking',
        'tutoring',
        'beauty',
        'other',
      ],
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    about: {
      type: String,
      default: '',
      maxlength: 500,
    },
    skills: {
      type: [String],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationDate: Date,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    completedBookings: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String,
      default: '',
    },
    documents: {
      type: [String],
      default: [],
    },
    availability: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String },
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
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

// Index for faster queries
workerSchema.index({ userId: 1 });
workerSchema.index({ serviceType: 1 });
workerSchema.index({ verified: 1 });
workerSchema.index({ rating: -1 });

module.exports = mongoose.model('Worker', workerSchema);
