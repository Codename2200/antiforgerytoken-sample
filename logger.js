// Load environment variables
require('dotenv').config();

// Description: This file contains the logger configuration.
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Define the log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Get log level from environment variable
const logLevel = process.env.LOG_LEVEL || 'info';

// Create a logger instance
const logger = createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Capture error stack trace
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/system.log', level: logLevel }), // Log errors to a file
    new transports.File({ filename: 'logs/combined.log' }) // Log all messages to a file
  ]
});

module.exports = logger;