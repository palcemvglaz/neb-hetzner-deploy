import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { RiderBiographyService } from '@/lib/services/riderBiographyService'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const {
      type,
      answers,
      profile,
      timePerQuestion,
      totalTime,
      motorcycleData
    } = body

    // Create questionnaire profile
    const questionnaireProfile = await prisma.questionnaireProfile.create({
      data: {
        userId: session.user.id,
        type,
        answers,
        profileType: profile.profile || profile.profileType || 'Unknown',
        riskScore: profile.metrics?.riskTaking || profile.riskScore,
        confidenceScore: profile.metrics?.adequacy || profile.confidenceScore,
        safetyScore: profile.metrics?.safetyIndex || profile.safetyScore,
        skillsScore: profile.metrics?.technicalSkills || profile.skillsScore,
        knowledgeScore: profile.knowledgeScore,
        psychologyScore: profile.psychologyScore,
        riskAwareness: profile.riskAwareness,
        overallLevel: profile.overallLevel,
        riskProfile: profile.riskProfile,
        redFlags: profile.redFlags || null,
        recommendations: profile.recommendations || null,
        completionTime: totalTime,
        timePerQuestion: timePerQuestion || null,
        motorcycleId: motorcycleData?.id || null
      }
    })

    // Update user's rider profile if this is their first questionnaire
    const existingProfiles = await prisma.questionnaireProfile.count({
      where: {
        userId: session.user.id
      }
    })

    if (existingProfiles === 1) {
      // This was their first questionnaire, update user profile
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          riderProfile: profile.profile || profile.profileType,
          riderProfileData: profile
        }
      })
    }

    // Generate timeline events from questionnaire
    try {
      await RiderBiographyService.generateEventsFromQuestionnaire(
        session.user.id,
        answers,
        type
      )

      // Generate skill map
      await RiderBiographyService.generateSkillMap(
        session.user.id,
        answers,
        type
      )

      // Save motorcycle info
      const motorcycle = answers.e1_6 || answers.b1_6
      if (motorcycle) {
        await RiderBiographyService.saveMotorcycle(session.user.id, motorcycle)
      }
    } catch (error) {
      console.error('Error generating rider biography:', error)
      // Continue even if biography generation fails
    }

    return NextResponse.json({
      success: true,
      profileId: questionnaireProfile.id,
      message: 'Questionnaire saved successfully'
    })
  } catch (error) {
    console.error('Error saving questionnaire:', error)
    return NextResponse.json(
      { error: 'Failed to save questionnaire' },
      { status: 500 }
    )
  }
}