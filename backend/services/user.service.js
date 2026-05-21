const { AppError } = require('../utils/errors');
const userModel = require('../models/user.model');

const ROLE_VALUES = ['warden', 'mess_secretary', 'student', 'cook'];
const ROLE_ALIASES = {
  admin: 'warden',
  resident: 'student',
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const normalizeRole = (role) => {
  const normalized = String(role || '').trim().toLowerCase();
  return ROLE_ALIASES[normalized] || normalized;
};

const assertValidRole = (role) => {
  const normalizedRole = normalizeRole(role);

  if (!ROLE_VALUES.includes(normalizedRole)) {
    throw new AppError('Invalid role value', 400);
  }

  return normalizedRole;
};

const createUser = async ({ name, email, password, role }) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = assertValidRole(role);

  const existing = await userModel.findUserByEmail(normalizedEmail);
  if (existing) {
    throw new AppError('Email is already in use', 409);
  }

  const id = await userModel.createUser({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: normalizedRole,
  });

  return userModel.findUserById(id);
};

const listUsers = async () => userModel.listUsers();

const getUserById = async (id) => {
  const user = await userModel.findUserById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

const updateUser = async (id, payload, actor) => {
  const targetUser = await userModel.findUserById(id);
  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  const actorRole = normalizeRole(actor?.role);
  const isAdmin = actorRole === 'warden';
  const isSelf = String(actor?.id) === String(id);

  if (!isAdmin && !isSelf) {
    throw new AppError('You can only update your own profile', 403);
  }

  if (!isAdmin && (payload.role !== undefined || payload.isActive !== undefined)) {
    throw new AppError('Only warden can change role or activation status', 403);
  }

  const updates = {};

  if (payload.name !== undefined) {
    updates.name = payload.name.trim();
  }

  if (payload.email !== undefined) {
    const normalizedEmail = normalizeEmail(payload.email);
    const existingByEmail = await userModel.findUserByEmail(normalizedEmail);
    if (existingByEmail && String(existingByEmail.id) !== String(id)) {
      throw new AppError('Email is already in use', 409);
    }
    updates.email = normalizedEmail;
  }

  if (payload.password !== undefined) {
    updates.password = payload.password;
  }

  if (payload.role !== undefined) {
    const nextRole = assertValidRole(payload.role);

    if (targetUser.role === 'warden' && nextRole !== 'warden') {
      const activeAdmins = await userModel.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new AppError('At least one active warden must remain in the system', 400);
      }
    }

    updates.role = nextRole;
  }

  if (payload.isActive !== undefined) {
    if (targetUser.role === 'warden' && !payload.isActive) {
      const activeAdmins = await userModel.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new AppError('At least one active warden must remain in the system', 400);
      }
    }

    updates.isActive = Boolean(payload.isActive);
  }

  const didUpdate = await userModel.updateUser(id, updates);
  if (!didUpdate) {
    throw new AppError('No valid fields provided for update', 400);
  }

  return userModel.findUserById(id);
};

const deactivateUser = async (id, actor) => {
  if (String(actor?.id) === String(id)) {
    throw new AppError('Warden cannot deactivate their own account', 400);
  }

  const targetUser = await userModel.findUserById(id);
  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  if (targetUser.role === 'warden') {
    const activeAdmins = await userModel.countActiveAdmins();
    if (activeAdmins <= 1) {
      throw new AppError('At least one active warden must remain in the system', 400);
    }
  }

  const deactivated = await userModel.deactivateUser(id);
  if (!deactivated) {
    throw new AppError('User is already deactivated', 400);
  }

  return userModel.findUserById(id);
};

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deactivateUser,
  ROLE_VALUES,
};
