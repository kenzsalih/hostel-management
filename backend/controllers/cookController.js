const asyncHandler = require('../middleware/asyncHandler.middleware');
const cookService = require('../services/cook.service');

const getMealCount = asyncHandler(async (req, res) => {
  const data = await cookService.getMealCountForToday(req.user);

  res.json({
    success: true,
    data,
  });
});

module.exports = {
  getMealCount,
};
