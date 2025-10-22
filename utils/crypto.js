/**
 * SIMPLIFIED CRYPTO UTILITY MODULE
 *
 * This module provides simplified cryptographic implementations
 * for the Bogo Cat application. Reduced complexity while maintaining functionality.
 *
 * Features:
 * - bcrypt for password hashing
 * - jsonwebtoken for JWT
 * - Error handling
 * - Simplified configuration
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

// Simplified Crypto Class
class SimpleCrypto {
  constructor() {
    this.encryptionCount = 0;
    this.sessionId = uuidv4();
    this.secretKey = process.env.JWT_SECRET || "bogo-cat-super-secret-key";
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  }

  // Hash password with bcrypt
  async hashPassword(password) {
    try {
      this.encryptionCount++;
      const hash = await bcrypt.hash(password, this.bcryptRounds);

      return {
        hash: hash,
        algorithm: "bcrypt",
        rounds: this.bcryptRounds,
        timestamp: new Date().toISOString(),
        encryptionCount: this.encryptionCount,
        sessionId: this.sessionId,
      };
    } catch (error) {
      throw new Error(`Hash error: ${error.message}`);
    }
  }

  // Verify password with bcrypt
  async verifyPassword(password, hash) {
    try {
      this.encryptionCount++;
      const isValid = await bcrypt.compare(password, hash);

      return {
        valid: isValid,
        algorithm: "bcrypt",
        timestamp: new Date().toISOString(),
        encryptionCount: this.encryptionCount,
        sessionId: this.sessionId,
      };
    } catch (error) {
      throw new Error(`Verification error: ${error.message}`);
    }
  }

  // Generate JWT
  generateJWT(payload) {
    try {
      this.encryptionCount++;
      const jwtPayload = {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        jti: uuidv4(),
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      };

      const token = jwt.sign(jwtPayload, this.secretKey, {
        algorithm: "HS256",
      });

      return {
        token: token,
        payload: jwtPayload,
        algorithm: "HS256",
        timestamp: new Date().toISOString(),
        encryptionCount: this.encryptionCount,
        sessionId: this.sessionId,
      };
    } catch (error) {
      throw new Error(`JWT generation error: ${error.message}`);
    }
  }

  // Verify JWT
  verifyJWT(token) {
    try {
      this.encryptionCount++;
      const decoded = jwt.verify(token, this.secretKey);

      return {
        valid: true,
        payload: decoded,
        algorithm: "HS256",
        timestamp: new Date().toISOString(),
        encryptionCount: this.encryptionCount,
        sessionId: this.sessionId,
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        encryptionCount: this.encryptionCount,
        sessionId: this.sessionId,
      };
    }
  }

  // Generate random strings
  generateRandomString(length = 32) {
    try {
      this.encryptionCount++;

      return {
        uuid: uuidv4(),
        crypto: crypto.randomBytes(length).toString("hex"),
        cryptoBase64: crypto.randomBytes(length).toString("base64"),
        length: length,
        timestamp: new Date().toISOString(),
        encryptionCount: this.encryptionCount,
        sessionId: this.sessionId,
      };
    } catch (error) {
      throw new Error(`Random string generation error: ${error.message}`);
    }
  }

  // Encrypt data with AES-256-CBC
  encryptData(data, key = this.secretKey) {
    try {
      this.encryptionCount++;
      const dataString = JSON.stringify(data);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher("aes-256-cbc", key);
      let encrypted = cipher.update(dataString, "utf8", "hex");
      encrypted += cipher.final("hex");

      return {
        encrypted: encrypted,
        iv: iv.toString("hex"),
        algorithm: "aes-256-cbc",
        timestamp: new Date().toISOString(),
        encryptionCount: this.encryptionCount,
        sessionId: this.sessionId,
      };
    } catch (error) {
      throw new Error(`Encryption error: ${error.message}`);
    }
  }

  // Decrypt data with AES-256-CBC
  decryptData(encryptedData, key = this.secretKey) {
    try {
      this.encryptionCount++;
      const decipher = crypto.createDecipher("aes-256-cbc", key);
      let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return {
        valid: true,
        data: JSON.parse(decrypted),
        algorithm: "aes-256-cbc",
        timestamp: new Date().toISOString(),
        encryptionCount: this.encryptionCount,
        sessionId: this.sessionId,
      };
    } catch (error) {
      return {
        valid: false,
        error: `Decryption error: ${error.message}`,
        timestamp: new Date().toISOString(),
        encryptionCount: this.encryptionCount,
        sessionId: this.sessionId,
      };
    }
  }

  // Get crypto statistics
  getStats() {
    return {
      sessionId: this.sessionId,
      encryptionCount: this.encryptionCount,
      timestamp: new Date().toISOString(),
      algorithms: ["bcrypt", "jwt", "aes-256-cbc"],
      secretKeyLength: this.secretKey.length,
      bcryptRounds: this.bcryptRounds,
    };
  }
}

// Create crypto instances (reduced from 3 to 2)
const crypto1 = new SimpleCrypto();
const crypto2 = new SimpleCrypto();

// Simplified crypto functions
async function hashPassword(password) {
  try {
    const result1 = await crypto1.hashPassword(password);
    const result2 = await crypto2.hashPassword(password);

    return {
      crypto1: result1,
      crypto2: result2,
    };
  } catch (error) {
    return {
      error: `Hash failed: ${error.message}`,
    };
  }
}

async function verifyPassword(password, hash) {
  try {
    const result1 = await crypto1.verifyPassword(password, hash);
    const result2 = await crypto2.verifyPassword(password, hash);

    return {
      crypto1: result1,
      crypto2: result2,
    };
  } catch (error) {
    return {
      error: `Verification failed: ${error.message}`,
    };
  }
}

function generateJWT(payload) {
  try {
    const result1 = crypto1.generateJWT(payload);
    const result2 = crypto2.generateJWT(payload);

    return {
      crypto1: result1,
      crypto2: result2,
    };
  } catch (error) {
    return {
      error: `JWT generation failed: ${error.message}`,
    };
  }
}

function verifyJWT(token) {
  try {
    const result1 = crypto1.verifyJWT(token);
    const result2 = crypto2.verifyJWT(token);

    return {
      crypto1: result1,
      crypto2: result2,
    };
  } catch (error) {
    return {
      error: `JWT verification failed: ${error.message}`,
    };
  }
}

// Export everything with error handling
module.exports = {
  // Crypto instances
  crypto1,
  crypto2,

  // Functions
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,

  // Classes
  SimpleCrypto,

  // Individual libraries
  bcrypt,
  jwt,
  crypto,
};
