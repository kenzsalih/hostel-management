const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../middleware/asyncHandler.middleware');

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  role: user.role,
  email: user.email,
  rollNumber: user.rollNumber,
});

// Public registration is intentionally disabled.
const registerUser = asyncHandler(async (req, res) => {
  return res.status(403).json({
    success: false,
    message: 'Public registration is disabled. Contact warden office for account creation.',
    code: 'PUBLIC_REGISTRATION_DISABLED',
  });
});

// Authorized account creation (warden, optionally mess secretary)
const createUserByRole = asyncHandler(async (req, res) => {
  const { name, username, password, role, email, rollNumber } = req.body;
  const creatorRole = req.user.role;

  if (creatorRole === 'mess_secretary' && role !== 'student') {
    throw new AppError('Mess secretary can only create student accounts', 403);
  }

  if (role === 'warden' && creatorRole !== 'warden') {
    throw new AppError('Only warden can create warden accounts', 403);
  }

  const normalizedUsername = username.toLowerCase();
  const normalizedEmail = email?.toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ username: normalizedUsername }, ...(normalizedEmail ? [{ email: normalizedEmail }] : [])],
  });

  if (existingUser) {
    throw new AppError('User already exists with provided username/email', 409);
  }

  if (rollNumber) {
    const duplicateRoll = await User.findOne({ rollNumber });
    if (duplicateRoll) {
      throw new AppError('rollNumber already exists', 409);
    }
  }

  const user = new User({
    name,
    username: normalizedUsername,
    password,
    role,
    email: normalizedEmail,
    rollNumber,
  });

  await user.save();

  const safeUser = toSafeUser(user);
  res.status(201).json({
    success: true,
    data: {
      message: 'User account created successfully',
      user: safeUser,
    },
    message: 'User account created successfully',
    user: safeUser,
  });
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const normalizedUsername = username.toLowerCase();

  const user = await User.findOne({ username: normalizedUsername }).select('+password');
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user);
  const safeUser = toSafeUser(user);

  res.json({
    success: true,
    data: {
      message: 'Login successful',
      token,
      user: safeUser,
    },
    message: 'Login successful',
    token,
    user: safeUser,
  });
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const safeUser = toSafeUser(user);
  res.json({
    success: true,
    data: {
      user: safeUser,
    },
    user: safeUser,
  });
});

module.exports = {
  registerUser,
  createUserByRole,
  loginUser,
  getCurrentUser,
};
