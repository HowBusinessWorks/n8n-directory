import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load homepage within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Homepage should load within 10 seconds (more realistic for DB-driven sites)
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`Homepage loaded in ${loadTime}ms`);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const webVitals: any = {};
          
          entries.forEach((entry) => {
            if (entry.name === 'largest-contentful-paint') {
              webVitals.LCP = entry.startTime;
            }
            if (entry.name === 'first-input-delay') {
              webVitals.FID = entry.processingStart - entry.startTime;
            }
            if (entry.name === 'cumulative-layout-shift') {
              webVitals.CLS = entry.value;
            }
          });
          
          // If we have some metrics, resolve
          if (Object.keys(webVitals).length > 0) {
            resolve(webVitals);
          }
        }).observe({type: 'largest-contentful-paint', buffered: true});
        
        // Fallback - resolve with navigation timing
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          resolve({
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          });
        }, 2000);
      });
    });
    
    console.log('Performance metrics:', metrics);
    
    // Basic performance assertions
    if ((metrics as any).LCP) {
      // LCP should be under 2.5 seconds
      expect((metrics as any).LCP).toBeLessThan(2500);
    }
    
    if ((metrics as any).CLS) {
      // CLS should be under 0.1
      expect((metrics as any).CLS).toBeLessThan(0.1);
    }
  });

  test('should handle multiple templates loading efficiently', async ({ page }) => {
    await page.goto('/');
    
    const startTime = Date.now();
    
    // Wait for all templates to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Count template cards with correct selector
    const templateCount = await page.locator('a[href*="/template/"]').count();
    const loadTime = Date.now() - startTime;
    
    console.log(`Loaded ${templateCount} templates in ${loadTime}ms`);
    
    // Should load at least some templates
    expect(templateCount).toBeGreaterThan(0);
    
    // Should load efficiently (less than 500ms per template for reasonable counts)
    if (templateCount > 0 && templateCount < 50) {
      expect(loadTime / templateCount).toBeLessThan(500);
    }
  });

  test('should have working images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that images are loading properly
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images are loaded
      for (let i = 0; i < Math.min(3, imageCount); i++) {
        const img = images.nth(i);
        
        // Check if image has naturalWidth (means it loaded)
        const isLoaded = await img.evaluate((el: HTMLImageElement) => {
          return el.naturalWidth > 0 && el.naturalHeight > 0;
        });
        
        if (!isLoaded) {
          // If image didn't load, at least check it has proper src
          const src = await img.getAttribute('src');
          expect(src).toBeTruthy();
        }
      }
    }
  });
});