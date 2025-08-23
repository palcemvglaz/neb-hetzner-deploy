import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { answers, profileType, skillMap, timeline } = body

    // Create or update RiderSkillMap
    if (skillMap) {
      await prisma.riderSkillMap.upsert({
        where: { userId: session.user.id },
        update: {
          basicSkills: skillMap.basicSkills || {},
          advancedSkills: skillMap.advancedSkills || {},
          stuntSkills: skillMap.stuntSkills || {},
          safetySkills: skillMap.safetySkills || {},
          overallLevel: skillMap.overallLevel || 1
        },
        create: {
          userId: session.user.id,
          basicSkills: skillMap.basicSkills || {},
          advancedSkills: skillMap.advancedSkills || {},
          stuntSkills: skillMap.stuntSkills || {},
          safetySkills: skillMap.safetySkills || {},
          overallLevel: skillMap.overallLevel || 1
        }
      })
    }

    // Create timeline events
    if (timeline && timeline.length > 0) {
      await prisma.riderTimelineEvent.createMany({
        data: timeline.map((event: any) => ({
          userId: session.user.id,
          eventType: event.type,
          title: event.title,
          description: event.description,
          metadata: event.metadata || {},
          eventDate: new Date(event.date || Date.now())
        }))
      })
    }

    // Store questionnaire answers (in metadata for now)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        metadata: {
          ...((await prisma.user.findUnique({ where: { id: session.user.id } }))?.metadata as any || {}),
          questionnaireProfile: {
            profileType,
            completedAt: new Date().toISOString(),
            answers
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      profileType,
      message: 'Questionnaire saved successfully'
    })

  } catch (error) {
    console.error('Questionnaire save error:', error)
    return NextResponse.json(
      { error: 'Failed to save questionnaire' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        riderSkillMap: true,
        riderTimelineEvents: {
          orderBy: { eventDate: 'desc' },
          take: 10
        }
      }
    })

    const profile = (user?.metadata as any)?.questionnaireProfile || null

    return NextResponse.json({
      profile,
      skillMap: user?.riderSkillMap,
      timeline: user?.riderTimelineEvents || []
    })

  } catch (error) {
    console.error('Questionnaire fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire data' },
      { status: 500 }
    )
  }
}