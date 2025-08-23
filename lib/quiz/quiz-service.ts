import { prisma } from '@/lib/prisma'
import { Test, Question, TestSession, TestAnswer, Prisma } from '@prisma/client'

export interface QuizQuestion {
  id: string
  question: string
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'TEXT'
  options?: string[]
  correctAnswer: number | number[] | boolean | string
  explanation?: string
  points: number
}

export interface TestResult {
  sessionId: string
  score: number
  totalScore: number
  percentage: number
  passed: boolean
  timeSpent: number
  answers: {
    questionId: string
    isCorrect: boolean
    userAnswer: any
    correctAnswer: any
    explanation?: string
  }[]
}

export class QuizService {
  /**
   * Create test questions based on course content
   */
  async generateTestForCourse(courseId: string): Promise<Test> {
    // Check if test already exists
    const existingTest = await prisma.test.findFirst({
      where: { courseId }
    })

    if (existingTest) {
      return existingTest
    }

    // Get course with sections
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: true
          }
        }
      }
    })

    if (!course) {
      throw new Error('Course not found')
    }

    // Create test
    const test = await prisma.test.create({
      data: {
        courseId,
        title: `Тест: ${course.title}`,
        description: `Перевірка знань по курсу "${course.title}"`,
        timeLimit: 30, // 30 minutes
        passingScore: 80, // 80%
        maxAttempts: 3,
        status: 'PUBLISHED'
      }
    })

    // Generate questions based on course sections
    const questions: Prisma.QuestionCreateManyInput[] = []
    let order = 1

    // Module 1: 8 концептів безпеки
    questions.push(
      {
        testId: test.id,
        type: 'SINGLE_CHOICE',
        question: 'Що таке "блокери" в контексті безпеки мотоцикліста?',
        options: [
          'Перешкоди, які заважають руху мотоцикла',
          'Об\'єкти, які обмежують видимість і приховують небезпеку',
          'Захисні елементи екіпірування',
          'Дорожні знаки та розмітка'
        ],
        correctAnswer: 1,
        explanation: 'Блокери - це об\'єкти (автомобілі, будівлі, рослинність), які обмежують вашу видимість та можуть приховувати потенційну небезпеку.',
        points: 10,
        order: order++
      },
      {
        testId: test.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Які основні принципи концепції "Responsibility" (Відповідальність)?',
        options: [
          'Покладатися тільки на себе в питаннях безпеки',
          'Передбачати помилки інших учасників руху',
          'Дотримуватися ПДР за будь-яких умов',
          'Компенсувати недоліки інфраструктури своїми діями'
        ],
        correctAnswer: [0, 1, 3],
        explanation: 'Концепція відповідальності включає: покладання тільки на себе, передбачення помилок інших та компенсацію недоліків дорожньої інфраструктури.',
        points: 15,
        order: order++
      },
      {
        testId: test.id,
        type: 'TRUE_FALSE',
        question: 'Концепція "Concentration" означає, що мотоцикліст повинен постійно контролювати периферійний зір.',
        options: ['Так', 'Ні'],
        correctAnswer: true,
        explanation: 'Концентрація включає не тільки фокус на дорозі попереду, але й постійний контроль периферійного зору для виявлення потенційних загроз.',
        points: 5,
        order: order++
      }
    )

    // Module 2: Критичні навички
    questions.push(
      {
        testId: test.id,
        type: 'SINGLE_CHOICE',
        question: 'Яка максимально безпечна відстань гальмування при екстреному гальмуванні?',
        options: [
          'Та, яку визначає виробник мотоцикла',
          'Залежить від швидкості та стану дороги',
          'Не більше 10 метрів',
          'Завжди однакова для всіх мотоциклів'
        ],
        correctAnswer: 1,
        explanation: 'Безпечна відстань гальмування залежить від багатьох факторів: швидкості, стану дороги, погодних умов, технічного стану мотоцикла.',
        points: 10,
        order: order++
      },
      {
        testId: test.id,
        type: 'SINGLE_CHOICE',
        question: 'Що є ключовим фактором для підтримки балансу на малих швидкостях?',
        options: [
          'Сила рук',
          'Положення тіла',
          'Робота газом та зчепленням',
          'Гальмування заднім гальмом'
        ],
        correctAnswer: 2,
        explanation: 'На малих швидкостях баланс підтримується переважно за рахунок правильної роботи газом та зчепленням, створюючи необхідну тягу.',
        points: 10,
        order: order++
      }
    )

    // Module 3: Перші кроки новачка
    questions.push(
      {
        testId: test.id,
        type: 'SINGLE_CHOICE',
        question: 'Який найважливіший критерій при виборі першого шолома?',
        options: [
          'Дизайн та колір',
          'Вага шолома',
          'Сертифікація безпеки та правильна посадка',
          'Ціна'
        ],
        correctAnswer: 2,
        explanation: 'Найважливіше - це сертифікація безпеки (ECE, DOT, Snell) та правильна посадка шолома на голові.',
        points: 10,
        order: order++
      },
      {
        testId: test.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Які типові помилки роблять початківці мотоциклісти?',
        options: [
          'Дивляться тільки перед колесом',
          'Різко працюють газом',
          'Ігнорують периферійний зір',
          'Занадто повільно їздять'
        ],
        correctAnswer: [0, 1, 2],
        explanation: 'Початківці часто фокусуються на близькій відстані, різко працюють органами керування та не використовують периферійний зір.',
        points: 15,
        order: order++
      }
    )

    // Create all questions
    await prisma.question.createMany({
      data: questions
    })

    return test
  }

  /**
   * Start a test session for a user
   */
  async startTestSession(testId: string, userId: string): Promise<TestSession> {
    // Check if test exists
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!test) {
      throw new Error('Test not found')
    }

    // Check previous attempts
    const previousAttempts = await prisma.testSession.count({
      where: {
        testId,
        userId,
        status: 'COMPLETED'
      }
    })

    if (test.maxAttempts && previousAttempts >= test.maxAttempts) {
      throw new Error('Maximum attempts reached')
    }

    // Check if there's an active session
    const activeSession = await prisma.testSession.findFirst({
      where: {
        testId,
        userId,
        status: 'IN_PROGRESS'
      }
    })

    if (activeSession) {
      return activeSession
    }

    // Create new session
    const session = await prisma.testSession.create({
      data: {
        testId,
        userId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        attemptNumber: previousAttempts + 1
      }
    })

    return session
  }

  /**
   * Get test questions for a session
   */
  async getTestQuestions(sessionId: string): Promise<QuizQuestion[]> {
    const session = await prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        test: {
          include: {
            questions: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })

    if (!session) {
      throw new Error('Session not found')
    }

    // Return questions without correct answers
    return session.test.questions.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type as QuizQuestion['type'],
      options: q.options as string[] | undefined,
      correctAnswer: null as any, // Don't send correct answer to client
      points: q.points
    }))
  }

  /**
   * Submit answer for a question
   */
  async submitAnswer(
    sessionId: string,
    questionId: string,
    answer: any
  ): Promise<void> {
    // Verify session is active
    const session = await prisma.testSession.findUnique({
      where: { id: sessionId }
    })

    if (!session || session.status !== 'IN_PROGRESS') {
      throw new Error('Invalid session')
    }

    // Check if answer already exists
    const existingAnswer = await prisma.testAnswer.findUnique({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId
        }
      }
    })

    if (existingAnswer) {
      // Update existing answer
      await prisma.testAnswer.update({
        where: {
          sessionId_questionId: {
            sessionId,
            questionId
          }
        },
        data: {
          userAnswer: answer,
          answeredAt: new Date()
        }
      })
    } else {
      // Create new answer
      await prisma.testAnswer.create({
        data: {
          sessionId,
          questionId,
          userAnswer: answer,
          answeredAt: new Date()
        }
      })
    }
  }

  /**
   * Complete test session and calculate results
   */
  async completeTestSession(sessionId: string): Promise<TestResult> {
    const session = await prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        test: {
          include: {
            questions: true
          }
        },
        answers: {
          include: {
            question: true
          }
        }
      }
    })

    if (!session || session.status !== 'IN_PROGRESS') {
      throw new Error('Invalid session')
    }

    // Calculate results
    let totalScore = 0
    let earnedScore = 0
    const answerResults = []

    for (const question of session.test.questions) {
      const userAnswer = session.answers.find(a => a.questionId === question.id)
      const isCorrect = this.checkAnswer(
        question,
        userAnswer?.userAnswer
      )

      totalScore += question.points

      if (isCorrect) {
        earnedScore += question.points
      }

      answerResults.push({
        questionId: question.id,
        isCorrect,
        userAnswer: userAnswer?.userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      })
    }

    const percentage = Math.round((earnedScore / totalScore) * 100)
    const passed = percentage >= (session.test.passingScore || 80)
    const timeSpent = Math.round(
      (new Date().getTime() - session.startedAt.getTime()) / 1000
    )

    // Update session
    await prisma.testSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        score: earnedScore,
        totalScore,
        percentage,
        passed,
        timeSpent
      }
    })

    // Update test results in enrollment if passed
    if (passed && session.test.courseId) {
      await prisma.enrollment.updateMany({
        where: {
          userId: session.userId,
          courseId: session.test.courseId
        },
        data: {
          testScore: percentage,
          testCompletedAt: new Date()
        }
      })
    }

    return {
      sessionId,
      score: earnedScore,
      totalScore,
      percentage,
      passed,
      timeSpent,
      answers: answerResults
    }
  }

  /**
   * Check if answer is correct
   */
  private checkAnswer(question: any, userAnswer: any): boolean {
    if (!userAnswer) return false

    switch (question.type) {
      case 'SINGLE_CHOICE':
        return userAnswer === question.correctAnswer

      case 'MULTIPLE_CHOICE':
        if (!Array.isArray(userAnswer)) return false
        const correct = question.correctAnswer as number[]
        return (
          userAnswer.length === correct.length &&
          userAnswer.every((a: number) => correct.includes(a))
        )

      case 'TRUE_FALSE':
        return userAnswer === question.correctAnswer

      case 'TEXT':
        // Simple text comparison (could be improved)
        return userAnswer.toLowerCase().trim() === 
               question.correctAnswer.toLowerCase().trim()

      default:
        return false
    }
  }

  /**
   * Get user's test history
   */
  async getUserTestHistory(userId: string, courseId?: string) {
    const where: Prisma.TestSessionWhereInput = {
      userId,
      status: 'COMPLETED'
    }

    if (courseId) {
      where.test = { courseId }
    }

    const sessions = await prisma.testSession.findMany({
      where,
      include: {
        test: {
          include: {
            course: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })

    return sessions
  }
}

export const quizService = new QuizService()