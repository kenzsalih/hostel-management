const asyncHandler = require('../middleware/asyncHandler.middleware');
const userService = require('../services/user.service');

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();

  res.json({
    success: true,
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (req.user.role === 'student' && String(req.user.id) !== String(user.id)) {
    return res.status(403).json({
      success: false,
      message: 'Students can only access their own user record',
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user);

  res.json({
    success: true,
    data: user,
  });
});

const deactivateUser = asyncHandler(async (req, res) => {
  const user = await userService.deactivateUser(req.params.id, req.user);

  res.json({
    success: true,
    data: user,
  });
});

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deactivateUser,
};
