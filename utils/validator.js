/**
 * SIMPLIFIED VALIDATOR UTILITY MODULE
 *
 * This module provides simplified validation implementations
 * for the Bogo Cat application. Reduced complexity while maintaining functionality.
 *
 * Features:
 * - Joi as primary validator
 * - Express-validator for middleware
 * - Error handling
 * - Simplified schemas
 */

const joi = require("joi");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

// Joi Schemas (Simplified)
const bongoJoiSchema = joi.object({
  intensity: joi.number().integer().min(1).max(10).required(),
  duration: joi.number().integer().min(1).max(60).required(),
  timestamp: joi.date().optional(),
  id: joi.string().uuid().optional(),
});

const danceJoiSchema = joi.object({
  style: joi.string().valid("bongo", "jazz", "breakdance", "ballet").required(),
  energy: joi.number().integer().min(1).max(100).required(),
  timestamp: joi.date().optional(),
  id: joi.string().uuid().optional(),
});

const statsJoiSchema = joi.object({
  version: joi.string().valid("v1", "v2", "v3").required(),
  includeServer: joi.boolean().optional(),
});

// Simplified Validator Class
class SimpleValidator {
  constructor() {
    this.validationCount = 0;
    this.sessionId = uuidv4();
  }

  // Validate with Joi (primary method)
  validateBongo(data) {
    try {
      this.validationCount++;
      const { error, value } = bongoJoiSchema.validate(data);

      return {
        valid: !error,
        value: value,
        error: error ? error.details.map((d) => d.message).join(", ") : null,
        timestamp: new Date().toISOString(),
        validationCount: this.validationCount,
        sessionId: this.sessionId,
      };
    } catch (err) {
      return {
        valid: false,
        value: null,
        error: `Validation error: ${err.message}`,
        timestamp: new Date().toISOString(),
        validationCount: this.validationCount,
        sessionId: this.sessionId,
      };
    }
  }

  validateDance(data) {
    try {
      this.validationCount++;
      const { error, value } = danceJoiSchema.validate(data);

      return {
        valid: !error,
        value: value,
        error: error ? error.details.map((d) => d.message).join(", ") : null,
        timestamp: new Date().toISOString(),
        validationCount: this.validationCount,
        sessionId: this.sessionId,
      };
    } catch (err) {
      return {
        valid: false,
        value: null,
        error: `Validation error: ${err.message}`,
        timestamp: new Date().toISOString(),
        validationCount: this.validationCount,
        sessionId: this.sessionId,
      };
    }
  }

  validateStats(data) {
    try {
      this.validationCount++;
      const { error, value } = statsJoiSchema.validate(data);

      return {
        valid: !error,
        value: value,
        error: error ? error.details.map((d) => d.message).join(", ") : null,
        timestamp: new Date().toISOString(),
        validationCount: this.validationCount,
        sessionId: this.sessionId,
      };
    } catch (err) {
      return {
        valid: false,
        value: null,
        error: `Validation error: ${err.message}`,
        timestamp: new Date().toISOString(),
        validationCount: this.validationCount,
        sessionId: this.sessionId,
      };
    }
  }

  // Get validator statistics
  getStats() {
    return {
      sessionId: this.sessionId,
      validationCount: this.validationCount,
      timestamp: new Date().toISOString(),
      libraries: ["joi"],
      schemas: ["bongo", "dance", "stats"],
    };
  }
}

// Create validator instances (reduced from 3 to 2)
const validator1 = new SimpleValidator();
const validator2 = new SimpleValidator();

// Simplified validation functions
function validateBongo(data) {
  try {
    const result1 = validator1.validateBongo(data);
    const result2 = validator2.validateBongo(data);

    return {
      validator1: result1,
      validator2: result2,
      overallValid: result1.valid && result2.valid,
    };
  } catch (error) {
    return {
      error: `Validation failed: ${error.message}`,
      overallValid: false,
    };
  }
}

function validateDance(data) {
  try {
    const result1 = validator1.validateDance(data);
    const result2 = validator2.validateDance(data);

    return {
      validator1: result1,
      validator2: result2,
      overallValid: result1.valid && result2.valid,
    };
  } catch (error) {
    return {
      error: `Validation failed: ${error.message}`,
      overallValid: false,
    };
  }
}

function validateStats(data) {
  try {
    const result1 = validator1.validateStats(data);
    const result2 = validator2.validateStats(data);

    return {
      validator1: result1,
      validator2: result2,
      overallValid: result1.valid && result2.valid,
    };
  } catch (error) {
    return {
      error: `Validation failed: ${error.message}`,
      overallValid: false,
    };
  }
}

// Express-validator middleware (simplified)
const bongoExpressValidation = [
  body("intensity")
    .isInt({ min: 1, max: 10 })
    .withMessage("Intensity must be between 1 and 10"),
  body("duration")
    .isInt({ min: 1, max: 60 })
    .withMessage("Duration must be between 1 and 60 seconds"),
  body("timestamp")
    .optional()
    .isISO8601()
    .withMessage("Timestamp must be valid ISO8601 date"),
  body("id").optional().isUUID().withMessage("ID must be valid UUID"),
];

const danceExpressValidation = [
  body("style")
    .isIn(["bongo", "jazz", "breakdance", "ballet"])
    .withMessage("Invalid dance style"),
  body("energy")
    .isInt({ min: 1, max: 100 })
    .withMessage("Energy must be between 1 and 100"),
  body("timestamp")
    .optional()
    .isISO8601()
    .withMessage("Timestamp must be valid ISO8601 date"),
  body("id").optional().isUUID().withMessage("ID must be valid UUID"),
];

const statsExpressValidation = [
  body("version")
    .isIn(["v1", "v2", "v3"])
    .withMessage("Version must be v1, v2, or v3"),
  body("includeServer")
    .optional()
    .isBoolean()
    .withMessage("includeServer must be boolean"),
];

// Export everything with error handling
module.exports = {
  // Joi schemas
  bongoJoiSchema,
  danceJoiSchema,
  statsJoiSchema,

  // Classes
  SimpleValidator,
  validator1,
  validator2,

  // Functions
  validateBongo,
  validateDance,
  validateStats,

  // Express validators
  bongoExpressValidation,
  danceExpressValidation,
  statsExpressValidation,

  // Individual library
  joi,
};
