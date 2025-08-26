#!/usr/bin/env node

/**
 * Data Integrity Testing for Nebachiv Content App
 * Tests data consistency, validation, relationships, and business rules
 */

const TestHelper = require('./test-helper')

class DataIntegrityTest extends TestHelper {
  constructor() {
    super()
    this.dataViolations = []
  }

  // Test referential integrity
  async testReferentialIntegrity() {
    this.log('Testing referential integrity...', 'info')
    
    try {
      // Check for orphaned questionnaire profiles
      const orphanedProfiles = await this.prisma.questionnaireProfile.findMany({
        where: {
          user: null
        }
      })
      
      this.recordTest(
        'Orphaned questionnaire profiles',
        orphanedProfiles.length === 0,
        `Found ${orphanedProfiles.length} orphaned profiles`
      )
      
      // Check for orphaned skill maps
      const orphanedSkills = await this.prisma.riderSkillMap.findMany({
        where: {
          user: null
        }
      })
      
      this.recordTest(
        'Orphaned skill maps',
        orphanedSkills.length === 0,
        `Found ${orphanedSkills.length} orphaned skill maps`
      )
      
      // Check for orphaned timeline events
      const orphanedEvents = await this.prisma.riderTimelineEvent.findMany({
        where: {
          user: null
        }
      })
      
      this.recordTest(
        'Orphaned timeline events',
        orphanedEvents.length === 0,
        `Found ${orphanedEvents.length} orphaned timeline events`
      )
      
      // Check for users without required relationships
      const usersWithoutProfiles = await this.prisma.user.count({
        where: {
          role: 'STUDENT',
          questionnaireProfiles: null,
          email: {
            contains: '@test.com' // Only check test users
          }
        }
      })
      
      this.recordTest(
        'Students without profiles',
        usersWithoutProfiles <= 1, // Allow 1 (student10 by design)
        `Found ${usersWithoutProfiles} students without questionnaire profiles`
      )
      
    } catch (error) {
      this.recordTest('Referential integrity', false, `Error: ${error.message}`)
    }
  }

  // Test data consistency across related tables
  async testDataConsistency() {
    this.log('Testing data consistency...', 'info')
    
    try {
      // Test profile type consistency
      const users = await this.prisma.user.findMany({
        include: {
          questionnaireProfiles: true
        },
        where: {
          email: { contains: '@test.com' }
        }
      })
      
      let profileTypeConsistency = true
      let inconsistentProfiles = 0
      
      for (const user of users) {
        if (user.riderProfile && user.questionnaireProfile) {
          if (user.riderProfile !== user.questionnaireProfile.profileType) {
            profileTypeConsistency = false
            inconsistentProfiles++
          }
        }
      }
      
      this.recordTest(
        'Profile type consistency',
        profileTypeConsistency,
        `Found ${inconsistentProfiles} users with inconsistent profile types`
      )
      
      // Test skill map level consistency
      const skillMaps = await this.prisma.riderSkillMap.findMany({
        include: {
          user: {
            include: {
              questionnaireProfiles: true
            }
          }
        },
        where: {
          user: {
            email: { contains: '@test.com' }
          }
        }
      })
      
      let skillLevelConsistency = true
      let inconsistentSkills = 0
      
      for (const skillMap of skillMaps) {
        if (skillMap.user.questionnaireProfile) {
          const profileLevel = skillMap.user.questionnaireProfile.overallLevel
          const skillLevel = skillMap.overallLevel
          
          // Check if skill level matches profile expectations
          const levelMapping = {
            'Novice': [1, 2],
            'Beginner': [2, 3, 4],
            'Intermediate': [4, 5, 6, 7],
            'Advanced': [7, 8, 9],
            'Expert': [9, 10]
          }
          
          if (levelMapping[profileLevel] && !levelMapping[profileLevel].includes(skillLevel)) {
            skillLevelConsistency = false
            inconsistentSkills++
          }
        }
      }
      
      this.recordTest(
        'Skill level consistency',
        skillLevelConsistency,
        `Found ${inconsistentSkills} skill maps with inconsistent levels`
      )
      
    } catch (error) {
      this.recordTest('Data consistency', false, `Error: ${error.message}`)
    }
  }

  // Test business rule validation
  async testBusinessRules() {
    this.log('Testing business rule validation...', 'info')
    
    try {
      // Rule: Risk scores should be between 1 and 5
      const invalidRiskScores = await this.prisma.questionnaireProfile.count({
        where: {
          OR: [
            { riskScore: { lt: 1 } },
            { riskScore: { gt: 5 } }
          ]
        }
      })
      
      this.recordTest(
        'Risk score range validation',
        invalidRiskScores === 0,
        `Found ${invalidRiskScores} profiles with invalid risk scores`
      )
      
      // Rule: Confidence scores should be between 0 and 100
      const invalidConfidenceScores = await this.prisma.questionnaireProfile.count({
        where: {
          OR: [
            { confidenceScore: { lt: 0 } },
            { confidenceScore: { gt: 100 } }
          ]
        }
      })
      
      this.recordTest(
        'Confidence score range validation',
        invalidConfidenceScores === 0,
        `Found ${invalidConfidenceScores} profiles with invalid confidence scores`
      )
      
      // Rule: Skill values should be between 0 and 100
      const skillMaps = await this.prisma.riderSkillMap.findMany()
      let invalidSkillValues = 0
      
      for (const skillMap of skillMaps) {
        const allSkills = {
          ...skillMap.basicSkills,
          ...skillMap.advancedSkills,
          ...skillMap.stuntSkills,
          ...skillMap.safetySkills
        }
        
        for (const [skill, value] of Object.entries(allSkills)) {
          if (typeof value === 'number' && (value < 0 || value > 100)) {
            invalidSkillValues++
          }
        }
      }
      
      this.recordTest(
        'Skill value range validation',
        invalidSkillValues === 0,
        `Found ${invalidSkillValues} invalid skill values`
      )
      
      // Rule: Overall level should be between 1 and 10
      const invalidOverallLevels = await this.prisma.riderSkillMap.count({
        where: {
          OR: [
            { overallLevel: { lt: 1 } },
            { overallLevel: { gt: 10 } }
          ]
        }
      })
      
      this.recordTest(
        'Overall level range validation',
        invalidOverallLevels === 0,
        `Found ${invalidOverallLevels} skill maps with invalid overall levels`
      )
      
    } catch (error) {
      this.recordTest('Business rule validation', false, `Error: ${error.message}`)
    }
  }

  // Test data completeness
  async testDataCompleteness() {
    this.log('Testing data completeness...', 'info')
    
    try {
      // Check for required fields in questionnaire profiles
      const incompleteProfiles = await this.prisma.questionnaireProfile.findMany({
        where: {
          OR: [
            { profileType: null },
            { type: null },
            { overallLevel: null },
            { answers: null }
          ]
        }
      })
      
      this.recordTest(
        'Complete questionnaire profiles',
        incompleteProfiles.length === 0,
        `Found ${incompleteProfiles.length} incomplete profiles`
      )
      
      // Check for required fields in users
      const incompleteUsers = await this.prisma.user.findMany({
        where: {
          OR: [
            { email: null },
            { name: null },
            { role: null }
          ]
        }
      })
      
      this.recordTest(
        'Complete user records',
        incompleteUsers.length === 0,
        `Found ${incompleteUsers.length} incomplete users`
      )
      
      // Check for empty skill maps
      const emptySkillMaps = await this.prisma.riderSkillMap.findMany({
        where: {
          OR: [
            { basicSkills: {} },
            { advancedSkills: {} },
            { safetySkills: {} }
          ]
        }
      })
      
      this.recordTest(
        'Complete skill maps',
        emptySkillMaps.length === 0,
        `Found ${emptySkillMaps.length} empty skill maps`
      )
      
    } catch (error) {
      this.recordTest('Data completeness', false, `Error: ${error.message}`)
    }
  }

  // Test duplicate detection
  async testDuplicateDetection() {
    this.log('Testing duplicate detection...', 'info')
    
    try {
      // Check for duplicate emails
      const duplicateEmails = await this.prisma.$queryRaw`
        SELECT email, COUNT(*) as count 
        FROM "User" 
        GROUP BY email 
        HAVING COUNT(*) > 1
      `
      
      this.recordTest(
        'No duplicate emails',
        duplicateEmails.length === 0,
        `Found ${duplicateEmails.length} duplicate email addresses`
      )
      
      // Check for multiple profiles per user
      const multipleProfiles = await this.prisma.$queryRaw`
        SELECT "userId", COUNT(*) as count 
        FROM "QuestionnaireProfile" 
        GROUP BY "userId" 
        HAVING COUNT(*) > 1
      `
      
      this.recordTest(
        'No multiple profiles per user',
        multipleProfiles.length === 0,
        `Found ${multipleProfiles.length} users with multiple profiles`
      )
      
      // Check for multiple skill maps per user
      const multipleSkillMaps = await this.prisma.$queryRaw`
        SELECT "userId", COUNT(*) as count 
        FROM "RiderSkillMap" 
        GROUP BY "userId" 
        HAVING COUNT(*) > 1
      `
      
      this.recordTest(
        'No multiple skill maps per user',
        multipleSkillMaps.length === 0,
        `Found ${multipleSkillMaps.length} users with multiple skill maps`
      )
      
    } catch (error) {
      this.recordTest('Duplicate detection', false, `Error: ${error.message}`)
    }
  }

  // Test data format validation
  async testDataFormats() {
    this.log('Testing data format validation...', 'info')
    
    try {
      // Check email format
      const invalidEmails = await this.prisma.user.findMany({
        where: {
          NOT: {
            email: {
              contains: '@'
            }
          }
        }
      })
      
      this.recordTest(
        'Valid email formats',
        invalidEmails.length === 0,
        `Found ${invalidEmails.length} invalid email formats`
      )
      
      // Check date formats for timeline events
      const invalidDates = await this.prisma.riderTimelineEvent.findMany({
        where: {
          eventDate: null
        }
      })
      
      this.recordTest(
        'Valid event dates',
        invalidDates.length === 0,
        `Found ${invalidDates.length} events with invalid dates`
      )
      
      // Check JSON structure in answers
      const profiles = await this.prisma.questionnaireProfile.findMany({
        where: {
          answers: {
            not: null
          }
        }
      })
      
      let invalidAnswerFormats = 0
      for (const profile of profiles) {
        try {
          if (typeof profile.answers !== 'object' || profile.answers === null) {
            invalidAnswerFormats++
          }
        } catch (error) {
          invalidAnswerFormats++
        }
      }
      
      this.recordTest(
        'Valid answer formats',
        invalidAnswerFormats === 0,
        `Found ${invalidAnswerFormats} profiles with invalid answer formats`
      )
      
    } catch (error) {
      this.recordTest('Data format validation', false, `Error: ${error.message}`)
    }
  }

  // Test cross-table relationships
  async testCrossTableRelationships() {
    this.log('Testing cross-table relationships...', 'info')
    
    try {
      // Verify all referenced users exist
      const profilesWithInvalidUsers = await this.prisma.questionnaireProfile.count({
        where: {
          user: null
        }
      })
      
      this.recordTest(
        'Valid profile-user relationships',
        profilesWithInvalidUsers === 0,
        `Found ${profilesWithInvalidUsers} profiles referencing invalid users`
      )
      
      // Test relationship counts
      const userCount = await this.prisma.user.count({ where: { email: { contains: '@test.com' } } })
      const profileCount = await this.prisma.questionnaireProfile.count({
        where: {
          user: {
            email: { contains: '@test.com' }
          }
        }
      })
      const skillMapCount = await this.prisma.riderSkillMap.count({
        where: {
          user: {
            email: { contains: '@test.com' }
          }
        }
      })
      
      // Expect 2 profiles and 2 skill maps for 3 test users (student10 has no profile)
      this.recordTest(
        'Expected relationship counts',
        userCount >= 3 && profileCount >= 2 && skillMapCount >= 2,
        `Users: ${userCount}, Profiles: ${profileCount}, Skill Maps: ${skillMapCount}`
      )
      
    } catch (error) {
      this.recordTest('Cross-table relationships', false, `Error: ${error.message}`)
    }
  }

  // Run all data integrity tests
  async runAllTests() {
    this.log('🔍 Starting Data Integrity Tests', 'info')
    this.log('=' .repeat(50), 'info')
    
    const startMemory = this.getMemoryUsage()
    const overallStart = Date.now()
    
    try {
      await this.testReferentialIntegrity()
      await this.testDataConsistency()
      await this.testBusinessRules()
      await this.testDataCompleteness()
      await this.testDuplicateDetection()
      await this.testDataFormats()
      await this.testCrossTableRelationships()
      
    } catch (error) {
      this.log(`Critical error during data integrity testing: ${error.message}`, 'error')
    }
    
    const overallDuration = Date.now() - overallStart
    const endMemory = this.getMemoryUsage()
    
    // Generate report
    const report = this.getTestReport()
    
    this.log('🔍 Data Integrity Test Results:', 'info')
    this.log(`Total Tests: ${report.summary.total}`, 'info')
    this.log(`Passed: ${report.summary.passed}`, 'success')
    this.log(`Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'success')
    this.log(`Pass Rate: ${report.summary.passRate}%`, report.summary.passRate > 90 ? 'success' : 'warning')
    this.log(`Total Duration: ${overallDuration}ms`, 'info')
    
    // Show critical data integrity issues
    const criticalIssues = report.tests.filter(t => 
      !t.passed && (
        t.testName.includes('Orphaned') ||
        t.testName.includes('duplicate') ||
        t.testName.includes('Referential') ||
        t.testName.includes('consistency')
      )
    )
    
    if (criticalIssues.length > 0) {
      this.log('🚨 CRITICAL DATA INTEGRITY ISSUES:', 'error')
      criticalIssues.forEach(test => {
        this.log(`  ⚠️  ${test.testName}: ${test.message}`, 'error')
      })
    }
    
    // Data quality score
    const dataQualityScore = Math.max(0, 100 - (report.summary.failed * 8))
    this.log(`📊 Data Quality Score: ${dataQualityScore}/100`, dataQualityScore > 85 ? 'success' : 'warning')
    
    return report
  }

  // Cleanup test data
  async cleanup() {
    try {
      await this.cleanupTestData()
      this.log('🧹 Data integrity test cleanup completed', 'success')
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error')
    }
  }
}

// Run if called directly
async function runDataIntegrityTest() {
  const tester = new DataIntegrityTest()
  
  try {
    const report = await tester.runAllTests()
    
    // Save detailed report
    const fs = require('fs')
    const reportPath = `./tests/reports/data-integrity-${Date.now()}.json`
    
    // Ensure reports directory exists
    if (!fs.existsSync('./tests/reports')) {
      fs.mkdirSync('./tests/reports', { recursive: true })
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📊 Detailed report saved to: ${reportPath}`)
    
    // Data integrity summary
    const criticalIssues = report.tests.filter(t => !t.passed).length
    const dataQualityScore = Math.max(0, 100 - (criticalIssues * 8))
    
    console.log(`\n🔍 DATA INTEGRITY SUMMARY:`)
    console.log(`Data Quality Score: ${dataQualityScore}/100`)
    console.log(`Issues Found: ${criticalIssues}`)
    console.log(`Data Status: ${dataQualityScore > 85 ? 'GOOD' : 'NEEDS ATTENTION'}`)
    
  } catch (error) {
    console.error('Fatal data integrity test error:', error)
    process.exit(1)
  } finally {
    await tester.cleanup()
    await tester.disconnect()
  }
}

module.exports = DataIntegrityTest

if (require.main === module) {
  runDataIntegrityTest()
}