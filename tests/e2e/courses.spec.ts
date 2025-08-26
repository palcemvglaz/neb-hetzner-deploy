import { test, expect } from '@playwright/test'

test.describe('Courses', () => {
  test('should display courses list', async ({ page }) => {
    await page.goto('/courses')
    
    // Should see courses page
    await expect(page.locator('h1')).toContainText('Каталог курсів')
    
    // Should see course cards
    await expect(page.locator('text=Базовий курс мотоцикліста')).toBeVisible()
    await expect(page.locator('text=Техніки безпечної їзди')).toBeVisible()
  })

  test('should filter courses by category', async ({ page }) => {
    await page.goto('/courses')
    
    // Select category
    await page.selectOption('select[name="category"]', 'beginner')
    
    // Should update URL
    await expect(page).toHaveURL(/category=beginner/)
  })

  test('should view course details', async ({ page }) => {
    await page.goto('/courses')
    
    // Click on course
    await page.click('text=Базовий курс мотоцикліста')
    
    // Should navigate to course detail page
    await expect(page).toHaveURL(/\/courses\/basic-motorcycle-course/)
    
    // Should see course info
    await expect(page.locator('h1')).toContainText('Базовий курс мотоцикліста')
    await expect(page.locator('text=Що ви навчитесь')).toBeVisible()
    await expect(page.locator('text=Зміст курсу')).toBeVisible()
  })

  test('should show different CTA for logged in users', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.click('button:has-text("📚 Студент")')
    await page.waitForURL('/dashboard')
    
    // Go to courses
    await page.goto('/courses')
    
    // Should see "Continue Learning" button for enrolled courses
    await expect(page.locator('text=Продовжити навчання').first()).toBeVisible()
  })
})