const express = require('express');
const authorizeRoles = require('../middleware/authorizeRoles.middleware');
const validateRequest = require('../middleware/validate.middleware');
const { billingGenerateValidator, billingPayValidator, billListValidator } = require('../validators/requestValidators');
const billingController = require('../controllers/billingController');

const router = express.Router();

router.post(
  '/generate',
  authorizeRoles('warden'),
  billingGenerateValidator,
  validateRequest,
  billingController.generateBilling
);

router.get('/my', authorizeRoles('student'), billListValidator, validateRequest, billingController.getMyBills);

router.patch('/pay', authorizeRoles('student'), billingPayValidator, validateRequest, billingController.payBill);

module.exports = router;
