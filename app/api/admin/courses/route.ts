import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const courses = await prisma.course.findMany({
      include: {
        enrollments: {
          select: { id: true }
        },
        sections: {
          include: {
            items: {
              select: { id: true }
            }
          }
        },
        payments: {
          where: { status: 'COMPLETED' },
          select: { id: true }
        },
        _count: {
          select: {
            enrollments: true,
            payments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Admin courses fetch error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch courses'
      },
      { status: 500 }
    )
  }
}