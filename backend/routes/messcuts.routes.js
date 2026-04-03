const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const validateRequest = require('../middleware/validate.middleware');
const {
  idParamValidator,
  usernameParamValidator,
  messCutCreateValidator,
  messCutRejectValidator,
} = require('../validators/requestValidators');
const {
  createMessCut,
  getAllMessCuts,
  approveMessCut,
  rejectMessCut,
  getStudentMessCuts,
} = require('../controllers/messController');

// Student: Create mess cut
router.post('/', authMiddleware, authorize(['student']), messCutCreateValidator, validateRequest, createMessCut);

// Get all mess cuts (any authenticated user)
router.get('/', authMiddleware, getAllMessCuts);

// Get mess cuts for a specific student
router.get('/:username', authMiddleware, usernameParamValidator, validateRequest, getStudentMessCuts);

// Mess Secretary: Approve mess cut
router.patch(
  '/:id/approve',
  authMiddleware,
  authorize(['mess_secretary', 'warden']),
  idParamValidator,
  validateRequest,
  approveMessCut
);

// Mess Secretary: Reject mess cut
router.patch(
  '/:id/reject',
  authMiddleware,
  authorize(['mess_secretary', 'warden']),
  idParamValidator,
  messCutRejectValidator,
  validateRequest,
  rejectMessCut
);

module.exports = router;
