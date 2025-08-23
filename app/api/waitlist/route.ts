import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const waitlistSchema = z.object({
  name: z.string().min(2, 'Ім\'я повинно містити мінімум 2 символи').optional(),
  email: z.string().email('Некоректний email'),
  phone: z.string().optional(),
  experience: z.string().optional(),
  source: z.string().optional(),
  version: z.string().optional(),
  metadata: z.any().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = waitlistSchema.parse(body)

    // Check if email already exists in users
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      // User already exists, just return success
      return NextResponse.json({
        message: 'Ви вже зареєстровані!',
        alreadyRegistered: true
      })
    }

    // Check if email exists in waitlist table
    const existingWaitlist = await prisma.waitlist.findUnique({
      where: { email: validatedData.email }
    })

    if (existingWaitlist) {
      return NextResponse.json({
        message: 'Ви вже у списку очікування!',
        alreadyRegistered: true
      })
    }

    // Create waitlist entry
    await prisma.waitlist.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        interests: JSON.stringify({
          experience: validatedData.experience,
          version: validatedData.version,
          ...validatedData.metadata
        }),
        source: validatedData.source || 'landing'
      }
    })

    // Log the signup
    console.log('New waitlist signup:', {
      email: validatedData.email,
      name: validatedData.name,
      source: validatedData.source,
      version: validatedData.version
    })

    return NextResponse.json({
      message: 'Успішно додано до списку очікування!',
      success: true
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Не вдалося додати до списку очікування' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin endpoint to get waitlist stats
    const totalWaitlist = await prisma.waitlist.count()

    const recentSignups = await prisma.waitlist.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        interests: true,
        source: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      total: totalWaitlist,
      recent: recentSignups,
      message: `${totalWaitlist} users in waitlist`
    })

  } catch (error) {
    console.error('Waitlist stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get waitlist stats' },
      { status: 500 }
    )
  }
}