const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define custom format for console
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Define transports
const transports = [
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info'
  }),
  new winston.transports.File({
    filename: path.join(logsDir, 'app.log'),
    format: logFormat,
    maxsize: 5242880,
    maxFiles: 5
  }),
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: 5242880,
    maxFiles: 5
  }),
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: logFormat,
    maxsize: 10485760,
    maxFiles: 5
  })
];

// Create winston logger instance
const winstonInstance = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ],
  exitOnError: false
});

winstonInstance.stream = {
  write: (message) => {
    winstonInstance.info(message.trim());
  }
};

const logRequest = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    if (res.statusCode >= 400) {
      winstonInstance.error('HTTP Request Error', logData);
    } else {
      winstonInstance.info('HTTP Request', logData);
    }
  });
  next();
};

const logDbQuery = (query, duration) => {
  winstonInstance.debug('Database Query', { query, duration: `${duration}ms` });
};

const logExternalApiCall = (service, endpoint, method, status, duration) => {
  winstonInstance.info('External API Call', { service, endpoint, method, status, duration: `${duration}ms` });
};

const logUserActivity = (userId, action, details = {}) => {
  winstonInstance.info('User Activity', { userId, action, ...details, timestamp: new Date().toISOString() });
};

const logMlPrediction = (userId, model, input, output, duration) => {
  winstonInstance.info('ML Prediction', { userId, model, input, output, duration: `${duration}ms` });
};

const logSecurityEvent = (type, details) => {
  winstonInstance.warn('Security Event', { type, ...details, timestamp: new Date().toISOString() });
};

const logPerformance = (metric, value, unit = 'ms') => {
  winstonInstance.info('Performance Metric', { metric, value, unit, timestamp: new Date().toISOString() });
};

const customLogger = {
  error: (message, meta = {}) => winstonInstance.error(message, meta),
  warn: (message, meta = {}) => winstonInstance.warn(message, meta),
  info: (message, meta = {}) => winstonInstance.info(message, meta),
  http: (message, meta = {}) => winstonInstance.http(message, meta),
  verbose: (message, meta = {}) => winstonInstance.verbose(message, meta),
  debug: (message, meta = {}) => winstonInstance.debug(message, meta),
  silly: (message, meta = {}) => winstonInstance.silly(message, meta)
};

// Hybrid Callable Function + Winston Instance Methods + Named Exports
const loggerCallable = function(message, meta = {}) {
  if (typeof message === 'object') {
    winstonInstance.info(JSON.stringify(message), meta);
  } else {
    winstonInstance.info(message, meta);
  }
};

loggerCallable.info = (msg, meta = {}) => winstonInstance.info(msg, meta);
loggerCallable.error = (msg, meta = {}) => winstonInstance.error(msg, meta);
loggerCallable.warn = (msg, meta = {}) => winstonInstance.warn(msg, meta);
loggerCallable.debug = (msg, meta = {}) => winstonInstance.debug(msg, meta);
loggerCallable.http = (msg, meta = {}) => winstonInstance.http(msg, meta);
loggerCallable.verbose = (msg, meta = {}) => winstonInstance.verbose(msg, meta);
loggerCallable.silly = (msg, meta = {}) => winstonInstance.silly(msg, meta);
loggerCallable.log = (level, msg, meta = {}) => winstonInstance.log(level, msg, meta);

loggerCallable.logger = loggerCallable;
loggerCallable.customLogger = customLogger;
loggerCallable.logRequest = logRequest;
loggerCallable.logDbQuery = logDbQuery;
loggerCallable.logExternalApiCall = logExternalApiCall;
loggerCallable.logUserActivity = logUserActivity;
loggerCallable.logMlPrediction = logMlPrediction;
loggerCallable.logSecurityEvent = logSecurityEvent;
loggerCallable.logPerformance = logPerformance;

module.exports = loggerCallable;