import { prisma } from '@/lib/db/prisma'
import { Payment } from '@prisma/client'

export interface DuplicatePayment {
  original: Payment
  duplicate: Payment
  reason: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface DuplicateDetectionResult {
  totalPayments: number
  duplicatesFound: number
  duplicates: DuplicatePayment[]
  checkedAt: Date
}

export class DuplicateDetectionService {
  /**
   * Check for duplicate payments based on multiple criteria
   */
  static async detectDuplicates(): Promise<DuplicateDetectionResult> {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        subscription: true
      }
    })

    const duplicates: DuplicatePayment[] = []
    const checkedPairs = new Set<string>()

    for (let i = 0; i < payments.length; i++) {
      for (let j = i + 1; j < payments.length; j++) {
        const payment1 = payments[i]
        const payment2 = payments[j]
        
        // Skip if already checked this pair
        const pairKey = [payment1.id, payment2.id].sort().join('-')
        if (checkedPairs.has(pairKey)) continue
        checkedPairs.add(pairKey)

        // Check for exact duplicates (same amount, user, and close time)
        if (this.isExactDuplicate(payment1, payment2)) {
          duplicates.push({
            original: payment1,
            duplicate: payment2,
            reason: 'Однакова сума, користувач та час (в межах 5 хвилин)',
            confidence: 'HIGH'
          })
          continue
        }

        // Check for same transaction reference
        if (this.hasSameTransactionRef(payment1, payment2)) {
          duplicates.push({
            original: payment1,
            duplicate: payment2,
            reason: 'Однаковий ID транзакції у провайдера',
            confidence: 'HIGH'
          })
          continue
        }

        // Check for suspicious pattern (same user, amount within short time)
        if (this.isSuspiciousDuplicate(payment1, payment2)) {
          duplicates.push({
            original: payment1,
            duplicate: payment2,
            reason: 'Підозріла транзакція: той же користувач та сума протягом години',
            confidence: 'MEDIUM'
          })
        }
      }
    }

    return {
      totalPayments: payments.length,
      duplicatesFound: duplicates.length,
      duplicates,
      checkedAt: new Date()
    }
  }

  /**
   * Check if two payments are exact duplicates
   */
  private static isExactDuplicate(p1: Payment, p2: Payment): boolean {
    // Same user, amount, and within 5 minutes
    const timeDiff = Math.abs(p1.createdAt.getTime() - p2.createdAt.getTime())
    const fiveMinutes = 5 * 60 * 1000

    return (
      p1.userId === p2.userId &&
      p1.amount === p2.amount &&
      p1.currency === p2.currency &&
      p1.provider === p2.provider &&
      timeDiff <= fiveMinutes
    )
  }

  /**
   * Check if payments have the same transaction reference
   */
  private static hasSameTransactionRef(p1: Payment, p2: Payment): boolean {
    if (!p1.providerPaymentId || !p2.providerPaymentId) return false
    return p1.providerPaymentId === p2.providerPaymentId
  }

  /**
   * Check for suspicious duplicate pattern
   */
  private static isSuspiciousDuplicate(p1: Payment, p2: Payment): boolean {
    // Same user and amount within 1 hour
    const timeDiff = Math.abs(p1.createdAt.getTime() - p2.createdAt.getTime())
    const oneHour = 60 * 60 * 1000

    return (
      p1.userId === p2.userId &&
      p1.amount === p2.amount &&
      p1.currency === p2.currency &&
      timeDiff <= oneHour &&
      p1.status === 'COMPLETED' &&
      p2.status === 'COMPLETED'
    )
  }

  /**
   * Mark a payment as duplicate
   */
  static async markAsDuplicate(paymentId: string, originalPaymentId: string): Promise<Payment> {
    return await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'FAILED',
        metadata: {
          isDuplicate: true,
          originalPaymentId,
          markedAsDuplicateAt: new Date().toISOString()
        }
      }
    })
  }

  /**
   * Automatically check for duplicates when a new payment is created
   */
  static async checkNewPayment(newPayment: Payment): Promise<DuplicatePayment | null> {
    // Find similar recent payments
    const recentPayments = await prisma.payment.findMany({
      where: {
        userId: newPayment.userId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        },
        id: {
          not: newPayment.id
        }
      }
    })

    for (const payment of recentPayments) {
      if (this.isExactDuplicate(newPayment, payment)) {
        return {
          original: payment,
          duplicate: newPayment,
          reason: 'Знайдено дублікат транзакції',
          confidence: 'HIGH'
        }
      }

      if (this.hasSameTransactionRef(newPayment, payment)) {
        return {
          original: payment,
          duplicate: newPayment,
          reason: 'Транзакція з таким ID вже існує',
          confidence: 'HIGH'
        }
      }
    }

    return null
  }
}