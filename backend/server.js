const express = require('express');
const cors = require('cors');
require('./config/env'); // Load and validate environment variables
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler.middleware');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
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
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Health Check: http://localhost:${PORT}/api/health\n`);
});
