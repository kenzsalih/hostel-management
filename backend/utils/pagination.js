const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
};

const getPagination = (query = {}) => {
  const page = parsePositiveInt(query.page, 1);
  const requestedLimit = parsePositiveInt(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    maxLimit: MAX_LIMIT,
  };
};

module.exports = {
  getPagination,
  MAX_LIMIT,
  DEFAULT_LIMIT,
};
