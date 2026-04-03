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
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  allowMessSecretaryUserCreation:
    String(process.env.ALLOW_MESS_SECRETARY_USER_CREATION || 'false').toLowerCase() === 'true',
};
