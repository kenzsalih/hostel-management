const express = require('express');
const authenticateJwt = require('../middlewares/jwtAuth.middleware');
const allowRoles = require('../middlewares/rbac.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const {
  userIdParamValidator,
  createUserValidator,
  updateUserValidator,
} = require('../middlewares/userValidation.middleware');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/', authenticateJwt, allowRoles('admin'), createUserValidator, validateRequest, userController.createUser);

router.get('/', authenticateJwt, allowRoles('admin', 'mess_secretary'), userController.listUsers);

router.get(
  '/:id',
  authenticateJwt,
  allowRoles('admin', 'mess_secretary', 'resident'),
  userIdParamValidator,
  validateRequest,
  userController.getUserById
);

router.patch(
  '/:id',
  authenticateJwt,
  allowRoles('admin', 'resident'),
  userIdParamValidator,
  updateUserValidator,
  validateRequest,
  userController.updateUser
);

router.delete(
  '/:id',
  authenticateJwt,
  allowRoles('admin'),
  userIdParamValidator,
  validateRequest,
  userController.deactivateUser
);

module.exports = router;
