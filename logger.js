// logger.js
const winston = require('winston');

// Define log file format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logfile.log' }),
    new winston.transports.Console()
  ]
});

module.exports = logger;

