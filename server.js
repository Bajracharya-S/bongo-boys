/**
 * BONGO CAT PHOTO PROCESSING APP
 *
 * A streamlined Node.js application for uploading images and turning them into
 * animated Bongo Cat GIFs with bongo-playing arms.
 *
 * Features:
 * - Image upload and processing
 * - GIF generation with animated bongo cat arms
 * - Simple web interface
 * - Minimal dependencies
 */

// Import essential packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Jimp = require("jimp");
const GIFEncoder = require("gif-encoder-2");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Bongo Cat class for tracking processed images
class BongoCat {
  constructor() {
    this.name = "Bongo Cat";
    this.processedImages = 0;
  }

  processImage() {
    this.processedImages++;
    return `Image processed with bongo cat arms (${this.processedImages} total)`;
  }

  getStats() {
    return {
      name: this.name,
      processedImages: this.processedImages,
      timestamp: new Date().toISOString(),
    };
  }
}

// Initialize bongo cat instance
const bongoCat = new BongoCat();

// Photo processing function
async function processPhotoWithBongoCatArms(inputPath, outputPath) {
  try {
    // Load the input image
    const image = await Jimp.read(inputPath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Ensure minimum dimensions
    if (width < 10 || height < 10) {
      throw new Error("Image too small. Minimum size is 10x10 pixels.");
    }

    // Create bongo cat arm images (simple colored rectangles)
    const armWidth = Math.min(width * 0.15, 100);
    const armHeight = Math.min(height * 0.3, 150);

    // Create frames for the GIF - bongo cat playing drums animation
    const frames = [];
    const frameCount = 8; // Number of frames for the bongo animation

    for (let i = 0; i < frameCount; i++) {
      // Clone the original image
      const frame = image.clone();

      // Calculate arm positions for bongo animation (drumming motion)
      const progress = i / frameCount;
      const leftArmAngle = progress * Math.PI * 2; // Full rotation for left arm
      const rightArmAngle = progress * Math.PI * 2 + Math.PI; // Offset for right arm

      // Left arm - drumming motion
      const leftArmX = Math.floor(width * 0.1 + Math.sin(leftArmAngle) * 30);
      const leftArmY = Math.floor(height * 0.3 + Math.cos(leftArmAngle) * 20);

      // Right arm - opposite motion for drumming
      const rightArmX = Math.floor(width * 0.8 + Math.sin(rightArmAngle) * 30);
      const rightArmY = Math.floor(height * 0.3 + Math.cos(rightArmAngle) * 20);

      // Create left arm (orange/red color for bongo cat)
      const leftArm = new Jimp(armWidth, armHeight, 0xff6b6bff);
      frame.composite(leftArm, leftArmX, leftArmY);

      // Create right arm (orange/red color for bongo cat)
      const rightArm = new Jimp(armWidth, armHeight, 0xff6b6bff);
      frame.composite(rightArm, rightArmX, rightArmY);

      // Add bongo drums visualization
      const drumX = Math.floor(width * 0.45);
      const drumY = Math.floor(height * 0.65);
      const drumSize = Math.floor(Math.min(width, height) * 0.12);

      // Create drum body (brown)
      const drum = new Jimp(drumSize, drumSize, 0x8b4513ff);
      frame.composite(drum, drumX, drumY);

      // Add drum sticks (small white lines)
      const stickLength = Math.floor(drumSize * 0.8);
      const stickWidth = 2;

      // Left drumstick
      const leftStick = new Jimp(stickWidth, stickLength, 0xffffffff);
      const leftStickX = drumX - Math.floor(drumSize * 0.3);
      const leftStickY = drumY - Math.floor(drumSize * 0.2);
      frame.composite(leftStick, leftStickX, leftStickY);

      // Right drumstick
      const rightStick = new Jimp(stickWidth, stickLength, 0xffffffff);
      const rightStickX = drumX + Math.floor(drumSize * 1.1);
      const rightStickY = drumY - Math.floor(drumSize * 0.2);
      frame.composite(rightStick, rightStickX, rightStickY);

      // Push raw frame data for GIFEncoder (must be RGBA buffer)
      frames.push(Buffer.from(frame.bitmap.data));
    }

    // Create GIF using gif-encoder-2
    const encoder = new GIFEncoder(width, height, "neuquant", true);
    const file = fs.createWriteStream(outputPath);
    encoder.createReadStream().pipe(file);

    encoder.start();
    encoder.setRepeat(0); // Repeat indefinitely
    encoder.setDelay(200); // 200ms delay between frames
    encoder.setQuality(10); // Image quality. 10 is default.

    // Add frames to GIF (must supply RGBA buffer)
    for (const frameBuffer of frames) {
      encoder.addFrame(frameBuffer);
    }

    encoder.finish();

    // Wait for the GIF to be written
    await new Promise((resolve, reject) => {
      file.on("finish", resolve);
      file.on("error", reject);
    });

    console.log("Photo processing completed", {
      inputPath,
      outputPath,
      frameCount: frames.length,
    });
  } catch (error) {
    console.error("Photo processing error:", error);
    throw error;
  }
}

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Bongo Cat Photo Processing App!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: [
      "/bogo-cat",
      "/bogo-cat/stats",
      "/bogo-cat/process-photo",
      "/ui",
    ],
  });
});

app.get("/bogo-cat", (req, res) => {
  res.json({
    message: "🐱 BONGO CAT PHOTO PROCESSOR 🐱",
    timestamp: new Date().toISOString(),
    description: "Upload images to turn them into animated Bongo Cat GIFs!",
  });
});

app.get("/bogo-cat/stats", (req, res) => {
  try {
    const stats = bongoCat.getStats();
    const allStats = {
      bongoCat: stats,
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
      },
    };

    res.json(allStats);
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      error: "Failed to get statistics",
      message: error.message,
    });
  }
});

// Serve the UI
app.get("/ui", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: "UI not found",
      message: "The interface file is missing!",
    });
  }
});

// Photo processing endpoint
app.post(
  "/bogo-cat/process-photo",
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No photo uploaded",
        });
      }

      console.log("Photo processing started", {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      });

      const inputPath = req.file.path;
      const outputDir = path.join(__dirname, "public", "generated");
      const gifFilename = `bongo-cat-${Date.now()}.gif`;
      const gifPath = path.join(outputDir, gifFilename);

      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Process the photo to add bongo cat arms
      await processPhotoWithBongoCatArms(inputPath, gifPath);

      // Track the processing
      bongoCat.processImage();

      // Clean up uploaded file
      fs.unlinkSync(inputPath);

      const gifUrl = `/generated/${gifFilename}`;

      console.log("Photo processing completed", { gifUrl });

      res.json({
        success: true,
        gifUrl: gifUrl,
        message: "BONGO CAT ARMS ADDED SUCCESSFULLY!",
      });
    } catch (error) {
      console.error("Photo processing error:", error);

      // Clean up uploaded file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        error: "Failed to process photo",
        message: error.message,
        stack: error.stack,
      });
    }
  },
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

// Start the server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🐱 BONGO CAT PHOTO APP RUNNING ON PORT ${PORT} 🐱`);
  console.log(`🐱 Upload images to turn them into Bongo Cat GIFs! 🐱`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Export for testing
module.exports = app;
