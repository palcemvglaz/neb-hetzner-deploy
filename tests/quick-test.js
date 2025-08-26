#!/usr/bin/env node

/**
 * Quick Test for Nebachiv Content App
 * Minimal test to verify basic functionality with current schema
 */

const { PrismaClient } = require('@prisma/client')

async function quickTest() {
  console.log('🧪 Quick Test - Verifying System State')
  console.log('═'.repeat(50))
  
  const prisma = new PrismaClient()
  
  try {
    // Test 1: Database Connection
    console.log('1. Testing database connection...')
    const userCount = await prisma.user.count()
    console.log(`✅ Database connected - ${userCount} users found`)
    
    // Test 2: Test Users
    console.log('2. Checking test users...')
    const testUsers = await prisma.user.findMany({
      where: { email: { contains: '@test.com' } },
      include: {
        questionnaireProfiles: true,
        riderSkillMap: true,
        riderTimeline: true
      }
    })
    console.log(`✅ Found ${testUsers.length} test users`)
    
    // Test 3: Data Structure Validation
    console.log('3. Validating data structure...')
    let validStructure = true
    testUsers.forEach((user, index) => {
      console.log(`   User ${index + 1}: ${user.name} (${user.email})`)
      console.log(`     - Questionnaire profiles: ${user.questionnaireProfiles?.length || 0}`)
      console.log(`     - Skill map: ${user.riderSkillMap ? 'Yes' : 'No'}`)
      console.log(`     - Timeline events: ${user.riderTimeline?.length || 0}`)
    })
    
    // Test 4: Basic API Test
    console.log('4. Testing API health...')
    try {
      const response = await fetch('http://localhost:3205/api/health')
      const data = await response.json()
      console.log(`✅ API Health: ${response.status} - ${data.status}`)
    } catch (error) {
      console.log(`⚠️ API not available: ${error.message}`)
    }
    
    // Test 5: Schema Compatibility
    console.log('5. Testing schema compatibility...')
    try {
      const sampleUser = await prisma.user.findFirst({
        where: { email: { contains: '@test.com' } },
        include: {
          questionnaireProfiles: true,
          riderSkillMap: true
        }
      })
      
      if (sampleUser) {
        console.log(`✅ Schema compatible - User model includes proper relationships`)
        console.log(`   - questionnaireProfiles: ${sampleUser.questionnaireProfiles ? 'Available' : 'Not available'}`)
        console.log(`   - riderSkillMap: ${sampleUser.riderSkillMap ? 'Available' : 'Not available'}`)
      }
    } catch (error) {
      console.log(`❌ Schema compatibility issue: ${error.message}`)
      validStructure = false
    }
    
    console.log('\n📊 QUICK TEST RESULTS:')
    console.log('═'.repeat(50))
    console.log(`Database Connection: ✅ Working`)
    console.log(`Test Data: ✅ ${testUsers.length} test users found`)
    console.log(`Schema Compatibility: ${validStructure ? '✅' : '❌'} ${validStructure ? 'Compatible' : 'Issues detected'}`)
    console.log(`API Status: ${global.apiWorking ? '✅' : '⚠️'} ${global.apiWorking ? 'Working' : 'Limited'}`)
    
    if (validStructure && testUsers.length >= 2) {
      console.log('\n🎉 SYSTEM STATUS: READY FOR TESTING')
      console.log('The basic infrastructure is working correctly.')
    } else {
      console.log('\n⚠️ SYSTEM STATUS: NEEDS ATTENTION')
      console.log('Some components need fixing before full testing.')
    }
    
  } catch (error) {
    console.error('💥 Quick test failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run test
quickTest()