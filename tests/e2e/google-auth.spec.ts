import { test, expect } from '@playwright/test'

test.describe('Google OAuth', () => {
  test('should show Google login button', async ({ page }) => {
    await page.goto('/login')
    
    // Should see Google button
    await expect(page.locator('button:has-text("Google")')).toBeVisible()
  })

  test('should redirect to Google when clicking Google button', async ({ page }) => {
    await page.goto('/login')
    
    // Click Google button
    const googleButton = page.locator('button:has-text("Google")')
    
    // Listen for navigation
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      googleButton.click()
    ])
    
    // Should open Google OAuth page
    await expect(popup.url()).toContain('accounts.google.com')
  })
})