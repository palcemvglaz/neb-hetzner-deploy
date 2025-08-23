import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Некоректний email'),
  password: z.string().min(6, 'Пароль повинен містити мінімум 6 символів'),
  name: z.string().min(2, 'Ім\'я повинно містити мінімум 2 символи'),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'SCHOOL_ADMIN']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role = 'STUDENT' } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Користувач з таким email вже існує' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { 
        message: 'Користувач успішно створений',
        user 
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    )
  }
}