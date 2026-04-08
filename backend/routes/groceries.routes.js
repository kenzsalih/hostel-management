const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/allowRoles.middleware');
const validateRequest = require('../middleware/validate.middleware');
const {
  groceriesCreateValidator,
  groceriesListValidator,
  groceriesDateRangeValidator,
  paginationValidator,
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
  allowRoles('mess_secretary'),
  groceriesCreateValidator,
  validateRequest,
  addGrocery
);

// Get all groceries
router.get('/', authMiddleware, groceriesListValidator, validateRequest, getAllGroceries);

// Get groceries by date range
router.get('/range', authMiddleware, groceriesDateRangeValidator, paginationValidator, validateRequest, getGroceriesByDateRange);

// Delete grocery
router.delete('/:id', authMiddleware, allowRoles('mess_secretary'), idParamValidator, validateRequest, deleteGrocery);

module.exports = router;
