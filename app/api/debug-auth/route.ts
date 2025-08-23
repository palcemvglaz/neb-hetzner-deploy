import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getToken } from 'next-auth/jwt'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    const providers = authOptions.providers.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type
    }))
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
        NODE_ENV: process.env.NODE_ENV,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing'
      },
      providers,
      session: session,
      token: token,
      cookies: request.cookies.getAll().map(cookie => ({
        name: cookie.name,
        value: cookie.name.includes('next-auth') ? 'SET' : cookie.value
      })),
      headers: {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        host: request.headers.get('host')
      }
    }
    
    return NextResponse.json(debugInfo, { status: 200 })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug auth failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}