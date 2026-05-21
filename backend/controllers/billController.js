const Bill = require('../models/Bill');
const User = require('../models/User');
const { calculateExpenseForPeriod, calculateBillPerStudent } = require('../utils/calculateBill');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const { getPagination } = require('../utils/pagination');

// Warden: Generate bills for all students
const generateBills = asyncHandler(async (req, res) => {
  const { month, startDate, endDate } = req.body;

  const { totalExpense } = await calculateExpenseForPeriod(startDate, endDate);

  const students = await User.find({ role: 'student' });
  const totalStudents = students.length;

  if (totalStudents === 0) {
    throw new AppError('No students found', 400);
  }

  const amountDue = calculateBillPerStudent(totalExpense, totalStudents);

  const bills = [];
  for (const student of students) {
    const existingBill = await Bill.findOne({
      studentUsername: student.username,
      month,
    });

    if (existingBill) {
      continue;
    }

    const bill = new Bill({
      studentUsername: student.username,
      month,
      totalExpense,
      totalStudents,
      amountDue,
      generatedBy: req.user.username,
      status: 'generated',
    });
    await bill.save();
    bills.push(bill);
  }

  const message = `Bills generated for ${bills.length} students`;
  res.status(201).json({
    success: true,
    data: {
      message,
      month,
      totalExpense,
      amountPerStudent: amountDue,
      billsCount: bills.length,
      bills,
    },
    message,
    month,
    totalExpense,
    amountPerStudent: amountDue,
    billsCount: bills.length,
    bills,
  });
});

// Student: Get their bills
const getStudentBills = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const requester = req.user;
  const { page, limit, skip, maxLimit } = getPagination(req.query);

  if (requester.role === 'student' && requester.username !== username) {
    throw new AppError('Students can only access their own bills', 403);
  }

  const filter = { studentUsername: username };
  const [bills, total, totalDueAggregate] = await Promise.all([
    Bill.find(filter).sort({ generatedOn: -1 }).skip(skip).limit(limit),
    Bill.countDocuments(filter),
    Bill.aggregate([
      { $match: { studentUsername: username, status: 'pending' } },
      { $group: { _id: null, totalDue: { $sum: '$amountDue' } } },
    ]),
  ]);

  const totalDue = totalDueAggregate[0]?.totalDue || 0;

  res.json({
    success: true,
    data: {
      username,
      totalDue: totalDue.toFixed(2),
      items: bills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        maxLimit,
      },
    },
    username,
    count: bills.length,
    totalDue: totalDue.toFixed(2),
    bills,
  });
});

// Warden: Get all bills
const getAllBills = asyncHandler(async (req, res) => {
  const { month, status } = req.query;
  const { page, limit, skip, maxLimit } = getPagination(req.query);

  const filter = {};
  if (month) {
    filter.month = month;
  }
  if (status) {
    filter.status = status;
  }

  const [bills, total] = await Promise.all([
    Bill.find(filter).sort({ generatedOn: -1 }).skip(skip).limit(limit),
    Bill.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      items: bills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        maxLimit,
      },
    },
    count: bills.length,
    bills,
  });
});

// Student: Mark bill as paid
const markBillAsPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requester = req.user;

  const bill = await Bill.findById(id);
  if (!bill) {
    throw new AppError('Bill not found', 404);
  }

  if (requester.role === 'student' && bill.studentUsername !== requester.username) {
    throw new AppError('Students can only pay their own bills', 403);
  }

  if (bill.status === 'paid') {
    throw new AppError('Bill is already marked as paid', 400);
  }

  bill.status = 'paid';
  bill.paidOn = new Date();

  await bill.save();

  res.json({
    success: true,
    data: {
      message: 'Bill marked as paid',
      bill,
    },
    message: 'Bill marked as paid',
    bill,
  });
});

module.exports = {
  generateBills,
  getStudentBills,
  getAllBills,
  markBillAsPaid,
};
