import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedSchool() {
  console.log('🏫 Seeding school data...')

  // Create a school
  const school = await prisma.school.create({
    data: {
      name: 'Київська Мотошкола',
      slug: 'kyiv-motoschool',
      description: 'Провідна мотошкола столиці з досвідченими інструкторами',
      phone: '+380441234567',
      email: 'info@kyiv-motoschool.ua',
      address: 'м. Київ, вул. Хрещатик, 1',
      website: 'https://kyiv-motoschool.ua',
      isActive: true
    }
  })

  // Update existing school admin user or create new one
  const hashedPassword = await bcrypt.hash('school123', 10)
  
  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'school@nebachiv.com' },
    update: {
      schoolId: school.id,
      role: 'SCHOOL_ADMIN'
    },
    create: {
      email: 'school@nebachiv.com',
      password: hashedPassword,
      name: 'Адмін Мотошколи',
      role: 'SCHOOL_ADMIN',
      emailVerified: new Date(),
      schoolId: school.id
    }
  })

  // Create an instructor
  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@kyiv-motoschool.ua',
      password: hashedPassword,
      name: 'Петро Інструктор',
      role: 'INSTRUCTOR',
      emailVerified: new Date(),
      schoolId: school.id
    }
  })

  // Create school groups
  const group1 = await prisma.schoolGroup.create({
    data: {
      name: 'Група А-2024-01',
      schoolId: school.id,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-15'),
      maxStudents: 15
    }
  })

  const group2 = await prisma.schoolGroup.create({
    data: {
      name: 'Група А-2024-02',
      schoolId: school.id,
      startDate: new Date('2024-02-01'),
      maxStudents: 20
    }
  })

  // Create some students for the school
  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'student1@example.com',
        password: hashedPassword,
        name: 'Олена Студентка',
        role: 'STUDENT',
        emailVerified: new Date(),
        schoolId: school.id,
        schoolGroupId: group1.id,
        lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    }),
    prisma.user.create({
      data: {
        email: 'student2@example.com',
        password: hashedPassword,
        name: 'Іван Студент',
        role: 'STUDENT',
        emailVerified: new Date(),
        schoolId: school.id,
        schoolGroupId: group1.id,
        lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    }),
    prisma.user.create({
      data: {
        email: 'student3@example.com',
        password: hashedPassword,
        name: 'Марія Студентка',
        role: 'STUDENT',
        emailVerified: new Date(),
        schoolId: school.id,
        schoolGroupId: group2.id,
        lastLoginAt: new Date() // today
      }
    })
  ])

  // Enroll students in courses
  const courses = await prisma.course.findMany({
    take: 2
  })

  if (courses.length > 0) {
    for (const student of students) {
      for (const course of courses) {
        await prisma.enrollment.create({
          data: {
            userId: student.id,
            courseId: course.id,
            progress: Math.floor(Math.random() * 100)
          }
        }).catch(() => {
          // Ignore if enrollment already exists
        })
      }
    }
  }

  console.log('✅ School data seeded successfully!')
  console.log(`
    School created: ${school.name}
    School admin: school@nebachiv.com / school123
    Instructor: instructor@kyiv-motoschool.ua / school123
    Students: 3
    Groups: 2
  `)
}

export default seedSchool

// Run if this file is executed directly
if (require.main === module) {
  seedSchool()
    .catch((e) => {
      console.error('Error seeding school:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}