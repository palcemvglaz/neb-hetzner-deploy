import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { DuplicateDetectionService } from '@/lib/services/duplicate-detection'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentId, originalPaymentId } = await request.json()

    if (!paymentId || !originalPaymentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updatedPayment = await DuplicateDetectionService.markAsDuplicate(
      paymentId, 
      originalPaymentId
    )
    
    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error('Error marking as duplicate:', error)
    return NextResponse.json({ error: 'Failed to mark as duplicate' }, { status: 500 })
  }
}