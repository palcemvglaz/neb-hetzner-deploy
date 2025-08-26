import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login with email and password as admin', async ({ page }) => {
    await page.goto('/login')
    
    // Fill login form
    await page.fill('input[name="email"]', 'admin@nebachiv.com')
    await page.fill('input[name="password"]', 'admin123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should redirect to admin dashboard
    await page.waitForURL('/admin', { timeout: 10000 })
    
    // Should see admin dashboard
    await expect(page.locator('h1').last()).toContainText('Панель адміністратора')
  })

  test('should login with quick login button as admin', async ({ page }) => {
    await page.goto('/login')
    
    // Click quick login button for admin
    await page.click('button:has-text("🔑 Адмін")')
    
    // Should redirect to admin dashboard
    await page.waitForURL('/admin', { timeout: 10000 })
    
    // Should see admin dashboard
    await expect(page.locator('h1').last()).toContainText('Панель адміністратора')
  })

  test('should login with quick login button as student', async ({ page }) => {
    await page.goto('/login')
    
    // Click quick login button for student
    await page.click('button:has-text("📚 Студент")')
    
    // Should redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 })
    
    // Should see student dashboard
    await expect(page.locator('h1').first()).toContainText('Вітаємо')
  })

  test('should login with quick login button as school', async ({ page }) => {
    await page.goto('/login')
    
    // Click quick login button for school
    await page.click('button:has-text("🏫 Школа")')
    
    // Should redirect to school dashboard
    await page.waitForURL('/school', { timeout: 10000 })
    
    // Should see school dashboard
    await expect(page.locator('h1').first()).toContainText('Київська Мотошкола')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'wrong@email.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Неправильний email або пароль')).toBeVisible()
  })
})