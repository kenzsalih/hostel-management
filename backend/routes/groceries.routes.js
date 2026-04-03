const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const validateRequest = require('../middleware/validate.middleware');
const {
  groceriesCreateValidator,
  groceriesDateRangeValidator,
  idParamValidator,
} = require('../validators/requestValidators');
const {
  addGrocery,
  getAllGroceries,
  getGroceriesByDateRange,
  deleteGrocery,
} = require('../controllers/groceryController');

// Mess Secretary: Add grocery
router.post(
  '/',
  authMiddleware,
  authorize(['mess_secretary']),
  groceriesCreateValidator,
  validateRequest,
  addGrocery
);

// Get all groceries
router.get('/', authMiddleware, getAllGroceries);

// Get groceries by date range
router.get('/range', authMiddleware, groceriesDateRangeValidator, validateRequest, getGroceriesByDateRange);

// Delete grocery
router.delete('/:id', authMiddleware, authorize(['mess_secretary']), idParamValidator, validateRequest, deleteGrocery);

module.exports = router;
