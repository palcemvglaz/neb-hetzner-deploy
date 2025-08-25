#!/usr/bin/env node

/**
 * Fix admin password
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixPassword() {
  try {
    console.log('🔧 Fixing admin password...');
    
    const email = 'admin@nebachiv.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        // Ensure it's admin
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Password updated successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${user.role}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPassword();