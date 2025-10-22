/**
 * SIMPLIFIED DATABASE UTILITY MODULE
 *
 * This module provides simplified database implementations
 * for the Bogo Cat application. Reduced complexity while maintaining functionality.
 *
 * Features:
 * - In-memory storage as primary
 * - Optional Redis connection
 * - Error handling
 * - Simplified configuration
 */

const { v4: uuidv4 } = require("uuid");

// In-memory storage
const memoryStore = new Map();

// Optional Redis connection (with error handling)
let redisClient = null;
try {
  const redis = require("redis");
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0,
  });

  redisClient.on("error", (err) => {
    console.warn("Redis connection error:", err.message);
    redisClient = null;
  });

  redisClient.on("connect", () => {
    console.log("Redis connected successfully");
  });
} catch (error) {
  console.warn("Redis not available:", error.message);
  redisClient = null;
}

// Simplified Database Class
class SimpleDatabase {
  constructor() {
    this.connectionCount = 0;
    this.sessionId = uuidv4();
    this.memoryStore = memoryStore;
    this.redisClient = redisClient;
  }

  // Store data in memory and optionally Redis
  async storeBogoCatData(data) {
    try {
      this.connectionCount++;
      const id = uuidv4();
      const timestamp = new Date().toISOString();

      const bogoCatData = {
        id,
        ...data,
        timestamp,
        sessionId: this.sessionId,
        connectionCount: this.connectionCount,
      };

      const results = {
        memory: null,
        redis: null,
        timestamp,
        connectionCount: this.connectionCount,
      };

      // Store in memory
      try {
        this.memoryStore.set(id, JSON.stringify(bogoCatData));
        results.memory = "success";
      } catch (error) {
        results.memory = { error: error.message };
      }

      // Store in Redis if available
      if (this.redisClient) {
        try {
          await this.redisClient.set(
            `bogo_cat:${id}`,
            JSON.stringify(bogoCatData),
          );
          results.redis = "success";
        } catch (error) {
          results.redis = { error: error.message };
        }
      } else {
        results.redis = { error: "Redis not available" };
      }

      return results;
    } catch (error) {
      throw new Error(`Storage error: ${error.message}`);
    }
  }

  // Retrieve data from memory and optionally Redis
  async getBogoCatData(id) {
    try {
      this.connectionCount++;
      const results = {
        memory: null,
        redis: null,
        timestamp: new Date().toISOString(),
        connectionCount: this.connectionCount,
      };

      // Get from memory
      try {
        const memoryData = this.memoryStore.get(id);
        results.memory = memoryData ? JSON.parse(memoryData) : null;
      } catch (error) {
        results.memory = { error: error.message };
      }

      // Get from Redis if available
      if (this.redisClient) {
        try {
          const redisData = await this.redisClient.get(`bogo_cat:${id}`);
          results.redis = redisData ? JSON.parse(redisData) : null;
        } catch (error) {
          results.redis = { error: error.message };
        }
      } else {
        results.redis = { error: "Redis not available" };
      }

      return results;
    } catch (error) {
      throw new Error(`Retrieval error: ${error.message}`);
    }
  }

  // Get all data from memory
  async getAllBogoCatData() {
    try {
      const allData = [];
      for (const [key, value] of this.memoryStore.entries()) {
        try {
          allData.push(JSON.parse(value));
        } catch (error) {
          console.warn(`Failed to parse data for key ${key}:`, error.message);
        }
      }
      return allData;
    } catch (error) {
      throw new Error(`Get all data error: ${error.message}`);
    }
  }

  // Clear all data
  async clearAllData() {
    try {
      this.memoryStore.clear();
      if (this.redisClient) {
        const keys = await this.redisClient.keys("bogo_cat:*");
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      }
      return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      throw new Error(`Clear data error: ${error.message}`);
    }
  }

  // Get database statistics
  getStats() {
    return {
      sessionId: this.sessionId,
      connectionCount: this.connectionCount,
      memoryStoreSize: this.memoryStore.size,
      hasRedis: !!this.redisClient,
      timestamp: new Date().toISOString(),
    };
  }
}

// Create database instances (reduced from 3 to 2)
const db1 = new SimpleDatabase();
const db2 = new SimpleDatabase();

// Simplified database functions
async function storeBogoCatData(data) {
  try {
    const result1 = await db1.storeBogoCatData(data);
    const result2 = await db2.storeBogoCatData(data);

    return {
      db1: result1,
      db2: result2,
    };
  } catch (error) {
    return {
      error: `Storage failed: ${error.message}`,
    };
  }
}

async function getBogoCatData(id) {
  try {
    const result1 = await db1.getBogoCatData(id);
    const result2 = await db2.getBogoCatData(id);

    return {
      db1: result1,
      db2: result2,
    };
  } catch (error) {
    return {
      error: `Retrieval failed: ${error.message}`,
    };
  }
}

async function getAllBogoCatData() {
  try {
    const result1 = await db1.getAllBogoCatData();
    const result2 = await db2.getAllBogoCatData();

    return {
      db1: result1,
      db2: result2,
    };
  } catch (error) {
    return {
      error: `Get all data failed: ${error.message}`,
    };
  }
}

async function clearAllData() {
  try {
    const result1 = await db1.clearAllData();
    const result2 = await db2.clearAllData();

    return {
      db1: result1,
      db2: result2,
    };
  } catch (error) {
    return {
      error: `Clear data failed: ${error.message}`,
    };
  }
}

// Initialize database (simplified)
async function initializeDatabase() {
  try {
    console.log("🐱 Database initialized successfully! 🐱");
    console.log(`Memory store size: ${memoryStore.size}`);
    console.log(`Redis available: ${!!redisClient}`);
    return true;
  } catch (error) {
    console.error("🐱 Database initialization error:", error.message);
    return false;
  }
}

// Export everything with error handling
module.exports = {
  // Database instances
  db1,
  db2,

  // Functions
  storeBogoCatData,
  getBogoCatData,
  getAllBogoCatData,
  clearAllData,
  initializeDatabase,

  // Classes
  SimpleDatabase,

  // Individual connections
  memoryStore,
  redisClient,
};
