import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { notificationService } from '@/lib/communication/notification-service'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export interface CheckoutSessionData {
  courseId: string
  userId: string
  successUrl: string
  cancelUrl: string
}

export interface SubscriptionData {
  userId: string
  priceId: string
  successUrl: string
  cancelUrl: string
}

export class StripeService {
  /**
   * Create a checkout session for course purchase
   */
  async createCourseCheckoutSession(data: CheckoutSessionData) {
    const course = await prisma.course.findUnique({
      where: { id: data.courseId }
    })

    if (!course) {
      throw new Error('Course not found')
    }

    if (course.price === 0) {
      throw new Error('Course is free')
    }

    // Check if user already enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: data.userId,
          courseId: data.courseId
        }
      }
    })

    if (enrollment) {
      throw new Error('Already enrolled in this course')
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: {
          userId: user.id
        }
      })

      customerId = customer.id

      // Save customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'uah',
            product_data: {
              name: course.title,
              description: course.description || undefined,
              images: course.thumbnail ? [course.thumbnail] : undefined,
              metadata: {
                courseId: course.id
              }
            },
            unit_amount: Math.round(course.price * 100) // Convert to cents
          },
          quantity: 1
        }
      ],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        userId: data.userId,
        courseId: data.courseId,
        type: 'course_purchase'
      },
      locale: 'uk'
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        amount: course.price,
        currency: 'UAH',
        status: 'PENDING',
        provider: 'STRIPE',
        metadata: {
          sessionId: session.id
        }
      }
    })

    return session
  }

  /**
   * Create a subscription checkout session
   */
  async createSubscriptionCheckoutSession(data: SubscriptionData) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: {
          userId: user.id
        }
      })

      customerId = customer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create subscription checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: data.priceId,
          quantity: 1
        }
      ],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: {
        userId: data.userId,
        type: 'subscription'
      },
      locale: 'uk'
    })

    return session
  }

  /**
   * Handle successful payment webhook
   */
  async handlePaymentSuccess(session: Stripe.Checkout.Session) {
    const { userId, courseId, type } = session.metadata!

    if (type === 'course_purchase' && courseId) {
      // Update payment status
      await prisma.payment.updateMany({
        where: {
          userId,
          courseId,
          status: 'PENDING',
          metadata: {
            path: ['sessionId'],
            equals: session.id
          }
        },
        data: {
          status: 'COMPLETED',
          stripePaymentIntentId: session.payment_intent as string,
          completedAt: new Date()
        }
      })

      // Create enrollment
      await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          enrolledAt: new Date(),
          paymentId: session.payment_intent as string
        }
      })

      // Send confirmation email
      // TODO: Implement email service
    } else if (type === 'subscription') {
      // Handle subscription logic
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          subscriptionCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          )
        }
      })
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(session: Stripe.Checkout.Session) {
    const { userId, courseId } = session.metadata!

    if (courseId) {
      await prisma.payment.updateMany({
        where: {
          userId,
          courseId,
          status: 'PENDING',
          metadata: {
            path: ['sessionId'],
            equals: session.id
          }
        },
        data: {
          status: 'FAILED',
          failedAt: new Date()
        }
      })
    }
  }

  /**
   * Handle subscription updated
   */
  async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    const customer = await stripe.customers.retrieve(customerId)
    
    if ('metadata' in customer && customer.metadata.userId) {
      await prisma.user.update({
        where: { id: customer.metadata.userId },
        data: {
          subscriptionStatus: subscription.status,
          subscriptionCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          )
        }
      })
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user?.stripeSubscriptionId) {
      throw new Error('No active subscription')
    }

    const subscription = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      {
        cancel_at_period_end: true
      }
    )

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'canceled'
      }
    })

    return subscription
  }

  /**
   * Get customer portal session
   */
  async createCustomerPortalSession(userId: string, returnUrl: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user?.stripeCustomerId) {
      throw new Error('No Stripe customer found')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
      locale: 'uk'
    })

    return session
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(userId: string) {
    const payments = await prisma.payment.findMany({
      where: {
        userId,
        status: 'COMPLETED'
      },
      include: {
        course: true
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    return payments
  }

  /**
   * Check course access
   */
  async checkCourseAccess(userId: string, courseId: string): Promise<boolean> {
    // Check if course is free
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) return false
    if (course.price === 0) return true

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    })

    if (enrollment) return true

    // Check if user has active subscription
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user?.subscriptionStatus === 'active') {
      // Check if subscription includes this course
      // TODO: Implement subscription tiers logic
      return true
    }

    return false
  }
}

export const stripeService = new StripeService()