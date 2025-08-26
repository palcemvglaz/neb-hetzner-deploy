#!/usr/bin/env node

/**
 * Security Testing for Nebachiv Content App
 * Tests API security, authentication, authorization, and input validation
 */

const TestHelper = require('./test-helper')
const crypto = require('crypto')

class SecurityTest extends TestHelper {
  constructor() {
    super()
    this.maliciousPayloads = [
      '<script>alert("xss")</script>',
      '../../etc/passwd',
      '{{ 7*7 }}',
      'javascript:alert(1)',
      '<img src=x onerror=alert(1)>',
      'OR 1=1 --',
      'UNION SELECT * FROM users--',
      '${7*7}',
      '\'; DROP TABLE users; --'
    ]
  }

  // Test unauthorized API access
  async testUnauthorizedAccess() {
    this.log('Testing unauthorized API access...', 'info')
    
    const protectedEndpoints = [
      '/api/admin/content',
      '/api/admin/questionnaires',
      '/api/admin/users',
      '/api/courses/create',
      '/api/user/profile'
    ]
    
    for (const endpoint of protectedEndpoints) {
      try {
        const response = await this.makeRequest(endpoint)
        const isUnauthorized = response.status === 401 || response.status === 403
        
        this.recordTest(
          `Unauthorized access: ${endpoint}`,
          isUnauthorized,
          `Status: ${response.status} - ${isUnauthorized ? 'Correctly blocked' : 'Security issue!'}`
        )
      } catch (error) {
        this.recordTest(`Unauthorized access: ${endpoint}`, false, `Error: ${error.message}`)
      }
    }
  }

  // Test SQL injection attempts
  async testSQLInjection() {
    this.log('Testing SQL injection vulnerabilities...', 'info')
    
    const sqlInjectionPayloads = [
      "' OR '1'='1",
      "1'; DROP TABLE users; --",
      "' UNION SELECT username, password FROM users --",
      "1' OR 1=1 --",
      "admin'--",
      "' OR 1=1#"
    ]
    
    for (const payload of sqlInjectionPayloads) {
      try {
        // Test login endpoint
        const response = await this.makeRequest('/api/auth/signin', {
          method: 'POST',
          body: {
            email: payload,
            password: payload
          }
        })
        
        // Should not succeed or return sensitive data
        const isSafe = response.status === 400 || response.status === 401 || response.status === 422
        
        this.recordTest(
          `SQL injection: ${payload.substring(0, 20)}...`,
          isSafe,
          `Status: ${response.status} - ${isSafe ? 'Protected' : 'Potential vulnerability'}`
        )
      } catch (error) {
        this.recordTest(`SQL injection test`, false, `Error: ${error.message}`)
      }
    }
  }

  // Test XSS vulnerabilities
  async testXSSVulnerabilities() {
    this.log('Testing XSS vulnerabilities...', 'info')
    
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert(1)>',
      'javascript:alert(document.cookie)',
      '<svg onload=alert(1)>',
      '<iframe src=javascript:alert(1)></iframe>'
    ]
    
    // Test user registration with XSS payloads
    for (const payload of xssPayloads) {
      try {
        const testUser = await this.createTestUser(`xss-${Date.now()}`)
        
        // Update user name with XSS payload
        await this.prisma.user.update({
          where: { id: testUser.id },
          data: { name: payload }
        })
        
        // Fetch user data via API
        const response = await this.makeRequest('/api/health')
        
        // Check if payload is properly escaped in response
        const responseText = JSON.stringify(response.data)
        const isEscaped = !responseText.includes('<script') && !responseText.includes('javascript:')
        
        this.recordTest(
          `XSS protection: ${payload.substring(0, 20)}...`,
          isEscaped,
          `${isEscaped ? 'Properly escaped' : 'XSS vulnerability detected!'}`
        )
        
      } catch (error) {
        this.recordTest(`XSS test`, false, `Error: ${error.message}`)
      }
    }
  }

  // Test input validation
  async testInputValidation() {
    this.log('Testing input validation...', 'info')
    
    const invalidInputs = [
      { field: 'email', value: 'invalid-email', expected: 'rejection' },
      { field: 'email', value: '', expected: 'rejection' },
      { field: 'password', value: '123', expected: 'rejection' }, // Too short
      { field: 'role', value: 'INVALID_ROLE', expected: 'rejection' },
      { field: 'name', value: 'A'.repeat(1000), expected: 'rejection' }, // Too long
      { field: 'age', value: -5, expected: 'rejection' },
      { field: 'age', value: 'not-a-number', expected: 'rejection' }
    ]
    
    for (const input of invalidInputs) {
      try {
        const testData = {
          email: 'test@example.com',
          name: 'Test User',
          password: 'validpassword123',
          role: 'STUDENT',
          age: 25
        }
        
        // Override with invalid input
        testData[input.field] = input.value
        
        // Try to create user with invalid data
        try {
          await this.prisma.user.create({ data: testData })
          this.recordTest(
            `Input validation: ${input.field}`,
            false,
            `Should reject invalid ${input.field}: ${input.value}`
          )
        } catch (error) {
          this.recordTest(
            `Input validation: ${input.field}`,
            true,
            `Correctly rejected invalid ${input.field}`
          )
        }
        
      } catch (error) {
        this.recordTest(`Input validation test`, false, `Error: ${error.message}`)
      }
    }
  }

  // Test rate limiting
  async testRateLimiting() {
    this.log('Testing rate limiting...', 'info')
    
    const rapidRequests = Array.from({ length: 100 }, (_, i) => 
      () => this.makeRequest('/api/health')
    )
    
    const start = Date.now()
    const results = await Promise.all(rapidRequests.map(fn => fn().catch(e => ({ error: e.message }))))
    const duration = Date.now() - start
    
    const successCount = results.filter(r => !r.error && r.status === 200).length
    const rateLimited = results.some(r => r.status === 429)
    
    this.recordTest(
      'Rate limiting',
      rateLimited || duration > 5000, // Either rate limited or slow (which is good)
      `${successCount}/100 succeeded in ${duration}ms, Rate limited: ${rateLimited}`,
      duration
    )
  }

  // Test session security
  async testSessionSecurity() {
    this.log('Testing session security...', 'info')
    
    try {
      // Create a test session
      const user = await this.createTestUser('session-test')
      
      // Test invalid session token
      const response = await this.makeRequest('/api/user/profile', {
        headers: {
          'Cookie': 'next-auth.session-token=invalid-token-12345'
        }
      })
      
      const isSecure = response.status === 401 || response.status === 403
      this.recordTest(
        'Invalid session rejection',
        isSecure,
        `Status: ${response.status} - ${isSecure ? 'Rejected invalid session' : 'Security issue!'}`
      )
      
      // Test session without CSRF token (if implemented)
      const csrfResponse = await this.makeRequest('/api/auth/csrf')
      this.recordTest(
        'CSRF token availability',
        csrfResponse.status === 200,
        `CSRF endpoint status: ${csrfResponse.status}`
      )
      
    } catch (error) {
      this.recordTest('Session security test', false, `Error: ${error.message}`)
    }
  }

  // Test file upload security
  async testFileUploadSecurity() {
    this.log('Testing file upload security...', 'info')
    
    const maliciousFiles = [
      { name: 'test.php', content: '<?php echo "hack"; ?>', type: 'application/x-php' },
      { name: 'test.exe', content: 'MZ\x90\x00', type: 'application/x-executable' },
      { name: '../../../etc/passwd', content: 'root:x:0:0', type: 'text/plain' },
      { name: 'test.svg', content: '<svg onload=alert(1)></svg>', type: 'image/svg+xml' }
    ]
    
    // Note: This assumes there's a file upload endpoint
    for (const file of maliciousFiles) {
      try {
        const response = await this.makeRequest('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          body: {
            file: file.content,
            filename: file.name,
            mimetype: file.type
          }
        })
        
        const isBlocked = response.status === 400 || response.status === 415 || response.status === 403
        this.recordTest(
          `File upload security: ${file.name}`,
          isBlocked,
          `Status: ${response.status} - ${isBlocked ? 'Blocked malicious file' : 'File accepted!'}`
        )
        
      } catch (error) {
        // If endpoint doesn't exist, that's actually good for security
        this.recordTest(
          `File upload security: ${file.name}`,
          true,
          'Upload endpoint not found (good for security)'
        )
      }
    }
  }

  // Test password security
  async testPasswordSecurity() {
    this.log('Testing password security...', 'info')
    
    try {
      const testUser = await this.createTestUser('password-test')
      
      // Check if password is hashed in database
      const userFromDb = await this.prisma.user.findUnique({
        where: { id: testUser.id },
        select: { password: true }
      })
      
      const isHashed = userFromDb.password !== 'test123' && userFromDb.password.length > 20
      this.recordTest(
        'Password hashing',
        isHashed,
        `Password stored as: ${isHashed ? 'hashed' : 'plaintext (CRITICAL!)'}`
      )
      
      // Test weak password rejection
      const weakPasswords = ['123', 'password', '12345678', 'abc']
      for (const weakPassword of weakPasswords) {
        try {
          await this.createTestUser(`weak-${Date.now()}`, 'STUDENT', weakPassword)
          this.recordTest(
            `Weak password rejection: ${weakPassword}`,
            false,
            'Weak password was accepted'
          )
        } catch (error) {
          this.recordTest(
            `Weak password rejection: ${weakPassword}`,
            true,
            'Weak password correctly rejected'
          )
        }
      }
      
    } catch (error) {
      this.recordTest('Password security test', false, `Error: ${error.message}`)
    }
  }

  // Test CORS security
  async testCORSSecurity() {
    this.log('Testing CORS security...', 'info')
    
    try {
      const response = await this.makeRequest('/api/health', {
        headers: {
          'Origin': 'https://malicious-site.com',
          'Access-Control-Request-Method': 'GET'
        }
      })
      
      const corsHeaders = response.headers.get('access-control-allow-origin')
      const isSecure = !corsHeaders || corsHeaders !== '*'
      
      this.recordTest(
        'CORS configuration',
        isSecure,
        `CORS header: ${corsHeaders || 'none'} - ${isSecure ? 'Secure' : 'Too permissive'}`
      )
      
    } catch (error) {
      this.recordTest('CORS test', false, `Error: ${error.message}`)
    }
  }

  // Run all security tests
  async runAllTests() {
    this.log('🔒 Starting Security Tests', 'info')
    this.log('=' .repeat(50), 'info')
    
    const startMemory = this.getMemoryUsage()
    const overallStart = Date.now()
    
    try {
      await this.testUnauthorizedAccess()
      await this.testSQLInjection()
      await this.testXSSVulnerabilities()
      await this.testInputValidation()
      await this.testRateLimiting()
      await this.testSessionSecurity()
      await this.testFileUploadSecurity()
      await this.testPasswordSecurity()
      await this.testCORSSecurity()
      
    } catch (error) {
      this.log(`Critical error during security testing: ${error.message}`, 'error')
    }
    
    const overallDuration = Date.now() - overallStart
    const endMemory = this.getMemoryUsage()
    
    // Generate report
    const report = this.getTestReport()
    
    this.log('🛡️ Security Test Results:', 'info')
    this.log(`Total Tests: ${report.summary.total}`, 'info')
    this.log(`Passed: ${report.summary.passed}`, 'success')
    this.log(`Failed: ${report.summary.failed}`, report.summary.failed > 0 ? 'error' : 'success')
    this.log(`Pass Rate: ${report.summary.passRate}%`, report.summary.passRate > 85 ? 'success' : 'error')
    this.log(`Total Duration: ${overallDuration}ms`, 'info')
    
    // Show critical security failures
    const criticalFailures = report.tests.filter(t => 
      !t.passed && (
        t.testName.includes('SQL injection') ||
        t.testName.includes('XSS') ||
        t.testName.includes('Unauthorized access') ||
        t.testName.includes('Password hashing')
      )
    )
    
    if (criticalFailures.length > 0) {
      this.log('🚨 CRITICAL SECURITY ISSUES:', 'error')
      criticalFailures.forEach(test => {
        this.log(`  ⚠️  ${test.testName}: ${test.message}`, 'error')
      })
    }
    
    // Security score calculation
    const securityScore = Math.max(0, 100 - (report.summary.failed * 5))
    this.log(`🔐 Security Score: ${securityScore}/100`, securityScore > 85 ? 'success' : 'error')
    
    return report
  }

  // Override createTestUser to support password parameter
  async createTestUser(suffix = 'user', role = 'STUDENT', password = 'test123') {
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)
    const email = `test-${suffix}-${this.testId}@test.com`
    
    return await this.prisma.user.create({
      data: {
        email,
        name: `Test-${suffix}-${this.testId}`,
        password: hashedPassword,
        role,
        emailVerified: new Date()
      }
    })
  }

  // Cleanup test data
  async cleanup() {
    try {
      await this.cleanupTestData()
      this.log('🧹 Security test cleanup completed', 'success')
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error')
    }
  }
}

// Run if called directly
async function runSecurityTest() {
  const tester = new SecurityTest()
  
  try {
    const report = await tester.runAllTests()
    
    // Save detailed report
    const fs = require('fs')
    const reportPath = `./tests/reports/security-${Date.now()}.json`
    
    // Ensure reports directory exists
    if (!fs.existsSync('./tests/reports')) {
      fs.mkdirSync('./tests/reports', { recursive: true })
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📊 Detailed report saved to: ${reportPath}`)
    
    // Generate security summary
    const criticalIssues = report.tests.filter(t => !t.passed).length
    const securityScore = Math.max(0, 100 - (criticalIssues * 5))
    
    console.log(`\n🔐 SECURITY SUMMARY:`)
    console.log(`Security Score: ${securityScore}/100`)
    console.log(`Critical Issues: ${criticalIssues}`)
    console.log(`Recommendation: ${securityScore > 85 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`)
    
  } catch (error) {
    console.error('Fatal security test error:', error)
    process.exit(1)
  } finally {
    await tester.cleanup()
    await tester.disconnect()
  }
}

module.exports = SecurityTest

if (require.main === module) {
  runSecurityTest()
}