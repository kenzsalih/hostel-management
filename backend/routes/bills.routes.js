const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleAuth = require('../middleware/roleAuth.middleware');
const {
  generateBills,
  getStudentBills,
  getAllBills,
  markBillAsPaid,
} = require('../controllers/billController');

// Warden: Generate bills for all students
router.post('/', authMiddleware, roleAuth(['warden']), generateBills);

// Get all bills (Warden only)
router.get('/', authMiddleware, roleAuth(['warden']), getAllBills);

// Student: Get their bills
router.get('/:username', authMiddleware, getStudentBills);

// Student: Mark bill as paid
router.patch('/:id/paid', authMiddleware, markBillAsPaid);

module.exports = router;
