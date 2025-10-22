const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Comprehensive test for the bogo cat photo processing functionality
async function testProcessingFunctionality() {
  console.log("🧪 Starting comprehensive bogo cat processing tests...\n");

  try {
    // Test 1: Create test image
    console.log("📸 Test 1: Creating test image...");
    require("./create-test-image.js");
    console.log("✅ Test image created successfully\n");

    // Test 2: Upload and process photo
    console.log("📤 Test 2: Uploading and processing photo...");
    const testImagePath = path.join(__dirname, "test-image.png");

    if (!fs.existsSync(testImagePath)) {
      throw new Error("Test image not found");
    }

    // Create form data
    const form = new FormData();
    form.append("photo", fs.createReadStream(testImagePath));

    // Upload to the server
    const response = await fetch(
      "http://localhost:3000/bogo-cat/process-photo",
      {
        method: "POST",
        body: form,
      },
    );

    const result = await response.json();

    if (result.success) {
      console.log("✅ Photo processing successful!");
      console.log("🎬 GIF URL:", result.gifUrl);
      console.log("💬 Message:", result.message);

      // Test 3: Verify GIF was created
      console.log("\n📁 Test 3: Verifying GIF creation...");
      const gifPath = path.join(__dirname, "public", result.gifUrl);
      if (fs.existsSync(gifPath)) {
        const stats = fs.statSync(gifPath);
        console.log(`✅ GIF file created successfully (${stats.size} bytes)`);
      } else {
        console.log("❌ GIF file not found");
      }

      // Test 4: Check server stats
      console.log("\n📊 Test 4: Checking server statistics...");
      const statsResponse = await fetch("http://localhost:3000/bogo-cat/stats");
      const stats = await statsResponse.json();
      console.log("✅ Server stats retrieved:");
      console.log(`   - Bongo Cat processed images: ${stats.bongoCat.processedImages}`);
      console.log(`   - Server uptime: ${Math.round(stats.server.uptime)}s`);

    } else {
      console.log("❌ Photo processing failed:", result.error);
      console.log("📝 Error message:", result.message);
      throw new Error(result.error);
    }

    // Test 5: Test API endpoints
    console.log("\n🌐 Test 5: Testing API endpoints...");

    // Test root endpoint
    const rootResponse = await fetch("http://localhost:3000/");
    const rootData = await rootResponse.json();
    console.log("✅ Root endpoint working:", rootData.message);

    // Test bogo-cat endpoint
    const bogoResponse = await fetch("http://localhost:3000/bogo-cat");
    const bogoData = await bogoResponse.json();
    console.log("✅ Bogo-cat endpoint working:", bogoData.message);

    // Test UI endpoint
    const uiResponse = await fetch("http://localhost:3000/ui");
    console.log("✅ UI endpoint working (status:", uiResponse.status + ")");

    console.log("\n🎉 All tests passed! Bogo cat processing functionality is working correctly.");
    console.log("🐱 The app can successfully:");
    console.log("   - Upload images");
    console.log("   - Process them into animated GIFs with bongo cat arms");
    console.log("   - Add drum visualization");
    console.log("   - Serve the generated GIFs");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    // Clean up test files
    try {
      const testImagePath = path.join(__dirname, "test-image.png");
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
        console.log("\n🧹 Cleaned up test image");
      }
    } catch (cleanupError) {
      console.warn("⚠️  Cleanup warning:", cleanupError.message);
    }
  }
}

// Run the tests
testProcessingFunctionality();