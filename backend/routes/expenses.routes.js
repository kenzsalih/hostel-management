const express = require('express');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const validateRequest = require('../middleware/validate.middleware');
const { expenseCreateValidator, monthQueryValidator } = require('../validators/requestValidators');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.post(
  '/',
  authorizeRoles('mess_secretary'),
  expenseCreateValidator,
  validateRequest,
  expenseController.addExpense
);

router.get(
  '/monthly',
  authorizeRoles('mess_secretary', 'warden'),
  monthQueryValidator,
  validateRequest,
  expenseController.getMonthlyExpenses
);

router.get('/all', authorizeRoles('warden'), expenseController.getAllExpenses);

module.exports = router;
