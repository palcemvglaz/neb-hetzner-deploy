import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { prisma } from '@/lib/db/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { courseId, userId } = session.metadata || {}
  
  if (!courseId || !userId) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  try {
    // Update payment status
    await prisma.payment.updateMany({
      where: {
        stripeSessionId: session.id,
        status: 'PENDING'
      },
      data: {
        status: 'COMPLETED',
        stripePaymentId: session.payment_intent as string,
        completedAt: new Date()
      }
    })

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        userId: userId,
        courseId: courseId,
        status: 'ACTIVE',
        enrolledAt: new Date(),
        progress: 0
      }
    })

    console.log(`Course enrollment created: User ${userId} enrolled in course ${courseId}`)
  } catch (error) {
    console.error('Error handling successful checkout:', error)
  }
}

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  try {
    await prisma.payment.updateMany({
      where: {
        stripeSessionId: session.id,
        status: 'PENDING'
      },
      data: {
        status: 'EXPIRED'
      }
    })

    console.log(`Checkout session expired: ${session.id}`)
  } catch (error) {
    console.error('Error handling expired checkout:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    await prisma.payment.updateMany({
      where: {
        stripePaymentId: paymentIntent.id,
        status: 'PENDING'
      },
      data: {
        status: 'FAILED'
      }
    })

    console.log(`Payment failed: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling failed payment:', error)
  }
}