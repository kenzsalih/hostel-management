const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    postedBy: {
      type: String, // Username of the person who posted
      required: [true, 'Posted by is required'],
    },
    role: {
      type: String,
      enum: ['mess_secretary', 'cook', 'warden'],
      required: [true, 'Role is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    expiryDate: {
      type: Date, // Optional: when this announcement expires
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
