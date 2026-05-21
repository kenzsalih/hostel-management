const { createLogger, format, transports } = require('winston');

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'jwt',
  'secret',
  'authorization',
  'accessToken',
  'refreshToken',
]);

const redactSensitive = (value) => {
  if (Array.isArray(value)) {
    value.forEach((item) => redactSensitive(item));
    return value;
  }

  if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      if (SENSITIVE_KEYS.has(key)) {
        value[key] = '[REDACTED]';
      } else {
        redactSensitive(value[key]);
      }
    });

    return value;
  }

  return value;
};

const redactFormat = format((info) => {
  redactSensitive(info);
  return info;
});

const consoleFormat = format.printf(({ timestamp, level, message, ...meta }) => {
  const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${level}: ${message}${metaString}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    redactFormat(),
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'hostel-mess-api' },
  transports: [
    new transports.Console({
      format: format.combine(redactFormat(), format.colorize(), format.timestamp(), consoleFormat),
    }),
  ],
});

module.exports = logger;
