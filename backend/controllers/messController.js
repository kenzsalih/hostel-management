const MessCut = require('../models/MessCut');
const User = require('../models/User');
const { isValidDateRange } = require('../utils/validators');

// Student: Create mess cut request
const createMessCut = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.body;
    const username = req.user.username;

    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'From date and to date are required' });
    }

    if (!isValidDateRange(fromDate, toDate)) {
      return res.status(400).json({ error: 'To date must be after from date' });
    }

    const messCut = new MessCut({
      username,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
    });

    await messCut.save();

    res.status(201).json({
      message: 'Mess cut request created',
      messCut,
    });
  } catch (error) {
    next(error);
  }
};

// Get all mess cuts (with filter by status, username)
const getAllMessCuts = async (req, res, next) => {
  try {
    const { status, username } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (username) filter.username = username;

    const messCuts = await MessCut.find(filter).sort({ createdAt: -1 });

    res.json({
      count: messCuts.length,
      messCuts,
    });
  } catch (error) {
    next(error);
  }
};

// Mess Secretary: Approve mess cut
const approveMessCut = async (req, res, next) => {
  try {
    const { id } = req.params;
    const secretaryUsername = req.user.username;

    const messCut = await MessCut.findById(id);
    if (!messCut) {
      return res.status(404).json({ error: 'Mess cut not found' });
    }

    if (messCut.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending requests can be approved' });
    }

    messCut.status = 'approved';
    messCut.approvedBy = secretaryUsername;
    messCut.approvedOn = new Date();

    await messCut.save();

    res.json({
      message: 'Mess cut approved',
      messCut,
    });
  } catch (error) {
    next(error);
  }
};

// Mess Secretary: Reject mess cut
const rejectMessCut = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const secretaryUsername = req.user.username;

    const messCut = await MessCut.findById(id);
    if (!messCut) {
      return res.status(404).json({ error: 'Mess cut not found' });
    }

    if (messCut.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending requests can be rejected' });
    }

    messCut.status = 'rejected';
    messCut.rejectionReason = rejectionReason || 'No reason provided';
    messCut.approvedBy = secretaryUsername;
    messCut.approvedOn = new Date();

    await messCut.save();

    res.json({
      message: 'Mess cut rejected',
      messCut,
    });
  } catch (error) {
    next(error);
  }
};

// Get mess cuts for a specific student
const getStudentMessCuts = async (req, res, next) => {
  try {
    const { username } = req.params;

    const messCuts = await MessCut.find({ username }).sort({ createdAt: -1 });

    res.json({
      username,
      count: messCuts.length,
      messCuts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessCut,
  getAllMessCuts,
  approveMessCut,
  rejectMessCut,
  getStudentMessCuts,
};
