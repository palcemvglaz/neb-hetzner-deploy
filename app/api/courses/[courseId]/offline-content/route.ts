import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = params

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 403 }
      )
    }

    // Get course with all necessary data for offline use
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        translations: {
          where: { language: 'UA' }
        },
        sections: {
          include: {
            items: {
              include: {
                content: {
                  include: {
                    translations: {
                      where: { language: 'UA' }
                    }
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Prepare offline-friendly data structure
    const offlineData = {
      id: course.id,
      slug: course.slug,
      title: course.translations[0]?.title || 'Unnamed Course',
      description: course.translations[0]?.description || '',
      difficulty: course.difficulty,
      downloadedAt: new Date().toISOString(),
      sections: course.sections.map(section => ({
        id: section.id,
        title: section.title,
        description: section.description,
        order: section.order,
        lessons: section.items.map(item => ({
          id: item.content.id,
          title: item.content.translations[0]?.title || 'Unnamed Lesson',
          body: item.content.translations[0]?.body || '',
          type: item.content.type,
          estimatedTime: item.content.estimatedTime,
          order: item.order,
          isRequired: item.isRequired,
          // Store content in a simplified format for offline use
          offlineContent: {
            html: item.content.translations[0]?.body || '',
            text: stripHtml(item.content.translations[0]?.body || ''),
            metadata: item.content.kbNebMetadata ? JSON.parse(item.content.kbNebMetadata) : null
          }
        }))
      })),
      // Calculate total stats
      totalLessons: course.sections.reduce((total, section) => total + section.items.length, 0),
      estimatedTotalTime: course.sections.reduce((total, section) => 
        total + section.items.reduce((sectionTotal, item) => 
          sectionTotal + (item.content.estimatedTime || 0), 0
        ), 0
      ),
      // User progress
      userProgress: {
        enrollmentId: enrollment.id,
        progress: enrollment.progress,
        startedAt: enrollment.startedAt,
        completedAt: enrollment.completedAt
      }
    }

    // Add cache headers for offline storage
    const response = NextResponse.json(offlineData)
    response.headers.set('Cache-Control', 'public, max-age=86400') // 24 hours
    response.headers.set('Offline-Content', 'true')

    return response

  } catch (error) {
    console.error('Error preparing offline content:', error)
    return NextResponse.json(
      { error: 'Failed to prepare offline content' },
      { status: 500 }
    )
  }
}

// Helper function to strip HTML tags for text-only version
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace HTML spaces
    .replace(/&amp;/g, '&') // Replace HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}