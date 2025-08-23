import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { quizService } from '@/lib/quiz/quiz-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const testSession = await quizService.startTestSession(
      params.testId,
      session.user.id
    )

    return NextResponse.json({
      success: true,
      session: {
        id: testSession.id,
        attemptNumber: testSession.attemptNumber,
        startedAt: testSession.startedAt
      }
    })
  } catch (error) {
    console.error('Error starting test:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to start test'
      },
      { status: 400 }
    )
  }
}