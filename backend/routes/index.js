const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const messcutsRoutes = require('./messcuts.routes');
const groceriesRoutes = require('./groceries.routes');
const announcementsRoutes = require('./announcements.routes');
const billsRoutes = require('./bills.routes');

// Register routes
router.use('/auth', authRoutes);
router.use('/messcuts', messcutsRoutes);
router.use('/groceries', groceriesRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/bills', billsRoutes);

module.exports = router;
