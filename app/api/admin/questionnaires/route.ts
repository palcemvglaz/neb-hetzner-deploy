import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')
    const profileType = searchParams.get('profileType')
    const riskProfile = searchParams.get('riskProfile')

    // Build where clause
    const where: any = {}
    if (type) where.type = type
    if (profileType) where.profileType = profileType
    if (riskProfile) where.riskProfile = riskProfile

    // Get total count
    const total = await prisma.questionnaireProfile.count({ where })

    // Get profiles with user data
    const profiles = await prisma.questionnaireProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            school: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    // Transform data for the frontend
    const transformedProfiles = profiles.map(profile => ({
      id: profile.id,
      userId: profile.user.id,
      userName: profile.user.name,
      userEmail: profile.user.email,
      schoolName: profile.user.school?.name,
      profileType: profile.profileType,
      type: profile.type,
      age: profile.answers?.age || profile.answers?.e1_age || profile.answers?.b1_age || 'N/A',
      profession: profile.answers?.profession || profile.answers?.e1_profession || profile.answers?.b1_profession || 'N/A',
      motorcycle: profile.answers?.motorcycle || profile.answers?.e1_6 || profile.answers?.b1_6 || 'N/A',
      ridingSeasons: profile.answers?.seasons || profile.answers?.e1_2 || profile.answers?.b1_2 || 'N/A',
      riskScore: profile.riskScore || 0,
      confidenceScore: profile.confidenceScore || 0,
      safetyScore: profile.safetyScore || 0,
      skillsScore: profile.skillsScore || 0,
      knowledgeScore: profile.knowledgeScore || 0,
      psychologyScore: profile.psychologyScore || 0,
      riskAwareness: profile.riskAwareness || 0,
      overallLevel: profile.overallLevel || 'Unknown',
      riskProfile: profile.riskProfile || 'unknown',
      redFlags: profile.redFlags || [],
      recommendations: profile.recommendations || [],
      completionTime: profile.completionTime || 0,
      createdAt: profile.createdAt.toISOString(),
      answers: profile.answers
    }))

    return NextResponse.json({
      profiles: transformedProfiles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching questionnaire profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire profiles' },
      { status: 500 }
    )
  }
}