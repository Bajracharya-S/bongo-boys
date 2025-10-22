const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function ensureTestImageExists() {
  const testImagePath = path.join(__dirname, "test-image.png");
  if (fs.existsSync(testImagePath)) {
    const stats = fs.statSync(testImagePath);
    if (stats.size > 0) {
      return testImagePath;
    } else {
      fs.unlinkSync(testImagePath);
    }
  }
  // Download fresh image via local downloader, which follows redirects
  await new Promise((resolve, reject) => {
    const child = require("child_process").spawn(
      process.execPath,
      [path.join(__dirname, "create-test-image.js")],
      { stdio: "inherit" }
    );
    child.on("exit", (code) => {
      if (code !== 0) return reject(new Error("create-test-image.js failed"));
      const stats = fs.statSync(testImagePath);
      if (stats.size > 0) resolve();
      else reject(new Error("Downloaded image is empty"));
    });
  });
  return testImagePath;
}

async function testPhotoUpload() {
  try {
    const testImagePath = await ensureTestImageExists();
    console.log("Using test image:", testImagePath);
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
    console.log("Server response:", result);
    if (result.success) {
      console.log("✅ Photo processing successful!");
      console.log("GIF URL:", result.gifUrl);
    } else {
      console.log("❌ Photo processing failed:", result.error);
    }
    // Clean up test image
    //fs.unlinkSync(testImagePath); // (leave for manual cleanup)
  } catch (error) {
    console.error("Test failed:", error instanceof Error ? error.message : error);
  }
}

testPhotoUpload();

