const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
};
