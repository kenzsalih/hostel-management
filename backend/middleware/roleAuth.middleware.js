const ROLE_ALIASES = {
  messsec: 'mess_secretary',
  admin: 'warden',
};

const normalizeRole = (role) => ROLE_ALIASES[role] || role;

// Middleware to check user role (use AFTER authMiddleware)
const roleAuth = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const normalizedAllowedRoles = roles.map(normalizeRole);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const requesterRole = normalizeRole(req.user.role);

    if (!normalizedAllowedRoles.includes(requesterRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${normalizedAllowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = roleAuth;
