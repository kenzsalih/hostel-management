const express = require('express');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const cookController = require('../controllers/cookController');

const router = express.Router();

router.get('/meal-count', authorizeRoles('cook'), cookController.getMealCount);

module.exports = router;
