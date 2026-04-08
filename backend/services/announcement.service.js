const Announcement = require('../models/Announcement');
const { AppError } = require('../utils/errors');

const createAnnouncement = async (payload, actor) => {
  if (actor?.role !== 'mess_secretary') {
    throw new AppError('Only mess secretary can create announcements', 403);
  }

  const announcement = await Announcement.create({
    title: String(payload.title || '').trim(),
    content: String(payload.content || '').trim(),
    createdBy: actor.userId,
  });

  return announcement;
};

const listAnnouncements = async () => {
  return Announcement.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name username role');
};

module.exports = {
  createAnnouncement,
  listAnnouncements,
};
