import { NextRequest, NextResponse } from 'next/server'
import { signIn } from 'next-auth/react'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Test the NextAuth signin process
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email,
        password,
        csrfToken: 'test', // We'll handle CSRF properly
        callbackUrl: '/dashboard',
        json: 'true'
      })
    })
    
    const result = await response.text()
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      result: result,
      headers: Object.fromEntries(response.headers.entries())
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test signin failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}