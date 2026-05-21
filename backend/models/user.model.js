const User = require('./User');

const ROLE_ALIASES = {
  admin: 'warden',
  resident: 'student',
};

const normalizeRole = (role) => {
  const normalized = String(role || '').trim().toLowerCase();
  return ROLE_ALIASES[normalized] || normalized;
};

const toUserRecord = (userDoc) => {
  if (!userDoc) {
    return null;
  }

  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    username: userDoc.username,
    email: userDoc.email,
    role: userDoc.role,
    isActive: userDoc.isActive !== false,
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
  };
};

const toUsernameBaseFromEmail = (email) => {
  const localPart = String(email || '').split('@')[0] || 'user';
  const cleaned = localPart.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '');
  return (cleaned || 'user').slice(0, 20);
};

const generateUniqueUsername = async (email) => {
  const base = toUsernameBaseFromEmail(email);
  let candidate = base;
  let suffix = 1;

  while (await User.exists({ username: candidate })) {
    const suffixText = String(suffix);
    const maxBaseLength = Math.max(1, 20 - suffixText.length);
    candidate = `${base.slice(0, maxBaseLength)}${suffixText}`;
    suffix += 1;
  }

  return candidate;
};

const createUser = async ({ name, email, password, role }) => {
  const username = await generateUniqueUsername(email);
  const user = new User({
    name,
    username,
    email,
    password,
    role: normalizeRole(role),
    isActive: true,
  });

  await user.save();
  return user._id.toString();
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email }).lean();
  return toUserRecord(user);
};

const findUserById = async (id) => {
  const user = await User.findById(id).lean();
  return toUserRecord(user);
};

const listUsers = async () => {
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return users.map(toUserRecord);
};

const updateUser = async (id, updates = {}) => {
  const user = await User.findById(id).select('+password');
  if (!user) {
    return false;
  }

  let hasUpdates = false;

  if (updates.name !== undefined) {
    user.name = updates.name;
    hasUpdates = true;
  }

  if (updates.email !== undefined) {
    user.email = updates.email;
    hasUpdates = true;
  }

  if (updates.password !== undefined) {
    user.password = updates.password;
    hasUpdates = true;
  }

  if (updates.role !== undefined) {
    user.role = normalizeRole(updates.role);
    hasUpdates = true;
  }

  if (updates.isActive !== undefined) {
    user.isActive = Boolean(updates.isActive);
    hasUpdates = true;
  }

  if (!hasUpdates) {
    return false;
  }

  await user.save();
  return true;
};

const deactivateUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    return false;
  }

  if (user.isActive === false) {
    return false;
  }

  user.isActive = false;
  await user.save();
  return true;
};

const countActiveAdmins = async () => {
  return User.countDocuments({
    role: 'warden',
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUser,
  deactivateUser,
  countActiveAdmins,
};
