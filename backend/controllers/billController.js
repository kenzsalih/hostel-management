const Bill = require('../models/Bill');
const User = require('../models/User');
const { calculateExpenseForPeriod, calculateBillPerStudent } = require('../utils/calculateBill');
const { AppError } = require('../utils/errors');

// Warden: Generate bills for all students
const generateBills = async (req, res, next) => {
  try {
    const { month, startDate, endDate } = req.body;

    if (!month || !startDate || !endDate) {
      return res.status(400).json({ error: 'Month, start date, and end date are required' });
    }

    // Get total expense for the period
    const { totalExpense } = await calculateExpenseForPeriod(startDate, endDate);

    // Get all students
    const students = await User.find({ role: 'student' });
    const totalStudents = students.length;

    if (totalStudents === 0) {
      return res.status(400).json({ error: 'No students found' });
    }

    // Calculate bill per student
    const amountDue = calculateBillPerStudent(totalExpense, totalStudents);

    // Create bills for each student
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

    res.status(201).json({
      message: `Bills generated for ${bills.length} students`,
      month,
      totalExpense,
      amountPerStudent: amountDue,
      billsCount: bills.length,
      bills,
    });
  } catch (error) {
    next(error);
  }
};

// Student: Get their bills
const getStudentBills = async (req, res, next) => {
  try {
    const { username } = req.params;
    const requester = req.user;

    if (requester.role === 'student' && requester.username !== username) {
      throw new AppError('Students can only access their own bills', 403);
    }

    const bills = await Bill.find({ studentUsername: username }).sort({ generatedOn: -1 });

    const totalDue = bills
      .filter((b) => b.status === 'pending')
      .reduce((sum, b) => sum + b.amountDue, 0);

    res.json({
      username,
      count: bills.length,
      totalDue: totalDue.toFixed(2),
      bills,
    });
  } catch (error) {
    next(error);
  }
};

// Warden: Get all bills
const getAllBills = async (req, res, next) => {
  try {
    const { month, status } = req.query;

    const filter = {};
    if (month) filter.month = month;
    if (status) filter.status = status;

    const bills = await Bill.find(filter).sort({ generatedOn: -1 });

    res.json({
      count: bills.length,
      bills,
    });
  } catch (error) {
    next(error);
  }
};

// Student: Mark bill as paid
const markBillAsPaid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    if (requester.role === 'student' && bill.studentUsername !== requester.username) {
      throw new AppError('Students can only pay their own bills', 403);
    }

    if (bill.status === 'paid') {
      return res.status(400).json({ error: 'Bill is already marked as paid' });
    }

    bill.status = 'paid';
    bill.paidOn = new Date();

    await bill.save();

    res.json({
      message: 'Bill marked as paid',
      bill,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateBills,
  getStudentBills,
  getAllBills,
  markBillAsPaid,
};
