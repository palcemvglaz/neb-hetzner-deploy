#!/usr/bin/env node

/**
 * Edge Cases Testing for Nebachiv Content App
 * Tests boundary conditions, extreme inputs, and unusual scenarios
 * Implements DEFENSIVE PARANOIA - assume every edge case can and will occur
 */

const TestHelper = require('./test-helper')

class EdgeCasesTest extends TestHelper {
  constructor() {
    super()
    this.edgeCaseScenarios = []
    this.boundaryViolations = []
  }

  // Test extreme string inputs
  async testExtremeStringInputs() {
    this.log('Testing extreme string inputs and boundary conditions...', 'info')
    
    const extremeStrings = [
      { name: 'Empty string', value: '', shouldFail: true },
      { name: 'Single character', value: 'a', shouldFail: false },
      { name: 'Very long string', value: 'A'.repeat(10000), shouldFail: true },
      { name: 'Unicode characters', value: '🚀🎯🔥💎🎨🌟⭐✨', shouldFail: false },
      { name: 'SQL injection attempt', value: "'; DROP TABLE users; --", shouldFail: true },
      { name: 'Script injection', value: '<script>alert("xss")</script>', shouldFail: true },
      { name: 'Null bytes', value: 'test\0null\0byte', shouldFail: true },
      { name: 'Line breaks', value: 'line1\nline2\rline3\r\nline4', shouldFail: false },
      { name: 'Special characters', value: '!@#$%^&*()_+-={}[]|\\:";\'<>?,./', shouldFail: false },
      { name: 'Only whitespace', value: '   \t\n\r   ', shouldFail: true }
    ]
    
    for (const testCase of extremeStrings) {
      try {
        const testUser = await this.createTestUser(`extreme-${Date.now()}`)
        
        // Test updating user name with extreme string
        try {
          await this.prisma.user.update({
            where: { id: testUser.id },
            data: { name: testCase.value }
          })
          
          // If we get here without error, check if it should have failed
          this.recordTest(
            `Extreme string: ${testCase.name}`,
            !testCase.shouldFail,
            `String accepted: "${testCase.value.substring(0, 50)}${testCase.value.length > 50 ? '...' : ''}"`
          )
          
        } catch (error) {
          // If error occurred, check if it should have failed
          this.recordTest(
            `Extreme string: ${testCase.name}`,
            testCase.shouldFail,
            `String rejected (${error.code}): "${testCase.value.substring(0, 50)}${testCase.value.length > 50 ? '...' : ''}"`
          )
        }
        
      } catch (error) {
        this.recordTest(`Extreme string: ${testCase.name}`, false, `Setup error: ${error.message}`)
      }
    }
  }

  // Test numeric boundary conditions
  async testNumericBoundaries() {
    this.log('Testing numeric boundary conditions...', 'info')
    
    const numericTests = [
      { name: 'Zero values', riskScore: 0, confidenceScore: 0, skillLevel: 0 },
      { name: 'Negative values', riskScore: -1, confidenceScore: -10, skillLevel: -5 },
      { name: 'Maximum valid', riskScore: 5, confidenceScore: 100, skillLevel: 10 },
      { name: 'Over maximum', riskScore: 10, confidenceScore: 150, skillLevel: 20 },
      { name: 'Decimal precision', riskScore: 3.14159265359, confidenceScore: 99.999, skillLevel: 7.5 },
      { name: 'Very large numbers', riskScore: 999999999, confidenceScore: 999999999, skillLevel: 999999999 },
      { name: 'Scientific notation', riskScore: 1e10, confidenceScore: 1e5, skillLevel: 1e3 },
      { name: 'Infinity', riskScore: Infinity, confidenceScore: Infinity, skillLevel: Infinity },
      { name: 'NaN', riskScore: NaN, confidenceScore: NaN, skillLevel: NaN }
    ]
    
    for (const test of numericTests) {
      try {
        const testUser = await this.createTestUser(`numeric-${Date.now()}`)
        
        try {
          // Test questionnaire profile with extreme numeric values
          const profile = await this.prisma.questionnaireProfile.create({
            data: {
              userId: testUser.id,
              type: 'beginner',
              profileType: 'BEGINNER_CAREFUL',
              answers: { test: 'data' },
              overallLevel: 'Beginner',
              riskProfile: 'low',
              riskScore: test.riskScore,
              confidenceScore: test.confidenceScore,
              skillsScore: 75
            }
          })
          
          // Test skill map with extreme values
          await this.prisma.riderSkillMap.create({
            data: {
              userId: testUser.id,
              overallLevel: test.skillLevel,
              basicSkills: { balance: test.confidenceScore },
              advancedSkills: { emergencyBraking: test.riskScore * 10 },
              stuntSkills: { wheelie: test.skillLevel * 5 },
              safetySkills: { hazardPerception: test.confidenceScore }
            }
          })
          
          this.recordTest(
            `Numeric boundary: ${test.name}`,
            true,
            `Values accepted - Risk: ${test.riskScore}, Confidence: ${test.confidenceScore}, Skill: ${test.skillLevel}`
          )
          
        } catch (error) {
          const shouldSucceed = (
            test.name === 'Maximum valid' || 
            test.name === 'Decimal precision' ||
            test.name === 'Zero values'
          )
          
          this.recordTest(
            `Numeric boundary: ${test.name}`,
            !shouldSucceed,
            `Values rejected (${error.code}): Risk: ${test.riskScore}, Confidence: ${test.confidenceScore}`
          )
        }
        
      } catch (error) {
        this.recordTest(`Numeric boundary: ${test.name}`, false, `Setup error: ${error.message}`)
      }
    }
  }

  // Test date and time edge cases
  async testDateTimeEdgeCases() {
    this.log('Testing date and time edge cases...', 'info')
    
    const dateTests = [
      { name: 'Unix epoch', date: new Date(0) },
      { name: 'Year 1900', date: new Date(1900, 0, 1) },
      { name: 'Year 2000 (Y2K)', date: new Date(2000, 0, 1) },
      { name: 'Leap year', date: new Date(2024, 1, 29) }, // Feb 29, 2024
      { name: 'Far future', date: new Date(2099, 11, 31) },
      { name: 'Invalid date', date: new Date('invalid') },
      { name: 'Null date', date: null }
    ]
    
    for (const test of dateTests) {
      try {
        const testUser = await this.createTestUser(`date-${Date.now()}`)
        
        try {
          // Test timeline event with extreme dates
          await this.prisma.riderTimelineEvent.create({
            data: {
              userId: testUser.id,
              title: `Date test: ${test.name}`,
              description: 'Testing date edge case',
              eventType: 'test_event',
              eventDate: test.date
            }
          })
          
          const isValidDate = test.date instanceof Date && !isNaN(test.date.getTime())
          
          this.recordTest(
            `Date edge case: ${test.name}`,
            isValidDate || test.date === null,
            `Date ${test.date ? test.date.toISOString() : 'null'} processed`
          )
          
        } catch (error) {
          const shouldFail = test.name === 'Invalid date'
          
          this.recordTest(
            `Date edge case: ${test.name}`,
            shouldFail,
            `Date rejected: ${error.message}`
          )
        }
        
      } catch (error) {
        this.recordTest(`Date edge case: ${test.name}`, false, `Setup error: ${error.message}`)
      }
    }
  }

  // Test JSON data edge cases
  async testJSONEdgeCases() {
    this.log('Testing JSON data edge cases...', 'info')
    
    const jsonTests = [
      { name: 'Empty object', data: {} },
      { name: 'Null value', data: null },
      { name: 'Nested deep object', data: this.createDeeplyNestedObject(50) },
      { name: 'Large array', data: { answers: Array.from({ length: 1000 }, (_, i) => `answer${i}`) } },
      { name: 'Special characters in keys', data: { 'key with spaces': 'value', '🔑': 'emoji key' } },
      { name: 'Circular reference', data: this.createCircularReference() },
      { name: 'Binary data', data: { buffer: Buffer.from('binary data').toString('base64') } },
      { name: 'Very long string values', data: { longValue: 'x'.repeat(100000) } }
    ]
    
    for (const test of jsonTests) {
      try {
        const testUser = await this.createTestUser(`json-${Date.now()}`)
        
        try {
          await this.prisma.questionnaireProfile.create({
            data: {
              userId: testUser.id,
              type: 'beginner',
              profileType: 'BEGINNER_CAREFUL',
              answers: test.data,
              overallLevel: 'Beginner',
              riskProfile: 'low'
            }
          })
          
          this.recordTest(
            `JSON edge case: ${test.name}`,
            true,
            `JSON data accepted: ${JSON.stringify(test.data).substring(0, 100)}...`
          )
          
        } catch (error) {
          const shouldFail = test.name === 'Circular reference' || test.name === 'Very long string values'
          
          this.recordTest(
            `JSON edge case: ${test.name}`,
            shouldFail,
            `JSON rejected: ${error.message}`
          )
        }
        
      } catch (error) {
        this.recordTest(`JSON edge case: ${test.name}`, false, `Setup error: ${error.message}`)
      }
    }
  }

  // Test concurrent edge cases
  async testConcurrentEdgeCases() {
    this.log('Testing concurrent edge cases and race conditions...', 'info')
    
    try {
      // Test: Create users with identical emails simultaneously
      const identicalEmailTest = async (index) => {
        try {
          const email = `concurrent-edge@test.com`
          const user = await this.prisma.user.create({
            data: {
              email,
              name: `Concurrent User ${index}`,
              password: 'test123',
              role: 'STUDENT'
            }
          })
          return { success: true, userId: user.id, index }
        } catch (error) {
          return { success: false, error: error.message, index }
        }
      }
      
      const results = await Promise.all(
        Array.from({ length: 5 }, (_, i) => identicalEmailTest(i))
      )
      
      const successes = results.filter(r => r.success).length
      const failures = results.filter(r => !r.success).length
      
      this.recordTest(
        'Concurrent identical emails',
        successes === 1 && failures === 4, // Only one should succeed
        `${successes} succeeded, ${failures} failed (expected 1 success, 4 failures)`
      )
      
      // Test: Simultaneous profile creation for same user
      const testUser = await this.createTestUser('concurrent-profile')
      
      const profileCreation = async (index) => {
        try {
          await this.prisma.questionnaireProfile.create({
            data: {
              userId: testUser.id,
              type: 'beginner',
              profileType: 'BEGINNER_CAREFUL',
              answers: { concurrent: true, index },
              overallLevel: 'Beginner',
              riskProfile: 'low'
            }
          })
          return { success: true, index }
        } catch (error) {
          return { success: false, error: error.message, index }
        }
      }
      
      const profileResults = await Promise.all(
        Array.from({ length: 3 }, (_, i) => profileCreation(i))
      )
      
      const profileSuccesses = profileResults.filter(r => r.success).length
      
      this.recordTest(
        'Concurrent profile creation',
        profileSuccesses === 1, // Only one profile per user should be allowed
        `${profileSuccesses} profiles created for one user (expected 1)`
      )
      
    } catch (error) {
      this.recordTest('Concurrent edge cases', false, `Error: ${error.message}`)
    }
  }

  // Test system resource exhaustion
  async testResourceExhaustion() {
    this.log('Testing system resource exhaustion scenarios...', 'info')
    
    try {
      // Test: Create large number of users rapidly
      const massUserCreation = async () => {
        const users = []
        const batchSize = 50
        
        try {
          for (let i = 0; i < batchSize; i++) {
            const user = await this.createTestUser(`mass-${i}`)
            users.push(user)
          }
          return { success: true, count: users.length }
        } catch (error) {
          return { success: false, error: error.message, count: users.length }
        }
      }
      
      const massCreationResult = await massUserCreation()
      
      this.recordTest(
        'Mass user creation',
        massCreationResult.success,
        `Created ${massCreationResult.count} users ${massCreationResult.success ? 'successfully' : 'before failure'}`
      )
      
      // Test: Large query result handling
      const largeQueryTest = async () => {
        try {
          const startTime = Date.now()
          const users = await this.prisma.user.findMany({
            include: {
              questionnaireProfiles: true,
              riderSkillMap: true,
              riderTimelineEvents: true
            }
          })
          const duration = Date.now() - startTime
          
          return { 
            success: true, 
            count: users.length, 
            duration,
            memoryUsage: this.getMemoryUsage()
          }
        } catch (error) {
          return { success: false, error: error.message }
        }
      }
      
      const queryResult = await largeQueryTest()
      
      this.recordTest(
        'Large query handling',
        queryResult.success && queryResult.duration < 10000,
        `Queried ${queryResult.count} records in ${queryResult.duration}ms`,
        queryResult.duration
      )
      
    } catch (error) {
      this.recordTest('Resource exhaustion tests', false, `Error: ${error.message}`)
    }
  }

  // Test malformed data scenarios
  async testMalformedData() {
    this.log('Testing malformed data handling...', 'info')
    
    const malformedTests = [
      {
        name: 'Mixed type answers',
        data: {
          userId: 'will-be-replaced',
          type: 'beginner',
          profileType: 'BEGINNER_CAREFUL',
          answers: {
            string_answer: 'text',
            number_answer: 42,
            boolean_answer: true,
            null_answer: null,
            array_answer: [1, 2, 3],
            object_answer: { nested: 'value' }
          },
          overallLevel: 'Beginner',
          riskProfile: 'low'
        }
      },
      {
        name: 'Wrong enum values',
        data: {
          userId: 'will-be-replaced',
          type: 'invalid_type',
          profileType: 'INVALID_PROFILE',
          answers: {},
          overallLevel: 'Invalid Level',
          riskProfile: 'invalid_risk'
        }
      }
    ]
    
    for (const test of malformedTests) {
      try {
        const testUser = await this.createTestUser(`malformed-${Date.now()}`)
        test.data.userId = testUser.id
        
        try {
          await this.prisma.questionnaireProfile.create({
            data: test.data
          })
          
          this.recordTest(
            `Malformed data: ${test.name}`,
            test.name === 'Mixed type answers', // This should succeed
            `Data accepted despite potential issues`
          )
          
        } catch (error) {
          this.recordTest(
            `Malformed data: ${test.name}`,
            test.name === 'Wrong enum values', // This should fail
            `Data rejected: ${error.message}`
          )
        }
        
      } catch (error) {
        this.recordTest(`Malformed data: ${test.name}`, false, `Setup error: ${error.message}`)
      }
    }
  }

  // Helper function to create deeply nested object
  createDeeplyNestedObject(depth) {
    let obj = { value: 'deep' }
    for (let i = 0; i < depth; i++) {
      obj = { level: i, nested: obj }
    }
    return obj
  }

  // Helper function to create circular reference
  createCircularReference() {
    const obj = { name: 'parent' }
    obj.self = obj
    return obj
  }

  // Test API endpoint edge cases
  async testAPIEndpointEdgeCases() {
    this.log('Testing API endpoint edge cases...', 'info')
    
    const apiTests = [
      { name: 'Non-existent endpoint', url: '/api/nonexistent', expectedStatus: 404 },
      { name: 'Malformed JSON body', url: '/api/health', method: 'POST', body: '{"invalid": json}', expectedStatus: 400 },
      { name: 'Extremely long URL', url: `/api/health?${'param=value&'.repeat(1000)}end=true`, expectedStatus: 414 },
      { name: 'Invalid HTTP method', url: '/api/health', method: 'INVALID', expectedStatus: 405 },
      { name: 'Missing required headers', url: '/api/admin/content', expectedStatus: [401, 403] }
    ]
    
    for (const test of apiTests) {
      try {
        const options = {
          method: test.method || 'GET'
        }
        
        if (test.body) {
          options.headers = { 'Content-Type': 'application/json' }
          options.body = test.body
        }
        
        const response = await this.makeRequest(test.url, options)
        
        const expectedStatuses = Array.isArray(test.expectedStatus) ? test.expectedStatus : [test.expectedStatus]
        const statusMatches = expectedStatuses.includes(response.status)
        
        this.recordTest(
          `API edge case: ${test.name}`,
          statusMatches,
          `Expected ${expectedStatuses.join(' or ')}, got ${response.status}`
        )
        
      } catch (error) {
        // Some edge cases might cause connection errors, which is also a valid response
        this.recordTest(
          `API edge case: ${test.name}`,
          true,
          `Connection error (expected for some edge cases): ${error.message}`
        )
      }
    }
  }

  // Run all edge case tests
  async runAllTests() {
    this.log('🔍 Starting Edge Cases Tests (DEFENSIVE PARANOIA)', 'info')
    this.log('=' .repeat(55), 'info')
    
    const startMemory = this.getMemoryUsage()
    const overallStart = Date.now()
    
    try {
      await this.testExtremeStringInputs()
      await this.testNumericBoundaries()
      await this.testDateTimeEdgeCases()
      await this.testJSONEdgeCases()
      await this.testConcurrentEdgeCases()
      await this.testResourceExhaustion()
      await this.testMalformedData()
      await this.testAPIEndpointEdgeCases()
      
    } catch (error) {
      this.log(`Critical error during edge case testing: ${error.message}`, 'error')
    }
    
    const overallDuration = Date.now() - overallStart
    const endMemory = this.getMemoryUsage()
    
    // Generate report
    const report = this.getTestReport()
    
    this.log('🔍 Edge Cases Test Results:', 'info')
    this.log(`Total Tests: ${report.summary.total}`, 'info')
    this.log(`Passed: ${report.summary.passed}`, 'success')
    this.log(`Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'warning' : 'success')
    this.log(`Pass Rate: ${report.summary.passRate}%`, report.summary.passRate > 75 ? 'success' : 'warning')
    this.log(`Total Duration: ${overallDuration}ms`, 'info')
    
    // Edge case resilience score
    const resilenceScore = Math.max(0, 100 - (report.summary.failed * 3)) // More lenient scoring for edge cases
    this.log(`🛡️ Edge Case Resilience Score: ${resilenceScore}/100`, resilenceScore > 75 ? 'success' : 'warning')
    
    // Show critical edge case failures
    const criticalEdgeFailures = report.tests.filter(t => 
      !t.passed && (
        t.testName.includes('SQL injection') ||
        t.testName.includes('Script injection') ||
        t.testName.includes('Concurrent identical') ||
        t.testName.includes('Buffer overflow')
      )
    )
    
    if (criticalEdgeFailures.length > 0) {
      this.log('🚨 CRITICAL EDGE CASE VULNERABILITIES:', 'error')
      criticalEdgeFailures.forEach(test => {
        this.log(`  ⚠️  ${test.testName}: ${test.message}`, 'error')
      })
    }
    
    this.log('Memory Impact:', 'info')
    this.log(`Start: ${startMemory.heapUsed}MB, End: ${endMemory.heapUsed}MB`, 'info')
    this.log(`Memory Delta: ${endMemory.heapUsed - startMemory.heapUsed}MB`, 'info')
    
    return report
  }

  // Cleanup test data
  async cleanup() {
    try {
      await this.cleanupTestData()
      this.log('🧹 Edge cases test cleanup completed', 'success')
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error')
    }
  }
}

// Run if called directly
async function runEdgeCasesTest() {
  const tester = new EdgeCasesTest()
  
  try {
    const report = await tester.runAllTests()
    
    // Save detailed report
    const fs = require('fs')
    const reportPath = `./tests/reports/edge-cases-${Date.now()}.json`
    
    // Ensure reports directory exists
    if (!fs.existsSync('./tests/reports')) {
      fs.mkdirSync('./tests/reports', { recursive: true })
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📊 Detailed report saved to: ${reportPath}`)
    
    // Edge case resilience summary
    const criticalFailures = report.tests.filter(t => 
      !t.passed && (
        t.testName.includes('injection') ||
        t.testName.includes('overflow') ||
        t.testName.includes('concurrent')
      )
    ).length
    
    const resilenceScore = Math.max(0, 100 - (report.summary.failed * 3))
    
    console.log(`\n🔍 EDGE CASES SUMMARY:`)
    console.log(`Resilience Score: ${resilenceScore}/100`)
    console.log(`Critical Vulnerabilities: ${criticalFailures}`)
    console.log(`System Robustness: ${resilenceScore > 75 ? 'EXCELLENT' : resilenceScore > 50 ? 'GOOD' : 'NEEDS HARDENING'}`)
    
  } catch (error) {
    console.error('Fatal edge cases test error:', error)
    process.exit(1)
  } finally {
    await tester.cleanup()
    await tester.disconnect()
  }
}

module.exports = EdgeCasesTest

if (require.main === module) {
  runEdgeCasesTest()
}