import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = params

    // Get user's enrollment and progress
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled' }, { status: 404 })
    }

    // Get course structure and user progress
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            items: {
              include: {
                content: {
                  select: {
                    id: true,
                    estimatedTime: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Get user progress for each content item
    const contentIds = course.sections.flatMap(section => 
      section.items.map(item => item.contentId)
    )

    const userProgress = await prisma.userProgress.findMany({
      where: {
        userId: session.user.id,
        contentId: { in: contentIds }
      }
    })

    const completedItems = userProgress.filter(p => p.status === 'COMPLETED').length
    const totalItems = contentIds.length
    const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

    // Calculate time spent and estimated time
    const timeSpent = userProgress.reduce((total, progress) => total + (progress.timeSpent || 0), 0)
    const estimatedTime = course.sections.flatMap(s => s.items).reduce((total, item) => 
      total + (item.content.estimatedTime || 0), 0
    )

    return NextResponse.json({
      enrollment: {
        id: enrollment.id,
        progress: enrollment.progress,
        startedAt: enrollment.startedAt,
        completedAt: enrollment.completedAt
      },
      stats: {
        completedItems,
        totalItems,
        progressPercentage,
        timeSpent,
        estimatedTime
      },
      sections: course.sections.map(section => ({
        id: section.id,
        title: section.title,
        items: section.items.map(item => {
          const progress = userProgress.find(p => p.contentId === item.contentId)
          return {
            id: item.id,
            contentId: item.contentId,
            order: item.order,
            isRequired: item.isRequired,
            isCompleted: progress?.status === 'COMPLETED',
            timeSpent: progress?.timeSpent || 0,
            estimatedTime: item.content.estimatedTime || 0
          }
        })
      }))
    })

  } catch (error) {
    console.error('Error fetching course progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = params
    const { contentId, isCompleted, timeSpent } = await request.json()
    const status = isCompleted ? 'COMPLETED' : 'IN_PROGRESS'

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled' }, { status: 404 })
    }

    // Update or create progress
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_contentId: {
          userId: session.user.id,
          contentId: contentId
        }
      },
      update: {
        status,
        completedAt: isCompleted ? new Date() : null,
        timeSpent: { increment: timeSpent || 0 },
        lastAccessedAt: new Date()
      },
      create: {
        userId: session.user.id,
        contentId: contentId,
        status,
        completedAt: isCompleted ? new Date() : null,
        timeSpent: timeSpent || 0,
        lastAccessedAt: new Date()
      }
    })

    // Recalculate overall course progress
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            items: true
          }
        }
      }
    })

    if (course) {
      const totalItems = course.sections.flatMap(s => s.items).length
      const completedProgress = await prisma.userProgress.count({
        where: {
          userId: session.user.id,
          contentId: { in: course.sections.flatMap(s => s.items.map(i => i.contentId)) },
          status: 'COMPLETED'
        }
      })

      const newProgress = totalItems > 0 ? Math.round((completedProgress / totalItems) * 100) : 0

      // Update enrollment progress
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progress: newProgress,
          completedAt: newProgress === 100 ? new Date() : null
        }
      })
    }

    return NextResponse.json({ success: true, progress })

  } catch (error) {
    console.error('Error updating course progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}