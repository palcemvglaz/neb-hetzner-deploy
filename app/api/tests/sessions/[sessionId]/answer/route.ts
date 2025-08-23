import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { quizService } from '@/lib/quiz/quiz-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { questionId, answer } = body

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      )
    }

    await quizService.submitAnswer(
      params.sessionId,
      questionId,
      answer
    )

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    )
  }
}