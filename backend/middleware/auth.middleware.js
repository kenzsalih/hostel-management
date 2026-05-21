const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const invalidTokenResponse = (res) =>
  res.status(401).json({
    success: false,
    message: 'Invalid or expired token',
  });

const invalidTokenErrorNames = new Set(['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError']);

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required',
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      if (invalidTokenErrorNames.has(error.name)) {
        return invalidTokenResponse(res);
      }
      throw error;
    }

    if (!decoded || !decoded.userId) {
      return invalidTokenResponse(res);
    }

    const user = await User.findById(decoded.userId).select('name username role');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    req.user = {
      userId: user._id.toString(),
      name: user.name,
      username: user.username,
      role: user.role,
      tokenRole: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
