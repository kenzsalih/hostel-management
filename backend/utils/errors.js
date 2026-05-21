// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error responses
const errors = {
  UNAUTHORIZED: new AppError('Unauthorized access', 401),
  FORBIDDEN: new AppError('Forbidden', 403),
  NOT_FOUND: new AppError('Resource not found', 404),
  DUPLICATE_ENTRY: new AppError('Duplicate entry', 400),
  INVALID_INPUT: new AppError('Invalid input', 400),
  SERVER_ERROR: new AppError('Internal server error', 500),
};

module.exports = { AppError, errors };
