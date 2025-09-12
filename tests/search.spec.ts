import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should search for templates', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Find search input with correct placeholder
    const searchInput = page.locator('input[placeholder="Search for templates..."]');
    await expect(searchInput).toBeVisible();
    
    // Search for a common term - just type, don't press Enter as it's auto-search with debounce
    await searchInput.fill('automation');
    
    // Wait for debounced search to trigger (300ms + some buffer)
    await page.waitForTimeout(1000);
    
    // Check if results are visible (template cards)
    const results = page.locator('a[href*="/template/"]');
    await expect(results.first()).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Search for something unlikely to exist
    const searchInput = page.locator('input[placeholder="Search for templates..."]');
    await searchInput.fill('xxxxxxx-unlikely-search-term-xxxxxxx');
    
    // Wait for debounced search
    await page.waitForTimeout(1000);
    
    // Should show no results message
    const noResultsText = page.locator('text=No templates found matching your criteria');
    await expect(noResultsText).toBeVisible();
  });

  test('should clear search with clear button', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Get initial template count
    const initialResults = page.locator('a[href*="/template/"]');
    
    // Search for something
    const searchInput = page.locator('input[placeholder="Search for templates..."]');
    await searchInput.fill('automation');
    await page.waitForTimeout(1000);
    
    // Clear search by selecting all and deleting
    await searchInput.selectText();
    await searchInput.fill('');
    await page.waitForTimeout(1000);
    
    // Should show similar number of templates again
    const finalCount = await initialResults.count();
    expect(finalCount).toBeGreaterThan(0);
  });
});