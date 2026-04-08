const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const runtimeEnv = process.env.NODE_ENV || 'development';
const envFiles = [
  path.resolve(__dirname, `../.env.${runtimeEnv}`),
  path.resolve(__dirname, '../.env'),
];

envFiles.forEach((envFile) => {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile, override: false });
  }
});

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'CORS_ORIGIN'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

const parseCorsOrigins = (originsValue) => {
  const origins = String(originsValue || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('CORS_ORIGIN must include at least one explicit origin');
  }

  if (origins.includes('*')) {
    throw new Error('Wildcard CORS origin is not allowed. Use explicit origins in CORS_ORIGIN.');
  }

  return origins;
};

const corsOrigins = parseCorsOrigins(process.env.CORS_ORIGIN);

module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN,
  corsOrigins,
  allowMessSecretaryUserCreation:
    String(process.env.ALLOW_MESS_SECRETARY_USER_CREATION || 'false').toLowerCase() === 'true',
};
