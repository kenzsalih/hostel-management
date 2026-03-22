const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
