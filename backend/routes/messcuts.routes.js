const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/allowRoles.middleware');
const validateRequest = require('../middleware/validate.middleware');
const {
  idParamValidator,
  usernameParamValidator,
  paginationValidator,
  messCutListValidator,
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
router.post('/', authMiddleware, allowRoles('student'), messCutCreateValidator, validateRequest, createMessCut);

// Get all mess cuts (any authenticated user)
router.get('/', authMiddleware, messCutListValidator, validateRequest, getAllMessCuts);

// Get mess cuts for a specific student
router.get(
  '/:username',
  authMiddleware,
  usernameParamValidator,
  paginationValidator,
  validateRequest,
  getStudentMessCuts
);

// Mess Secretary: Approve mess cut
router.patch(
  '/:id/approve',
  authMiddleware,
  allowRoles('mess_secretary', 'admin'),
  idParamValidator,
  validateRequest,
  approveMessCut
);

// Mess Secretary: Reject mess cut
router.patch(
  '/:id/reject',
  authMiddleware,
  allowRoles('mess_secretary', 'admin'),
  idParamValidator,
  messCutRejectValidator,
  validateRequest,
  rejectMessCut
);

module.exports = router;
