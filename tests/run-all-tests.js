#!/usr/bin/env node

/**
 * Master Test Runner for Nebachiv Content App
 * Orchestrates all test suites and generates comprehensive system validation report
 * Implements EXHAUSTIVE DISCOVERY and OBSERVABLE TRANSPARENCY principles
 */

const fs = require('fs')
const path = require('path')
const { spawn, execSync } = require('child_process')

// Import all test classes
const TestHelper = require('./test-helper')
const DatabaseStressTest = require('./stress-test-db')
const SecurityTest = require('./security-test')
const LoadTest = require('./load-test')
const DataIntegrityTest = require('./data-integrity-test')
const RecoveryTest = require('./recovery-test')
const EdgeCasesTest = require('./edge-cases-test')

class MasterTestRunner {
  constructor() {
    this.testSuites = [
      { name: 'Database Stress', class: DatabaseStressTest, critical: true },
      { name: 'Security', class: SecurityTest, critical: true },
      { name: 'Load Performance', class: LoadTest, critical: false },
      { name: 'Data Integrity', class: DataIntegrityTest, critical: true },
      { name: 'Recovery & Healing', class: RecoveryTest, critical: true },
      { name: 'Edge Cases', class: EdgeCasesTest, critical: false }
    ]
    
    this.overallResults = {
      startTime: new Date(),
      endTime: null,
      duration: 0,
      suiteResults: [],
      systemHealth: null,
      criticalIssues: [],
      recommendations: [],
      consistencyScore: 0,
      securityScore: 0,
      performanceScore: 0,
      reliabilityScore: 0,
      overallScore: 0
    }
    
    this.colors = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      reset: '\x1b[0m',
      bright: '\x1b[1m'
    }
  }

  log(message, color = 'white') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`)
  }

  // Generate comprehensive system banner
  displayBanner() {
    const banner = `
${this.colors.cyan}╔═══════════════════════════════════════════════════════════════════════════════╗
║                    🔬 SYSTEM CONSISTENCY ARCHITECT & QA ORACLE                ║
║                         Nebachiv Content App - Full System Audit             ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║  Mission: ZERO production inconsistencies across all system layers           ║
║  Framework: Mathematical rigor + Defensive paranoia + Adaptive healing       ║
║  Coverage: Database + Security + Load + Integrity + Recovery + Edge Cases    ║
╚═══════════════════════════════════════════════════════════════════════════════╝${this.colors.reset}
`
    console.log(banner)
  }

  // Pre-test system validation
  async validateTestEnvironment() {
    this.log('\n🔍 PHASE 1: EXHAUSTIVE DISCOVERY - Test Environment Validation', 'yellow')
    this.log('═'.repeat(80), 'yellow')
    
    const validations = []
    
    try {
      // Check database connection
      const helper = new TestHelper()
      await helper.prisma.$connect()
      const userCount = await helper.prisma.user.count()
      validations.push({ 
        name: 'Database Connection', 
        status: 'pass', 
        details: `Connected, ${userCount} users found` 
      })
      await helper.disconnect()
    } catch (error) {
      validations.push({ 
        name: 'Database Connection', 
        status: 'fail', 
        details: error.message 
      })
    }
    
    // Check test data exists
    try {
      const helper = new TestHelper()
      const testUsers = await helper.prisma.user.count({
        where: { email: { contains: '@test.com' } }
      })
      validations.push({ 
        name: 'Test Data Present', 
        status: testUsers > 0 ? 'pass' : 'warn', 
        details: `${testUsers} test users found` 
      })
      await helper.disconnect()
    } catch (error) {
      validations.push({ 
        name: 'Test Data Present', 
        status: 'fail', 
        details: error.message 
      })
    }
    
    // Check server status
    try {
      const { testAPI } = require('../scripts/api-test')
      const response = await testAPI('/api/health')
      validations.push({ 
        name: 'API Server', 
        status: response.status === 200 ? 'pass' : 'warn', 
        details: `Status: ${response.status}` 
      })
    } catch (error) {
      validations.push({ 
        name: 'API Server', 
        status: 'warn', 
        details: 'Server may not be running - some tests will be limited' 
      })
    }
    
    // Check file system permissions
    try {
      const testDir = './tests/reports'
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true })
      }
      fs.writeFileSync(`${testDir}/permission-test.txt`, 'test')
      fs.unlinkSync(`${testDir}/permission-test.txt`)
      validations.push({ 
        name: 'File System Access', 
        status: 'pass', 
        details: 'Read/write permissions verified' 
      })
    } catch (error) {
      validations.push({ 
        name: 'File System Access', 
        status: 'fail', 
        details: error.message 
      })
    }
    
    // Display validation results
    validations.forEach(v => {
      const color = v.status === 'pass' ? 'green' : v.status === 'warn' ? 'yellow' : 'red'
      const symbol = v.status === 'pass' ? '✅' : v.status === 'warn' ? '⚠️' : '❌'
      this.log(`${symbol} ${v.name}: ${v.details}`, color)
    })
    
    const criticalFailures = validations.filter(v => v.status === 'fail').length
    if (criticalFailures > 0) {
      this.log(`\n🚨 ${criticalFailures} critical environment issues detected!`, 'red')
      this.log('Some tests may fail due to environment setup.', 'yellow')
    }
    
    return validations
  }

  // Run individual test suite with error isolation
  async runTestSuite(suiteConfig) {
    this.log(`\n🧪 Running ${suiteConfig.name} Tests...`, 'cyan')
    this.log('─'.repeat(50), 'cyan')
    
    const startTime = Date.now()
    const startMemory = process.memoryUsage()
    
    try {
      const tester = new suiteConfig.class()
      const result = await tester.runAllTests()
      
      // Cleanup
      await tester.cleanup()
      await tester.disconnect()
      
      const duration = Date.now() - startTime
      const endMemory = process.memoryUsage()
      const memoryDelta = endMemory.heapUsed - startMemory.heapUsed
      
      const suiteResult = {
        name: suiteConfig.name,
        critical: suiteConfig.critical,
        status: result.summary.passRate >= (suiteConfig.critical ? 95 : 80) ? 'pass' : 'fail',
        duration,
        memoryDelta: Math.round(memoryDelta / 1024 / 1024), // MB
        tests: {
          total: result.summary.total,
          passed: result.summary.passed,
          failed: result.summary.failed,
          passRate: result.summary.passRate
        },
        details: result,
        criticalFailures: result.tests.filter(t => 
          !t.passed && (
            t.testName.includes('Invariant') ||
            t.testName.includes('SQL injection') ||
            t.testName.includes('XSS') ||
            t.testName.includes('Password hashing') ||
            t.testName.includes('Unauthorized')
          )
        )
      }
      
      // Display suite results
      const statusColor = suiteResult.status === 'pass' ? 'green' : 'red'
      const statusSymbol = suiteResult.status === 'pass' ? '✅' : '❌'
      
      this.log(`${statusSymbol} ${suiteConfig.name}: ${suiteResult.tests.passed}/${suiteResult.tests.total} tests passed (${suiteResult.tests.passRate}%)`, statusColor)
      this.log(`   Duration: ${duration}ms | Memory: ${suiteResult.memoryDelta > 0 ? '+' : ''}${suiteResult.memoryDelta}MB`, 'white')
      
      if (suiteResult.criticalFailures.length > 0) {
        this.log(`   🚨 ${suiteResult.criticalFailures.length} critical failures detected!`, 'red')
      }
      
      return suiteResult
      
    } catch (error) {
      const suiteResult = {
        name: suiteConfig.name,
        critical: suiteConfig.critical,
        status: 'error',
        duration: Date.now() - startTime,
        error: error.message,
        tests: { total: 0, passed: 0, failed: 1, passRate: 0 },
        criticalFailures: [{ testName: 'Suite Execution', message: error.message }]
      }
      
      this.log(`❌ ${suiteConfig.name}: SUITE EXECUTION FAILED`, 'red')
      this.log(`   Error: ${error.message}`, 'red')
      
      return suiteResult
    }
  }

  // Calculate composite scores
  calculateScores() {
    const suiteResults = this.overallResults.suiteResults
    
    // Consistency Score (Data Integrity + Recovery)
    const integrityResult = suiteResults.find(s => s.name === 'Data Integrity')
    const recoveryResult = suiteResults.find(s => s.name === 'Recovery & Healing')
    this.overallResults.consistencyScore = Math.round(
      ((integrityResult?.tests.passRate || 0) + (recoveryResult?.tests.passRate || 0)) / 2
    )
    
    // Security Score
    const securityResult = suiteResults.find(s => s.name === 'Security')
    this.overallResults.securityScore = securityResult?.tests.passRate || 0
    
    // Performance Score
    const loadResult = suiteResults.find(s => s.name === 'Load Performance')
    const dbStressResult = suiteResults.find(s => s.name === 'Database Stress')
    this.overallResults.performanceScore = Math.round(
      ((loadResult?.tests.passRate || 0) + (dbStressResult?.tests.passRate || 0)) / 2
    )
    
    // Reliability Score (Recovery + Edge Cases)
    const edgeResult = suiteResults.find(s => s.name === 'Edge Cases')
    this.overallResults.reliabilityScore = Math.round(
      ((recoveryResult?.tests.passRate || 0) + (edgeResult?.tests.passRate || 0)) / 2
    )
    
    // Overall Score (weighted by criticality)
    const criticalResults = suiteResults.filter(s => s.critical)
    const nonCriticalResults = suiteResults.filter(s => !s.critical)
    
    const criticalScore = criticalResults.reduce((sum, s) => sum + (s.tests.passRate || 0), 0) / criticalResults.length
    const nonCriticalScore = nonCriticalResults.reduce((sum, s) => sum + (s.tests.passRate || 0), 0) / nonCriticalResults.length
    
    this.overallResults.overallScore = Math.round((criticalScore * 0.8) + (nonCriticalScore * 0.2))
  }

  // Generate recommendations based on results
  generateRecommendations() {
    const recommendations = []
    const criticalIssues = []
    
    this.overallResults.suiteResults.forEach(suite => {
      if (suite.status === 'error') {
        criticalIssues.push(`${suite.name} suite failed to execute: ${suite.error}`)
        recommendations.push(`Fix ${suite.name} test environment setup`)
      }
      
      if (suite.criticalFailures && suite.criticalFailures.length > 0) {
        suite.criticalFailures.forEach(failure => {
          criticalIssues.push(`${suite.name}: ${failure.testName} - ${failure.message}`)
        })
      }
      
      // Suite-specific recommendations
      if (suite.name === 'Security' && suite.tests.passRate < 95) {
        recommendations.push('Urgent security vulnerabilities need immediate attention')
        recommendations.push('Review authentication, authorization, and input validation')
      }
      
      if (suite.name === 'Data Integrity' && suite.tests.passRate < 95) {
        recommendations.push('Data consistency issues detected - review database constraints')
        recommendations.push('Implement stronger data validation at API layer')
      }
      
      if (suite.name === 'Recovery & Healing' && suite.tests.passRate < 90) {
        recommendations.push('System recovery capabilities need improvement')
        recommendations.push('Implement better error handling and rollback mechanisms')
      }
      
      if (suite.name === 'Load Performance' && suite.tests.passRate < 80) {
        recommendations.push('Performance optimization needed for production load')
        recommendations.push('Consider database indexing and query optimization')
      }
    })
    
    // Overall recommendations
    if (this.overallResults.overallScore < 90) {
      recommendations.push('System not ready for production - address critical issues first')
    } else if (this.overallResults.overallScore < 95) {
      recommendations.push('System approaching production readiness - address remaining issues')
    } else {
      recommendations.push('System demonstrates excellent stability and security')
    }
    
    this.overallResults.criticalIssues = criticalIssues
    this.overallResults.recommendations = recommendations
  }

  // Generate comprehensive report
  async generateFinalReport() {
    this.log('\n📊 PHASE 4: OBSERVABLE TRANSPARENCY - Final System Report', 'magenta')
    this.log('═'.repeat(80), 'magenta')
    
    // Calculate scores and recommendations
    this.calculateScores()
    this.generateRecommendations()
    
    const report = `
${this.colors.bright}${this.colors.white}╔═══════════════════════════════════════════════════════════════════════════════╗
║                          🏆 SYSTEM VALIDATION REPORT                          ║
╠═══════════════════════════════════════════════════════════════════════════════╣${this.colors.reset}
${this.colors.bright}║  Test Execution: ${this.overallResults.startTime.toISOString()}                    ║
║  Duration: ${this.overallResults.duration}ms                                        ║
║  Total Test Suites: ${this.overallResults.suiteResults.length}                                                ║${this.colors.reset}
╠═══════════════════════════════════════════════════════════════════════════════╣

${this.colors.cyan}📊 COMPOSITE SCORES:${this.colors.reset}
${this.colors.bright}Consistency Score:  ${this.getScoreColor(this.overallResults.consistencyScore)}${this.overallResults.consistencyScore}%${this.colors.reset} (Data Integrity + Recovery)
${this.colors.bright}Security Score:     ${this.getScoreColor(this.overallResults.securityScore)}${this.overallResults.securityScore}%${this.colors.reset} (Authentication + Authorization + Input Validation)
${this.colors.bright}Performance Score:  ${this.getScoreColor(this.overallResults.performanceScore)}${this.overallResults.performanceScore}%${this.colors.reset} (Load Handling + Database Stress)
${this.colors.bright}Reliability Score:  ${this.getScoreColor(this.overallResults.reliabilityScore)}${this.overallResults.reliabilityScore}%${this.colors.reset} (Recovery + Edge Cases)

${this.colors.yellow}🎯 OVERALL SYSTEM SCORE: ${this.getScoreColor(this.overallResults.overallScore)}${this.overallResults.overallScore}%${this.colors.reset}

${this.colors.cyan}📈 SUITE BREAKDOWN:${this.colors.reset}
${this.overallResults.suiteResults.map(suite => {
      const statusSymbol = suite.status === 'pass' ? '✅' : suite.status === 'fail' ? '❌' : '⚠️'
      const criticalBadge = suite.critical ? ' [CRITICAL]' : ''
      return `${statusSymbol} ${suite.name}${criticalBadge}: ${suite.tests.passed}/${suite.tests.total} (${suite.tests.passRate}%) - ${suite.duration}ms`
    }).join('\n')}

${this.overallResults.criticalIssues.length > 0 ? `
${this.colors.red}🚨 CRITICAL ISSUES (${this.overallResults.criticalIssues.length}):${this.colors.reset}
${this.overallResults.criticalIssues.map(issue => `   ⚠️  ${issue}`).join('\n')}
` : `${this.colors.green}✅ No critical issues detected${this.colors.reset}`}

${this.colors.yellow}💡 RECOMMENDATIONS:${this.colors.reset}
${this.overallResults.recommendations.map(rec => `   📋 ${rec}`).join('\n')}

${this.colors.bright}${this.colors.white}╚═══════════════════════════════════════════════════════════════════════════════╝${this.colors.reset}
`
    
    console.log(report)
    
    // Save detailed JSON report
    const reportPath = `./tests/reports/master-report-${Date.now()}.json`
    fs.writeFileSync(reportPath, JSON.stringify(this.overallResults, null, 2))
    this.log(`\n💾 Detailed report saved: ${reportPath}`, 'green')
    
    // Generate executive summary
    const summaryPath = `./tests/reports/executive-summary-${Date.now()}.md`
    const summary = this.generateExecutiveSummary()
    fs.writeFileSync(summaryPath, summary)
    this.log(`📄 Executive summary: ${summaryPath}`, 'green')
    
    return this.overallResults
  }

  getScoreColor(score) {
    if (score >= 95) return this.colors.green
    if (score >= 85) return this.colors.yellow
    return this.colors.red
  }

  generateExecutiveSummary() {
    return `# System Validation Executive Summary

**Test Date:** ${this.overallResults.startTime.toISOString()}
**Overall Score:** ${this.overallResults.overallScore}%

## Key Metrics
- **Consistency Score:** ${this.overallResults.consistencyScore}%
- **Security Score:** ${this.overallResults.securityScore}%
- **Performance Score:** ${this.overallResults.performanceScore}%
- **Reliability Score:** ${this.overallResults.reliabilityScore}%

## Production Readiness
${this.overallResults.overallScore >= 95 ? 
  '✅ **PRODUCTION READY** - System demonstrates excellent stability and security' :
  this.overallResults.overallScore >= 90 ?
  '⚠️ **NEARLY READY** - Minor issues need addressing before production' :
  '❌ **NOT READY** - Critical issues must be resolved before production'}

## Critical Issues
${this.overallResults.criticalIssues.length === 0 ? 
  'None detected' : 
  this.overallResults.criticalIssues.map(issue => `- ${issue}`).join('\n')}

## Next Steps
${this.overallResults.recommendations.map(rec => `1. ${rec}`).join('\n')}

---
*Generated by System Consistency Architect & QA Oracle*
`
  }

  // Main test execution orchestrator
  async runAllTests() {
    this.displayBanner()
    
    const overallStart = Date.now()
    
    try {
      // Phase 1: Environment validation
      await this.validateTestEnvironment()
      
      this.log('\n🚀 PHASE 2: PROPERTY-BASED VALIDATION - Test Suite Execution', 'yellow')
      this.log('═'.repeat(80), 'yellow')
      
      // Phase 2: Execute all test suites
      for (const suiteConfig of this.testSuites) {
        try {
          const suiteResult = await this.runTestSuite(suiteConfig)
          this.overallResults.suiteResults.push(suiteResult)
          
          // Small delay between suites to allow cleanup
          await new Promise(resolve => setTimeout(resolve, 1000))
          
        } catch (error) {
          this.log(`💥 Failed to run ${suiteConfig.name}: ${error.message}`, 'red')
          this.overallResults.suiteResults.push({
            name: suiteConfig.name,
            critical: suiteConfig.critical,
            status: 'error',
            error: error.message,
            tests: { total: 0, passed: 0, failed: 1, passRate: 0 }
          })
        }
      }
      
      // Phase 3: Analysis and reporting
      this.overallResults.endTime = new Date()
      this.overallResults.duration = Date.now() - overallStart
      
      await this.generateFinalReport()
      
      // Exit with appropriate code
      const hasErrors = this.overallResults.suiteResults.some(s => s.status === 'error')
      const hasCriticalFailures = this.overallResults.criticalIssues.length > 0
      
      if (hasErrors || (hasCriticalFailures && this.overallResults.overallScore < 85)) {
        process.exit(1)
      }
      
    } catch (error) {
      this.log(`💥 Master test runner failed: ${error.message}`, 'red')
      console.error(error.stack)
      process.exit(1)
    }
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new MasterTestRunner()
  runner.runAllTests()
}

module.exports = MasterTestRunner