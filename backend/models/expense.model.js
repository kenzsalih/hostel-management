const ExpenseRecord = require('./ExpenseRecord');

const toDateValue = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toExpenseRecord = (doc) => {
  if (!doc) {
    return null;
  }

  return {
    id: doc._id.toString(),
    itemName: doc.itemName,
    quantity: doc.quantity,
    price: doc.price,
    totalCost: doc.totalCost,
    purchasedFrom: doc.purchasedFrom,
    date: doc.date,
    createdBy: doc.createdBy.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

const createExpense = async ({ itemName, quantity, price, totalCost, purchasedFrom, date, createdBy }) => {
  const created = await ExpenseRecord.create({
    itemName,
    quantity,
    price,
    totalCost,
    purchasedFrom,
    date: toDateValue(date),
    createdBy,
  });

  return created._id.toString();
};

const findExpenseById = async (id) => {
  const record = await ExpenseRecord.findById(id).lean();
  return toExpenseRecord(record);
};

const listExpenses = async () => {
  const records = await ExpenseRecord.find({}).sort({ date: -1, createdAt: -1 }).lean();
  return records.map(toExpenseRecord);
};

const getExpensesTotal = async () => {
  const [summary, totalRecords] = await Promise.all([
    ExpenseRecord.aggregate([
      {
        $group: {
          _id: null,
          totalCost: { $sum: '$totalCost' },
        },
      },
    ]),
    ExpenseRecord.countDocuments({}),
  ]);

  return {
    totalCost: Number(summary[0]?.totalCost || 0),
    totalRecords: Number(totalRecords || 0),
  };
};

module.exports = {
  createExpense,
  findExpenseById,
  listExpenses,
  getExpensesTotal,
};
