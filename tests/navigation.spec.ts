import { test, expect } from '@playwright/test';

test.describe('Navigation & Filtering', () => {
  test('should open and use filters', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Click filters button
    const filterButton = page.locator('button:has-text("Filters")');
    await filterButton.click();
    
    // Check that filter dropdowns are visible
    const categorySelect = page.locator('select').first();
    await expect(categorySelect).toBeVisible();
    
    // Try to select a category
    await categorySelect.selectOption({ index: 1 }); // Select first non-"All" option
    
    // Wait for filter to apply
    await page.waitForTimeout(1000);
    
    // Should still have templates visible
    const results = page.locator('a[href*="/template/"]');
    await expect(results.first()).toBeVisible();
  });

  test('should navigate to individual template pages', async ({ page }) => {
    // Set a longer timeout for this test
    test.setTimeout(60000);
    
    await page.goto('/');
    
    // Wait for templates to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Find the first template link - click on the card itself, not the button
    const templateCard = page.locator('a[href*="/template/"]').first();
    
    // Wait for the template card to be visible
    await expect(templateCard).toBeVisible({ timeout: 15000 });
    
    // Get the href before clicking to verify it's a valid template URL
    const href = await templateCard.getAttribute('href');
    expect(href).toContain('/template/');
    
    console.log(`Clicking template link: ${href}`);
    
    // Click on the template card (not on the "Use template" button)
    await templateCard.click({ position: { x: 100, y: 100 } }); // Click in upper area of card
    
    // Wait for navigation with longer timeout using networkidle
    await page.waitForURL('**template**', { timeout: 45000, waitUntil: 'networkidle' });
    
    // Check we're on a template page
    expect(page.url()).toContain('template');
    console.log(`Navigation successful to: ${page.url()}`);
    
    // Check template page has loaded with more specific selectors
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('should show newsletter subscription form', async ({ page }) => {
    await page.goto('/');
    
    // Check newsletter elements with correct selectors
    const emailInput = page.locator('input[placeholder="Enter your email address"]');
    const subscribeButton = page.locator('button:has-text("Get Weekly Templates")');
    
    await expect(emailInput).toBeVisible();
    await expect(subscribeButton).toBeVisible();
  });

  test('should handle back navigation', async ({ page }) => {
    // Set longer timeout for this test
    test.setTimeout(60000);
    
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Find and click template card (not the button)
    const templateCard = page.locator('a[href*="/template/"]').first();
    await expect(templateCard).toBeVisible({ timeout: 15000 });
    
    const href = await templateCard.getAttribute('href');
    console.log(`Navigating to template: ${href}`);
    
    await templateCard.click({ position: { x: 100, y: 100 } });
    
    // Wait for navigation to complete
    await page.waitForURL('**template**', { timeout: 45000, waitUntil: 'networkidle' });
    
    // Confirm we're on template page
    expect(page.url()).toContain('template');
    console.log(`Successfully navigated to: ${page.url()}`);
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Should be back on homepage
    expect(page.url()).not.toContain('template');
    console.log(`Back navigation successful to: ${page.url()}`);
    
    // Should see the main heading again - with longer timeout
    await expect(page.locator('h1:has-text("#1 FREE n8n Template Directory")')).toBeVisible({ timeout: 10000 });
  });

  test('should show footer links', async ({ page }) => {
    await page.goto('/');
    
    // Check footer links exist
    await expect(page.locator('a[href="/terms"]')).toBeVisible();
    await expect(page.locator('a[href="/privacy"]')).toBeVisible();
  });
});