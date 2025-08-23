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

    // Get the latest sync record
    const latestSync = await prisma.kBNebSync.findFirst({
      orderBy: { startedAt: 'desc' }
    })

    // Count synced items
    const syncedItems = await prisma.kBNebSyncItem.count({
      where: { status: 'SUCCESS' }
    })

    const failedItems = await prisma.kBNebSyncItem.count({
      where: { status: 'FAILED' }
    })

    const totalItems = await prisma.kBNebSyncItem.count()

    return NextResponse.json({
      lastSync: latestSync?.completedAt,
      totalItems,
      syncedItems,
      failedItems,
      isRunning: latestSync && !latestSync.completedAt ? true : false,
      currentItem: latestSync && !latestSync.completedAt ? 'Processing...' : null
    })
  } catch (error) {
    console.error('Error fetching sync status:', error)
    return NextResponse.json({ error: 'Failed to fetch sync status' }, { status: 500 })
  }
}