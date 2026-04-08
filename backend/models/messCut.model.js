const MessCutRecord = require('./MessCutRecord');

const toDateValue = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toMessCutRecord = (doc) => {
  if (!doc) {
    return null;
  }

  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    fromDate: doc.fromDate.toISOString().slice(0, 10),
    toDate: doc.toDate.toISOString().slice(0, 10),
    status: doc.status,
    reviewedBy: doc.reviewedBy ? doc.reviewedBy.toString() : null,
    reviewedAt: doc.reviewedAt || null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

const createMessCut = async ({ userId, fromDate, toDate }) => {
  const created = await MessCutRecord.create({
    userId,
    fromDate: toDateValue(fromDate),
    toDate: toDateValue(toDate),
    status: 'pending',
  });

  return created._id.toString();
};

const findMessCutById = async (id) => {
  const record = await MessCutRecord.findById(id).lean();
  return toMessCutRecord(record);
};

const findOverlappingMessCut = async ({ userId, fromDate, toDate }) => {
  const record = await MessCutRecord.findOne({
    userId,
    fromDate: { $lte: toDateValue(toDate) },
    toDate: { $gte: toDateValue(fromDate) },
  })
    .select('_id')
    .lean();

  return record ? { id: record._id.toString() } : null;
};

const listMessCutsByUserId = async (userId) => {
  const records = await MessCutRecord.find({ userId }).sort({ createdAt: -1 }).lean();
  return records.map(toMessCutRecord);
};

const listAllMessCuts = async () => {
  const records = await MessCutRecord.find({}).sort({ createdAt: -1 }).lean();
  return records.map(toMessCutRecord);
};

const updateMessCutStatus = async ({ id, status }) => {
  const updated = await MessCutRecord.findByIdAndUpdate(
    id,
    {
      status,
      reviewedAt: new Date(),
    },
    { new: true }
  ).lean();

  return Boolean(updated);
};

module.exports = {
  createMessCut,
  findMessCutById,
  findOverlappingMessCut,
  listMessCutsByUserId,
  listAllMessCuts,
  updateMessCutStatus,
};
