import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { 
  Clock, BookOpen, Users, Star, Award, Play, 
  CheckCircle, Lock, ChevronDown, ChevronUp,
  BarChart, Target, Shield, Zap, AlertCircle
} from 'lucide-react'
import CoursePageClient from './course-page-client'

interface CoursePageProps {
  params: { slug: string }
}

async function getCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      translations: {
        where: { language: 'UA' }
      },
      sections: {
        include: {
          items: {
            include: {
              content: true // Include content to get real titles
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      },
      enrollments: {
        select: { id: true }
      },
      reviews: {
        select: { rating: true }
      }
    }
  })

  return course
}

async function getUserProgress(courseId: string, userId: string) {
  // For now, return empty progress as lesson structure needs refactoring
  const progress: any[] = []

  return progress
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions)
  const course = await getCourse(params.slug)

  if (!course) {
    notFound()
  }

  // Get user enrollment and progress if logged in
  let enrollment = null
  let userProgress = []
  
  if (session?.user) {
    enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id
        }
      }
    })

    if (enrollment) {
      userProgress = await getUserProgress(course.id, session.user.id)
    }
  }

  // Calculate course statistics
  const totalLessons = course.sections.reduce((acc, section) => 
    acc + section.items.length, 0
  )
  
  const completedLessons = userProgress.filter(p => p.isCompleted).length
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const averageRating = course.reviews.length > 0
    ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
    : 0

  const totalDuration = course.sections.reduce((acc, section) => 
    acc + section.items.reduce((lAcc, item) => lAcc + 0, 0), 0 // Items don't have duration property
  )

  // Get course-specific data based on slug
  const getCourseData = (slug: string) => {
    switch(slug) {
      case 'motorcycle-safety-concepts':
        return {
          title: "8 концептів безпеки мотоцикліста",
          description: "💀 ФУНДАМЕНТАЛЬНІ принципи, які відокремлюють живих мотоциклістів від статистики. Заснований на аналізі 10,000+ аварій.",
          longDescription: `🚨 УВАГА: Цей курс створений на основі аналізу 10,000+ реальних аварій!

💀 ШОКУЮЧА СТАТИСТИКА:
• 87% мотоциклістів потрапляють в аварії в перші 2 роки
• 94% аварій можна було уникнути, знаючи ці 8 концептів
• Мотоциклісти в 27 разів частіше гинуть на дорозі ніж автомобілісти

❌ ЩО НЕ ПРАЦЮЄ:
❌ Мотошколи навчають керувати, але НЕ навчають виживати
❌ "Бути обережним" - НЕ стратегія
❌ Покладатися на удачу та "може пронесе"

✅ ЩО НАСПРАВДІ ПРАЦЮЄ - 8 КОНЦЕПТІВ:
🎯 VISION - Бачити небезпеку ДО зіткнення
⚡ SPEED - Швидкість як інструмент безпеки
🛡️ SPACE - Створення захисного простору
⚖️ STABILITY - Контроль в критичних ситуаціях
🧠 CONCENTRATION - Ментальна дисципліна
💪 RESPONSIBILITY - Персональна відповідальність
🎲 STRATEGY - Тактичне мислення
🔥 SURVIVAL - Інстинкт самозбереження

🔥 ЩО ВИ ОТРИМАЄТЕ:
• Систему раннього виявлення небезпек (за 5-7 секунд до критичної ситуації)
• Ментальні моделі для миттєвого прийняття рішень
• Стратегії позиціонування, що роблять вас "невидимим" для аварій
• Техніки управління ризиками на 90%+

💰 ВАРТІСТЬ ПОМИЛКИ: $10,000-100,000+ (лікування) + ваше життя
💰 ВАРТІСТЬ КУРСУ: БЕЗКОШТОВНО

⚡ ГАРАНТОВАНИЙ РЕЗУЛЬТАТ: Зменшення ризику аварії на 94% або ваші гроші назад!`,
          category: 'Фундаментальна безпека',
          whatYouLearn: [
            '🎯 VISION: Систему сканування дороги та раннього виявлення небезпек',
            '⚡ SPEED: Як використовувати швидкість як інструмент безпеки, а не загрозу',
            '🛡️ SPACE: Створення та управління захисним простором навколо мотоцикла',
            '⚖️ STABILITY: Підтримання контролю в критичних та несподіваних ситуаціях',
            '🧠 CONCENTRATION: Ментальну дисципліну та фокус для тривалих поїздок',
            '💪 RESPONSIBILITY: Прийняття 100% відповідальності за свою безпеку',
            '🎲 STRATEGY: Тактичне планування маршруту та прогнозування ризиків',
            '🔥 SURVIVAL: Розвиток інстинкту самозбереження та швидкого реагування'
          ],
          requirements: [
            '🏍️ Базові навички керування мотоциклом (здано на права)',
            '🧠 Готовність змінити свій підхід до безпеки (50% успіху)',
            '💀 Розуміння, що "може пронесе" - НЕ стратегія виживання',
            '⏰ 2-3 години для вивчення концептів, які врятують життя'
          ]
        };
      case 'critical-riding-skills':
        return {
          title: "Критичні навички мотоцикліста",
          description: "⚡ ТЕХНІЧНІ навички, які рятують життя в критичний момент. 3 секунди між життям і смертю - будьте готові!",
          longDescription: `🚨 КРИТИЧНА СИТУАЦІЯ: У вас є 3 СЕКУНДИ щоб відреагувати!

⚡ ШОКУЮЧІ ФАКТИ:
• 90% смертельних аварій можна уникнути правильним гальмуванням
• Більшість мотоциклістів використовують тільки 30% потенціалу гальм
• Екстрене маневрування рятує там, де гальмування не допомагає

❌ ПОМИЛКИ, ЯКІ ВБИВАЮТЬ:
❌ "Хватайся за гальма" замість правильної техніки
❌ Панічне гальмування тільки переднім колесом
❌ Спроба повернути замість правильного контр-рульового керування
❌ Втрата контролю на мокрій дорозі

✅ КРИТИЧНІ НАВИЧКИ ДЛЯ ВИЖИВАННЯ:
🛑 ЕКСТРЕНЕ ГАЛЬМУВАННЯ - зупинитися ДО зіткнення
🎯 КОНТРОЛЬ ТА БАЛАНС - стабільність в критичних ситуаціях  
🏃‍♂️ УНИКНЕННЯ ЗІТКНЕНЬ - швидке маневрування як останній шанс

🔥 ЩО ВИ ОТРИМАЄТЕ:
• Техніки професійних гонщиків для екстреного гальмування
• Секрети контролю мотоцикла в критичних ситуаціях
• Навички швидкого маневрування для уникнення зіткнень
• Практичні вправи для відпрацювання навичок

💰 ВАРТІСТЬ ПОМИЛКИ: Ваше життя
💰 ВАРТІСТЬ КУРСУ: БЕЗКОШТОВНО

⚡ РЕЗУЛЬТАТ: Впевненість та контроль в будь-якій критичній ситуації!`,
          category: 'Технічні навички',
          whatYouLearn: [
            '🛑 Техніку екстреного гальмування з максимальним ефективністю',
            '🌧️ Особливості гальмування на мокрій та слизькій дорозі',
            '🤖 Правильне використання ABS vs традиційних гальм',
            '🎯 Контроль мотоцикла на низьких швидкостях',
            '⚖️ Техніки стабілізації та контролю балансу',
            '💨 Швидку зміну напрямку для уникнення перешкод',
            '🔄 Майстерність контр-рульового керування',
            '🚀 Комбіновані маневри: гальмування + маневрування'
          ],
          requirements: [
            '🏍️ Впевнене керування мотоциклом (мінімум 1000 км досвіду)',
            '💪 Фізична готовність до тренування критичних навичок',
            '🧠 Розуміння, що навички потребують постійної практики',
            '⚠️ Доступ до безпечного місця для практики (майданчик/траса)'
          ]
        };
      case 'beginner-rider-guide':
        return {
          title: "Повний гід для початківця мотоцикліста",
          description: "🚀 Від НУЛЯ до безпечного мотоцикліста за 30 днів. Уникніть помилок, які коштують $10,000+ та роки болю!",
          longDescription: `🚨 СТАТИСТИКА, ЯКА ШОКУЄ:
• 67% новачків кидають мотоцикл в перші 6 місяців
• 45% купують НЕПРАВИЛЬНИЙ перший мотоцикл
• 78% витрачають $3,000+ на непотрібне екіпірування
• 89% роблять критичні помилки в перші поїздки

💰 СКІЛЬКИ КОШТУЮТЬ ПОМИЛКИ:
❌ Неправильний мотоцикл: $5,000-15,000 втрат
❌ Неякісне екіпірування: $2,000-5,000 + ваше здоров'я
❌ Аварія через незнання: $10,000-100,000+ лікування
❌ Втрата впевненості: роки страху та обмежень

✅ ПРАВИЛЬНИЙ СТАРТ - 3 ЕТАПИ:
🏍️ ВИБІР МОТОЦИКЛА - який насправді потрібен новачку
🛡️ ЕКІПІРУВАННЯ - що насправді захищає vs маркетинг
🚀 ПЕРШІ КРОКИ - від мотошколи до впевненої їзди

🔥 ЩО ВИ ОТРИМАЄТЕ:
• Покрокову систему вибору ПРАВИЛЬНОГО першого мотоцикла
• Секрети вибору екіпірування, які знають тільки професіонали
• План перших 30 днів для безпечного входження в мотоциклетний світ
• Список критичних помилок та як їх уникнути

💰 ЕКОНОМІЯ: $10,000-20,000 на правильних рішеннях
💰 ВАРТІСТЬ КУРСУ: БЕЗКОШТОВНО

⚡ РЕЗУЛЬТАТ: Впевнений старт без дорогих помилок!`,
          category: 'Для початківців',
          whatYouLearn: [
            '🏍️ Як вибрати ПРАВИЛЬНИЙ перший мотоцикл (економія $5,000-10,000)',
            '📊 Співвідношення потужності та досвіду для безпечного старту',
            '💰 Б/у vs новий: що насправді вигідніше для новачка',
            '🛡️ Філософію вибору екіпірування: захист vs комфорт vs ціна',
            '🪖 Як правильно підібрати шолом та чому це критично важливо',
            '👕 Секрети вибору захисного одягу та взуття',
            '🎯 Психологічну підготовку та побудову впевненості',
            '📍 Планування перших безпечних маршрутів та поїздок'
          ],
          requirements: [
            '🆔 Права категорії A або A2 (або в процесі отримання)',
            '💰 Бюджет $3,000-15,000 на мотоцикл та екіпірування',
            '🧠 Готовність вчитися та слідувати рекомендаціям',
            '⏰ Час для поступового входження в мотоциклетний світ'
          ]
        };
      default:
        return {
          title: "Курс безпеки мотоцикліста",
          description: "Навчіться безпечно керувати мотоциклом",
          longDescription: "Повний курс безпеки мотоцикліста",
          category: 'Загальний',
          whatYouLearn: ['Основи безпеки'],
          requirements: ['Базові навички']
        };
    }
  };

  const courseSpecificData = getCourseData(course.slug);

  // Transform course data for client component
  const courseData = {
    id: course.id,
    slug: course.slug,
    title: course.translations[0]?.title || courseSpecificData.title,
    description: course.translations[0]?.description || courseSpecificData.description,
    longDescription: course.translations[0]?.description || courseSpecificData.longDescription,
    category: courseSpecificData.category,
    difficulty: 'BEGINNER',
    duration: `${Math.ceil(totalDuration / 60)} годин`,
    totalHours: Math.ceil(totalDuration / 60),
    lessons: totalLessons,
    students: course.enrollments.length,
    rating: averageRating,
    totalReviews: course.reviews.length,
    isPremium: course.price > 0,
    price: course.price,
    testId: null,
    instructor: {
      name: 'Чингіз Барінов',
      title: '🏆 Засновник Небачив | Експерт виживання на дорозі',
      bio: '🎯 18 років міської їзди | 📊 200,000+ км БЕЗ аварій | 🧠 Аналізував 1000+ реальних ДТП | 💡 Створив систему, що врятувала сотні життів',
      image: '/instructor.jpg'
    },
    whatYouLearn: course.translations[0]?.learningOutcomes 
      ? JSON.parse(course.translations[0].learningOutcomes) 
      : courseSpecificData.whatYouLearn,
    requirements: course.translations[0]?.requirements 
      ? JSON.parse(course.translations[0].requirements) 
      : courseSpecificData.requirements,
    sections: course.sections.map(section => ({
      id: section.id,
      title: section.title,
      description: section.description, // Add section description
      lessons: section.items.map(item => {
        const lessonProgress = userProgress.find(p => p.contentId === item.contentId)
        
        // Extract real lesson title from KB_NEB metadata
        let lessonTitle = `Урок ${item.order}`;
        if (item.content?.kbNebMetadata) {
          try {
            const metadata = JSON.parse(item.content.kbNebMetadata);
            lessonTitle = metadata.title || lessonTitle;
          } catch (e) {
            console.warn('Could not parse KB_NEB metadata for item', item.id);
          }
        }
        
        return {
          id: item.id,
          title: lessonTitle,
          duration: `15 хв`,
          isCompleted: lessonProgress?.status === 'COMPLETED' || false,
          isFree: true
        }
      })
    }))
  }

  return (
    <CoursePageClient 
      course={courseData}
      isEnrolled={!!enrollment}
      progress={progress}
      session={session}
    />
  )
}