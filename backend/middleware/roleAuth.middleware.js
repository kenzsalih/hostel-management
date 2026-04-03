const ROLE_ALIASES = {
  messsec: 'mess_secretary',
};

const normalizeRole = (role) => ROLE_ALIASES[role] || role;

// Middleware to check user role (use AFTER authMiddleware)
const roleAuth = (allowedRoles) => {
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
    }

    if (!normalizedAllowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Required role(s): ${normalizedAllowedRoles.join(', ')}`,
        },
      });
    }

    next();
  };
};

module.exports = roleAuth;
