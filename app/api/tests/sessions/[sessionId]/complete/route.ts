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

    const result = await quizService.completeTestSession(params.sessionId)

    return NextResponse.json({
      success: true,
      result
    })
  } catch (error) {
    console.error('Error completing test:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to complete test'
      },
      { status: 400 }
    )
  }
}