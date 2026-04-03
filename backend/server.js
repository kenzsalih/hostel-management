const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');
require('./config/env'); // Load and validate environment variables
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler.middleware');
const noCache = require('./middleware/noCache.middleware');
const logger = require('./utils/logger');
const { corsOrigin, nodeEnv } = require('./config/env');

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
  })
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Import and use routes
const routes = require('./routes');
app.use('/api', noCache, routes);

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API route not found',
    },
  });
});

const frontendBuildPath = path.resolve(__dirname, '../frontend/build');
const frontendIndexPath = path.join(frontendBuildPath, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexPath);

if (hasFrontendBuild) {
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(frontendIndexPath);
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`API Health Check: http://localhost:${PORT}/api/health`);
  if (hasFrontendBuild) {
    logger.info(`Serving React build from ${frontendBuildPath}`);
  } else if (nodeEnv === 'production') {
    logger.warn('Frontend build not found; direct browser route refreshes may fail');
  }
});
