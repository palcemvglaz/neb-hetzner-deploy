#!/usr/bin/env node

/**
 * Create test admin user for development
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestAdmin() {
  try {
    console.log('🔧 Creating test admin user...');
    
    const email = 'admin@nebachiv.com';
    const password = 'password123';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('✅ Admin user already exists');
      console.log(`   Email: ${email}`);
      console.log(`   Role: ${existingUser.role}`);
      
      // Update to ADMIN role if not already
      if (existingUser.role !== 'ADMIN') {
        await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' }
        });
        console.log('   ✓ Updated role to ADMIN');
      }
      
      return;
    }
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Test Admin',
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ADMIN`);
    console.log('\n📌 You can now login at http://localhost:3205/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestAdmin();