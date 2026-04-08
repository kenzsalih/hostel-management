const { verifyToken } = require('../config/jwt');
const { getActiveUserByIdOrFail, normalizeUserId } = require('../services/userContext.service');

const authenticateJwt = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token is required',
    });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    const tokenUserId = normalizeUserId(decoded.userId || decoded.id);
    const user = await getActiveUserByIdOrFail(tokenUserId);

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      username: user.username,
      isActive: Boolean(user.isActive),
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = authenticateJwt;
