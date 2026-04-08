const { AppError } = require('../utils/errors');
const MessCutRecord = require('../models/MessCutRecord');

const toDateBoundary = (value, endOfDay = false) => {
  const parsed = new Date(value);
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

const assertValidDateRange = ({ fromDate, toDate }) => {
  if (toDate < fromDate) {
    throw new AppError('fromDate must be on or before toDate', 400);
  }
};

const applyMessCut = async (payload, actor) => {
  if (actor?.role !== 'student') {
    throw new AppError('Only students can apply for mess cut', 403);
  }

  const fromDate = toDateBoundary(payload.fromDate);
  const toDate = toDateBoundary(payload.toDate, true);
  assertValidDateRange({ fromDate, toDate });

  const overlap = await MessCutRecord.findOne({
    userId: actor.userId,
    status: { $in: ['pending', 'approved'] },
    fromDate: { $lte: toDate },
    toDate: { $gte: fromDate },
  });

  if (overlap) {
    throw new AppError('Overlapping mess cut request already exists', 409);
  }

  const record = await MessCutRecord.create({
    userId: actor.userId,
    fromDate,
    toDate,
    status: 'pending',
    appliedAt: new Date(),
  });

  return record;
};

const getMyMessCuts = async (actor) => {
  if (actor?.role !== 'student') {
    throw new AppError('Only students can access their requests', 403);
  }

  return MessCutRecord.find({ userId: actor.userId }).sort({ appliedAt: -1 });
};

const getPendingMessCutRequests = async (actor) => {
  if (actor?.role !== 'mess_secretary') {
    throw new AppError('Only mess secretary can view pending requests', 403);
  }

  return MessCutRecord.find({ status: 'pending' })
    .sort({ appliedAt: -1 })
    .populate('userId', 'name username role');
};

const updateMessCutStatus = async (requestId, status, actor) => {
  if (actor?.role !== 'mess_secretary') {
    throw new AppError('Only mess secretary can review requests', 403);
  }

  const request = await MessCutRecord.findById(requestId);
  if (!request) {
    throw new AppError('Mess cut request not found', 404);
  }

  if (request.status !== 'pending') {
    throw new AppError('Only pending requests can be reviewed', 400);
  }

  request.status = status;
  request.reviewedBy = actor.userId;
  request.reviewedAt = new Date();
  await request.save();

  return request;
};

const approveMessCut = async (requestId, actor) => updateMessCutStatus(requestId, 'approved', actor);

const rejectMessCut = async (requestId, actor) => updateMessCutStatus(requestId, 'rejected', actor);

module.exports = {
  applyMessCut,
  getMyMessCuts,
  getPendingMessCutRequests,
  approveMessCut,
  rejectMessCut,
};
