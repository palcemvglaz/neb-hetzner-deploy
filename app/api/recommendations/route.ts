import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { recommendationService } from '@/lib/ai/recommendation-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // Optional filter by recommendation type

    // Get personalized recommendations
    const recommendations = await recommendationService.getRecommendations(
      session.user.id,
      limit
    )

    // Filter by type if specified
    const filteredRecommendations = type 
      ? recommendations.filter(rec => rec.type === type.toUpperCase())
      : recommendations

    return NextResponse.json({
      recommendations: filteredRecommendations,
      total: filteredRecommendations.length,
      hasMore: recommendations.length >= limit
    })

  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, courseId, rating } = body

    // Handle recommendation feedback
    switch (action) {
      case 'like':
        // Store positive feedback for improving recommendations
        // This could be used to train the recommendation algorithm
        console.log(`User ${session.user.id} liked recommendation for course ${courseId}`)
        break
        
      case 'dislike':
        // Store negative feedback
        console.log(`User ${session.user.id} disliked recommendation for course ${courseId}`)
        break
        
      case 'rate':
        // Store rating feedback
        console.log(`User ${session.user.id} rated recommendation for course ${courseId}: ${rating}`)
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error processing recommendation feedback:', error)
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    )
  }
}