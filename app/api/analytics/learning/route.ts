import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d, all

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0) // All time
    }

    // Get learning analytics
    const [
      dailyActivity,
      courseProgress,
      contentByType,
      weeklyStats
    ] = await Promise.all([
      // Daily activity (last 30 days)
      prisma.userProgress.findMany({
        where: {
          userId: session.user.id,
          lastAccessedAt: { gte: startDate }
        },
        select: {
          lastAccessedAt: true,
          timeSpent: true,
          pointsEarned: true
        },
        orderBy: { lastAccessedAt: 'asc' }
      }),

      // Course progress overview
      prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: {
          course: {
            include: {
              translations: {
                where: { language: 'UA' },
                select: { title: true }
              }
            }
          }
        }
      }),

      // Content consumption by type
      // Temporary disabled due to type issues
      Promise.resolve([]),

      // Weekly learning stats
      prisma.userProgress.findMany({
        where: {
          userId: session.user.id,
          lastAccessedAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        },
        select: {
          lastAccessedAt: true,
          timeSpent: true,
          status: true
        }
      })
    ])

    // Process daily activity data
    const dailyActivityMap = new Map<string, { time: number, points: number, sessions: number }>()
    
    dailyActivity.forEach(activity => {
      const dateKey = activity.lastAccessedAt.toISOString().split('T')[0]
      const existing = dailyActivityMap.get(dateKey) || { time: 0, points: 0, sessions: 0 }
      
      dailyActivityMap.set(dateKey, {
        time: existing.time + activity.timeSpent,
        points: existing.points + activity.pointsEarned,
        sessions: existing.sessions + 1
      })
    })

    // Convert to array for chart
    const dailyData = Array.from(dailyActivityMap.entries()).map(([date, data]) => ({
      date,
      timeSpent: data.time,
      pointsEarned: data.points,
      sessions: data.sessions
    }))

    // Calculate week-over-week stats
    const thisWeekTime = weeklyStats.reduce((sum, stat) => sum + stat.timeSpent, 0)
    const completedThisWeek = weeklyStats.filter(stat => stat.status === 'COMPLETED').length

    // Get content type breakdown (disabled)
    const contentIds: string[] = []
    const contentTypes = await prisma.content.findMany({
      where: { id: { in: contentIds } },
      select: { id: true, type: true }
    })

    const typeBreakdown = {} as Record<string, { count: number, timeSpent: number }>

    // Calculate learning streaks
    const recentDays = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const activeDays = new Set(dailyActivity.map(a => a.lastAccessedAt.toISOString().split('T')[0]))
    
    let currentStreak = 0
    let maxStreak = 0
    let tempStreak = 0

    for (const day of recentDays) {
      if (activeDays.has(day)) {
        tempStreak++
        maxStreak = Math.max(maxStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    // Current streak (from today backwards)
    const today = new Date().toISOString().split('T')[0]
    for (let i = 0; i < recentDays.length; i++) {
      const day = recentDays[recentDays.length - 1 - i]
      if (activeDays.has(day)) {
        currentStreak++
      } else {
        break
      }
    }

    return NextResponse.json({
      period,
      summary: {
        totalTimeSpent: dailyActivity.reduce((sum, a) => sum + a.timeSpent, 0),
        totalPointsEarned: dailyActivity.reduce((sum, a) => sum + a.pointsEarned, 0),
        activeDays: activeDays.size,
        currentStreak,
        maxStreak,
        thisWeekTime,
        completedThisWeek
      },
      dailyActivity: dailyData,
      courseProgress: courseProgress.map(enrollment => ({
        courseName: enrollment.course.translations[0]?.title || 'Unnamed Course',
        progress: enrollment.progress,
        startedAt: enrollment.startedAt,
        completedAt: enrollment.completedAt
      })),
      contentTypeBreakdown: Object.entries(typeBreakdown).map(([type, data]) => ({
        type,
        count: data.count,
        timeSpent: data.timeSpent
      })),
      weeklyComparison: {
        thisWeek: {
          timeSpent: thisWeekTime,
          completed: completedThisWeek
        }
      }
    })

  } catch (error) {
    console.error('Error fetching learning analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}