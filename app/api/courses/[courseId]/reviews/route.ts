import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000)
})

// GET /api/courses/[courseId]/reviews
export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const reviews = await prisma.courseReview.findMany({
      where: { courseId: params.courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0

    return NextResponse.json({
      reviews: reviews.map(review => ({
        id: review.id,
        userId: review.user.id,
        userName: review.user.name || 'Користувач',
        userImage: review.user.image,
        rating: review.rating,
        comment: review.comment || '',
        createdAt: review.createdAt,
        helpful: 0, // TODO: implement helpful votes
      })),
      averageRating,
      totalReviews: reviews.length
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/courses/[courseId]/reviews
export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    // Check if user has already reviewed this course
    const existingReview = await prisma.courseReview.findUnique({
      where: {
        courseId_userId: {
          courseId: params.courseId,
          userId: session.user.id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this course' },
        { status: 400 }
      )
    }

    // Check if user has completed the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: params.courseId
        }
      }
    })

    if (!enrollment || enrollment.progress < 100) {
      return NextResponse.json(
        { error: 'You must complete the course to leave a review' },
        { status: 403 }
      )
    }

    // Create review
    const review = await prisma.courseReview.create({
      data: {
        courseId: params.courseId,
        userId: session.user.id,
        rating: validatedData.rating,
        comment: validatedData.comment
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      id: review.id,
      userId: review.user.id,
      userName: review.user.name || 'Користувач',
      userImage: review.user.image,
      rating: review.rating,
      comment: review.comment || '',
      createdAt: review.createdAt,
      helpful: 0
    })
  } catch (error) {
    console.error('Error creating review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

// PUT /api/courses/[courseId]/reviews
export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    // Update review
    const review = await prisma.courseReview.update({
      where: {
        courseId_userId: {
          courseId: params.courseId,
          userId: session.user.id
        }
      },
      data: {
        rating: validatedData.rating,
        comment: validatedData.comment,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      review
    })
  } catch (error) {
    console.error('Error updating review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid review data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[courseId]/reviews
export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.courseReview.delete({
      where: {
        courseId_userId: {
          courseId: params.courseId,
          userId: session.user.id
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}