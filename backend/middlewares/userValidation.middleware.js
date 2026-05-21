const { body, param } = require('express-validator');
const { ROLE_VALUES } = require('../services/user.service');

const userIdParamValidator = [
  param('id').isMongoId().withMessage('id must be a valid Mongo ObjectId'),
];

const createUserValidator = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('name must be 2-120 characters'),
  body('email').trim().isEmail().withMessage('valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8, max: 72 }).withMessage('password must be 8-72 characters'),
  body('role').isIn(ROLE_VALUES).withMessage('invalid role value'),
];

const updateUserValidator = [
  body('name')
    .optional({ nullable: false })
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('name must be 2-120 characters'),
  body('email')
    .optional({ nullable: false })
    .trim()
    .isEmail()
    .withMessage('valid email is required')
    .normalizeEmail(),
  body('password')
    .optional({ nullable: false })
    .isLength({ min: 8, max: 72 })
    .withMessage('password must be 8-72 characters'),
  body('role').optional({ nullable: false }).isIn(ROLE_VALUES).withMessage('invalid role value'),
  body('isActive').optional({ nullable: false }).isBoolean().withMessage('isActive must be boolean'),
];

module.exports = {
  userIdParamValidator,
  createUserValidator,
  updateUserValidator,
};
