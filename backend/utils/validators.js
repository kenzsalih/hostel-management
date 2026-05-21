// Validation helpers

const isValidRole = (role) => {
  const validRoles = ['student', 'mess_secretary', 'cook', 'warden'];
  return validRoles.includes(role);
};

const isValidUsername = (username) => {
  // Username: 3-20 chars, alphanumeric and underscore
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password) => {
  // Min 6 chars, at least 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return regex.test(password);
};

const isValidDateRange = (fromDate, toDate) => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  return from < to;
};

const isValidMessCutStatus = (status) => {
  const validStatuses = ['pending', 'approved', 'rejected'];
  return validStatuses.includes(status);
};

module.exports = {
  isValidRole,
  isValidUsername,
  isValidEmail,
  isValidPassword,
  isValidDateRange,
  isValidMessCutStatus,
};
