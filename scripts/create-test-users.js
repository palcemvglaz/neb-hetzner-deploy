#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  console.log('🚀 Creating test users for PostgreSQL...\n');

  const password = await bcrypt.hash('password123', 12);
  
  const testUsers = [
    {
      id: 'cm1234admin',
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'ADMIN',
      password,
      emailVerified: new Date()
    },
    {
      id: 'cm1234student1',
      email: 'student@test.com',
      name: 'Test Student',
      role: 'STUDENT', 
      password,
      emailVerified: new Date()
    },
    {
      id: 'cm1234student2',
      email: 'student2@test.com',
      name: 'Test Student 2',
      role: 'STUDENT',
      password,
      emailVerified: new Date()
    },
    {
      id: 'cm1234school',
      email: 'school@test.com',
      name: 'School Admin',
      role: 'SCHOOL_ADMIN',
      password,
      emailVerified: new Date()
    },
    {
      id: 'cm1234instructor',
      email: 'instructor@test.com',
      name: 'Test Instructor',
      role: 'INSTRUCTOR',
      password,
      emailVerified: new Date()
    },
    {
      id: 'cm1234superadmin',
      email: 'admin@nebachiv.com',
      name: 'Super Admin',
      role: 'ADMIN',
      password,
      emailVerified: new Date()
    }
  ];

  let created = 0;

  for (const userData of testUsers) {
    try {
      const user = await prisma.user.create({
        data: userData
      });
      console.log(`✅ Created user: ${user.email} (${user.role})`);
      created++;
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⚠️ User ${userData.email} already exists, updating...`);
        try {
          await prisma.user.update({
            where: { email: userData.email },
            data: userData
          });
          console.log(`✅ Updated user: ${userData.email}`);
          created++;
        } catch (updateError) {
          console.log(`❌ Failed to update ${userData.email}: ${updateError.message}`);
        }
      } else {
        console.log(`❌ Failed to create ${userData.email}: ${error.message}`);
      }
    }
  }

  console.log(`\n✨ Created/updated ${created} test users`);
  console.log('\n🔐 Login credentials:');
  console.log('   Email: admin@test.com | Password: password123 | Role: ADMIN');
  console.log('   Email: student@test.com | Password: password123 | Role: STUDENT');
  console.log('   Email: school@test.com | Password: password123 | Role: SCHOOL_ADMIN');
  console.log('   Email: instructor@test.com | Password: password123 | Role: INSTRUCTOR');
  console.log('   Email: admin@nebachiv.com | Password: password123 | Role: ADMIN');

  await prisma.$disconnect();
}

createTestUsers().catch(console.error);