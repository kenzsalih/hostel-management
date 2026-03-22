const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleAuth = require('../middleware/roleAuth.middleware');
const {
  addGrocery,
  getAllGroceries,
  getGroceriesByDateRange,
  deleteGrocery,
} = require('../controllers/groceryController');

// Mess Secretary: Add grocery
router.post('/', authMiddleware, roleAuth(['mess_secretary']), addGrocery);

// Get all groceries
router.get('/', authMiddleware, getAllGroceries);

// Get groceries by date range
router.get('/range', authMiddleware, getGroceriesByDateRange);

// Delete grocery
router.delete('/:id', authMiddleware, roleAuth(['mess_secretary']), deleteGrocery);

module.exports = router;
