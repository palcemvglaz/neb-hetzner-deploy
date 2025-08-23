import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tests = await prisma.test.findMany({
      include: {
        _count: {
          select: {
            questions: true,
            results: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics
    const testsWithStats = await Promise.all(tests.map(async (test) => {
      const results = await prisma.testResult.findMany({
        where: { testId: test.id },
        select: { score: true, passed: true }
      })

      const attempts = results.length
      const completedResults = results.filter(r => r.passed)
      const avgScore = completedResults.length > 0
        ? Math.round(completedResults.reduce((sum, r) => sum + r.score, 0) / completedResults.length)
        : 0
      const completionRate = attempts > 0
        ? Math.round((completedResults.length / attempts) * 100)
        : 0

      return {
        id: test.id,
        title: test.title,
        description: test.description || '',
        category: 'principles',
        difficulty: 'medium',
        questionsCount: test._count.questions,
        passingScore: test.passingScore,
        timeLimit: test.timeLimit,
        status: 'published',
        attempts,
        avgScore,
        completionRate,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt
      }
    }))

    return NextResponse.json(testsWithStats)
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const test = await prisma.test.create({
      data: {
        title: data.title,
        description: data.description,
        passingScore: data.passingScore || 70,
        timeLimit: data.timeLimit,
        attemptsAllowed: data.attemptsAllowed || 3,
        contentId: data.contentId || '1',
      }
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 })
  }
}