import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    // Get user with timeline events and motorcycles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        riderProfile: true,
        riderProfileData: true,
        riderTimeline: {
          orderBy: { eventDate: 'desc' }
        },
        motorcycles: {
          orderBy: { purchaseDate: 'desc' }
        },
        riderSkillMap: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        riderProfile: user.riderProfile
      },
      events: user.riderTimeline || [],
      motorcycles: user.motorcycles || [],
      skillMap: user.riderSkillMap,
      questionnaireProfile: user.riderProfileData
    })

  } catch (error) {
    console.error('Timeline API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    )
  }
}