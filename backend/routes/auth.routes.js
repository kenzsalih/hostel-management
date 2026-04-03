const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const validateRequest = require('../middleware/validate.middleware');
const { allowMessSecretaryUserCreation } = require('../config/env');
const { loginValidator, createUserValidator } = require('../validators/requestValidators');
const {
	registerUser,
	createUserByRole,
	loginUser,
	getCurrentUser,
} = require('../controllers/authController');

const accountCreatorRoles = allowMessSecretaryUserCreation
	? ['warden', 'mess_secretary']
	: ['warden'];

// Public routes
router.post('/register', registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);

// Authorized account creation
router.post(
	'/users',
	authMiddleware,
	authorize(accountCreatorRoles),
	createUserValidator,
	validateRequest,
	createUserByRole
);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
