const { AppError } = require('../utils/errors');
const mongoose = require('mongoose');
const userModel = require('../models/user.model');

const normalizeUserId = (userId) => {
  const id = String(userId || '').trim();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user id in token context', 401);
  }

  return id;
};

const getUserByIdOrFail = async (userId) => {
  const id = normalizeUserId(userId);
  const user = await userModel.findUserById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const getActiveUserByIdOrFail = async (userId) => {
  const user = await getUserByIdOrFail(userId);

  if (!user.isActive) {
    throw new AppError('User account is deactivated', 401);
  }

  return user;
};

const getActiveUserByIdAndRoleOrFail = async (userId, expectedRoles = []) => {
  const roles = Array.isArray(expectedRoles) ? expectedRoles : [expectedRoles];
  const user = await getActiveUserByIdOrFail(userId);

  if (roles.length > 0 && !roles.includes(user.role)) {
    throw new AppError('User role is not authorized for this operation', 403);
  }

  return user;
};

module.exports = {
  normalizeUserId,
  getUserByIdOrFail,
  getActiveUserByIdOrFail,
  getActiveUserByIdAndRoleOrFail,
};
