import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { quizService } from '@/lib/quiz/quiz-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const test = await quizService.generateTestForCourse(params.courseId)

    return NextResponse.json({
      success: true,
      test: {
        id: test.id,
        title: test.title,
        description: test.description
      }
    })
  } catch (error) {
    console.error('Error generating test:', error)
    return NextResponse.json(
      { error: 'Failed to generate test' },
      { status: 500 }
    )
  }
}