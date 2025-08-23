import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { quizService } from '@/lib/quiz/quiz-service'

export async function GET(
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

    const questions = await quizService.getTestQuestions(params.sessionId)

    return NextResponse.json({
      success: true,
      questions
    })
  } catch (error) {
    console.error('Error getting questions:', error)
    return NextResponse.json(
      { error: 'Failed to get questions' },
      { status: 500 }
    )
  }
}