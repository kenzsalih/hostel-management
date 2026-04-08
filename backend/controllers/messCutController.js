const asyncHandler = require('../middleware/asyncHandler.middleware');
const messCutService = require('../services/messCut.service');

const applyMessCut = asyncHandler(async (req, res) => {
  const request = await messCutService.applyMessCut(req.body, req.user);

  res.status(201).json({
    success: true,
    data: request,
  });
});

const getMyMessCuts = asyncHandler(async (req, res) => {
  const requests = await messCutService.getMyMessCuts(req.user);

  res.json({
    success: true,
    data: requests,
  });
});

const getPendingMessCuts = asyncHandler(async (req, res) => {
  const requests = await messCutService.getPendingMessCutRequests(req.user);

  res.json({
    success: true,
    data: requests,
  });
});

const approveMessCut = asyncHandler(async (req, res) => {
  const updated = await messCutService.approveMessCut(req.params.id, req.user);

  res.json({
    success: true,
    data: updated,
  });
});

const rejectMessCut = asyncHandler(async (req, res) => {
  const updated = await messCutService.rejectMessCut(req.params.id, req.user);

  res.json({
    success: true,
    data: updated,
  });
});

module.exports = {
  applyMessCut,
  getMyMessCuts,
  getPendingMessCuts,
  approveMessCut,
  rejectMessCut,
};
