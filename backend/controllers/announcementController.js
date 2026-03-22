const Announcement = require('../models/Announcement');

// Create announcement
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, priority, expiryDate } = req.body;
    const postedBy = req.user.username;
    const role = req.user.role;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const announcement = new Announcement({
      title,
      message,
      postedBy,
      role,
      priority: priority || 'medium',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    await announcement.save();

    res.status(201).json({
      message: 'Announcement posted successfully',
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// Get all announcements
const getAllAnnouncements = async (req, res, next) => {
  try {
    const { priority } = req.query;

    const filter = {
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } },
      ],
    };

    if (priority) filter.priority = priority;

    const announcements = await Announcement.find(filter).sort({ date: -1 });

    res.json({
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

// Get announcements by role
const getAnnouncementsByRole = async (req, res, next) => {
  try {
    const { role } = req.params;

    const validRoles = ['mess_secretary', 'cook', 'warden'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const announcements = await Announcement.find({
      role,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gte: new Date() } },
      ],
    }).sort({ date: -1 });

    res.json({
      role,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({
      message: 'Announcement deleted successfully',
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementsByRole,
  deleteAnnouncement,
};
