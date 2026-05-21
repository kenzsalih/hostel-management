const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const validateRequest = require('../middleware/validate.middleware');
const { loginValidator, createUserValidator } = require('../validators/requestValidators');
const {
	registerUser,
	createUserByRole,
	loginUser,
	getCurrentUser,
} = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);

// Authorized account creation
router.post(
	'/users',
	authMiddleware,
	authorizeRoles('warden'),
	createUserValidator,
	validateRequest,
	createUserByRole
);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
