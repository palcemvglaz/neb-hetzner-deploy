import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('password123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nebachiv.com' },
    update: {},
    create: {
      email: 'admin@nebachiv.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create demo school
  const school = await prisma.school.upsert({
    where: { id: 'demo-school-id' },
    update: {},
    create: {
      id: 'demo-school-id',
      name: 'Демо Мотошкола',
      description: 'Демонстраційна мотошкола для тестування системи',
      email: 'info@demo-motoshkola.com',
      phone: '+380671234567',
      address: 'вул. Хрещатик, 1, Київ'
    },
  })

  console.log('✅ Created demo school:', school.name)

  // Create school admin
  const schoolAdminPassword = await bcrypt.hash('password123', 12)
  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'school@nebachiv.com' },
    update: {},
    create: {
      email: 'school@nebachiv.com',
      name: 'School Admin',
      password: schoolAdminPassword,
      role: 'SCHOOL_ADMIN',
      schoolId: school.id,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created school admin:', schoolAdmin.email)

  // Create demo student
  const studentPassword = await bcrypt.hash('password123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@nebachiv.com' },
    update: {},
    create: {
      email: 'student@nebachiv.com',
      name: 'Demo Student',
      password: studentPassword,
      role: 'STUDENT',
      schoolId: school.id,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Created demo student:', student.email)

  // Create additional test users
  const testPassword = await bcrypt.hash('password123', 12)
  
  const student2 = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      name: 'Test Student',
      password: testPassword,
      role: 'STUDENT',
      schoolId: school.id,
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created test student:', student2.email)

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@test.com' },
    update: {},
    create: {
      email: 'instructor@test.com',
      name: 'Test Instructor',
      password: testPassword,
      role: 'INSTRUCTOR',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created test instructor:', instructor.email)

  const schoolAdmin2 = await prisma.user.upsert({
    where: { email: 'school@test.com' },
    update: {},
    create: {
      email: 'school@test.com',
      name: 'Test Moto School',
      password: testPassword,
      role: 'SCHOOL_ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created test school admin:', schoolAdmin2.email)

  const admin2 = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'System Admin',
      password: testPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created test admin:', admin2.email)

  // Create demo tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'bezpeka' },
      update: {},
      create: {
        slug: 'bezpeka',
        nameUa: 'Безпека',
        nameEn: 'Safety',
        nameRu: 'Безопасность',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'pdr' },
      update: {},
      create: {
        slug: 'pdr',
        nameUa: 'ПДР',
        nameEn: 'Traffic Rules',
        nameRu: 'ПДД',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'tekhnika-vodinnya' },
      update: {},
      create: {
        slug: 'tekhnika-vodinnya',
        nameUa: 'Техніка водіння',
        nameEn: 'Driving Technique',
        nameRu: 'Техника вождения',
      },
    }),
  ])

  console.log('✅ Created tags:', tags.map(tag => tag.nameUa).join(', '))

  // Create demo content
  const content = await prisma.content.create({
    data: {
      slug: 'osnovni-pravyla-bezpeki',
      type: 'GUIDE',
      status: 'PUBLISHED',
      isPublished: true,
      isPremium: false,
      difficulty: 'BEGINNER',
      estimatedTime: 15,
      order: 1,
      translations: {
        create: {
          language: 'UA',
          title: 'Основні правила безпеки на мотоциклі',
          description: 'Базові правила безпеки, які повинен знати кожен мотоцикліст',
          body: `# Основні правила безпеки на мотоциклі

## Екіпіровка

1. **Шолом** - обов'язковий елемент безпеки
2. **Захисний одяг** - куртка, штани, рукавички
3. **Взуття** - закрите взуття з твердою підошвою

## Перед поїздкою

- Перевірте технічний стан мотоцикла
- Переконайтеся у справності гальм
- Перевірте тиск у шинах

## На дорозі

- Дотримуйтесь швидкісного режиму
- Тримайте безпечну дистанцію
- Будьте помітними для інших учасників руху`,
          metaTitle: 'Основні правила безпеки на мотоциклі | Nebachiv',
          metaDescription: 'Дізнайтеся про основні правила безпеки для мотоциклістів. Екіпіровка, підготовка до поїздки та поведінка на дорозі.',
        },
      },
      tags: {
        create: [
          { tagId: tags[0].id }, // Безпека
        ],
      },
    },
  })

  console.log('✅ Created demo content:', content.slug)

  // Create demo test
  const test = await prisma.test.create({
    data: {
      contentId: content.id,
      title: 'Тест з основ безпеки',
      description: 'Перевірте свої знання основних правил безпеки на мотоциклі',
      passingScore: 80,
      timeLimit: 10,
      attemptsAllowed: 3,
      questions: {
        create: [
          {
            text: 'Який головний елемент захисної екіпіровки мотоцикліста?',
            type: 'SINGLE_CHOICE',
            points: 1,
            order: 1,
            explanation: 'Шолом захищає найважливішу частину тіла - голову',
            answers: {
              create: [
                { text: 'Шолом', isCorrect: true, order: 1 },
                { text: 'Рукавички', isCorrect: false, order: 2 },
                { text: 'Куртка', isCorrect: false, order: 3 },
                { text: 'Черевики', isCorrect: false, order: 4 },
              ],
            },
          },
          {
            text: 'Яку дистанцію слід тримати за іншими транспортними засобами?',
            type: 'SINGLE_CHOICE',
            points: 1,
            order: 2,
            explanation: 'Безпечна дистанція дозволяє вчасно зреагувати на зміну ситуації',
            answers: {
              create: [
                { text: 'Мінімальну', isCorrect: false, order: 1 },
                { text: 'Безпечну', isCorrect: true, order: 2 },
                { text: 'Будь-яку', isCorrect: false, order: 3 },
                { text: 'Максимальну', isCorrect: false, order: 4 },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('✅ Created demo test:', test.title)

  console.log('🎉 Database seeding completed!')
  console.log('\n📋 Demo accounts (all use password123):')
  console.log('Admin: admin@nebachiv.com / password123')
  console.log('Admin2: admin@test.com / password123')
  console.log('School: school@nebachiv.com / password123')
  console.log('School2: school@test.com / password123')
  console.log('Student: student@nebachiv.com / password123')
  console.log('Student2: student@test.com / password123')
  console.log('Instructor: instructor@test.com / password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })