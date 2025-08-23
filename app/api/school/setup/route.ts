import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { schoolService } from '@/lib/school/school-service'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user already has a school
    const userWithSchool = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    })

    if (userWithSchool?.schoolId) {
      return NextResponse.json(
        { error: 'User already has a school' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, slug, description, email, phone, address, website } = body

    // Validate required fields
    if (!name || !slug || !email) {
      return NextResponse.json(
        { error: 'Name, slug, and email are required' },
        { status: 400 }
      )
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    // Create school
    const school = await schoolService.createSchool({
      name,
      slug,
      description,
      email,
      phone,
      address,
      website,
      adminUserId: session.user.id
    })

    return NextResponse.json({
      school,
      message: 'School created successfully'
    })
  } catch (error) {
    console.error('School setup error:', error)
    
    if (error instanceof Error && error.message === 'School slug already exists') {
      return NextResponse.json(
        { error: 'Цей URL вже зайнятий. Спробуйте інший.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create school'
      },
      { status: 500 }
    )
  }
}