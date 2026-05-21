const { body, param, query } = require('express-validator');

const roleValues = ['student', 'mess_secretary', 'cook', 'warden'];
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

const monthQueryValidator = [
  query('month').matches(monthPattern).withMessage('month must be in format YYYY-MM'),
];

const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1-100'),
];

const createUserValidator = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('username')
    .trim()
    .toLowerCase()
    .matches(/^[a-zA-Z0-9_]{3,20}$/)
    .withMessage('Username must be 3-20 characters with letters, numbers, or underscore'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage('Password must include uppercase, lowercase, and a number'),
  body('role').isIn(roleValues).withMessage('Invalid role'),
  body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  body('rollNumber').optional({ values: 'falsy' }).trim().isLength({ max: 30 }),
];

const loginValidator = [
  body('username').trim().toLowerCase().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const idParamValidator = [
  param('id').isMongoId().withMessage('Invalid id parameter'),
];

const messCutApplyValidator = [
  body('fromDate').isISO8601().withMessage('fromDate must be a valid date'),
  body('toDate').isISO8601().withMessage('toDate must be a valid date'),
];

const expenseCreateValidator = [
  body('amount').isFloat({ gt: 0 }).withMessage('amount must be greater than 0'),
  body('category').trim().isLength({ min: 2, max: 80 }).withMessage('category must be 2-80 characters'),
  body('description')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('description must be 3-500 characters'),
  body('date').optional({ values: 'falsy' }).isISO8601().withMessage('date must be a valid date'),
];

const announcementCreateValidator = [
  body('title').trim().isLength({ min: 3, max: 150 }).withMessage('title must be 3-150 characters'),
  body('content').trim().isLength({ min: 5, max: 2000 }).withMessage('content must be 5-2000 characters'),
];

const billingGenerateValidator = [
  body('month').matches(monthPattern).withMessage('month must be in format YYYY-MM'),
];

const billingPayValidator = [
  body('billId').isMongoId().withMessage('billId must be a valid Mongo ObjectId'),
];

const billListValidator = [
  ...paginationValidator,
  query('month')
    .optional({ values: 'falsy' })
    .matches(monthPattern)
    .withMessage('month must be in format YYYY-MM'),
];

module.exports = {
  createUserValidator,
  loginValidator,
  idParamValidator,
  paginationValidator,
  monthQueryValidator,
  messCutApplyValidator,
  expenseCreateValidator,
  announcementCreateValidator,
  billingGenerateValidator,
  billingPayValidator,
  billListValidator,
};
