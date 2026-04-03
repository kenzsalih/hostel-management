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

  if (status >= 500) {
    console.error('Error:', error);
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
};

module.exports = errorHandler;
