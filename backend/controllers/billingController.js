const asyncHandler = require('../middleware/asyncHandler.middleware');
const billingService = require('../services/billing.service');

const generateBilling = asyncHandler(async (req, res) => {
  const data = await billingService.generateBilling(req.body, req.user);

  res.status(201).json({
    success: true,
    data,
  });
});

const getMyBills = asyncHandler(async (req, res) => {
  const data = await billingService.getMyBills(req.user, req.query);

  res.json({
    success: true,
    data,
  });
});

const payBill = asyncHandler(async (req, res) => {
  const data = await billingService.payBill(req.user, req.body);

  res.json({
    success: true,
    data,
  });
});

module.exports = {
  generateBilling,
  getMyBills,
  payBill,
};
