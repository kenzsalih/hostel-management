const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('./env');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
};

// Verify JWT token
const verifyToken = (token) => jwt.verify(token, jwtSecret);

module.exports = {
  generateToken,
  verifyToken,
};
