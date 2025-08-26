const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

class TestHelper {
  constructor() {
    this.prisma = new PrismaClient()
    this.testResults = []
    this.testId = Date.now()
  }

  // Logging utilities
  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const colored = this.colorize(message, type)
    console.log(`[${timestamp}] ${colored}`)
  }

  colorize(text, type) {
    const colors = {
      info: '\x1b[34m',    // Blue
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    }
    return `${colors[type] || colors.info}${text}${colors.reset}`
  }

  // Test recording
  recordTest(testName, passed, message, duration = 0, details = {}) {
    this.testResults.push({
      testName,
      passed,
      message,
      duration,
      details,
      timestamp: new Date().toISOString()
    })

    const status = passed ? '✅' : '❌'
    const timeStr = duration > 0 ? ` (${duration}ms)` : ''
    this.log(`${status} ${testName}: ${message}${timeStr}`, passed ? 'success' : 'error')
  }

  // Database utilities
  async cleanupTestData() {
    try {
      // Delete test data in proper order to avoid FK constraints
      await this.prisma.riderTimelineEvent.deleteMany({
        where: { userId: { contains: 'test-' } }
      })
      
      await this.prisma.riderSkillMap.deleteMany({
        where: { userId: { contains: 'test-' } }
      })
      
      await this.prisma.questionnaireProfile.deleteMany({
        where: { userId: { contains: 'test-' } }
      })
      
      await this.prisma.user.deleteMany({
        where: { 
          OR: [
            { email: { contains: 'test-' } },
            { name: { contains: 'Test-' } }
          ]
        }
      })
      
      this.log('Test data cleaned up', 'info')
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error')
    }
  }

  // Create test user
  async createTestUser(suffix = 'user', role = 'STUDENT') {
    const password = await bcrypt.hash('test123', 10)
    const email = `test-${suffix}-${this.testId}@test.com`
    
    return await this.prisma.user.create({
      data: {
        email,
        name: `Test-${suffix}-${this.testId}`,
        password,
        role,
        emailVerified: new Date()
      }
    })
  }

  // HTTP request helper
  async makeRequest(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `http://localhost:3205${url}`
    
    try {
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })
      
      const data = response.headers.get('content-type')?.includes('json') 
        ? await response.json() 
        : await response.text()
        
      return {
        status: response.status,
        data,
        headers: response.headers
      }
    } catch (error) {
      return {
        status: 0,
        data: { error: error.message },
        headers: new Headers()
      }
    }
  }

  // Performance testing
  async measurePerformance(name, asyncFunction) {
    const start = Date.now()
    try {
      const result = await asyncFunction()
      const duration = Date.now() - start
      this.recordTest(name, true, `Completed in ${duration}ms`, duration, result)
      return { success: true, result, duration }
    } catch (error) {
      const duration = Date.now() - start
      this.recordTest(name, false, `Failed: ${error.message}`, duration, { error: error.message })
      return { success: false, error, duration }
    }
  }

  // Concurrent testing
  async runConcurrent(name, asyncFunction, count = 10) {
    this.log(`Running ${count} concurrent ${name} tests...`, 'info')
    
    const promises = Array.from({ length: count }, (_, i) => 
      asyncFunction(i).catch(error => ({ error, index: i }))
    )
    
    const start = Date.now()
    const results = await Promise.all(promises)
    const duration = Date.now() - start
    
    const successes = results.filter(r => !r.error).length
    const failures = results.filter(r => r.error).length
    
    this.recordTest(
      `${name} (concurrent)`, 
      failures === 0, 
      `${successes}/${count} succeeded`, 
      duration,
      { successes, failures, results }
    )
    
    return results
  }

  // Memory monitoring
  getMemoryUsage() {
    const usage = process.memoryUsage()
    return {
      rss: Math.round(usage.rss / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      external: Math.round(usage.external / 1024 / 1024)
    }
  }

  // Generate test report
  getTestReport() {
    const total = this.testResults.length
    const passed = this.testResults.filter(r => r.passed).length
    const failed = total - passed
    const avgDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0) / total
    
    return {
      summary: {
        total,
        passed,
        failed,
        passRate: Math.round((passed / total) * 100),
        avgDuration: Math.round(avgDuration)
      },
      tests: this.testResults,
      memoryUsage: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    }
  }

  // Cleanup
  async disconnect() {
    await this.prisma.$disconnect()
  }
}

module.exports = TestHelper