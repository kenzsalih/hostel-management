const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const validateRequest = require('../middleware/validate.middleware');
const {
  announcementsCreateValidator,
  announcementsRoleParamValidator,
  idParamValidator,
} = require('../validators/requestValidators');
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
  authorize(['mess_secretary', 'cook', 'warden']),
  announcementsCreateValidator,
  validateRequest,
  createAnnouncement
);

// Get all announcements
router.get('/', authMiddleware, getAllAnnouncements);

// Get announcements by role
router.get('/role/:role', authMiddleware, announcementsRoleParamValidator, validateRequest, getAnnouncementsByRole);

// Delete announcement
router.delete(
  '/:id',
  authMiddleware,
  authorize(['mess_secretary', 'warden']),
  idParamValidator,
  validateRequest,
  deleteAnnouncement
);

module.exports = router;
