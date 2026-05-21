// Calculate total expenses for a given time period
const Grocery = require('../models/Grocery');

const calculateExpenseForPeriod = async (startDate, endDate) => {
  try {
    const result = await Grocery.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: {
            $sum: { $multiply: ['$price', '$quantity'] },
          },
          itemCount: { $sum: 1 },
        },
      },
    ]);

    return result.length > 0
      ? { totalExpense: result[0].totalExpense, itemCount: result[0].itemCount }
      : { totalExpense: 0, itemCount: 0 };
  } catch (error) {
    throw new Error(`Error calculating expenses: ${error.message}`);
  }
};

// Calculate bill amount per student
const calculateBillPerStudent = (totalExpense, totalStudents) => {
  if (totalStudents <= 0) {
    throw new Error('Total students must be greater than 0');
  }
  return parseFloat((totalExpense / totalStudents).toFixed(2));
};

// Get active mess cuts count for a given date
const getActiveMessCutsCount = async (date) => {
  const MessCut = require('../models/MessCut');
  try {
    const count = await MessCut.countDocuments({
      fromDate: { $lte: date },
      toDate: { $gte: date },
      status: 'approved',
    });
    return count;
  } catch (error) {
    throw new Error(`Error calculating active mess cuts: ${error.message}`);
  }
};

module.exports = {
  calculateExpenseForPeriod,
  calculateBillPerStudent,
  getActiveMessCutsCount,
};
