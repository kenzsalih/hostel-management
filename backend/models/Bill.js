const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
      index: true,
    },
    month: {
      type: String, // Format: YYYY-MM
      required: [true, 'Month is required'],
      index: true,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    messCutDays: {
      type: Number,
      required: [true, 'Mess cut days is required'],
      min: 0,
    },
    payableAmount: {
      type: Number,
      required: [true, 'Payable amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    paidOn: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

billSchema.index({ userId: 1, month: 1 }, { unique: true });
billSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Bill', billSchema);
