const asyncHandler = require('../middleware/asyncHandler.middleware');
const announcementService = require('../services/announcement.service');

const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await announcementService.createAnnouncement(req.body, req.user);

  res.status(201).json({
    success: true,
    data: announcement,
  });
});

const getAllAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await announcementService.listAnnouncements();

  res.json({
    success: true,
    data: announcements,
  });
});

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
};
