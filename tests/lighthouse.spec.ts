import { test, expect } from '@playwright/test';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

test.describe('Lighthouse Performance Tests', () => {
  test('should have good Lighthouse scores for homepage', async () => {
    // Launch browser and page
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      // Navigate to homepage
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Get the browser endpoint for Lighthouse
      const browserWSEndpoint = browser.wsEndpoint();
      
      // Run Lighthouse audit
      const result = await lighthouse('http://localhost:3000', {
        port: new URL(browserWSEndpoint).port,
        output: 'json',
        logLevel: 'error',
        chromeFlags: ['--headless'],
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
      });

      if (!result) {
        throw new Error('Lighthouse audit failed to return results');
      }

      const { lhr } = result;
      const scores = lhr.categories;

      console.log('Lighthouse Scores:');
      console.log(`Performance: ${(scores.performance.score * 100).toFixed(0)}/100`);
      console.log(`Accessibility: ${(scores.accessibility.score * 100).toFixed(0)}/100`);
      console.log(`Best Practices: ${(scores['best-practices'].score * 100).toFixed(0)}/100`);
      console.log(`SEO: ${(scores.seo.score * 100).toFixed(0)}/100`);

      // Core Web Vitals
      const metrics = lhr.audits;
      if (metrics['largest-contentful-paint']) {
        console.log(`LCP: ${metrics['largest-contentful-paint'].displayValue}`);
      }
      if (metrics['cumulative-layout-shift']) {
        console.log(`CLS: ${metrics['cumulative-layout-shift'].displayValue}`);
      }
      if (metrics['total-blocking-time']) {
        console.log(`TBT: ${metrics['total-blocking-time'].displayValue}`);
      }
      if (metrics['first-contentful-paint']) {
        console.log(`FCP: ${metrics['first-contentful-paint'].displayValue}`);
      }

      // Assertions for minimum acceptable scores
      expect(scores.performance.score).toBeGreaterThan(0.6); // 60+
      expect(scores.accessibility.score).toBeGreaterThan(0.8); // 80+
      expect(scores['best-practices'].score).toBeGreaterThan(0.8); // 80+
      expect(scores.seo.score).toBeGreaterThan(0.8); // 80+

      // Core Web Vitals thresholds
      if (metrics['largest-contentful-paint']) {
        const lcpValue = metrics['largest-contentful-paint'].numericValue;
        expect(lcpValue).toBeLessThan(4000); // LCP < 4s (reasonable for data-heavy sites)
      }

      if (metrics['cumulative-layout-shift']) {
        const clsValue = metrics['cumulative-layout-shift'].numericValue;
        expect(clsValue).toBeLessThan(0.25); // CLS < 0.25 (reasonable threshold)
      }

    } finally {
      await page.close();
      await browser.close();
    }
  });

  test('should have good performance for template page', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      // Navigate to first template page
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Get first template link
      const templateLink = page.locator('a[href*="/template/"]').first();
      const href = await templateLink.getAttribute('href');
      const templateUrl = `http://localhost:3000${href}`;

      console.log(`Testing template page: ${templateUrl}`);

      // Get browser endpoint for Lighthouse
      const browserWSEndpoint = browser.wsEndpoint();
      
      // Run Lighthouse on template page
      const result = await lighthouse(templateUrl, {
        port: new URL(browserWSEndpoint).port,
        output: 'json',
        logLevel: 'error',
        chromeFlags: ['--headless'],
        onlyCategories: ['performance', 'accessibility', 'seo']
      });

      if (!result) {
        throw new Error('Lighthouse audit failed for template page');
      }

      const { lhr } = result;
      const scores = lhr.categories;

      console.log('Template Page Lighthouse Scores:');
      console.log(`Performance: ${(scores.performance.score * 100).toFixed(0)}/100`);
      console.log(`Accessibility: ${(scores.accessibility.score * 100).toFixed(0)}/100`);
      console.log(`SEO: ${(scores.seo.score * 100).toFixed(0)}/100`);

      // Slightly more lenient thresholds for template pages (they have more content)
      expect(scores.performance.score).toBeGreaterThan(0.5); // 50+
      expect(scores.accessibility.score).toBeGreaterThan(0.8); // 80+
      expect(scores.seo.score).toBeGreaterThan(0.8); // 80+

    } finally {
      await page.close();
      await browser.close();
    }
  });

  test('should analyze mobile performance', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      const browserWSEndpoint = browser.wsEndpoint();
      
      // Run Lighthouse with mobile emulation
      const result = await lighthouse('http://localhost:3000', {
        port: new URL(browserWSEndpoint).port,
        output: 'json',
        logLevel: 'error',
        chromeFlags: ['--headless'],
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
        },
        onlyCategories: ['performance', 'accessibility']
      });

      if (!result) {
        throw new Error('Mobile Lighthouse audit failed');
      }

      const { lhr } = result;
      const scores = lhr.categories;

      console.log('Mobile Performance Scores:');
      console.log(`Performance: ${(scores.performance.score * 100).toFixed(0)}/100`);
      console.log(`Accessibility: ${(scores.accessibility.score * 100).toFixed(0)}/100`);

      // Mobile tends to have lower performance scores
      expect(scores.performance.score).toBeGreaterThan(0.4); // 40+
      expect(scores.accessibility.score).toBeGreaterThan(0.8); // 80+

    } finally {
      await page.close();
      await browser.close();
    }
  });

  test('should check for performance opportunities', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      const browserWSEndpoint = browser.wsEndpoint();
      
      const result = await lighthouse('http://localhost:3000', {
        port: new URL(browserWSEndpoint).port,
        output: 'json',
        logLevel: 'error',
        chromeFlags: ['--headless'],
        onlyCategories: ['performance']
      });

      if (!result) {
        throw new Error('Performance audit failed');
      }

      const { lhr } = result;
      
      // Log performance opportunities
      console.log('\nPerformance Opportunities:');
      Object.entries(lhr.audits).forEach(([key, audit]: [string, any]) => {
        if (audit.scoreDisplayMode === 'numeric' && audit.score !== null && audit.score < 0.9) {
          console.log(`- ${audit.title}: ${audit.displayValue || 'Check needed'}`);
          if (audit.description) {
            console.log(`  ${audit.description.substring(0, 100)}...`);
          }
        }
      });

      // Check for common issues
      const audits = lhr.audits;
      
      if (audits['unused-javascript']) {
        const unusedJs = audits['unused-javascript'];
        if (unusedJs.score < 0.9) {
          console.log(`Unused JavaScript detected: ${unusedJs.displayValue}`);
        }
      }

      if (audits['render-blocking-resources']) {
        const renderBlocking = audits['render-blocking-resources'];
        if (renderBlocking.score < 0.9) {
          console.log(`Render-blocking resources detected: ${renderBlocking.displayValue}`);
        }
      }

      // The test passes regardless - this is for analysis
      expect(true).toBe(true);

    } finally {
      await page.close();
      await browser.close();
    }
  });
});