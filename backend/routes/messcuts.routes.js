const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleAuth = require('../middleware/roleAuth.middleware');
const {
  createMessCut,
  getAllMessCuts,
  approveMessCut,
  rejectMessCut,
  getStudentMessCuts,
} = require('../controllers/messController');

// Student: Create mess cut
router.post('/', authMiddleware, roleAuth(['student']), createMessCut);

// Get all mess cuts (any authenticated user)
router.get('/', authMiddleware, getAllMessCuts);

// Get mess cuts for a specific student
router.get('/:username', authMiddleware, getStudentMessCuts);

// Mess Secretary: Approve mess cut
router.patch('/:id/approve', authMiddleware, roleAuth(['mess_secretary']), approveMessCut);

// Mess Secretary: Reject mess cut
router.patch('/:id/reject', authMiddleware, roleAuth(['mess_secretary']), rejectMessCut);

module.exports = router;
