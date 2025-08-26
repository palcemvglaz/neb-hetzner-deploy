#!/usr/bin/env node

/**
 * Database Stress Testing for Nebachiv Content App
 * Tests database resilience, constraints, and concurrent operations
 */

const TestHelper = require('./test-helper')

class DatabaseStressTest extends TestHelper {
  constructor() {
    super()
    this.concurrentUsers = []
  }

  // Test unique constraint violations
  async testUniqueConstraints() {
    this.log('Testing unique constraint violations...', 'info')
    
    const testEmail = `stress-test-${Date.now()}@test.com`
    
    try {
      // Create first user
      const user1 = await this.createTestUser('unique1')
      this.recordTest('Create first user', true, `Created user: ${user1.email}`)
      
      // Try to create user with same email - should fail
      try {
        await this.prisma.user.create({
          data: {
            email: user1.email,
            name: 'Duplicate User',
            password: 'test123',
            role: 'STUDENT'
          }
        })
        this.recordTest('Unique constraint test', false, 'Should have failed but succeeded')
      } catch (error) {
        this.recordTest('Unique constraint test', true, `Correctly rejected duplicate: ${error.code}`)
      }
      
    } catch (error) {
      this.recordTest('Unique constraint test', false, `Setup failed: ${error.message}`)
    }
  }

  // Test cascade deletion behavior
  async testCascadeDeletion() {
    this.log('Testing cascade deletion...', 'info')
    
    try {
      // Create user with related data
      const user = await this.createTestUser('cascade')
      
      // Create questionnaire profile
      await this.prisma.questionnaireProfile.create({
        data: {
          userId: user.id,
          type: 'beginner',
          profileType: 'BEGINNER_CAREFUL',
          answers: { test: 'data' },
          overallLevel: 'Beginner',
          riskProfile: 'low'
        }
      })
      
      // Create skill map
      await this.prisma.riderSkillMap.create({
        data: {
          userId: user.id,
          overallLevel: 2,
          basicSkills: { balance: 75 },
          advancedSkills: { emergencyBraking: 60 },
          stuntSkills: { wheelie: 20 },
          safetySkills: { hazardPerception: 85 }
        }
      })
      
      // Create timeline events
      await this.prisma.riderTimelineEvent.create({
        data: {
          userId: user.id,
          title: 'Test Event',
          description: 'Test cascade deletion',
          eventType: 'started_riding',
          eventDate: new Date()
        }
      })
      
      // Count related records before deletion
      const profilesBefore = await this.prisma.questionnaireProfile.count({
        where: { userId: user.id }
      })
      const skillsBefore = await this.prisma.riderSkillMap.count({
        where: { userId: user.id }
      })
      const eventsBefore = await this.prisma.riderTimelineEvent.count({
        where: { userId: user.id }
      })
      
      // Delete user - should cascade
      await this.prisma.user.delete({ where: { id: user.id } })
      
      // Count related records after deletion
      const profilesAfter = await this.prisma.questionnaireProfile.count({
        where: { userId: user.id }
      })
      const skillsAfter = await this.prisma.riderSkillMap.count({
        where: { userId: user.id }
      })
      const eventsAfter = await this.prisma.riderTimelineEvent.count({
        where: { userId: user.id }
      })
      
      const cascadeWorked = profilesAfter === 0 && skillsAfter === 0 && eventsAfter === 0
      
      this.recordTest(
        'Cascade deletion', 
        cascadeWorked, 
        `Before: ${profilesBefore + skillsBefore + eventsBefore}, After: ${profilesAfter + skillsAfter + eventsAfter}`
      )
      
    } catch (error) {
      this.recordTest('Cascade deletion', false, `Failed: ${error.message}`)
    }
  }

  // Test concurrent database writes
  async testConcurrentWrites() {
    this.log('Testing concurrent database writes...', 'info')
    
    const createConcurrentUser = async (index) => {
      try {
        const user = await this.createTestUser(`concurrent-${index}`)
        return { success: true, user }
      } catch (error) {
        return { success: false, error: error.message, index }
      }
    }
    
    await this.runConcurrent('concurrent user creation', createConcurrentUser, 20)
  }

  // Test database connection pool exhaustion
  async testConnectionPoolStress() {
    this.log('Testing database connection pool...', 'info')
    
    const performQuery = async (index) => {
      try {
        const start = Date.now()
        await this.prisma.user.findMany({ take: 1 })
        const duration = Date.now() - start
        return { success: true, duration, index }
      } catch (error) {
        return { success: false, error: error.message, index }
      }
    }
    
    // Test with high concurrency
    await this.runConcurrent('connection pool stress', performQuery, 50)
  }

  // Test transaction rollbacks
  async testTransactionRollbacks() {
    this.log('Testing transaction rollbacks...', 'info')
    
    try {
      const initialUserCount = await this.prisma.user.count()
      
      try {
        await this.prisma.$transaction(async (tx) => {
          // Create user
          const user = await tx.user.create({
            data: {
              email: `tx-test-${Date.now()}@test.com`,
              name: 'Transaction Test',
              password: 'test123',
              role: 'STUDENT'
            }
          })
          
          // Create related data
          await tx.questionnaireProfile.create({
            data: {
              userId: user.id,
              type: 'beginner',
              profileType: 'BEGINNER_CAREFUL',
              answers: { test: 'data' },
              overallLevel: 'Beginner',
              riskProfile: 'low'
            }
          })
          
          // Force an error to trigger rollback
          throw new Error('Intentional transaction rollback')
        })
      } catch (error) {
        // Expected error
      }
      
      const finalUserCount = await this.prisma.user.count()
      const rollbackWorked = initialUserCount === finalUserCount
      
      this.recordTest(
        'Transaction rollback', 
        rollbackWorked, 
        `Users before: ${initialUserCount}, after: ${finalUserCount}`
      )
      
    } catch (error) {
      this.recordTest('Transaction rollback', false, `Failed: ${error.message}`)
    }
  }

  // Test foreign key constraints
  async testForeignKeyConstraints() {
    this.log('Testing foreign key constraints...', 'info')
    
    try {
      // Try to create questionnaire profile with non-existent user
      try {
        await this.prisma.questionnaireProfile.create({
          data: {
            userId: 'non-existent-user-id',
            type: 'beginner',
            profileType: 'BEGINNER_CAREFUL',
            answers: { test: 'data' },
            overallLevel: 'Beginner',
            riskProfile: 'low'
          }
        })
        this.recordTest('Foreign key constraint', false, 'Should have failed but succeeded')
      } catch (error) {
        this.recordTest('Foreign key constraint', true, `Correctly rejected invalid FK: ${error.code}`)
      }
      
    } catch (error) {
      this.recordTest('Foreign key constraint', false, `Test setup failed: ${error.message}`)
    }
  }

  // Test large data queries
  async testLargeDataQueries() {
    this.log('Testing large data query performance...', 'info')
    
    try {
      const start = Date.now()
      
      // Query all users with related data
      const users = await this.prisma.user.findMany({
        include: {
          questionnaireProfiles: true,
          riderSkillMap: true,
          riderTimelineEvents: true
        },
        take: 1000 // Limit to prevent excessive load
      })
      
      const duration = Date.now() - start
      const performanceGood = duration < 5000 // Should complete within 5 seconds
      
      this.recordTest(
        'Large data query', 
        performanceGood, 
        `Fetched ${users.length} users in ${duration}ms`,
        duration
      )
      
    } catch (error) {
      this.recordTest('Large data query', false, `Failed: ${error.message}`)
    }
  }

  // Test database recovery after connection loss
  async testConnectionRecovery() {
    this.log('Testing connection recovery...', 'info')
    
    try {
      // Perform initial query
      await this.prisma.user.count()
      
      // Simulate connection issues by disconnecting
      await this.prisma.$disconnect()
      
      // Try to perform query - should auto-reconnect
      const start = Date.now()
      const count = await this.prisma.user.count()
      const duration = Date.now() - start
      
      this.recordTest(
        'Connection recovery', 
        true, 
        `Reconnected and got ${count} users in ${duration}ms`,
        duration
      )
      
    } catch (error) {
      this.recordTest('Connection recovery', false, `Failed: ${error.message}`)
    }
  }

  // Run all database stress tests
  async runAllTests() {
    this.log('🔥 Starting Database Stress Tests', 'info')
    this.log('=' .repeat(50), 'info')
    
    const startMemory = this.getMemoryUsage()
    const overallStart = Date.now()
    
    try {
      await this.testUniqueConstraints()
      await this.testForeignKeyConstraints()
      await this.testCascadeDeletion()
      await this.testTransactionRollbacks()
      await this.testConcurrentWrites()
      await this.testConnectionPoolStress()
      await this.testLargeDataQueries()
      await this.testConnectionRecovery()
      
    } catch (error) {
      this.log(`Critical error during testing: ${error.message}`, 'error')
    }
    
    const overallDuration = Date.now() - overallStart
    const endMemory = this.getMemoryUsage()
    
    // Generate report
    const report = this.getTestReport()
    
    this.log('🎯 Database Stress Test Results:', 'info')
    this.log(`Total Tests: ${report.summary.total}`, 'info')
    this.log(`Passed: ${report.summary.passed}`, 'success')
    this.log(`Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'success')
    this.log(`Pass Rate: ${report.summary.passRate}%`, report.summary.passRate > 90 ? 'success' : 'warning')
    this.log(`Total Duration: ${overallDuration}ms`, 'info')
    
    this.log('Memory Usage:', 'info')
    this.log(`Start: ${startMemory.heapUsed}MB, End: ${endMemory.heapUsed}MB`, 'info')
    this.log(`Memory Delta: ${endMemory.heapUsed - startMemory.heapUsed}MB`, 'info')
    
    // Show failed tests
    if (report.summary.failed > 0) {
      this.log('❌ Failed Tests:', 'error')
      report.tests.filter(t => !t.passed).forEach(test => {
        this.log(`  • ${test.testName}: ${test.message}`, 'error')
      })
    }
    
    return report
  }

  // Cleanup test data
  async cleanup() {
    try {
      await this.cleanupTestData()
      this.log('🧹 Cleanup completed', 'success')
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error')
    }
  }
}

// Run if called directly
async function runStressTest() {
  const tester = new DatabaseStressTest()
  
  try {
    const report = await tester.runAllTests()
    
    // Save detailed report
    const fs = require('fs')
    const reportPath = `./tests/reports/db-stress-${Date.now()}.json`
    
    // Ensure reports directory exists
    if (!fs.existsSync('./tests/reports')) {
      fs.mkdirSync('./tests/reports', { recursive: true })
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📊 Detailed report saved to: ${reportPath}`)
    
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  } finally {
    await tester.cleanup()
    await tester.disconnect()
  }
}

module.exports = DatabaseStressTest

if (require.main === module) {
  runStressTest()
}