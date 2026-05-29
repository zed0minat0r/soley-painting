const { chromium } = require('/usr/local/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/tmp/soley-frames';
const VIDEO_DIR = '/tmp/soley-video';

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(VIDEO_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  console.log('Navigating to soley-painting.vercel.app...');
  await page.goto('https://soley-painting.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for hero to start animating
  await page.waitForTimeout(500);

  console.log('Recording — waiting 35 seconds...');
  await page.waitForTimeout(35000);

  console.log('Done. Closing...');
  await page.close();
  await context.close();
  await browser.close();

  // List what was saved
  const files = fs.readdirSync(VIDEO_DIR);
  console.log('Video files:', files);
  if (files.length > 0) {
    console.log('VIDEO_PATH=' + path.join(VIDEO_DIR, files[0]));
  }
})();
