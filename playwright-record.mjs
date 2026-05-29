import { chromium } from '/usr/local/lib/node_modules/playwright/index.js';
import path from 'path';
import { mkdirSync } from 'fs';

const OUT_DIR = '/tmp/soley-frames';
const VIDEO_PATH = '/tmp/soley-hero-record.webm';

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: '/tmp/soley-video/',
    size: { width: 1440, height: 900 },
  },
});

mkdirSync('/tmp/soley-video/', { recursive: true });

const page = await context.newPage();

// Navigate to production site
await page.goto('https://soley-painting.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });

// Wait for hero to fully load and start animating
await page.waitForTimeout(1000);

// Record for 35 seconds by waiting
console.log('Recording started — waiting 35s...');
await page.waitForTimeout(35000);

console.log('Recording complete. Closing browser.');
await page.close();
const videoFile = await context.pages();
await context.close();
await browser.close();

console.log('Video saved to /tmp/soley-video/');

// List saved video
import { readdirSync } from 'node:fs';
const files = readdirSync('/tmp/soley-video/');
console.log('Video files:', files);
