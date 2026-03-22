const Grocery = require('../models/Grocery');

// Mess Secretary: Add grocery purchase
const addGrocery = async (req, res, next) => {
  try {
    const { itemName, quantity, unit, price, purchaseLocation, category } = req.body;
    const enteredBy = req.user.username;

    if (!itemName || !quantity || !price || !purchaseLocation) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

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
      message: 'Grocery added successfully',
      grocery,
    });
  } catch (error) {
    next(error);
  }
};

// Get all groceries with filters
const getAllGroceries = async (req, res, next) => {
  try {
    const { category, startDate, endDate } = req.query;

    const filter = {};
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const groceries = await Grocery.find(filter).sort({ date: -1 });

    res.json({
      count: groceries.length,
      groceries,
    });
  } catch (error) {
    next(error);
  }
};

// Get groceries for a date range with total expense
const getGroceriesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const groceries = await Grocery.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: -1 });

    const totalExpense = groceries.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      startDate,
      endDate,
      count: groceries.length,
      totalExpense: totalExpense.toFixed(2),
      groceries,
    });
  } catch (error) {
    next(error);
  }
};

// Delete grocery (Mess Secretary)
const deleteGrocery = async (req, res, next) => {
  try {
    const { id } = req.params;

    const grocery = await Grocery.findByIdAndDelete(id);
    if (!grocery) {
      return res.status(404).json({ error: 'Grocery not found' });
    }

    res.json({
      message: 'Grocery deleted successfully',
      grocery,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addGrocery,
  getAllGroceries,
  getGroceriesByDateRange,
  deleteGrocery,
};
