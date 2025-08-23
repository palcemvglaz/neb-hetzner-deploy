import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { stripe } from '@/lib/stripe/client'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const { courseId } = await request.json()
    
    if (!courseId) {
      return NextResponse.json({
        success: false,
        error: 'Course ID is required'
      }, { status: 400 })
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        translations: {
          where: { language: 'UA' }
        }
      }
    })

    if (!course) {
      return NextResponse.json({
        success: false,
        error: 'Course not found'
      }, { status: 404 })
    }

    if (!course.isPremium || course.price === 0) {
      return NextResponse.json({
        success: false,
        error: 'This course is free'
      }, { status: 400 })
    }

    // Check if user already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
        status: 'ACTIVE'
      }
    })

    if (existingEnrollment) {
      return NextResponse.json({
        success: false,
        error: 'You are already enrolled in this course'
      }, { status: 400 })
    }

    const courseTitle = course.translations[0]?.title || course.slug
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3205'

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: session.user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'uah',
            product_data: {
              name: courseTitle,
              description: course.translations[0]?.description || 'Курс з безпечної їзди на мотоциклі',
              images: ['https://images.unsplash.com/photo-1558618666-6c7c2d72b30e?w=500'],
            },
            unit_amount: Math.round(course.price * 100), // Convert to kopecks
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/courses/${course.slug}?payment=success`,
      cancel_url: `${baseUrl}/courses/${course.slug}?payment=cancelled`,
      metadata: {
        courseId: courseId,
        userId: session.user.id,
        type: 'course_purchase'
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    })

    // Create pending payment record
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: course.price,
        currency: 'UAH',
        type: 'COURSE_PURCHASE',
        status: 'PENDING',
        provider: 'STRIPE',
        providerPaymentId: checkoutSession.id,
        metadata: JSON.stringify({
          checkout_session_id: checkoutSession.id,
          course_title: courseTitle
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        checkout_url: checkoutSession.url,
        session_id: checkoutSession.id
      }
    })

  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    }, { status: 500 })
  }
}