import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { SKILLS_DATABASE } from '@/lib/skills/skillsTree'
import { generateSkillMap } from '@/lib/services/riderBiographyService'

// GET /api/profile/[userId]/skills - Get rider skills
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      include: {
        questionnaireResponses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get existing skills from database
    let riderSkills = await prisma.riderSkills.findFirst({
      where: { userId: params.userId },
      include: {
        completedEvents: true
      }
    })

    // If no skills exist, generate from questionnaire
    if (!riderSkills && user.questionnaireResponses.length > 0) {
      const response = user.questionnaireResponses[0]
      const skillMap = generateSkillMap(response.answers as any, response.type as any)
      
      // Create skills record
      riderSkills = await prisma.riderSkills.create({
        data: {
          userId: params.userId,
          skills: skillMap,
          totalDistance: 0,
          ridingMonths: 0,
          completedEvents: {
            create: []
          }
        },
        include: {
          completedEvents: true
        }
      })
    }

    // Calculate skill categories averages
    const skillCategories = {
      basic: [],
      advanced: [],
      stunt: [],
      safety: [],
      mental: []
    }

    if (riderSkills?.skills) {
      const skills = riderSkills.skills as Record<string, number>
      
      Object.entries(skills).forEach(([skillId, level]) => {
        const skill = SKILLS_DATABASE[skillId]
        if (skill) {
          skillCategories[skill.category]?.push(level)
        }
      })
    }

    const categoryAverages = Object.entries(skillCategories).reduce((acc, [category, levels]) => {
      acc[category] = levels.length > 0 
        ? Math.round(levels.reduce((sum, l) => sum + l, 0) / levels.length)
        : 0
      return acc
    }, {} as Record<string, number>)

    // Calculate overall level
    const allLevels = Object.values(skillCategories).flat()
    const overallLevel = allLevels.length > 0
      ? Math.round(allLevels.reduce((sum, l) => sum + l, 0) / allLevels.length)
      : 0

    return NextResponse.json({
      userId: params.userId,
      skills: riderSkills?.skills || {},
      completedEvents: riderSkills?.completedEvents || [],
      totalDistance: riderSkills?.totalDistance || 0,
      ridingMonths: riderSkills?.ridingMonths || 0,
      categoryAverages,
      overallLevel,
      userName: user.name,
      userEmail: user.email
    })

  } catch (error) {
    console.error('Error fetching rider skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rider skills' },
      { status: 500 }
    )
  }
}

// PUT /api/profile/[userId]/skills - Update rider skills
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only admin or the user themselves can update skills
    if (!session || (session.user.role !== 'ADMIN' && session.user.id !== params.userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { skills, completedEventIds, totalDistance, ridingMonths } = body

    // Update or create rider skills
    const riderSkills = await prisma.riderSkills.upsert({
      where: { userId: params.userId },
      update: {
        skills: skills || undefined,
        totalDistance: totalDistance || undefined,
        ridingMonths: ridingMonths || undefined
      },
      create: {
        userId: params.userId,
        skills: skills || {},
        totalDistance: totalDistance || 0,
        ridingMonths: ridingMonths || 0
      }
    })

    // Update completed events if provided
    if (completedEventIds && Array.isArray(completedEventIds)) {
      // Delete existing events
      await prisma.riderEvent.deleteMany({
        where: { riderSkillsId: riderSkills.id }
      })
      
      // Create new events
      await prisma.riderEvent.createMany({
        data: completedEventIds.map((eventId: string) => ({
          eventId,
          riderSkillsId: riderSkills.id,
          completedAt: new Date()
        }))
      })
    }

    return NextResponse.json({
      message: 'Skills updated successfully',
      riderSkills
    })

  } catch (error) {
    console.error('Error updating rider skills:', error)
    return NextResponse.json(
      { error: 'Failed to update rider skills' },
      { status: 500 }
    )
  }
}

// POST /api/profile/[userId]/skills/event - Mark event as completed
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only the user themselves or admin can mark events
    if (!session || (session.user.id !== params.userId && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { eventId, completedAt } = body

    // Get or create rider skills
    let riderSkills = await prisma.riderSkills.findFirst({
      where: { userId: params.userId }
    })

    if (!riderSkills) {
      riderSkills = await prisma.riderSkills.create({
        data: {
          userId: params.userId,
          skills: {},
          totalDistance: 0,
          ridingMonths: 0
        }
      })
    }

    // Check if event already exists
    const existingEvent = await prisma.riderEvent.findFirst({
      where: {
        riderSkillsId: riderSkills.id,
        eventId
      }
    })

    if (existingEvent) {
      return NextResponse.json({ error: 'Event already completed' }, { status: 400 })
    }

    // Add the event
    const riderEvent = await prisma.riderEvent.create({
      data: {
        eventId,
        riderSkillsId: riderSkills.id,
        completedAt: completedAt ? new Date(completedAt) : new Date()
      }
    })

    // Apply skill impact from the event
    const { MOTORCYCLE_EVENTS } = await import('@/lib/events/motorcycleEvents')
    const event = MOTORCYCLE_EVENTS[eventId]
    
    if (event?.skillImpact) {
      const currentSkills = (riderSkills.skills as Record<string, number>) || {}
      
      // Apply skill impacts
      Object.entries(event.skillImpact).forEach(([skillId, impact]) => {
        currentSkills[skillId] = Math.min(100, (currentSkills[skillId] || 0) + impact)
      })

      // Update skills in database
      await prisma.riderSkills.update({
        where: { id: riderSkills.id },
        data: { skills: currentSkills }
      })
    }

    return NextResponse.json({
      message: 'Event marked as completed',
      riderEvent,
      updatedSkills: riderSkills.skills
    })

  } catch (error) {
    console.error('Error marking event as completed:', error)
    return NextResponse.json(
      { error: 'Failed to mark event as completed' },
      { status: 500 }
    )
  }
}