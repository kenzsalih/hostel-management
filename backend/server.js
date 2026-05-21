const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
require('./config/env'); // Load and validate environment variables
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler.middleware');
const noCache = require('./middleware/noCache.middleware');
const logger = require('./utils/logger');
const { corsOrigins, nodeEnv, port } = require('./config/env');

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors((req, callback) => {
    const requestOrigin = req.header('Origin');

    if (!requestOrigin) {
      return callback(null, { origin: false, credentials: false });
    }

    const isAllowedOrigin = corsOrigins.includes(requestOrigin);
    return callback(null, {
      origin: isAllowedOrigin ? requestOrigin : false,
      credentials: isAllowedOrigin,
    });
  })
);
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
});
morgan.token('id', (req) => req.id || '-');
morgan.token('safe-url', (req) => req.originalUrl.split('?')[0]);
app.use(
  morgan(':date[iso] :id :remote-addr :method :safe-url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'Server is running',
      environment: nodeEnv,
    },
  });
});

// Import and use routes
const routes = require('./routes');
app.use('/api', noCache, routes);

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    code: 'NOT_FOUND',
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
    message: 'Route not found',
    code: 'NOT_FOUND',
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = port || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`API Health Check: http://localhost:${PORT}/api/health`);
      if (hasFrontendBuild) {
        logger.info(`Serving React build from ${frontendBuildPath}`);
      } else if (nodeEnv === 'production') {
        logger.warn('Frontend build not found; direct browser route refreshes may fail');
      }
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
