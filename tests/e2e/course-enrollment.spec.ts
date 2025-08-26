import { test, expect } from '@playwright/test'

test.describe('Course Enrollment', () => {
  test.beforeEach(async ({ page }) => {
    // Login as a student before each test
    await page.goto('/login')
    await page.click('button:has-text("📚 Студент")')
    await page.waitForURL('/dashboard', { timeout: 10000 })
  })

  test('should browse available courses', async ({ page }) => {
    // Navigate to courses page
    await page.goto('/courses')
    
    // Should see courses list
    await expect(page.locator('h1')).toContainText('Курси')
    
    // Should have at least one course card
    const courseCards = page.locator('[data-testid="course-card"]')
    await expect(courseCards.first()).toBeVisible()
  })

  test('should view course details', async ({ page }) => {
    // Navigate to courses page
    await page.goto('/courses')
    
    // Click on first course
    const firstCourse = page.locator('[data-testid="course-card"]').first()
    await firstCourse.click()
    
    // Should navigate to course detail page
    await expect(page.url()).toMatch(/\/courses\/[^/]+/)
    
    // Should see course information
    await expect(page.locator('h1')).toBeVisible() // Course title
    await expect(page.locator('text=Опис курсу')).toBeVisible()
    await expect(page.locator('text=Програма курсу')).toBeVisible()
  })

  test('should enroll in a free course', async ({ page }) => {
    // Navigate to a specific free course (assuming one exists)
    await page.goto('/courses')
    
    // Find a free course
    const freeCourse = page.locator('[data-testid="course-card"]').filter({
      hasText: 'Безкоштовно'
    }).first()
    
    // If no free course found, skip test
    const freeCourseCount = await freeCourse.count()
    if (freeCourseCount === 0) {
      test.skip()
      return
    }
    
    await freeCourse.click()
    
    // Click enroll button
    await page.click('button:has-text("Розпочати навчання")')
    
    // Should redirect to course learning page
    await expect(page.url()).toMatch(/\/dashboard\/learn/)
    
    // Should see course content
    await expect(page.locator('[data-testid="course-content"]')).toBeVisible()
  })

  test('should track course progress', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Check if there are any enrolled courses
    const enrolledCourses = page.locator('[data-testid="enrolled-course"]')
    const coursesCount = await enrolledCourses.count()
    
    if (coursesCount === 0) {
      // Enroll in a course first
      await page.goto('/courses')
      const firstCourse = page.locator('[data-testid="course-card"]').first()
      await firstCourse.click()
      await page.click('button:has-text("Розпочати навчання")')
    } else {
      // Click on first enrolled course
      await enrolledCourses.first().click()
    }
    
    // Should see progress indicator
    await expect(page.locator('[data-testid="course-progress"]')).toBeVisible()
    
    // Complete a lesson (if available)
    const firstLesson = page.locator('[data-testid="lesson-item"]').first()
    if (await firstLesson.count() > 0) {
      await firstLesson.click()
      
      // Mark lesson as complete
      const completeButton = page.locator('button:has-text("Завершити урок")')
      if (await completeButton.count() > 0) {
        await completeButton.click()
        
        // Progress should update
        await expect(page.locator('[data-testid="course-progress"]')).toContainText(/[1-9]/)
      }
    }
  })

  test('should access course from mobile menu', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip()
      return
    }
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]')
    
    // Click on courses link
    await page.click('a:has-text("Курси")')
    
    // Should navigate to courses page
    await expect(page.url()).toContain('/courses')
    await expect(page.locator('h1')).toContainText('Курси')
  })

  test('should handle payment flow for premium course', async ({ page }) => {
    // Navigate to courses
    await page.goto('/courses')
    
    // Find a premium course
    const premiumCourse = page.locator('[data-testid="course-card"]').filter({
      hasText: '₴'
    }).first()
    
    const premiumCourseCount = await premiumCourse.count()
    if (premiumCourseCount === 0) {
      test.skip()
      return
    }
    
    await premiumCourse.click()
    
    // Click purchase button
    await page.click('button:has-text("Придбати курс")')
    
    // Should show payment modal or redirect to payment page
    await expect(
      page.locator('text=Оплата курсу').or(page.locator('text=Stripe'))
    ).toBeVisible({ timeout: 10000 })
    
    // Cancel payment
    const cancelButton = page.locator('button:has-text("Скасувати")').or(
      page.locator('button:has-text("Cancel")')
    )
    if (await cancelButton.count() > 0) {
      await cancelButton.click()
    } else {
      // Navigate back if redirected to external payment
      await page.goBack()
    }
  })
})