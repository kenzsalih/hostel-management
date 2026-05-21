const User = require('../models/User');
const MessCutRecord = require('../models/MessCutRecord');
const { AppError } = require('../utils/errors');

const getMealCountForToday = async (actor) => {
  if (actor?.role !== 'cook') {
    throw new AppError('Only cook can access meal count', 403);
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [totalStudents, approvedCutsToday] = await Promise.all([
    User.countDocuments({ role: 'student', isActive: { $ne: false } }),
    MessCutRecord.find({
      status: 'approved',
      fromDate: { $lte: endOfDay },
      toDate: { $gte: startOfDay },
    }).select('userId'),
  ]);

  const onCutUserIds = new Set(approvedCutsToday.map((item) => String(item.userId)));
  const mealCount = Math.max(0, totalStudents - onCutUserIds.size);

  return {
    date: startOfDay.toISOString().slice(0, 10),
    totalStudents,
    studentsOnMessCut: onCutUserIds.size,
    mealCount,
  };
};

module.exports = {
  getMealCountForToday,
};
