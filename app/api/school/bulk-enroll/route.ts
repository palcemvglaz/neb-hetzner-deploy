import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { schoolService } from '@/lib/school/school-service'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SCHOOL_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's school information
    const userWithSchool = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { school: true }
    })

    if (!userWithSchool?.schoolId) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { courseId, studentIds } = body

    // Validate input
    if (!courseId || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { error: 'Course ID and student IDs are required' },
        { status: 400 }
      )
    }

    const result = await schoolService.bulkEnrollStudents(
      courseId,
      studentIds,
      userWithSchool.schoolId
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Bulk enroll error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to enroll students'
      },
      { status: 500 }
    )
  }
}