'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'

interface CoursePaymentButtonProps {
  courseId: string
  courseTitle: string
  price: number
  currency: string
  isEnrolled?: boolean
  isPremium?: boolean
  className?: string
}

export default function CoursePaymentButton({
  courseId,
  courseTitle,
  price,
  currency = 'UAH',
  isEnrolled = false,
  isPremium = true,
  className = ''
}: CoursePaymentButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    if (status !== 'authenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.href))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseId
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      window.location.href = data.data.checkout_url
    } catch (error) {
      console.error('Payment error:', error)
      setError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  // If user is enrolled, show enrolled status
  if (isEnrolled) {
    return (
      <button
        disabled
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium ${className}`}
      >
        <CheckCircle className="h-5 w-5" />
        Ви записані на курс
      </button>
    )
  }

  // If course is free
  if (!isPremium || price === 0) {
    return (
      <button
        onClick={() => {/* Handle free enrollment */}}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors ${className}`}
      >
        Записатися безкоштовно
      </button>
    )
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all ${className}`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Обробка...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Купити за {price} {currency}
          </>
        )}
      </button>

      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Lock className="h-4 w-4" />
        Безпечна оплата через Stripe
      </div>
    </div>
  )
}