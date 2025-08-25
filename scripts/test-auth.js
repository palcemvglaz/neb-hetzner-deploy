#!/usr/bin/env node

/**
 * Test authentication system
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔐 Testing authentication...\n');
    
    const email = 'admin@nebachiv.com';
    const password = 'password123';
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        name: true
      }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Has password: ${!!user.password}`);
    
    if (user.password) {
      // Test password
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`   Password match: ${isValid ? '✅' : '❌'}`);
      
      if (!isValid) {
        // Try to hash and compare the test password
        const testHash = await bcrypt.hash(password, 10);
        console.log('\n📝 To fix password, run:');
        console.log(`   UPDATE User SET password='${testHash}' WHERE email='${email}';`);
      }
    } else {
      console.log('   ❌ No password set');
      const testHash = await bcrypt.hash(password, 10);
      console.log('\n📝 To set password, run:');
      console.log(`   UPDATE User SET password='${testHash}' WHERE email='${email}';`);
    }
    
    // Check for active sessions
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        expires: { gt: new Date() }
      },
      select: {
        sessionToken: true,
        expires: true
      }
    });
    
    console.log(`\n📊 Active sessions: ${sessions.length}`);
    if (sessions.length > 0) {
      console.log(`   Latest expires: ${sessions[0].expires}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();