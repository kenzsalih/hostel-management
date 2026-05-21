const { AppError } = require('../utils/errors');
const Bill = require('../models/Bill');
const User = require('../models/User');
const MessCutRecord = require('../models/MessCutRecord');
const { getMonthlyTotal } = require('./expense.service');

const toMoney = (value) => Number(Number(value).toFixed(2));
let legacyBillIndexesChecked = false;

const cleanupLegacyBillIndexes = async () => {
  if (legacyBillIndexesChecked) {
    return;
  }

  legacyBillIndexesChecked = true;

  const legacyIndexes = ['studentUsername_1_month_1', 'generatedOn_-1'];
  await Promise.all(
    legacyIndexes.map(async (indexName) => {
      try {
        await Bill.collection.dropIndex(indexName);
      } catch (error) {
        const codeName = String(error?.codeName || '');
        if (codeName !== 'IndexNotFound') {
          throw error;
        }
      }
    })
  );
};

const parseMonth = (month) => {
  const input = String(month || '').trim();
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(input)) {
    throw new AppError('month must be in format YYYY-MM', 400);
  }

  const [yearText, monthText] = input.split('-');
  const year = Number(yearText);
  const monthNumber = Number(monthText);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const startDate = new Date(year, monthNumber - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

  return {
    key: input,
    startDate,
    endDate,
    daysInMonth,
  };
};

const mergeAndCountDays = (ranges = [], monthStart, monthEnd) => {
  if (ranges.length === 0) {
    return 0;
  }

  const clipped = ranges
    .map(({ fromDate, toDate }) => {
      const start = new Date(Math.max(monthStart.getTime(), new Date(fromDate).getTime()));
      const end = new Date(Math.min(monthEnd.getTime(), new Date(toDate).getTime()));
      return { start, end };
    })
    .filter((range) => range.end >= range.start)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (clipped.length === 0) {
    return 0;
  }

  const merged = [clipped[0]];
  for (let i = 1; i < clipped.length; i += 1) {
    const last = merged[merged.length - 1];
    const current = clipped[i];
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (current.start.getTime() <= last.end.getTime() + oneDayMs) {
      last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
    } else {
      merged.push(current);
    }
  }

  const oneDayMs = 24 * 60 * 60 * 1000;
  return merged.reduce((sum, range) => sum + Math.floor((range.end - range.start) / oneDayMs) + 1, 0);
};

const generateBilling = async ({ month }, actor) => {
  if (actor?.role !== 'warden') {
    throw new AppError('Only warden can generate billing', 403);
  }

  await cleanupLegacyBillIndexes();

  const { key: monthKey, startDate, endDate, daysInMonth } = parseMonth(month);

  const [students, totalExpenses, approvedMessCuts] = await Promise.all([
    User.find({ role: 'student', isActive: { $ne: false } }).select('_id name username'),
    getMonthlyTotal(monthKey),
    MessCutRecord.find({
      status: 'approved',
      fromDate: { $lte: endDate },
      toDate: { $gte: startDate },
    }).select('userId fromDate toDate'),
  ]);

  if (students.length === 0) {
    throw new AppError('No active students found for billing', 400);
  }

  const cutsByUserId = approvedMessCuts.reduce((accumulator, cut) => {
    const userId = String(cut.userId);
    if (!accumulator[userId]) {
      accumulator[userId] = [];
    }
    accumulator[userId].push(cut);
    return accumulator;
  }, {});

  const computed = students.map((student) => {
    const userId = String(student._id);
    const messCutDays = Math.min(
      daysInMonth,
      mergeAndCountDays(cutsByUserId[userId] || [], startDate, endDate)
    );
    const effectiveDays = Math.max(0, daysInMonth - messCutDays);

    return {
      userId,
      messCutDays,
      effectiveDays,
    };
  });

  const totalUsers = students.length;
  const totalEffectiveDays = computed.reduce(
    (sum, user) => sum + user.effectiveDays,
    0
  );

  if (totalEffectiveDays <= 0) {
    throw new AppError('Total effective days is zero; billing cannot be generated', 400);
  }

  const perDayCost = totalExpenses / totalEffectiveDays;
  const totalAmountPerStudent = toMoney(perDayCost * daysInMonth);

  const billWrites = computed.map(async (entry) => {
    const payableAmount = toMoney(perDayCost * entry.effectiveDays);
    const existing = await Bill.findOne({ userId: entry.userId, month: monthKey });

    const nextStatus = existing?.status === 'paid' ? 'paid' : 'unpaid';
    const nextPaidOn = nextStatus === 'paid' ? existing?.paidOn || new Date() : null;

    return Bill.findOneAndUpdate(
      { userId: entry.userId, month: monthKey },
      {
        userId: entry.userId,
        month: monthKey,
        totalAmount: totalAmountPerStudent,
        messCutDays: entry.messCutDays,
        payableAmount,
        status: nextStatus,
        paidOn: nextPaidOn,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  });

  const savedBills = await Promise.all(billWrites);

  return {
    month: monthKey,
    totalExpenses: toMoney(totalExpenses),
    totalUsers,
    totalEffectiveDays,
    perDayCost: toMoney(perDayCost),
    bills: savedBills,
  };
};

const getMyBills = async (actor, { month }) => {
  if (actor?.role !== 'student') {
    throw new AppError('Only students can access personal bills', 403);
  }

  const filter = { userId: actor.userId };
  if (month) {
    filter.month = parseMonth(month).key;
  }

  return Bill.find(filter).sort({ month: -1, createdAt: -1 });
};

const payBill = async (actor, { billId }) => {
  if (actor?.role !== 'student') {
    throw new AppError('Only students can pay bills', 403);
  }

  const bill = await Bill.findOne({ _id: billId, userId: actor.userId });
  if (!bill) {
    throw new AppError('Bill not found', 404);
  }

  if (bill.status === 'paid') {
    throw new AppError('Bill is already paid', 400);
  }

  bill.status = 'paid';
  bill.paidOn = new Date();
  await bill.save();
  return bill;
};

module.exports = {
  generateBilling,
  getMyBills,
  payBill,
};
