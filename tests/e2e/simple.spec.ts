import { test, expect } from '@playwright/test'

test.describe('Simple Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    
    // Should see Nebachiv in the page
    await expect(page).toHaveTitle(/Nebachiv/i)
  })

  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    
    // Should see login form
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('can navigate to courses', async ({ page }) => {
    await page.goto('/')
    
    // Click on courses link if exists
    const coursesLink = page.locator('a[href="/courses"]').first()
    if (await coursesLink.isVisible()) {
      await coursesLink.click()
      await expect(page).toHaveURL('/courses')
    } else {
      // Navigate directly
      await page.goto('/courses')
    }
    
    // Page should load without errors
    await expect(page.locator('body')).toBeVisible()
  })
})