import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading exists - the actual h1 text
    await expect(page.locator('h1:has-text("#1 FREE n8n Template Directory")')).toBeVisible();
    
    // Wait for templates to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Give time for data to load
    
    // Check that template cards are loaded (they're Links with Cards inside)
    const templateCards = page.locator('a[href*="/template/"]');
    await expect(templateCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Check search input exists with the actual placeholder
    await expect(page.locator('input[placeholder="Search for templates..."]')).toBeVisible();
  });

  test('should display filter options', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check filter button exists
    const filterButton = page.locator('button:has-text("Filters")');
    await expect(filterButton).toBeVisible();
    
    // Click to open filters
    await filterButton.click();
    
    // Check filter dropdowns appear
    const selectCount = await page.locator('select').count();
    expect(selectCount).toBeGreaterThan(0);
  });

  test('should display newsletter signup', async ({ page }) => {
    await page.goto('/');
    
    // Check email input and subscribe button
    await expect(page.locator('input[placeholder="Enter your email address"]')).toBeVisible();
    await expect(page.locator('button:has-text("Get Weekly Templates")')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check page loads on mobile
    await expect(page.locator('h1')).toBeVisible();
  });
});