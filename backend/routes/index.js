const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const announcementsRoutes = require('./announcements.routes');
const messCutRoutes = require('./messCut.routes');
const expensesRoutes = require('./expenses.routes');
const billingRoutes = require('./billing.routes');
const cookRoutes = require('./cook.routes');
const authMiddleware = require('../middleware/auth.middleware');
const { authRateLimiter, apiRateLimiter } = require('../middleware/rateLimit.middleware');

router.use('/auth', authRateLimiter, authRoutes);
router.use(authMiddleware);
router.use(apiRateLimiter);

router.use('/announcements', announcementsRoutes);
router.use('/mess-cut', messCutRoutes);
router.use('/expenses', expensesRoutes);
router.use('/billing', billingRoutes);
router.use('/cook', cookRoutes);

module.exports = router;
