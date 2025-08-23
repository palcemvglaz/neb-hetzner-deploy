import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCourses() {
  console.log('🌱 Seeding courses...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        slug: 'beginner',
        icon: '🏍️',
        order: 1,
        translations: {
          create: {
            language: 'UA',
            name: 'Для початківців',
            description: 'Базові курси для тих, хто тільки починає'
          }
        }
      }
    }),
    prisma.category.create({
      data: {
        slug: 'safety',
        icon: '🛡️',
        order: 2,
        translations: {
          create: {
            language: 'UA',
            name: 'Безпека',
            description: 'Курси з безпечної їзди'
          }
        }
      }
    }),
    prisma.category.create({
      data: {
        slug: 'advanced',
        icon: '🚀',
        order: 3,
        translations: {
          create: {
            language: 'UA',
            name: 'Просунутий рівень',
            description: 'Для досвідчених мотоциклістів'
          }
        }
      }
    })
  ])

  // Get admin user to be instructor
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      slug: 'basic-motorcycle-course',
      difficulty: 'BEGINNER',
      isPremium: false,
      isPublished: true,
      price: 0,
      categoryId: categories[0].id,
      instructorId: adminUser?.id,
      translations: {
        create: {
          language: 'UA',
          title: 'Базовий курс мотоцикліста',
          description: 'Основи керування мотоциклом для початківців. Навчіться базовим навичкам безпечної їзди.',
          learningOutcomes: JSON.stringify([
            'Основи керування мотоциклом',
            'Правила дорожнього руху для мотоциклістів',
            'Базові маневри та техніки',
            'Основи технічного обслуговування'
          ]),
          requirements: JSON.stringify([
            'Бажання навчитися їздити на мотоциклі',
            'Вік від 16 років'
          ])
        }
      }
    }
  })

  const course2 = await prisma.course.create({
    data: {
      slug: 'safe-riding-techniques',
      difficulty: 'INTERMEDIATE',
      isPremium: true,
      isPublished: true,
      price: 499,
      categoryId: categories[1].id,
      instructorId: adminUser?.id,
      translations: {
        create: {
          language: 'UA',
          title: 'Техніки безпечної їзди',
          description: 'Поглиблений курс з безпеки на дорозі. Навчіться передбачати небезпечні ситуації.',
          learningOutcomes: JSON.stringify([
            'Захисне водіння',
            'Аналіз дорожньої ситуації',
            'Екстрене гальмування',
            'Маневрування в складних умовах'
          ]),
          requirements: JSON.stringify([
            'Базові навички керування мотоциклом',
            'Досвід їзди від 6 місяців'
          ])
        }
      }
    }
  })

  // Create sections and link existing content
  const contents = await prisma.content.findMany({
    where: { isPublished: true },
    take: 10
  })

  if (contents.length > 0) {
    // Section for course 1
    const section1 = await prisma.courseSection.create({
      data: {
        courseId: course1.id,
        title: 'Вступ до мотоциклізму',
        description: 'Основні поняття та підготовка',
        order: 1,
        items: {
          create: contents.slice(0, 3).map((content, index) => ({
            contentId: content.id,
            order: index + 1,
            isRequired: true
          }))
        }
      }
    })

    const section2 = await prisma.courseSection.create({
      data: {
        courseId: course1.id,
        title: 'Практичні навички',
        description: 'Вправи та техніки керування',
        order: 2,
        items: {
          create: contents.slice(3, 5).map((content, index) => ({
            contentId: content.id,
            order: index + 1,
            isRequired: true
          }))
        }
      }
    })

    // Sections for course 2
    const section3 = await prisma.courseSection.create({
      data: {
        courseId: course2.id,
        title: 'Теорія безпечної їзди',
        description: 'Принципи та правила',
        order: 1,
        items: {
          create: contents.slice(5, 7).map((content, index) => ({
            contentId: content.id,
            order: index + 1,
            isRequired: true
          }))
        }
      }
    })

    const section4 = await prisma.courseSection.create({
      data: {
        courseId: course2.id,
        title: 'Практичні сценарії',
        description: 'Розбір реальних ситуацій',
        order: 2,
        items: {
          create: contents.slice(7, 10).map((content, index) => ({
            contentId: content.id,
            order: index + 1,
            isRequired: true
          }))
        }
      }
    })
  }

  // Create sample reviews
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    take: 3
  })

  for (const user of users) {
    await prisma.courseReview.create({
      data: {
        courseId: course1.id,
        userId: user.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        comment: 'Чудовий курс для початківців! Все пояснено зрозуміло.'
      }
    })

    // Create enrollment for free course
    await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course1.id,
        progress: Math.floor(Math.random() * 100)
      }
    })
  }

  console.log('✅ Courses seeded successfully!')
}

export default seedCourses

// Run if this file is executed directly
if (require.main === module) {
  seedCourses()
    .catch((e) => {
      console.error('Error seeding courses:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}