const winston = require("winston");
const expressWinston = require("express-winston");

// Create a custom log format
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, meta, timestamp }) =>
    meta && meta.error?.stack
      ? `${timestamp} ${level}: ${meta.error.stack}`
      : `${timestamp} ${level}: ${message}`
  )
);

// Request Logger - Logs all incoming requests
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "request.log",
      format: winston.format.json(),
    }),
  ],
  format: winston.format.json(),
});

// Error Logger - Logs all errors
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: "error.log",
      format: winston.format.json(),
    }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
