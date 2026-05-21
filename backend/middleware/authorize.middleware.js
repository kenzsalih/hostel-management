const authorizeRoles = require('./authorizeRoles.middleware');

const authorize = (allowedRoles = []) => authorizeRoles(...allowedRoles);

module.exports = authorize;
module.exports.allowRoles = authorizeRoles;
module.exports.authorizeRoles = authorizeRoles;
