// Middleware to check user role (use AFTER authMiddleware)
const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required role(s): ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

module.exports = roleAuth;
