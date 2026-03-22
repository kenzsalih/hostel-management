const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      enum: ['kg', 'liter', 'piece', 'box', 'dozen'],
      default: 'kg',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    purchaseLocation: {
      type: String,
      required: [true, 'Purchase location is required'],
    },
    date: {
      type: Date,
      required: [true, 'Purchase date is required'],
      default: Date.now,
    },
    enteredBy: {
      type: String, // Username of the person who entered it
      required: [true, 'Entered by is required'],
    },
    category: {
      type: String,
      enum: ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'spices', 'oil', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grocery', grocerySchema);
