import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { courseId: string }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = params
    const body = await request.json()
    const { price, isPublished } = body

    // Validate input
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      )
    }

    if (isPublished !== undefined && typeof isPublished !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid published status' },
        { status: 400 }
      )
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Update course
    const updateData: any = {}
    if (price !== undefined) updateData.price = price
    if (isPublished !== undefined) updateData.isPublished = isPublished

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData
    })

    return NextResponse.json({ 
      course: updatedCourse,
      message: 'Course updated successfully'
    })
  } catch (error) {
    console.error('Course update error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update course'
      },
      { status: 500 }
    )
  }
}