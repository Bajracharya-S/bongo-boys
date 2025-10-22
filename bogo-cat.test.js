const assert = require('assert');

// ---- Inline minimal BongoCat for test scope (normally import from your codebase) ----
class BongoCat {
  constructor() {
    this.name = 'Bongo Cat';
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

// ---- TESTS ----
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`✅ ${name}`);
  } catch (err) {
    failed++;
    console.error(`❌ ${name}`);
    console.error(err);
  }
}

test('BongoCat initializes with zero processed images', () => {
  const cat = new BongoCat();
  assert.strictEqual(cat.processedImages, 0);
});

test('processImage increments processedImages and returns expected string', () => {
  const cat = new BongoCat();
  const msg = cat.processImage();
  assert.strictEqual(cat.processedImages, 1);
  assert.match(msg, /Image processed with bongo cat arms/);
});

test('getStats returns correct structure', () => {
  const cat = new BongoCat();
  cat.processImage();
  const stats = cat.getStats();
  assert.strictEqual(stats.name, 'Bongo Cat');
  assert.strictEqual(stats.processedImages, 1);
  assert.ok(typeof stats.timestamp === 'string');
});

console.log(`\nTest results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
