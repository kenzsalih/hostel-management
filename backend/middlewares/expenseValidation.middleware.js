const { body } = require('express-validator');

const createExpenseValidator = [
  body('item_name')
    .trim()
    .isLength({ min: 2, max: 160 })
    .withMessage('item_name must be 2-160 characters'),
  body('quantity').isFloat({ gt: 0 }).withMessage('quantity must be greater than 0'),
  body('price').isFloat({ gt: 0 }).withMessage('price must be greater than 0'),
  body('purchased_from')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('purchased_from must be 2-255 characters'),
  body('date').optional({ values: 'falsy' }).isISO8601().withMessage('date must be a valid date'),
];

module.exports = {
  createExpenseValidator,
};
