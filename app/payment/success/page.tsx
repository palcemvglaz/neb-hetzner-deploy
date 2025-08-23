import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CheckCircle, ArrowRight, BookOpen, Trophy } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PaymentSuccessProps {
  searchParams: {
    courseId?: string
    sessionId?: string
    type?: 'course' | 'subscription'
  }
}

async function getPaymentDetails(sessionId: string, userId: string) {
  if (!sessionId || !userId) return null

  // Get payment record by checking if metadata contains session ID
  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      status: 'COMPLETED',
      providerPaymentId: sessionId // Use the provider payment ID instead
    }
  })

  return payment
}

async function PaymentSuccessContent({ searchParams }: PaymentSuccessProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return notFound()
  }

  const { courseId, sessionId, type = 'course' } = searchParams

  // Get payment details if available
  const payment = sessionId ? await getPaymentDetails(sessionId, session.user.id) : null
  
  // Get course info
  const course = courseId ? await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      translations: {
        where: { language: 'UA' }
      }
    }
  }) : null

  if (!course) {
    return notFound()
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Оплата успішна!
            </h1>
            <p className="text-gray-600">
              {type === 'subscription' 
                ? 'Ваша підписка активована'
                : 'Ви успішно придбали курс'
              }
            </p>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  {course.translations[0]?.title || course.slug}
                </h2>
                <p className="text-gray-600">
                  {course.translations[0]?.description || 'Курс з безпечної їзди'}
                </p>
              </div>
            </div>

            {enrollment && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">
                    Ви записані на курс!
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Тепер ви маєте повний доступ до всіх уроків та матеріалів курсу.
                </p>
              </div>
            )}

            {payment && (
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Сума:</strong> {payment.amount} {payment.currency}</p>
                <p><strong>Дата оплати:</strong> {payment.updatedAt.toLocaleDateString('uk-UA')}</p>
                <p><strong>ID транзакції:</strong> {payment.id}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {enrollment ? (
              <Link
                href={`/learn/${course.slug}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Почати навчання
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href={`/courses/${course.slug}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Переглянути курс
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}

            <div className="flex justify-center gap-4">
              <Link
                href="/courses"
                className="text-gray-600 hover:text-gray-900"
              >
                Всі курси
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                Мій профіль
              </Link>
            </div>
          </div>

          {/* What's Next */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Що далі?
            </h3>
            <div className="space-y-2 text-blue-800">
              <p>✓ Почніть з першого уроку курсу</p>
              <p>✓ Відстежуйте свій прогрес навчання</p>
              <p>✓ Пройдіть тест після завершення курсу</p>
              <p>✓ Отримайте сертифікат про завершення</p>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 text-sm text-gray-600">
            <p>Маєте питання? <Link href="/contact" className="text-blue-600 hover:underline">Зв'яжіться з нами</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage({ searchParams }: PaymentSuccessProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Завантаження...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent searchParams={searchParams} />
    </Suspense>
  )
}