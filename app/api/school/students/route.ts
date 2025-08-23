import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { schoolService } from '@/lib/school/school-service'
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all'

    const result = await schoolService.getSchoolStudents(userWithSchool.schoolId, page, limit)

    // Apply search filter if provided
    let filteredStudents = result.students
    if (search) {
      const searchLower = search.toLowerCase()
      filteredStudents = result.students.filter(student =>
        student.name?.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply activity filter
    if (filter === 'active') {
      filteredStudents = filteredStudents.filter(student => {
        if (!student.lastLoginAt) return false
        const daysSinceLogin = Math.floor((Date.now() - new Date(student.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceLogin <= 30
      })
    } else if (filter === 'inactive') {
      filteredStudents = filteredStudents.filter(student => {
        if (!student.lastLoginAt) return true
        const daysSinceLogin = Math.floor((Date.now() - new Date(student.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceLogin > 30
      })
    }

    return NextResponse.json({
      students: filteredStudents,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('School students fetch error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch students'
      },
      { status: 500 }
    )
  }
}