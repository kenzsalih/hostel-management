const MessCut = require('../models/MessCut');
const { isValidDateRange } = require('../utils/validators');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const { getPagination } = require('../utils/pagination');

// Student: Create mess cut request
const createMessCut = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.body;
  const username = req.user.username;

  if (!isValidDateRange(fromDate, toDate)) {
    throw new AppError('To date must be after from date', 400);
  }

  const duplicate = await MessCut.findOne({
    username,
    fromDate: new Date(fromDate),
    toDate: new Date(toDate),
  });

  if (duplicate) {
    throw new AppError('Duplicate mess cut request for same date range', 409);
  }

  const messCut = new MessCut({
    username,
    fromDate: new Date(fromDate),
    toDate: new Date(toDate),
  });

  await messCut.save();

  res.status(201).json({
    success: true,
    data: {
      message: 'Mess cut request created',
      messCut,
    },
    message: 'Mess cut request created',
    messCut,
  });
});

// Get all mess cuts (with filter by status, username)
const getAllMessCuts = asyncHandler(async (req, res) => {
  const { status, username } = req.query;
  const requester = req.user;
  const { page, limit, skip, maxLimit } = getPagination(req.query);

  const filter = {};

  if (requester.role === 'student') {
    filter.username = requester.username;
  }

  if (username && requester.role !== 'student') {
    filter.username = username;
  }

  if (status) {
    filter.status = status;
  }

  const [messCuts, total] = await Promise.all([
    MessCut.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    MessCut.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      items: messCuts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        maxLimit,
      },
      filters: {
        status: status || null,
        username: filter.username || null,
      },
    },
    count: messCuts.length,
    messCuts,
  });
});

// Mess Secretary: Approve mess cut
const approveMessCut = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const secretaryUsername = req.user.username;

  const messCut = await MessCut.findById(id);
  if (!messCut) {
    throw new AppError('Mess cut not found', 404);
  }

  if (messCut.status !== 'pending') {
    throw new AppError('Only pending requests can be approved', 400);
  }

  messCut.status = 'approved';
  messCut.approvedBy = secretaryUsername;
  messCut.approvedOn = new Date();

  await messCut.save();

  res.json({
    success: true,
    data: {
      message: 'Mess cut approved',
      messCut,
    },
    message: 'Mess cut approved',
    messCut,
  });
});

// Mess Secretary: Reject mess cut
const rejectMessCut = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;
  const secretaryUsername = req.user.username;

  const messCut = await MessCut.findById(id);
  if (!messCut) {
    throw new AppError('Mess cut not found', 404);
  }

  if (messCut.status !== 'pending') {
    throw new AppError('Only pending requests can be rejected', 400);
  }

  messCut.status = 'rejected';
  messCut.rejectionReason = rejectionReason || 'No reason provided';
  messCut.approvedBy = secretaryUsername;
  messCut.approvedOn = new Date();

  await messCut.save();

  res.json({
    success: true,
    data: {
      message: 'Mess cut rejected',
      messCut,
    },
    message: 'Mess cut rejected',
    messCut,
  });
});

// Get mess cuts for a specific student
const getStudentMessCuts = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const requester = req.user;
  const { page, limit, skip, maxLimit } = getPagination(req.query);

  if (requester.role === 'student' && requester.username !== username) {
    throw new AppError('Students can only access their own mess cuts', 403);
  }

  const filter = { username };
  const [messCuts, total] = await Promise.all([
    MessCut.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    MessCut.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      username,
      items: messCuts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        maxLimit,
      },
    },
    username,
    count: messCuts.length,
    messCuts,
  });
});

module.exports = {
  createMessCut,
  getAllMessCuts,
  approveMessCut,
  rejectMessCut,
  getStudentMessCuts,
};
