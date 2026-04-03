const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const validateRequest = require('../middleware/validate.middleware');
const {
  generateBillsValidator,
  usernameParamValidator,
  idParamValidator,
} = require('../validators/requestValidators');
const {
  generateBills,
  getStudentBills,
  getAllBills,
  markBillAsPaid,
} = require('../controllers/billController');

// Warden: Generate bills for all students
router.post('/', authMiddleware, authorize(['warden']), generateBillsValidator, validateRequest, generateBills);

// Get all bills (Warden only)
router.get('/', authMiddleware, authorize(['warden']), getAllBills);

// Student: Get their bills
router.get('/:username', authMiddleware, usernameParamValidator, validateRequest, getStudentBills);

// Student: Mark bill as paid
router.patch('/:id/paid', authMiddleware, authorize(['student', 'warden']), idParamValidator, validateRequest, markBillAsPaid);

module.exports = router;
