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

    const [
      totalUsers,
      activeUsers,
      totalPayments,
      monthlyRevenue,
      totalCourses,
      activeCourses,
      totalSchools,
      totalCertificates
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      }),
      prisma.payment.count({
        where: { status: 'COMPLETED' }
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { amount: true }
      }),
      prisma.course.count(),
      prisma.enrollment.count({
        where: {
          progress: { lt: 100 },
          completedAt: null // Active = not completed
        }
      }),
      prisma.school.count(),
      prisma.certificate.count()
    ])

    // Recent activity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true
      }
    })

    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalPayments,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        totalCourses,
        activeCourses,
        totalSchools,
        totalCertificates
      },
      recentUsers,
      recentPayments
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}