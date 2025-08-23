import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { DuplicateDetectionService } from '@/lib/services/duplicate-detection'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await DuplicateDetectionService.detectDuplicates()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error checking duplicates:', error)
    return NextResponse.json({ error: 'Failed to check duplicates' }, { status: 500 })
  }
}