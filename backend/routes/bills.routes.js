const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/allowRoles.middleware');
const validateRequest = require('../middleware/validate.middleware');
const {
  generateBillsValidator,
  usernameParamValidator,
  paginationValidator,
  billsListValidator,
  idParamValidator,
} = require('../validators/requestValidators');
const {
  generateBills,
  getStudentBills,
  getAllBills,
  markBillAsPaid,
} = require('../controllers/billController');

// Warden: Generate bills for all students
router.post('/', authMiddleware, allowRoles('admin'), generateBillsValidator, validateRequest, generateBills);

// Get all bills (Warden only)
router.get('/', authMiddleware, allowRoles('admin'), billsListValidator, validateRequest, getAllBills);

// Student: Get their bills
router.get('/:username', authMiddleware, usernameParamValidator, paginationValidator, validateRequest, getStudentBills);

// Student: Mark bill as paid
router.patch('/:id/paid', authMiddleware, allowRoles('student', 'admin'), idParamValidator, validateRequest, markBillAsPaid);

module.exports = router;
