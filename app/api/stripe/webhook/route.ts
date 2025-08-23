import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripeService } from '@/lib/stripe/stripe-service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await stripeService.handlePaymentSuccess(session)
        break

      case 'checkout.session.async_payment_succeeded':
        const asyncSession = event.data.object as Stripe.Checkout.Session
        await stripeService.handlePaymentSuccess(asyncSession)
        break

      case 'checkout.session.async_payment_failed':
        const failedSession = event.data.object as Stripe.Checkout.Session
        await stripeService.handlePaymentFailed(failedSession)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await stripeService.handleSubscriptionUpdated(subscription)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await stripeService.handleSubscriptionUpdated(deletedSubscription)
        break

      case 'invoice.payment_succeeded':
        // Handle successful subscription payment
        console.log('Subscription payment succeeded')
        break

      case 'invoice.payment_failed':
        // Handle failed subscription payment
        console.log('Subscription payment failed')
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Webhook processing failed'
      },
      { status: 500 }
    )
  }
}