const User = require('./User');
const ExpenseRecord = require('./ExpenseRecord');
const MessCutRecord = require('./MessCutRecord');

const toDateValue = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const listActiveResidents = async () => {
  const residents = await User.find({
    role: 'student',
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  })
    .select('_id')
    .sort({ _id: 1 })
    .lean();

  return residents.map((resident) => ({ id: resident._id.toString() }));
};

const getMonthlyTotalExpenses = async ({ startDate, endDate }) => {
  const start = toDateValue(startDate);
  const end = toDateValue(endDate);

  const totals = await ExpenseRecord.aggregate([
    {
      $match: {
        date: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: '$totalCost' },
      },
    },
  ]);

  return Number(totals[0]?.totalExpense || 0);
};

const calculateOverlapDaysInclusive = ({ rangeStart, rangeEnd, cutFrom, cutTo }) => {
  const overlapStart = new Date(Math.max(rangeStart.getTime(), cutFrom.getTime()));
  const overlapEnd = new Date(Math.min(rangeEnd.getTime(), cutTo.getTime()));

  if (overlapEnd < overlapStart) {
    return 0;
  }

  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((overlapEnd.getTime() - overlapStart.getTime()) / dayMs) + 1;
};

const listApprovedMessCutDaysByUser = async ({ startDate, endDate }) => {
  const rangeStart = toDateValue(startDate);
  const rangeEnd = toDateValue(endDate);

  const approvedCuts = await MessCutRecord.find({
    status: 'approved',
    fromDate: { $lte: rangeEnd },
    toDate: { $gte: rangeStart },
  })
    .select('userId fromDate toDate')
    .lean();

  const daysByUser = approvedCuts.reduce((accumulator, cut) => {
    const userId = cut.userId.toString();
    const overlapDays = calculateOverlapDaysInclusive({
      rangeStart,
      rangeEnd,
      cutFrom: cut.fromDate,
      cutTo: cut.toDate,
    });

    accumulator[userId] = (accumulator[userId] || 0) + overlapDays;
    return accumulator;
  }, {});

  return Object.entries(daysByUser).map(([userId, messCutDays]) => ({
    userId,
    messCutDays,
  }));
};

module.exports = {
  listActiveResidents,
  getMonthlyTotalExpenses,
  listApprovedMessCutDaysByUser,
};
