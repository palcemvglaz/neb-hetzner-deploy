import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { achievementService } from '@/lib/gamification/achievement-service'

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
    const type = searchParams.get('type') // 'user', 'available', 'stats'

    switch (type) {
      case 'stats':
        const stats = await achievementService.getAchievementStats(session.user.id)
        return NextResponse.json(stats)

      case 'available':
        const available = achievementService.getAvailableAchievements()
        return NextResponse.json(available)

      case 'user':
      default:
        const userAchievements = await achievementService.getUserAchievements(session.user.id)
        return NextResponse.json(userAchievements)
    }

  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
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

    // Only allow admins to manually trigger achievement checks
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, metadata } = body

    const newAchievements = await achievementService.checkUserAchievements(
      session.user.id,
      action,
      metadata
    )

    return NextResponse.json({
      newAchievements: newAchievements.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        points: a.points,
        rarity: a.rarity
      }))
    })

  } catch (error) {
    console.error('Error checking achievements:', error)
    return NextResponse.json(
      { error: 'Failed to check achievements' },
      { status: 500 }
    )
  }
}