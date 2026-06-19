import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../screenshots');
mkdirSync(outDir, { recursive: true });

const BASE = 'http://localhost:5173';

const PUBLIC_PAGES = [
  { name: '01-landing',      path: '/' },
  { name: '02-login',        path: '/login' },
  { name: '03-onboarding',   path: '/onboarding' },
  { name: '04-module-exam',  path: '/module-exam' },
  { name: '05-prompt-wars',  path: '/prompt-wars' },
  { name: '06-prompt-lab',   path: '/prompt-lab' },
  { name: '07-lesson',       path: '/lesson?track=a1&module=0' },
  { name: '08-learn',        path: '/learn' },
  { name: '09-missions',     path: '/missions' },
  { name: '10-community',    path: '/community' },
  { name: '11-roadmap',      path: '/roadmap' },
  { name: '12-settings',     path: '/settings' },
  { name: '13-ranking',      path: '/ranking' },
];

async function shot(page, name) {
  await page.waitForTimeout(800);
  await page.screenshot({
    path: join(outDir, `${name}.png`),
    fullPage: true,
  });
  console.log(`✓ ${name}.png`);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  // Mobile viewport (iPhone 14 Pro)
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });

  const page = await ctx.newPage();

  for (const { name, path } of PUBLIC_PAGES) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 10000 });
      await shot(page, name);
    } catch (e) {
      console.warn(`⚠ skipped ${name}: ${e.message.split('\n')[0]}`);
    }
  }

  await browser.close();
  console.log(`\nScreenshots saved to: screenshots/`);
})();
