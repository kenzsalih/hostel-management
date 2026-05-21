const logger = require('../utils/logger');
const { nodeEnv } = require('../config/env');

// Global error handler middleware (use at the very end)
const errorHandler = (error, req, res, next) => {
  const status = error.statusCode || error.status || 500;
  let message = error.message || 'Internal Server Error';
  let code = error.code || 'INTERNAL_ERROR';
  let details;

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    details = Object.values(error.errors).map((item) => item.message);
  }

  // Mongoose cast error (invalid ID)
  if (error.name === 'CastError' && !details) {
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  }

  // Duplicate key error
  if (error.code === 11000 && !details) {
    const field = Object.keys(error.keyPattern)[0];
    message = `${field} already exists`;
    code = 'DUPLICATE_KEY';
  }

  if (error.type === 'validation' && error.errors) {
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    details = error.errors;
  }

  if (
    ['ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR'].includes(
      error.code
    )
  ) {
    message = 'Database service unavailable';
    code = 'DATABASE_UNAVAILABLE';
  }

  const safeStatus = code === 'DATABASE_UNAVAILABLE' ? 503 : status;

  if (safeStatus >= 500) {
    logger.error('Unhandled request error', {
      requestId: req.id,
      status: safeStatus,
      code,
      method: req.method,
      path: req.originalUrl,
      error: error.message,
      stack: error.stack,
    });
  }

  const response = {
    success: false,
    message,
    code,
    ...(details ? { details } : {}),
  };

  if (nodeEnv !== 'production' && safeStatus >= 500) {
    response.stack = error.stack;
  }

  res.status(safeStatus).json(response);
};

module.exports = errorHandler;
