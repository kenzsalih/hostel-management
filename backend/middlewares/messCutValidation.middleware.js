const { body, param } = require('express-validator');

const messCutCreateValidator = [
  body('from_date').isISO8601().withMessage('from_date must be a valid date'),
  body('to_date').isISO8601().withMessage('to_date must be a valid date'),
];

const messCutUserIdParamValidator = [
  param('id').isMongoId().withMessage('id must be a valid Mongo ObjectId'),
];

const messCutIdParamValidator = [
  param('id').isMongoId().withMessage('id must be a valid Mongo ObjectId'),
];

const messCutStatusUpdateValidator = [
  body('status')
    .trim()
    .toLowerCase()
    .isIn(['approved', 'rejected'])
    .withMessage('status must be approved or rejected'),
];

module.exports = {
  messCutCreateValidator,
  messCutUserIdParamValidator,
  messCutIdParamValidator,
  messCutStatusUpdateValidator,
};
