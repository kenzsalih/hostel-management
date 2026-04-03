const roleAuth = require('./roleAuth.middleware');

const authorize = (allowedRoles = []) => roleAuth(allowedRoles);

module.exports = authorize;
