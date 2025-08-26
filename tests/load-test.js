#!/usr/bin/env node

/**
 * Load Testing for Nebachiv Content App
 * Tests system performance under various load conditions
 */

const TestHelper = require('./test-helper')
const cluster = require('cluster')
const os = require('os')

class LoadTest extends TestHelper {
  constructor() {
    super()
    this.performanceMetrics = []
    this.loadPatterns = {
      spike: { duration: 10000, concurrent: 50, interval: 100 },
      sustained: { duration: 30000, concurrent: 20, interval: 500 },
      burst: { duration: 5000, concurrent: 100, interval: 50 },
      gradual: { duration: 20000, concurrent: 5, interval: 1000 }
    }
  }

  // Measure response time and throughput
  async measureEndpointPerformance(endpoint, concurrent = 10, duration = 10000) {
    this.log(`Measuring ${endpoint} performance (${concurrent} concurrent, ${duration}ms)...`, 'info')
    
    const results = {
      requests: 0,
      successes: 0,
      failures: 0,
      responseTimes: [],
      errors: [],
      startTime: Date.now()
    }
    
    const makeRequest = async () => {
      const start = Date.now()
      try {
        const response = await this.makeRequest(endpoint)
        const responseTime = Date.now() - start
        
        results.requests++
        results.responseTimes.push(responseTime)
        
        if (response.status >= 200 && response.status < 400) {
          results.successes++
        } else {
          results.failures++
          results.errors.push(`${response.status}: ${response.data?.error || 'Unknown'}`)
        }
        
        return response
      } catch (error) {
        results.requests++
        results.failures++
        results.errors.push(error.message)
        return { error: error.message }
      }
    }
    
    // Run concurrent requests for specified duration
    const endTime = Date.now() + duration
    const promises = []
    
    while (Date.now() < endTime) {
      // Maintain concurrent request pool
      while (promises.length < concurrent && Date.now() < endTime) {
        promises.push(makeRequest())
      }
      
      // Wait for some requests to complete
      await Promise.race(promises)
      
      // Remove completed promises
      const completedPromises = []
      for (let i = 0; i < promises.length; i++) {
        if (promises[i].constructor.name !== 'Promise') {
          completedPromises.push(i)
        }
      }
      completedPromises.reverse().forEach(i => promises.splice(i, 1))
      
      // Small delay to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    // Wait for remaining requests
    await Promise.all(promises)
    
    // Calculate metrics
    const totalDuration = Date.now() - results.startTime
    const avgResponseTime = results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length
    const throughput = (results.requests / totalDuration) * 1000 // requests per second
    const successRate = (results.successes / results.requests) * 100
    
    const metrics = {
      endpoint,
      requests: results.requests,
      successes: results.successes,
      failures: results.failures,
      avgResponseTime: Math.round(avgResponseTime),
      minResponseTime: Math.min(...results.responseTimes),
      maxResponseTime: Math.max(...results.responseTimes),
      throughput: Math.round(throughput * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      duration: totalDuration,
      errors: results.errors.slice(0, 5) // Keep first 5 errors
    }
    
    this.performanceMetrics.push(metrics)
    
    // Determine if performance is acceptable
    const isAcceptable = avgResponseTime < 2000 && successRate > 95 && throughput > 1
    
    this.recordTest(
      `Load test: ${endpoint}`,
      isAcceptable,
      `${metrics.requests} req, ${metrics.avgResponseTime}ms avg, ${metrics.throughput}/s, ${metrics.successRate}% success`,
      totalDuration,
      metrics
    )
    
    return metrics
  }

  // Test API endpoints under load
  async testAPIEndpointsLoad() {
    this.log('Testing API endpoints under load...', 'info')
    
    const endpoints = [
      '/api/health',
      '/api/courses',
      '/api/auth/session',
      '/api/admin/content'
    ]
    
    for (const endpoint of endpoints) {
      await this.measureEndpointPerformance(endpoint, 15, 8000)
      
      // Small delay between endpoint tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Test database query performance under load
  async testDatabaseLoad() {
    this.log('Testing database performance under load...', 'info')
    
    const queries = [
      { name: 'User count', fn: () => this.prisma.user.count() },
      { name: 'User list', fn: () => this.prisma.user.findMany({ take: 10 }) },
      { name: 'User with profile', fn: () => this.prisma.user.findMany({ 
        include: { questionnaireProfiles: true }, 
        take: 5 
      })},
      { name: 'Complex join', fn: () => this.prisma.user.findMany({
        include: {
          questionnaireProfiles: true,
          riderSkillMap: true,
          riderTimelineEvents: true
        },
        take: 3
      })}
    ]
    
    for (const query of queries) {
      await this.measurePerformance(`DB Query: ${query.name}`, async () => {
        const concurrent = Array.from({ length: 10 }, () => query.fn())
        return await Promise.all(concurrent)
      })
    }
  }

  // Test memory usage under load
  async testMemoryUsage() {
    this.log('Testing memory usage under sustained load...', 'info')
    
    const initialMemory = this.getMemoryUsage()
    const memorySnapshots = [initialMemory]
    
    // Create memory pressure with data operations
    const createMemoryPressure = async () => {
      const users = []
      for (let i = 0; i < 100; i++) {
        users.push(await this.createTestUser(`memory-${i}`))
      }
      
      // Perform complex queries
      await this.prisma.user.findMany({
        include: {
          questionnaireProfiles: true,
          riderSkillMap: true,
          riderTimelineEvents: true
        }
      })
      
      return users
    }
    
    // Run memory pressure test
    const start = Date.now()
    try {
      const users = await createMemoryPressure()
      const duration = Date.now() - start
      
      const finalMemory = this.getMemoryUsage()
      memorySnapshots.push(finalMemory)
      
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed
      const memoryEfficient = memoryIncrease < 100 // Less than 100MB increase
      
      this.recordTest(
        'Memory efficiency',
        memoryEfficient,
        `Memory increase: ${memoryIncrease}MB (${initialMemory.heapUsed}MB → ${finalMemory.heapUsed}MB)`,
        duration,
        { memorySnapshots, users: users.length }
      )
      
    } catch (error) {
      this.recordTest('Memory efficiency', false, `Error: ${error.message}`)
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
      const gcMemory = this.getMemoryUsage()
      memorySnapshots.push(gcMemory)
      
      this.log(`Memory after GC: ${gcMemory.heapUsed}MB`, 'info')
    }
  }

  // Test different load patterns
  async testLoadPatterns() {
    this.log('Testing various load patterns...', 'info')
    
    for (const [patternName, config] of Object.entries(this.loadPatterns)) {
      this.log(`Testing ${patternName} load pattern...`, 'info')
      
      const startTime = Date.now()
      const results = {
        pattern: patternName,
        requests: 0,
        successes: 0,
        failures: 0,
        avgResponseTime: 0
      }
      
      const makePatternRequest = async (index) => {
        const requestStart = Date.now()
        try {
          const response = await this.makeRequest('/api/health')
          const responseTime = Date.now() - requestStart
          
          results.requests++
          results.avgResponseTime = ((results.avgResponseTime * (results.requests - 1)) + responseTime) / results.requests
          
          if (response.status === 200) {
            results.successes++
          } else {
            results.failures++
          }
          
          return { success: true, responseTime, index }
        } catch (error) {
          results.requests++
          results.failures++
          return { success: false, error: error.message, index }
        }
      }
      
      // Execute load pattern
      const endTime = startTime + config.duration
      let requestIndex = 0
      
      while (Date.now() < endTime) {
        const batchPromises = []
        
        // Create batch of concurrent requests
        for (let i = 0; i < config.concurrent; i++) {
          batchPromises.push(makePatternRequest(requestIndex++))
        }
        
        await Promise.all(batchPromises)
        
        // Wait for interval before next batch
        if (Date.now() < endTime) {
          await new Promise(resolve => setTimeout(resolve, config.interval))
        }
      }
      
      const totalDuration = Date.now() - startTime
      const successRate = (results.successes / results.requests) * 100
      const isSuccessful = successRate > 90 && results.avgResponseTime < 3000
      
      this.recordTest(
        `Load pattern: ${patternName}`,
        isSuccessful,
        `${results.requests} requests, ${Math.round(results.avgResponseTime)}ms avg, ${Math.round(successRate)}% success`,
        totalDuration,
        results
      )
    }
  }

  // Test concurrent user sessions
  async testConcurrentSessions() {
    this.log('Testing concurrent user sessions...', 'info')
    
    const sessionCount = 20
    
    const createUserSession = async (index) => {
      try {
        // Create test user
        const user = await this.createTestUser(`session-${index}`)
        
        // Simulate user activity
        const activities = [
          () => this.makeRequest('/api/health'),
          () => this.makeRequest('/api/courses'),
          () => this.makeRequest(`/api/user/${user.id}`)
        ]
        
        const results = []
        for (const activity of activities) {
          const start = Date.now()
          const response = await activity()
          results.push({
            duration: Date.now() - start,
            success: response.status < 400
          })
          
          // Random delay between activities
          await new Promise(resolve => setTimeout(resolve, Math.random() * 500))
        }
        
        return {
          userIndex: index,
          userId: user.id,
          activities: results,
          success: results.every(r => r.success)
        }
        
      } catch (error) {
        return {
          userIndex: index,
          error: error.message,
          success: false
        }
      }
    }
    
    // Create concurrent sessions
    const sessions = await this.runConcurrent('concurrent sessions', createUserSession, sessionCount)
    
    const successfulSessions = sessions.filter(s => s.success).length
    const sessionSuccess = (successfulSessions / sessionCount) * 100
    
    this.recordTest(
      'Concurrent sessions',
      sessionSuccess > 85,
      `${successfulSessions}/${sessionCount} sessions successful (${Math.round(sessionSuccess)}%)`,
      0,
      { sessions: sessions.slice(0, 3) } // Sample sessions
    )
  }

  // Run all load tests
  async runAllTests() {
    this.log('⚡ Starting Load Tests', 'info')
    this.log('=' .repeat(50), 'info')
    
    const startMemory = this.getMemoryUsage()
    const overallStart = Date.now()
    
    try {
      await this.testAPIEndpointsLoad()
      await this.testDatabaseLoad()
      await this.testConcurrentSessions()
      await this.testLoadPatterns()
      await this.testMemoryUsage()
      
    } catch (error) {
      this.log(`Critical error during load testing: ${error.message}`, 'error')
    }
    
    const overallDuration = Date.now() - overallStart
    const endMemory = this.getMemoryUsage()
    
    // Generate report
    const report = this.getTestReport()
    
    this.log('⚡ Load Test Results:', 'info')
    this.log(`Total Tests: ${report.summary.total}`, 'info')
    this.log(`Passed: ${report.summary.passed}`, 'success')
    this.log(`Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'warning' : 'success')
    this.log(`Pass Rate: ${report.summary.passRate}%`, report.summary.passRate > 80 ? 'success' : 'warning')
    this.log(`Total Duration: ${overallDuration}ms`, 'info')
    
    // Performance summary
    if (this.performanceMetrics.length > 0) {
      const avgThroughput = this.performanceMetrics.reduce((sum, m) => sum + m.throughput, 0) / this.performanceMetrics.length
      const avgResponseTime = this.performanceMetrics.reduce((sum, m) => sum + m.avgResponseTime, 0) / this.performanceMetrics.length
      
      this.log('📊 Performance Summary:', 'info')
      this.log(`Average Throughput: ${Math.round(avgThroughput * 100) / 100} req/s`, 'info')
      this.log(`Average Response Time: ${Math.round(avgResponseTime)}ms`, 'info')
      
      // Show slowest endpoints
      const slowest = this.performanceMetrics.sort((a, b) => b.avgResponseTime - a.avgResponseTime).slice(0, 3)
      this.log('Slowest Endpoints:', 'warning')
      slowest.forEach(m => {
        this.log(`  ${m.endpoint}: ${m.avgResponseTime}ms`, 'warning')
      })
    }
    
    this.log('Memory Impact:', 'info')
    this.log(`Start: ${startMemory.heapUsed}MB, End: ${endMemory.heapUsed}MB`, 'info')
    this.log(`Memory Delta: ${endMemory.heapUsed - startMemory.heapUsed}MB`, 'info')
    
    // Show failed tests
    if (report.summary.failed > 0) {
      this.log('⚠️ Failed Load Tests:', 'warning')
      report.tests.filter(t => !t.passed).forEach(test => {
        this.log(`  • ${test.testName}: ${test.message}`, 'warning')
      })
    }
    
    return report
  }

  // Cleanup test data
  async cleanup() {
    try {
      await this.cleanupTestData()
      this.log('🧹 Load test cleanup completed', 'success')
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error')
    }
  }
}

// Run if called directly
async function runLoadTest() {
  const tester = new LoadTest()
  
  try {
    const report = await tester.runAllTests()
    
    // Save detailed report
    const fs = require('fs')
    const reportPath = `./tests/reports/load-${Date.now()}.json`
    
    // Ensure reports directory exists
    if (!fs.existsSync('./tests/reports')) {
      fs.mkdirSync('./tests/reports', { recursive: true })
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📊 Detailed report saved to: ${reportPath}`)
    
    // Performance summary
    console.log(`\n⚡ LOAD TEST SUMMARY:`)
    console.log(`Tests Passed: ${report.summary.passed}/${report.summary.total}`)
    console.log(`Average Duration: ${report.summary.avgDuration}ms`)
    console.log(`System Performance: ${report.summary.passRate > 80 ? 'GOOD' : 'NEEDS OPTIMIZATION'}`)
    
  } catch (error) {
    console.error('Fatal load test error:', error)
    process.exit(1)
  } finally {
    await tester.cleanup()
    await tester.disconnect()
  }
}

module.exports = LoadTest

if (require.main === module) {
  runLoadTest()
}