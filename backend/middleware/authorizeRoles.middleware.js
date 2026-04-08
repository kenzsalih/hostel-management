const ROLE_ALIASES = {
  admin: 'warden',
  resident: 'student',
};

const normalizeRole = (role) => {
  const normalized = String(role || '').trim().toLowerCase();
  return ROLE_ALIASES[normalized] || normalized;
};

const authorizeRoles = (...roles) => {
  const normalizedAllowedRoles = roles.map(normalizeRole);

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const requesterRole = normalizeRole(req.user.role);
    if (!normalizedAllowedRoles.includes(requesterRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied for this role',
      });
    }

    return next();
  };
};

module.exports = authorizeRoles;
