// Global error handler middleware (use at the very end)
const errorHandler = (error, req, res, next) => {
  console.error('Error:', error.message);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  // Mongoose cast error (invalid ID)
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // Duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(400).json({ error: `${field} already exists` });
  }

  // Default server error
  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
