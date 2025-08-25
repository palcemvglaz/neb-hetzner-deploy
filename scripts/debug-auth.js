#!/usr/bin/env node

/**
 * Debug authentication issue
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugAuth() {
  try {
    console.log('🔍 Debug Authentication\n');
    
    const email = 'admin@nebachiv.com';
    const testPassword = 'password123';
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('User data:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password hash: ${user.password?.substring(0, 20)}...`);
    
    // Test password with bcryptjs (same as auth uses)
    console.log('\nTesting with bcryptjs:');
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log(`  Result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    
    // Create new hash for comparison
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log(`\nNew hash would be: ${newHash.substring(0, 20)}...`);
    
    // Force update password to ensure it works
    console.log('\n🔧 Updating password to ensure it works...');
    await prisma.user.update({
      where: { email },
      data: { 
        password: newHash,
        // Ensure these fields are set
        emailVerified: new Date(),
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Password updated! Try logging in now.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuth();