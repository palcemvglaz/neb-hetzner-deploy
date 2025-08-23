import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN' && user?.role !== 'SCHOOL_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get statistics
    const [
      totalProfiles,
      profilesByType,
      riskDistribution,
      averageScores,
      recentProfiles,
      motorcycleStats
    ] = await Promise.all([
      // Total profiles count
      prisma.questionnaireProfile.count(),

      // Profiles by type
      prisma.questionnaireProfile.groupBy({
        by: ['profileType'],
        _count: true
      }),

      // Risk distribution
      prisma.questionnaireProfile.groupBy({
        by: ['riskProfile'],
        _count: true
      }),

      // Average scores
      prisma.questionnaireProfile.aggregate({
        _avg: {
          riskScore: true,
          confidenceScore: true,
          safetyScore: true,
          skillsScore: true,
          knowledgeScore: true,
          psychologyScore: true,
          riskAwareness: true,
          completionTime: true
        }
      }),

      // Recent profiles with user info
      prisma.questionnaireProfile.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),

      // Motorcycle preferences (extract from metadata)
      prisma.testResult.findMany({
        where: {
          test: {
            testType: 'QUESTIONNAIRE'
          },
          metadata: {
            not: null
          }
        },
        select: {
          metadata: true
        }
      })
    ])

    // Process motorcycle statistics
    const motorcycleBrands: Record<string, number> = {}
    const motorcycleTypes: Record<string, number> = {}
    
    motorcycleStats.forEach(result => {
      if (result.metadata) {
        try {
          const data = JSON.parse(result.metadata as string)
          if (data.motorcycleData) {
            const brand = data.motorcycleData.brand
            const type = data.motorcycleData.type || 'unknown'
            
            motorcycleBrands[brand] = (motorcycleBrands[brand] || 0) + 1
            motorcycleTypes[type] = (motorcycleTypes[type] || 0) + 1
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    })

    // Get red flags statistics
    const profilesWithRedFlags = await prisma.questionnaireProfile.count({
      where: {
        redFlags: {
          not: null
        }
      }
    })

    // Format response
    const stats = {
      summary: {
        totalProfiles,
        profilesWithRedFlags,
        averageCompletionTime: Math.round(averageScores._avg.completionTime || 0),
        conversionRate: totalProfiles > 0 ? 100 : 0 // TODO: Calculate from actual registrations
      },
      profileDistribution: profilesByType.map(p => ({
        type: p.profileType,
        count: p._count,
        percentage: Math.round((p._count / totalProfiles) * 100)
      })),
      riskDistribution: riskDistribution.map(r => ({
        level: r.riskProfile,
        count: r._count,
        percentage: Math.round((r._count / totalProfiles) * 100)
      })),
      averageScores: {
        risk: Math.round(averageScores._avg.riskScore || 0),
        confidence: Math.round(averageScores._avg.confidenceScore || 0),
        safety: Math.round(averageScores._avg.safetyScore || 0),
        skills: Math.round(averageScores._avg.skillsScore || 0),
        knowledge: Math.round(averageScores._avg.knowledgeScore || 0),
        psychology: Math.round(averageScores._avg.psychologyScore || 0),
        riskAwareness: Math.round(averageScores._avg.riskAwareness || 0)
      },
      motorcyclePreferences: {
        topBrands: Object.entries(motorcycleBrands)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([brand, count]) => ({ brand, count })),
        types: Object.entries(motorcycleTypes)
          .map(([type, count]) => ({ type, count }))
      },
      recentProfiles: recentProfiles.map(p => ({
        id: p.id,
        userName: p.user.name,
        userEmail: p.user.email,
        profileType: p.profileType,
        riskProfile: p.riskProfile,
        overallLevel: p.overallLevel,
        completionTime: p.completionTime,
        createdAt: p.createdAt
      }))
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching questionnaire stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}