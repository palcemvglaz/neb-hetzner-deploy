import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripeService } from '@/lib/stripe/stripe-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId, type = 'course', priceId } = body

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3205'

    if (type === 'course') {
      if (!courseId) {
        return NextResponse.json(
          { error: 'Course ID is required' },
          { status: 400 }
        )
      }

      const checkoutSession = await stripeService.createCourseCheckoutSession({
        courseId,
        userId: session.user.id,
        successUrl: `${baseUrl}/payment/success?courseId=${courseId}&sessionId={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/courses/${courseId}`
      })

      return NextResponse.json({
        url: checkoutSession.url,
        sessionId: checkoutSession.id
      })
    } else if (type === 'subscription') {
      if (!priceId) {
        return NextResponse.json(
          { error: 'Price ID is required' },
          { status: 400 }
        )
      }

      const checkoutSession = await stripeService.createSubscriptionCheckoutSession({
        userId: session.user.id,
        priceId,
        successUrl: `${baseUrl}/payment/success?type=subscription&sessionId={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/pricing`
      })

      return NextResponse.json({
        url: checkoutSession.url,
        sessionId: checkoutSession.id
      })
    }

    return NextResponse.json(
      { error: 'Invalid checkout type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create checkout session'
      },
      { status: 500 }
    )
  }
}