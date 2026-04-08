const { AppError } = require('../utils/errors');
const ExpenseRecord = require('../models/ExpenseRecord');

const normalizeDateBoundary = (input, endOfDay = false) => {
  const parsed = input ? new Date(input) : new Date();

  if (Number.isNaN(parsed.getTime())) {
    throw new AppError('Invalid date provided', 400);
  }

  if (endOfDay) {
    parsed.setHours(23, 59, 59, 999);
  } else {
    parsed.setHours(0, 0, 0, 0);
  }

  return parsed;
};

const toMoney = (value) => Number(Number(value).toFixed(2));

const parseMonth = (month) => {
  const input = String(month || '').trim();
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(input)) {
    throw new AppError('month must be in format YYYY-MM', 400);
  }

  const [yearText, monthText] = input.split('-');
  const year = Number(yearText);
  const monthNumber = Number(monthText);
  const startDate = new Date(year, monthNumber - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

  return {
    key: input,
    startDate,
    endDate,
  };
};

const addExpense = async (payload, actor) => {
  if (actor?.role !== 'mess_secretary') {
    throw new AppError('Only mess secretary can add expenses', 403);
  }

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError('amount must be greater than 0', 400);
  }

  const expense = await ExpenseRecord.create({
    amount: toMoney(amount),
    category: String(payload.category || '').trim().toLowerCase(),
    description: String(payload.description || '').trim(),
    date: normalizeDateBoundary(payload.date),
    addedBy: actor.userId,
  });

  return expense;
};

const getMonthlyExpenses = async (month, actor) => {
  if (!['mess_secretary', 'warden'].includes(actor?.role)) {
    throw new AppError('Only mess secretary or warden can access monthly expenses', 403);
  }

  const { key, startDate, endDate } = parseMonth(month);

  const [items, totals, categoryBreakdown] = await Promise.all([
    ExpenseRecord.find({ date: { $gte: startDate, $lte: endDate } })
      .sort({ date: -1, createdAt: -1 })
      .populate('addedBy', 'name username role'),
    ExpenseRecord.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, totalMonthlyExpense: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    ExpenseRecord.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', total: 1 } },
      { $sort: { total: -1 } },
    ]),
  ]);

  return {
    month: key,
    totalMonthlyExpense: toMoney(totals[0]?.totalMonthlyExpense || 0),
    totalEntries: Number(totals[0]?.count || 0),
    categoryBreakdown: categoryBreakdown.map((entry) => ({
      category: entry.category,
      total: toMoney(entry.total),
    })),
    expenses: items,
  };
};

const getAllExpenses = async (actor) => {
  if (actor?.role !== 'warden') {
    throw new AppError('Only warden can access all expenses', 403);
  }

  return ExpenseRecord.find({}).sort({ date: -1, createdAt: -1 }).populate('addedBy', 'name username role');
};

const getMonthlyTotal = async (month) => {
  const { startDate, endDate } = parseMonth(month);

  const totals = await ExpenseRecord.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, totalMonthlyExpense: { $sum: '$amount' } } },
  ]);

  return toMoney(totals[0]?.totalMonthlyExpense || 0);
};

module.exports = {
  addExpense,
  getMonthlyExpenses,
  getAllExpenses,
  getMonthlyTotal,
};
