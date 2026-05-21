const asyncHandler = require('../middleware/asyncHandler.middleware');
const expenseService = require('../services/expense.service');

const addExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.addExpense(req.body, req.user);

  res.status(201).json({
    success: true,
    data: expense,
  });
});

const getMonthlyExpenses = asyncHandler(async (req, res) => {
  const summary = await expenseService.getMonthlyExpenses(req.query.month, req.user);

  res.json({
    success: true,
    data: summary,
  });
});

const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getAllExpenses(req.user);

  res.json({
    success: true,
    data: expenses,
  });
});

module.exports = {
  addExpense,
  getMonthlyExpenses,
  getAllExpenses,
};
