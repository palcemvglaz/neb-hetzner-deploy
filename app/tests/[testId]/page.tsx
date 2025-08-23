import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import TestRunner from './test-runner'

interface TestPageProps {
  params: { testId: string }
}

async function getTest(testId: string) {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      content: {
        include: {
          courseSectionItems: {
            include: {
              section: {
                include: {
                  course: {
                    include: {
                      translations: {
                        where: { language: 'UA' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      _count: {
        select: { questions: true }
      }
    }
  })

  return test
}

async function getUserTestResults(testId: string, userId: string) {
  const results = await prisma.testResult.findMany({
    where: {
      testId,
      userId
    },
    orderBy: { completedAt: 'desc' }
  })

  return results
}

export default async function TestPage({ params }: TestPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Авторизація потрібна</h1>
          <p className="text-gray-600 mb-4">Увійдіть, щоб проходити тести</p>
          <a href="/login" className="text-blue-600 hover:underline">Увійти</a>
        </div>
      </div>
    )
  }

  const test = await getTest(params.testId)

  if (!test) {
    notFound()
  }

  // Check if user is enrolled in the course
  const courseItem = test.content?.courseSectionItems?.[0]
  if (courseItem?.section?.course?.id) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseItem.section.course.id
        }
      }
    })

    if (!enrollment) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Доступ обмежено</h1>
            <p className="text-gray-600 mb-4">Запишіться на курс, щоб проходити цей тест</p>
            <a 
              href={`/courses/${courseItem.section.course.slug}`} 
              className="text-blue-600 hover:underline"
            >
              Переглянути курс
            </a>
          </div>
        </div>
      )
    }
  }

  // Get user's previous attempts
  const previousResults = await getUserTestResults(test.id, session.user.id)
  const attemptCount = previousResults.length
  const bestScore = previousResults.length > 0
    ? Math.max(...previousResults.map(r => r.score || 0))
    : null

  const testData = {
    id: test.id,
    title: test.title,
    description: test.description || '',
    timeLimit: test.timeLimit,
    questionCount: test._count.questions,
    passingScore: test.passingScore || 80,
    maxAttempts: test.attemptsAllowed || 3,
    attemptCount,
    bestScore,
    courseTitle: courseItem?.section?.course?.translations?.[0]?.title || courseItem?.section?.course?.slug,
    courseSlug: courseItem?.section?.course?.slug
  }

  return <TestRunner test={testData} userId={session.user.id} />
}