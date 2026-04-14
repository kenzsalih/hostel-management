const express = require('express');
const router = express.Router();
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const validateRequest = require('../middleware/validate.middleware');
const { announcementCreateValidator } = require('../validators/requestValidators');
const { createAnnouncement, getAllAnnouncements } = require('../controllers/announcementController');

router.post(
  '/',
  authorizeRoles('mess_secretary', 'cook', 'warden'),
  announcementCreateValidator,
  validateRequest,
  createAnnouncement
);

router.get('/', authorizeRoles('student', 'mess_secretary', 'cook', 'warden'), getAllAnnouncements);

module.exports = router;
