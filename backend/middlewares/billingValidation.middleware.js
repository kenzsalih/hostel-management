const { param } = require('express-validator');

const billingParamsValidator = [
  param('month').isInt({ min: 1, max: 12 }).withMessage('month must be an integer from 1 to 12'),
  param('year').isInt({ min: 2000, max: 9999 }).withMessage('year must be a four-digit integer'),
];

module.exports = {
  billingParamsValidator,
};
