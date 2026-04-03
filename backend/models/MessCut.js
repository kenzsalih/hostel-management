const mongoose = require('mongoose');

const messCutSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      ref: 'User',
    },
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String, // Why was it rejected?
    },
    approvedBy: {
      type: String, // Username of the mess secretary who approved
    },
    approvedOn: {
      type: Date,
    },
  },
  { timestamps: true }
);

messCutSchema.index({ username: 1, fromDate: 1, toDate: 1 }, { unique: true });
messCutSchema.index({ status: 1, createdAt: -1 });

// Validate that toDate is after fromDate
messCutSchema.pre('save', function (next) {
  if (this.toDate <= this.fromDate) {
    throw new Error('To date must be after from date');
  }
  next();
});

module.exports = mongoose.model('MessCut', messCutSchema);
