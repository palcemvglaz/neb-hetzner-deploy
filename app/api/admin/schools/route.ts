import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const schools = await prisma.school.findMany({
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        groups: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                students: true
              }
            }
          }
        },
        _count: {
          select: {
            users: true,
            groups: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(schools)
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const school = await prisma.school.create({
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        address: data.address,
        phone: data.phone,
        email: data.email
      }
    })

    return NextResponse.json(school)
  } catch (error) {
    console.error('Error creating school:', error)
    return NextResponse.json({ error: 'Failed to create school' }, { status: 500 })
  }
}