const { body, param, query } = require('express-validator');

const roleValues = ['student', 'mess_secretary', 'cook', 'warden'];
const groceryUnits = ['kg', 'liter', 'piece', 'box', 'dozen'];
const groceryCategories = ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'spices', 'oil', 'other'];
const announcementPriorities = ['low', 'medium', 'high'];

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

const usernameParamValidator = [
  param('username')
    .trim()
    .toLowerCase()
    .matches(/^[a-zA-Z0-9_]{3,20}$/)
    .withMessage('Invalid username parameter'),
];

const messCutCreateValidator = [
  body('fromDate').isISO8601().withMessage('fromDate must be a valid date'),
  body('toDate').isISO8601().withMessage('toDate must be a valid date'),
];

const messCutRejectValidator = [
  body('rejectionReason').optional({ values: 'falsy' }).trim().isLength({ max: 300 }),
];

const groceriesCreateValidator = [
  body('itemName').trim().isLength({ min: 2, max: 120 }).withMessage('Item name must be 2-120 characters'),
  body('quantity').isFloat({ gt: 0 }).withMessage('Quantity must be greater than 0'),
  body('unit').optional().isIn(groceryUnits).withMessage('Invalid grocery unit'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('purchaseLocation')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Purchase location must be 2-120 characters'),
  body('category').optional().isIn(groceryCategories).withMessage('Invalid category'),
];

const groceriesDateRangeValidator = [
  query('startDate').isISO8601().withMessage('startDate must be valid date'),
  query('endDate').isISO8601().withMessage('endDate must be valid date'),
];

const announcementsCreateValidator = [
  body('title').trim().isLength({ min: 3, max: 150 }).withMessage('Title must be 3-150 characters'),
  body('message').trim().isLength({ min: 5, max: 2000 }).withMessage('Message must be 5-2000 characters'),
  body('priority').optional().isIn(announcementPriorities).withMessage('Invalid priority'),
  body('expiryDate').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid expiryDate'),
];

const announcementsRoleParamValidator = [
  param('role').isIn(['mess_secretary', 'cook', 'warden']).withMessage('Invalid role parameter'),
];

const generateBillsValidator = [
  body('month')
    .trim()
    .matches(/^[A-Za-z]+-\d{4}$/)
    .withMessage('Month must be in format Month-YYYY, e.g. March-2026'),
  body('startDate').isISO8601().withMessage('startDate must be valid date'),
  body('endDate').isISO8601().withMessage('endDate must be valid date'),
];

module.exports = {
  createUserValidator,
  loginValidator,
  idParamValidator,
  usernameParamValidator,
  messCutCreateValidator,
  messCutRejectValidator,
  groceriesCreateValidator,
  groceriesDateRangeValidator,
  announcementsCreateValidator,
  announcementsRoleParamValidator,
  generateBillsValidator,
};
