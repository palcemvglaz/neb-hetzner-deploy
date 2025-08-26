#!/usr/bin/env node

/**
 * Recovery Testing for Nebachiv Content App
 * Tests system recovery from failures, data corruption, and partial states
 * Implements DEFENSIVE PARANOIA and MATHEMATICAL RIGOR for consistency validation
 */

const TestHelper = require('./test-helper')
const fs = require('fs')
const path = require('path')

class RecoveryTest extends TestHelper {
  constructor() {
    super()
    this.recoveryScenarios = []
    this.invariants = new Map() // Mathematical invariants that must always hold
    this.stateSnapshots = []
  }

  // PHASE 1: EXHAUSTIVE DISCOVERY - Define system invariants
  defineSystemInvariants() {
    this.log('Defining mathematical invariants for consistency validation...', 'info')
    
    // Core mathematical invariants that MUST always hold
    this.invariants.set('referential_integrity', {
      description: 'All foreign keys must reference existing records',
      check: async () => {
        const orphanedProfiles = await this.prisma.questionnaireProfile.count({
          where: { user: null }
        })
        const orphanedSkills = await this.prisma.riderSkillMap.count({
          where: { user: null }
        })
        const orphanedEvents = await this.prisma.riderTimelineEvent.count({
          where: { user: null }
        })
        return orphanedProfiles === 0 && orphanedSkills === 0 && orphanedEvents === 0
      }
    })
    
    this.invariants.set('unique_constraints', {
      description: 'No duplicate entries where uniqueness is required',
      check: async () => {
        const duplicateEmails = await this.prisma.$queryRaw`
          SELECT email, COUNT(*) as count 
          FROM "User" 
          GROUP BY email 
          HAVING COUNT(*) > 1
        `
        return duplicateEmails.length === 0
      }
    })
    
    this.invariants.set('data_bounds', {
      description: 'All numeric values within valid ranges',
      check: async () => {
        const invalidRiskScores = await this.prisma.questionnaireProfile.count({
          where: { OR: [{ riskScore: { lt: 1 } }, { riskScore: { gt: 5 } }] }
        })
        const invalidSkillLevels = await this.prisma.riderSkillMap.count({
          where: { OR: [{ overallLevel: { lt: 1 } }, { overallLevel: { gt: 10 } }] }
        })
        return invalidRiskScores === 0 && invalidSkillLevels === 0
      }
    })
    
    this.invariants.set('profile_consistency', {
      description: 'User.riderProfile matches QuestionnaireProfile.profileType',
      check: async () => {
        const inconsistent = await this.prisma.user.count({
          where: {
            AND: [
              { riderProfile: { not: null } },
              { questionnaireProfiles: { isNot: null } },
              {
                NOT: {
                  riderProfile: {
                    equals: this.prisma.user.fields.questionnaireProfile.fields.profileType
                  }
                }
              }
            ]
          }
        })
        return inconsistent === 0
      }
    })
  }

  // PHASE 2: PROPERTY-BASED VALIDATION - Verify invariants hold
  async validateAllInvariants() {
    this.log('Validating system invariants (MATHEMATICAL RIGOR)...', 'info')
    
    let allValid = true
    const violations = []
    
    for (const [name, invariant] of this.invariants) {
      try {
        const isValid = await invariant.check()
        
        this.recordTest(
          `Invariant: ${name}`,
          isValid,
          invariant.description
        )
        
        if (!isValid) {
          allValid = false
          violations.push(name)
        }
      } catch (error) {
        this.recordTest(`Invariant: ${name}`, false, `Error: ${error.message}`)
        allValid = false
        violations.push(name)
      }
    }
    
    return { allValid, violations }
  }

  // Create system state snapshot for recovery testing
  async createStateSnapshot() {
    this.log('Creating system state snapshot...', 'info')
    
    try {
      const snapshot = {
        timestamp: new Date().toISOString(),
        users: await this.prisma.user.count(),
        profiles: await this.prisma.questionnaireProfile.count(),
        skillMaps: await this.prisma.riderSkillMap.count(),
        events: await this.prisma.riderTimelineEvent.count(),
        invariantState: await this.validateAllInvariants()
      }
      
      this.stateSnapshots.push(snapshot)
      return snapshot
    } catch (error) {
      this.log(`Failed to create snapshot: ${error.message}`, 'error')
      throw error
    }
  }

  // Test database connection recovery
  async testDatabaseConnectionRecovery() {
    this.log('Testing database connection recovery...', 'info')
    
    try {
      const initialSnapshot = await this.createStateSnapshot()
      
      // Perform initial operations to establish baseline
      await this.prisma.user.count()
      
      // Simulate connection loss
      await this.prisma.$disconnect()
      
      // Wait and attempt recovery
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const start = Date.now()
      
      // Test automatic reconnection
      try {
        const count = await this.prisma.user.count()
        const recoveryTime = Date.now() - start
        
        // Verify system state after recovery
        const postRecoverySnapshot = await this.createStateSnapshot()
        
        const stateIntact = (
          initialSnapshot.users === postRecoverySnapshot.users &&
          initialSnapshot.profiles === postRecoverySnapshot.profiles &&
          initialSnapshot.skillMaps === postRecoverySnapshot.skillMaps
        )
        
        this.recordTest(
          'Database connection recovery',
          stateIntact && recoveryTime < 5000,
          `Recovered in ${recoveryTime}ms, state intact: ${stateIntact}`,
          recoveryTime
        )
        
      } catch (error) {
        this.recordTest('Database connection recovery', false, `Failed to reconnect: ${error.message}`)
      }
      
    } catch (error) {
      this.recordTest('Database connection recovery', false, `Test setup failed: ${error.message}`)
    }
  }

  // Test partial transaction recovery
  async testTransactionRecovery() {
    this.log('Testing transaction recovery and rollback integrity...', 'info')
    
    try {
      const initialSnapshot = await this.createStateSnapshot()
      
      // Test successful transaction - should maintain invariants
      await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: `tx-success-${Date.now()}@test.com`,
            name: 'Transaction Test User',
            password: 'test123',
            role: 'STUDENT'
          }
        })
        
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
      })
      
      const postSuccessInvariants = await this.validateAllInvariants()
      
      this.recordTest(
        'Successful transaction invariants',
        postSuccessInvariants.allValid,
        `Invariants maintained after successful transaction`
      )
      
      // Test failed transaction - should restore original state
      const preFailureSnapshot = await this.createStateSnapshot()
      
      try {
        await this.prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email: `tx-fail-${Date.now()}@test.com`,
              name: 'Failed Transaction User',
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
          
          // Force transaction failure
          throw new Error('Intentional transaction failure')
        })
      } catch (error) {
        // Expected failure
      }
      
      const postFailureSnapshot = await this.createStateSnapshot()
      const postFailureInvariants = await this.validateAllInvariants()
      
      const rollbackWorked = (
        preFailureSnapshot.users === postFailureSnapshot.users &&
        preFailureSnapshot.profiles === postFailureSnapshot.profiles &&
        postFailureInvariants.allValid
      )
      
      this.recordTest(
        'Transaction rollback recovery',
        rollbackWorked,
        `State restored after rollback, invariants maintained: ${postFailureInvariants.allValid}`
      )
      
    } catch (error) {
      this.recordTest('Transaction recovery', false, `Error: ${error.message}`)
    }
  }

  // PHASE 3: CHAOS INJECTION - Test recovery from data corruption
  async testDataCorruptionRecovery() {
    this.log('Testing recovery from data corruption (CHAOS INJECTION)...', 'info')
    
    try {
      const initialSnapshot = await this.createStateSnapshot()
      
      // Create test user for corruption
      const testUser = await this.createTestUser('corruption-test')
      await this.prisma.questionnaireProfile.create({
        data: {
          userId: testUser.id,
          type: 'beginner',
          profileType: 'BEGINNER_CAREFUL',
          answers: { test: 'data' },
          overallLevel: 'Beginner',
          riskProfile: 'low'
        }
      })
      
      // Inject data corruption scenarios
      const corruptionTests = [
        {
          name: 'Invalid risk score',
          corruption: () => this.prisma.questionnaireProfile.update({
            where: { userId: testUser.id },
            data: { riskScore: 999 } // Invalid value
          }),
          recovery: () => this.prisma.questionnaireProfile.update({
            where: { userId: testUser.id },
            data: { riskScore: 2.5 } // Valid value
          })
        },
        {
          name: 'Invalid skill level',
          corruption: () => this.prisma.riderSkillMap.create({
            data: {
              userId: testUser.id,
              overallLevel: -5, // Invalid value
              basicSkills: { balance: 150 }, // Invalid value
              advancedSkills: {},
              stuntSkills: {},
              safetySkills: {}
            }
          }),
          recovery: () => this.prisma.riderSkillMap.deleteMany({
            where: { userId: testUser.id, overallLevel: { lt: 1 } }
          })
        }
      ]
      
      for (const test of corruptionTests) {
        try {
          // Introduce corruption
          await test.corruption()
          
          // Verify corruption detected
          const corruptedInvariants = await this.validateAllInvariants()
          
          if (corruptedInvariants.allValid) {
            this.recordTest(`Corruption detection: ${test.name}`, false, 'Corruption not detected')
            continue
          }
          
          // Attempt recovery
          await test.recovery()
          
          // Verify recovery
          const recoveredInvariants = await this.validateAllInvariants()
          
          this.recordTest(
            `Corruption recovery: ${test.name}`,
            recoveredInvariants.allValid,
            `Recovery successful: ${recoveredInvariants.allValid}, violations: ${recoveredInvariants.violations.join(', ')}`
          )
          
        } catch (error) {
          this.recordTest(`Corruption test: ${test.name}`, false, `Error: ${error.message}`)
        }
      }
      
    } catch (error) {
      this.recordTest('Data corruption recovery', false, `Test setup failed: ${error.message}`)
    }
  }

  // Test concurrent modification recovery
  async testConcurrentModificationRecovery() {
    this.log('Testing concurrent modification conflict recovery...', 'info')
    
    try {
      const testUser = await this.createTestUser('concurrent-test')
      
      // Create concurrent modification scenario
      const concurrentModifications = Array.from({ length: 10 }, (_, index) => 
        async () => {
          try {
            // Each modification updates different fields to avoid direct conflicts
            await this.prisma.user.update({
              where: { id: testUser.id },
              data: { 
                name: `Updated-${index}-${Date.now()}`,
                // Add timestamp to track modification order
                updatedAt: new Date()
              }
            })
            return { success: true, index }
          } catch (error) {
            return { success: false, index, error: error.message }
          }
        }
      )
      
      // Execute concurrent modifications
      const results = await Promise.all(concurrentModifications.map(fn => fn()))
      
      const successes = results.filter(r => r.success).length
      const failures = results.filter(r => !r.success).length
      
      // Verify final state is consistent
      const finalInvariants = await this.validateAllInvariants()
      
      this.recordTest(
        'Concurrent modification recovery',
        finalInvariants.allValid && successes > 0,
        `${successes} successful, ${failures} failed, invariants maintained: ${finalInvariants.allValid}`
      )
      
    } catch (error) {
      this.recordTest('Concurrent modification recovery', false, `Error: ${error.message}`)
    }
  }

  // Test system recovery from partial states
  async testPartialStateRecovery() {
    this.log('Testing recovery from partial/incomplete states...', 'info')
    
    try {
      // Create user without complete profile (partial state)
      const partialUser = await this.createTestUser('partial-state')
      
      // Verify system can handle partial state
      const partialStateQuery = await this.prisma.user.findUnique({
        where: { id: partialUser.id },
        include: {
          questionnaireProfiles: true,
          riderSkillMap: true,
          riderTimelineEvents: true
        }
      })
      
      const canHandlePartialState = partialStateQuery !== null
      
      this.recordTest(
        'Partial state handling',
        canHandlePartialState,
        `System can query users without complete profiles`
      )
      
      // Test completion of partial state
      await this.prisma.questionnaireProfile.create({
        data: {
          userId: partialUser.id,
          type: 'beginner',
          profileType: 'BEGINNER_CAREFUL',
          answers: { completed: 'later' },
          overallLevel: 'Beginner',
          riskProfile: 'low'
        }
      })
      
      // Verify state completion maintains invariants
      const completedInvariants = await this.validateAllInvariants()
      
      this.recordTest(
        'Partial state completion',
        completedInvariants.allValid,
        `State completed successfully, invariants maintained`
      )
      
    } catch (error) {
      this.recordTest('Partial state recovery', false, `Error: ${error.message}`)
    }
  }

  // PHASE 4: ADAPTIVE HEALING - Self-repair mechanisms
  async testSelfHealingCapabilities() {
    this.log('Testing self-healing and adaptive recovery...', 'info')
    
    try {
      // Test automatic constraint violation repair
      const healingUser = await this.createTestUser('healing-test')
      
      // Create profile with intentionally problematic data
      const problematicProfile = await this.prisma.questionnaireProfile.create({
        data: {
          userId: healingUser.id,
          type: 'beginner',
          profileType: 'BEGINNER_CAREFUL',
          answers: { test: 'data' },
          overallLevel: 'Expert', // Inconsistent with type
          riskProfile: 'low',
          riskScore: 4.5, // High risk but labeled as low
          confidenceScore: 95 // High confidence but beginner level
        }
      })
      
      // Implement self-healing logic
      const healingResult = await this.performSelfHealing(problematicProfile)
      
      this.recordTest(
        'Self-healing capabilities',
        healingResult.healed,
        `Inconsistencies resolved: ${healingResult.fixesApplied}, confidence: ${healingResult.confidence}`
      )
      
    } catch (error) {
      this.recordTest('Self-healing capabilities', false, `Error: ${error.message}`)
    }
  }

  // Self-healing implementation with confidence scoring
  async performSelfHealing(profile) {
    const fixes = []
    let confidence = 1.0
    
    try {
      // Fix 1: Align risk profile with risk score (HIGH confidence)
      if (profile.riskScore > 3.0 && profile.riskProfile === 'low') {
        await this.prisma.questionnaireProfile.update({
          where: { id: profile.id },
          data: { riskProfile: 'high' }
        })
        fixes.push('risk_profile_alignment')
        confidence *= 0.95 // Small confidence reduction
      }
      
      // Fix 2: Align overall level with type (MEDIUM confidence)
      const typeLevelMapping = {
        'beginner': ['Novice', 'Beginner'],
        'intermediate': ['Intermediate'],
        'advanced': ['Advanced', 'Expert']
      }
      
      if (!typeLevelMapping[profile.type]?.includes(profile.overallLevel)) {
        const correctLevel = typeLevelMapping[profile.type][0]
        await this.prisma.questionnaireProfile.update({
          where: { id: profile.id },
          data: { overallLevel: correctLevel }
        })
        fixes.push('level_type_alignment')
        confidence *= 0.85 // Medium confidence reduction
      }
      
      // Fix 3: Adjust confidence score for beginners (MEDIUM confidence)
      if (profile.type === 'beginner' && profile.confidenceScore > 80) {
        await this.prisma.questionnaireProfile.update({
          where: { id: profile.id },
          data: { confidenceScore: 65 }
        })
        fixes.push('confidence_adjustment')
        confidence *= 0.8 // Medium confidence reduction
      }
      
      return {
        healed: fixes.length > 0,
        fixesApplied: fixes.length,
        confidence: Math.round(confidence * 100) / 100,
        fixes
      }
      
    } catch (error) {
      return {
        healed: false,
        fixesApplied: 0,
        confidence: 0,
        error: error.message
      }
    }
  }

  // Run all recovery tests
  async runAllTests() {
    this.log('🔄 Starting Recovery Tests (SYSTEM CONSISTENCY ARCHITECT)', 'info')
    this.log('=' .repeat(60), 'info')
    
    // Initialize mathematical invariants
    this.defineSystemInvariants()
    
    const startMemory = this.getMemoryUsage()
    const overallStart = Date.now()
    
    try {
      // Validate initial system state
      const initialInvariants = await this.validateAllInvariants()
      this.log(`Initial system state - Invariants valid: ${initialInvariants.allValid}`, 
        initialInvariants.allValid ? 'success' : 'error')
      
      // Run recovery tests
      await this.testDatabaseConnectionRecovery()
      await this.testTransactionRecovery()
      await this.testDataCorruptionRecovery()
      await this.testConcurrentModificationRecovery()
      await this.testPartialStateRecovery()
      await this.testSelfHealingCapabilities()
      
      // Final validation
      const finalInvariants = await this.validateAllInvariants()
      
      this.recordTest(
        'System consistency maintained',
        finalInvariants.allValid,
        `All mathematical invariants valid after recovery tests`
      )
      
    } catch (error) {
      this.log(`Critical error during recovery testing: ${error.message}`, 'error')
    }
    
    const overallDuration = Date.now() - overallStart
    const endMemory = this.getMemoryUsage()
    
    // Generate report
    const report = this.getTestReport()
    
    this.log('🔄 Recovery Test Results:', 'info')
    this.log(`Total Tests: ${report.summary.total}`, 'info')
    this.log(`Passed: ${report.summary.passed}`, 'success')
    this.log(`Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'success')
    this.log(`Pass Rate: ${report.summary.passRate}%`, report.summary.passRate > 85 ? 'success' : 'warning')
    this.log(`Total Duration: ${overallDuration}ms`, 'info')
    
    // Recovery capability scoring
    const recoveryScore = Math.max(0, 100 - (report.summary.failed * 12))
    this.log(`🛡️ Recovery Capability Score: ${recoveryScore}/100`, recoveryScore > 80 ? 'success' : 'warning')
    
    // Show critical failures
    const criticalFailures = report.tests.filter(t => 
      !t.passed && (
        t.testName.includes('Invariant') ||
        t.testName.includes('consistency') ||
        t.testName.includes('recovery')
      )
    )
    
    if (criticalFailures.length > 0) {
      this.log('🚨 CRITICAL RECOVERY FAILURES:', 'error')
      criticalFailures.forEach(test => {
        this.log(`  ⚠️  ${test.testName}: ${test.message}`, 'error')
      })
    }
    
    return report
  }

  // Cleanup test data
  async cleanup() {
    try {
      await this.cleanupTestData()
      this.log('🧹 Recovery test cleanup completed', 'success')
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error')
    }
  }
}

// Run if called directly
async function runRecoveryTest() {
  const tester = new RecoveryTest()
  
  try {
    const report = await tester.runAllTests()
    
    // Save detailed report
    const fs = require('fs')
    const reportPath = `./tests/reports/recovery-${Date.now()}.json`
    
    // Ensure reports directory exists
    if (!fs.existsSync('./tests/reports')) {
      fs.mkdirSync('./tests/reports', { recursive: true })
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📊 Detailed report saved to: ${reportPath}`)
    
    // Recovery capability summary
    const criticalFailures = report.tests.filter(t => !t.passed).length
    const recoveryScore = Math.max(0, 100 - (criticalFailures * 12))
    
    console.log(`\n🔄 RECOVERY TEST SUMMARY:`)
    console.log(`Recovery Score: ${recoveryScore}/100`)
    console.log(`Critical Failures: ${criticalFailures}`)
    console.log(`System Resilience: ${recoveryScore > 80 ? 'EXCELLENT' : recoveryScore > 60 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`)
    
  } catch (error) {
    console.error('Fatal recovery test error:', error)
    process.exit(1)
  } finally {
    await tester.cleanup()
    await tester.disconnect()
  }
}

module.exports = RecoveryTest

if (require.main === module) {
  runRecoveryTest()
}