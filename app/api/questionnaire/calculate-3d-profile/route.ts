import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { calculate3DProfile, getProfileDescription } from '@/lib/questionnaire/profile-calculator-3d-simple'
import { z } from 'zod'

// Validation schema for 3D profile calculation
const calculate3DSchema = z.object({
  answers: z.record(z.any())
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication (optional for profile calculation)
    const session = await getServerSession(authOptions)
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = calculate3DSchema.parse(body)
    
    // Calculate 3D profile
    const profile3D = calculate3DProfile(validatedData.answers)
    
    // Get profile description
    const profileDescription = getProfileDescription(profile3D.profileType)
    
    // Format response
    const response = {
      success: true,
      profile: {
        // Core 3D coordinates
        axes: {
          riskTaking: profile3D.riskTaking,
          technicalSkills: profile3D.technicalSkills,
          adequacy: profile3D.adequacy
        },
        
        // Derived metrics
        metrics: {
          safetyIndex: profile3D.safetyIndex,
          growthPotential: profile3D.growthPotential,
          dangerLevel: profile3D.dangerLevel
        },
        
        // Profile classification
        classification: {
          type: profile3D.profileType,
          description: profileDescription,
          characteristics: profile3D.characteristics,
          recommendations: profile3D.recommendations,
          redFlags: profile3D.redFlags
        },
        
        // Visual data for 3D rendering
        visualization: {
          position: {
            x: profile3D.riskTaking,
            y: profile3D.technicalSkills,
            z: profile3D.adequacy + 5 // Shift to 0-10 range for visualization
          },
          color: getDangerColor(profile3D.dangerLevel),
          size: Math.max(0.5, profile3D.growthPotential / 10)
        },
        
        // User info if authenticated
        user: session?.user ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email
        } : null
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error calculating 3D profile:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to calculate profile' },
      { status: 500 }
    )
  }
}

// Helper function to get color based on danger level
function getDangerColor(dangerLevel: string): string {
  switch (dangerLevel) {
    case 'CRITICAL':
      return '#ef4444' // red-500
    case 'HIGH':
      return '#f97316' // orange-500
    case 'MEDIUM':
      return '#eab308' // yellow-500
    case 'LOW':
      return '#22c55e' // green-500
    default:
      return '#6b7280' // gray-500
  }
}