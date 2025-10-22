/**
 * SIMPLIFIED LOGGER UTILITY MODULE
 *
 * This module provides a simplified but still redundant logging implementation
 * for the Bogo Cat application. Reduced complexity while maintaining functionality.
 *
 * Features:
 * - Winston logger as primary
 * - Console fallback
 * - Error handling
 * - Simplified configuration
 */

const winston = require("winston");
const { v4: uuidv4 } = require("uuid");

// Create logger with error handling
let logger;
let fallbackLogger;

try {
  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
    ],
  });

  // Add file transport if not in production
  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.File({
        filename: "bogo-cat.log",
        level: "info",
      }),
    );
    logger.add(
      new winston.transports.File({
        filename: "bogo-cat-error.log",
        level: "error",
      }),
    );
  }
} catch (error) {
  console.error("Failed to initialize Winston logger:", error.message);
  logger = null;
}

// Fallback logger using console
fallbackLogger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
  },
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta);
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
  },
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
    }
  },
};

// Simplified Logger Class
class SimpleLogger {
  constructor() {
    this.sessionId = uuidv4();
    this.logCount = 0;
    this.primaryLogger = logger;
    this.fallbackLogger = fallbackLogger;
  }

  // Log with primary logger, fallback to console if needed
  log(level, message, meta = {}) {
    try {
      this.logCount++;
      const logData = {
        message,
        level,
        sessionId: this.sessionId,
        logCount: this.logCount,
        timestamp: new Date().toISOString(),
        ...meta,
      };

      if (this.primaryLogger) {
        this.primaryLogger[level](message, logData);
      } else {
        this.fallbackLogger[level](message, logData);
      }
    } catch (error) {
      // Ultimate fallback
      console.error(`Logger error: ${error.message}`);
      console.log(`[${level.toUpperCase()}] ${message}`, meta);
    }
  }

  info(message, meta = {}) {
    this.log("info", message, meta);
  }

  error(message, meta = {}) {
    this.log("error", message, meta);
  }

  warn(message, meta = {}) {
    this.log("warn", message, meta);
  }

  debug(message, meta = {}) {
    this.log("debug", message, meta);
  }

  // Get logger statistics
  getStats() {
    return {
      sessionId: this.sessionId,
      logCount: this.logCount,
      hasPrimaryLogger: !!this.primaryLogger,
      hasFallbackLogger: !!this.fallbackLogger,
      timestamp: new Date().toISOString(),
    };
  }
}

// Create logger instances (reduced from 3 to 2)
const logger1 = new SimpleLogger();
const logger2 = new SimpleLogger();

// Simplified logging functions
function logInfo(message, meta = {}) {
  try {
    logger1.info(message, meta);
  } catch (error) {
    console.log(`[INFO] ${message}`, meta);
  }
}

function logError(message, meta = {}) {
  try {
    logger1.error(message, meta);
  } catch (error) {
    console.error(`[ERROR] ${message}`, meta);
  }
}

function logWarn(message, meta = {}) {
  try {
    logger1.warn(message, meta);
  } catch (error) {
    console.warn(`[WARN] ${message}`, meta);
  }
}

function logDebug(message, meta = {}) {
  try {
    logger1.debug(message, meta);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }
}

// Export everything with error handling
module.exports = {
  // Primary logger
  logger: logger || fallbackLogger,

  // Logger instances
  logger1,
  logger2,

  // Functions
  logInfo,
  logError,
  logWarn,
  logDebug,

  // Classes
  SimpleLogger,

  // Individual loggers (for backward compatibility)
  winston: logger,
  fallback: fallbackLogger,
};
