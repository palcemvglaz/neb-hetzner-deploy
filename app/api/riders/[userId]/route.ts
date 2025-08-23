import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    // Get full user profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        riderProfile: true,
        riderProfileData: true,
        riderSkillMap: true,
        riderTimeline: {
          orderBy: { eventDate: 'desc' },
          take: 5
        },
        motorcycles: {
          where: { isCurrent: true }
        },
        enrollments: {
          include: {
            course: true
          }
        },
        certificates: {
          include: {
            course: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate statistics
    const stats = {
      totalCourses: user.enrollments.length,
      completedCourses: user.certificates.length,
      recentEvents: user.riderTimeline.length,
      skillLevel: user.riderSkillMap?.overallLevel || 0
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        riderProfile: user.riderProfile
      },
      stats,
      skillMap: user.riderSkillMap,
      recentEvents: user.riderTimeline,
      currentBike: user.motorcycles[0] || null,
      questionnaireProfile: user.riderProfileData
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}