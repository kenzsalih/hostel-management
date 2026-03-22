const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleAuth = require('../middleware/roleAuth.middleware');
const {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementsByRole,
  deleteAnnouncement,
} = require('../controllers/announcementController');

// Create announcement (Mess Secretary, Cook, Warden)
router.post(
  '/',
  authMiddleware,
  roleAuth(['mess_secretary', 'cook', 'warden']),
  createAnnouncement
);

// Get all announcements
router.get('/', authMiddleware, getAllAnnouncements);

// Get announcements by role
router.get('/role/:role', authMiddleware, getAnnouncementsByRole);

// Delete announcement
router.delete(
  '/:id',
  authMiddleware,
  roleAuth(['mess_secretary', 'cook', 'warden']),
  deleteAnnouncement
);

module.exports = router;
