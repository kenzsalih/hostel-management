const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { mongoUri } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri);

    logger.info(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
