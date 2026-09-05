import winston from 'winston';

const sensitiveKeys = ['password', 'token', 'jwt_secret', 'secret', 'key', 'smtp_pass', 'credit_card'];

const maskSensitiveData = winston.format((info) => {
  if (typeof info.message === 'object' && info.message !== null) {
    const masked = { ...info.message };
    for (const key of Object.keys(masked)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        masked[key] = '***REDACTED***';
      }
    }
    info.message = masked;
  }
  return info;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    maskSensitiveData(),
    winston.format.printf(({ timestamp, level, message }) => {
      const msg = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
      return `[${timestamp}] [${level.toUpperCase()}]: ${msg}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          const msg = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
          return `[${timestamp}] ${level}: ${msg}`;
        })
      )
    })
  ]
});
