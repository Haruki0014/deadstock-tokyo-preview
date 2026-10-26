import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.VISUAL_QA_URL || 'http://127.0.0.1:8000';
const OUT_DIR = path.resolve('visual-qa-artifacts');

const viewports = [
  { name: 'phone-390x844', width: 390, height: 844 },
  { name: 'ipad-portrait-820x1180', width: 820, height: 1180 },
  { name: 'ipad-landscape-1180x820', width: 1180, height: 820 },
  { name: 'desktop-1440x1000', width: 1440, height: 1000 }
];

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  passed: true,
  viewports: []
};

function intersects(a, b) {
  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();

    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.addInitScript(() => {
      try {
        localStorage.setItem('dst-language', 'en');
      } catch (_) {
        // Visual QA should still run if storage is unavailable.
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20_000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    await page.waitForTimeout(250);

    const metrics = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const overflowAmount = Math.max(
        document.documentElement.scrollWidth - viewportWidth,
        document.body.scrollWidth - viewportWidth
      );

      const brokenImages = [...document.images]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute('src') || '(missing src)');

      const selectors = [
        '.site-header',
        '.hero-copy',
        '.shop-link',
        '#point-of-view',
        '.collection-heading',
        '.product-card',
        '.finale',
        'footer'
      ];

      const escaping = [];
      for (const selector of selectors) {
        document.querySelectorAll(selector).forEach((element, index) => {
          const style = getComputedStyle(element);
          if (style.display === 'none' || style.visibility === 'hidden') return;
          const rect = element.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          if (rect.left < -2 || rect.right > viewportWidth + 2) {
            escaping.push({
              selector,
              index,
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              viewportWidth
            });
          }
        });
      }

      const visibleRect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return null;
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom
        };
      };

      return {
        overflowAmount,
        brokenImages,
        escaping,
        headerRects: {
          wordmark: visibleRect('.wordmark'),
          nav: visibleRect('.main-nav'),
          actions: visibleRect('.header-actions')
        }
      };
    });

    const headerRects = metrics.headerRects;
    const headerCollisions = [];
    if (headerRects.wordmark && headerRects.nav && intersects(headerRects.wordmark, headerRects.nav)) {
      headerCollisions.push('wordmark overlaps navigation');
    }
    if (headerRects.nav && headerRects.actions && intersects(headerRects.nav, headerRects.actions)) {
      headerCollisions.push('navigation overlaps header actions');
    }
    if (headerRects.wordmark && headerRects.actions && intersects(headerRects.wordmark, headerRects.actions)) {
      headerCollisions.push('wordmark overlaps header actions');
    }

    const failures = [];
    if (metrics.overflowAmount > 2) failures.push(`horizontal overflow: ${metrics.overflowAmount}px`);
    if (metrics.brokenImages.length) failures.push(`broken images: ${metrics.brokenImages.join(', ')}`);
    if (metrics.escaping.length) failures.push(`critical elements escape viewport: ${metrics.escaping.length}`);
    if (headerCollisions.length) failures.push(...headerCollisions);
    if (pageErrors.length) failures.push(`page errors: ${pageErrors.join(' | ')}`);
    if (consoleErrors.length) failures.push(`console errors: ${consoleErrors.join(' | ')}`);

    const screenshotPath = path.join(OUT_DIR, `${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const viewportReport = {
      ...viewport,
      passed: failures.length === 0,
      failures,
      metrics: {
        overflowAmount: metrics.overflowAmount,
        brokenImages: metrics.brokenImages,
        escaping: metrics.escaping,
        headerCollisions,
        pageErrors,
        consoleErrors
      },
      screenshot: path.basename(screenshotPath)
    };

    report.viewports.push(viewportReport);
    if (!viewportReport.passed) report.passed = false;

    console.log(`${viewportReport.passed ? 'PASS' : 'FAIL'} ${viewport.name}`);
    for (const failure of failures) console.log(`  - ${failure}`);

    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(OUT_DIR, 'visual-qa-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);

if (!report.passed) {
  console.error('Visual QA failed. See visual-qa-artifacts/visual-qa-report.json');
  process.exitCode = 1;
} else {
  console.log('Visual QA passed for all configured viewports.');
}
