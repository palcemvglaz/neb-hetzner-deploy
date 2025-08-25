#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    const email = 'admin@nebachiv.com';
    const passwords = ['password123', 'admin123', 'test123'];
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('🔍 Testing admin login');
    console.log(`Email: ${user.email}`);
    console.log(`Current hash: ${user.password?.substring(0, 60)}...`);
    console.log(`Hash length: ${user.password?.length}`);
    
    // Test different passwords
    console.log('\nTesting passwords:');
    for (const pwd of passwords) {
      const isValid = await bcrypt.compare(pwd, user.password);
      console.log(`  ${pwd}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    
    // Create correct hash and update
    console.log('\n🔧 Setting password to "password123"...');
    const correctHash = await bcrypt.hash('password123', 10);
    
    await prisma.user.update({
      where: { email },
      data: { 
        password: correctHash,
        emailVerified: new Date(),
        role: 'ADMIN'
      }
    });
    
    // Verify the update
    const updatedUser = await prisma.user.findUnique({
      where: { email }
    });
    
    const verifyResult = await bcrypt.compare('password123', updatedUser.password);
    console.log(`\n✅ Password updated. Verification: ${verifyResult ? 'SUCCESS' : 'FAILED'}`);
    console.log(`New hash: ${updatedUser.password?.substring(0, 60)}...`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();