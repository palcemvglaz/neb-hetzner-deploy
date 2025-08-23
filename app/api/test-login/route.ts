import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('🔐 Test login attempt:', email)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 })
    }

    if (!user.password) {
      return NextResponse.json({ 
        success: false, 
        error: 'User has no password' 
      }, { status: 400 })
    }

    const isValid = await bcrypt.compare(password, user.password)

    return NextResponse.json({
      success: isValid,
      user: isValid ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      } : null,
      error: isValid ? null : 'Invalid password'
    })
  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Server error' 
    }, { status: 500 })
  }
}