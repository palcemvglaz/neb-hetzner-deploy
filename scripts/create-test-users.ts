import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creating test users...')

  const password = await bcryptjs.hash('password123', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nebachiv.com' },
    update: {},
    create: {
      email: 'admin@nebachiv.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  })
  console.log('✅ Admin created:', admin.email)

  // Create student user
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Test Student',
      password,
      role: 'STUDENT',
      emailVerified: new Date(),
    }
  })
  console.log('✅ Student created:', student.email)

  // Create instructor user
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      email: 'instructor@example.com',
      name: 'Test Instructor',
      password,
      role: 'INSTRUCTOR',
      emailVerified: new Date(),
    }
  })
  console.log('✅ Instructor created:', instructor.email)

  // Create school admin user
  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'school@example.com' },
    update: {},
    create: {
      email: 'school@example.com',
      name: 'School Admin',
      password,
      role: 'SCHOOL_ADMIN',
      emailVerified: new Date(),
    }
  })
  console.log('✅ School Admin created:', schoolAdmin.email)

  console.log('\n📝 Test users created successfully!')
  console.log('\nYou can login with:')
  console.log('- Email: admin@nebachiv.com, Password: password123 (ADMIN)')
  console.log('- Email: student@example.com, Password: password123 (STUDENT)')
  console.log('- Email: instructor@example.com, Password: password123 (INSTRUCTOR)')
  console.log('- Email: school@example.com, Password: password123 (SCHOOL_ADMIN)')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })