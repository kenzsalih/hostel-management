const Grocery = require('../models/Grocery');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const { getPagination } = require('../utils/pagination');

// Mess Secretary: Add grocery purchase
const addGrocery = asyncHandler(async (req, res) => {
  const { itemName, quantity, unit, price, purchaseLocation, category } = req.body;
  const enteredBy = req.user.username;

  const grocery = new Grocery({
    itemName,
    quantity,
    unit: unit || 'kg',
    price,
    purchaseLocation,
    enteredBy,
    category: category || 'other',
    date: new Date(),
  });

  await grocery.save();

  res.status(201).json({
    success: true,
    data: {
      message: 'Grocery added successfully',
      grocery,
    },
    message: 'Grocery added successfully',
    grocery,
  });
});

// Get all groceries with filters
const getAllGroceries = asyncHandler(async (req, res) => {
  const { category, startDate, endDate } = req.query;
  const { page, limit, skip, maxLimit } = getPagination(req.query);

  const filter = {};
  if (category) {
    filter.category = category;
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const [groceries, total] = await Promise.all([
    Grocery.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
    Grocery.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      items: groceries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        maxLimit,
      },
    },
    count: groceries.length,
    groceries,
  });
});

// Get groceries for a date range with total expense
const getGroceriesByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const { page, limit, skip, maxLimit } = getPagination(req.query);

  const rangeFilter = {
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };

  const [groceries, total, aggregateTotal] = await Promise.all([
    Grocery.find(rangeFilter).sort({ date: -1 }).skip(skip).limit(limit),
    Grocery.countDocuments(rangeFilter),
    Grocery.aggregate([
      { $match: rangeFilter },
      {
        $group: {
          _id: null,
          totalExpense: {
            $sum: { $multiply: ['$price', '$quantity'] },
          },
        },
      },
    ]),
  ]);

  const totalExpense = aggregateTotal[0]?.totalExpense || 0;

  res.json({
    success: true,
    data: {
      startDate,
      endDate,
      totalExpense: totalExpense.toFixed(2),
      items: groceries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        maxLimit,
      },
    },
    startDate,
    endDate,
    count: groceries.length,
    totalExpense: totalExpense.toFixed(2),
    groceries,
  });
});

// Delete grocery (Mess Secretary)
const deleteGrocery = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const grocery = await Grocery.findByIdAndDelete(id);
  if (!grocery) {
    throw new AppError('Grocery not found', 404);
  }

  res.json({
    success: true,
    data: {
      message: 'Grocery deleted successfully',
      grocery,
    },
    message: 'Grocery deleted successfully',
    grocery,
  });
});

module.exports = {
  addGrocery,
  getAllGroceries,
  getGroceriesByDateRange,
  deleteGrocery,
};
