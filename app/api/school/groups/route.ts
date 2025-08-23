import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    const groups = await prisma.schoolGroup.findMany({
      where: {
        schoolId: userWithSchool.schoolId
      },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ groups })
  } catch (error) {
    console.error('School groups fetch error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch groups'
      },
      { status: 500 }
    )
  }
}

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
    const { name, description } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      )
    }

    const group = await prisma.schoolGroup.create({
      data: {
        name: name.trim(),
        schoolId: userWithSchool.schoolId,
        startDate: new Date(),
        maxStudents: 20
      }
    })

    return NextResponse.json({ 
      group,
      message: 'Group created successfully'
    })
  } catch (error) {
    console.error('Group creation error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create group'
      },
      { status: 500 }
    )
  }
}