const express = require('express');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const validateRequest = require('../middleware/validate.middleware');
const {
  messCutApplyValidator,
  idParamValidator,
} = require('../validators/requestValidators');
const messCutController = require('../controllers/messCutController');

const router = express.Router();

router.post(
  '/apply',
  authorizeRoles('student'),
  messCutApplyValidator,
  validateRequest,
  messCutController.applyMessCut
);

router.get('/my', authorizeRoles('student'), messCutController.getMyMessCuts);

router.get('/pending', authorizeRoles('mess_secretary'), messCutController.getPendingMessCuts);

router.patch(
  '/:id/approve',
  authorizeRoles('mess_secretary'),
  idParamValidator,
  validateRequest,
  messCutController.approveMessCut
);

router.patch(
  '/:id/reject',
  authorizeRoles('mess_secretary'),
  idParamValidator,
  validateRequest,
  messCutController.rejectMessCut
);

module.exports = router;
