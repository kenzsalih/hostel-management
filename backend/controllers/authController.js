const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { AppError } = require('../utils/errors');

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  role: user.role,
  email: user.email,
  rollNumber: user.rollNumber,
});

// Public registration is intentionally disabled.
const registerUser = async (req, res) => {
  return res.status(403).json({
    success: false,
    error: {
      code: 'PUBLIC_REGISTRATION_DISABLED',
      message: 'Public registration is disabled. Contact warden office for account creation.',
    },
  });
};

// Authorized account creation (warden, optionally mess secretary)
const createUserByRole = async (req, res, next) => {
  try {
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
      $or: [
        { username: normalizedUsername },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      ],
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

    res.status(201).json({
      success: true,
      message: 'User account created successfully',
      user: toSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const normalizedUsername = username.toLowerCase();

    // Find user and include password field
    const user = await User.findOne({ username: normalizedUsername }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      user: toSafeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  createUserByRole,
  loginUser,
  getCurrentUser,
};
