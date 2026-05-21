const mongoose = require('mongoose');

const messCutRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

messCutRecordSchema.index({ userId: 1, fromDate: 1, toDate: 1 });

messCutRecordSchema.pre('validate', function validateDateRange(next) {
  if (this.toDate < this.fromDate) {
    return next(new Error('toDate must be on or after fromDate'));
  }

  return next();
});

module.exports = mongoose.models.MessCutRecord || mongoose.model('MessCutRecord', messCutRecordSchema);
