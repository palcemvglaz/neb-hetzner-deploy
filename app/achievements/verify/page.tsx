'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Shield, Award, Calendar, User, BookOpen, Clock } from 'lucide-react'
import Link from 'next/link'

// Mock verification data
const mockCertificates: Record<string, any> = {
  'NEB-2024-0001': {
    title: 'Основи безпечної їзди',
    userName: 'Олександр Коваленко',
    issuedAt: new Date('2024-01-20'),
    courseCompleted: '8 принципів Небачива',
    instructor: 'Чингіз Барінов',
    duration: '7 днів',
    score: 92
  },
  'NEB-2024-0045': {
    title: 'Екстрене гальмування',
    userName: 'Марія Петренко',
    issuedAt: new Date('2024-02-01'),
    courseCompleted: 'Практичний курс екстреного гальмування',
    instructor: 'Олександр Петров',
    duration: '3 дні',
    score: 88
  }
}

export default function VerifyAchievementPage() {
  const searchParams = useSearchParams()
  const certNumber = searchParams.get('cert')
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'valid' | 'invalid'>('loading')
  const [certificateData, setCertificateData] = useState<any>(null)

  useEffect(() => {
    if (certNumber) {
      // Simulate API call
      setTimeout(() => {
        const cert = mockCertificates[certNumber]
        if (cert) {
          setCertificateData(cert)
          setVerificationStatus('valid')
        } else {
          setVerificationStatus('invalid')
        }
      }, 1000)
    } else {
      setVerificationStatus('invalid')
    }
  }, [certNumber])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Верифікація сертифіката</h1>
            <p className="text-gray-600">
              Перевірка автентичності сертифікатів платформи Nebachiv
            </p>
          </div>

          {/* Verification Result */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {verificationStatus === 'loading' ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Перевірка сертифіката...</p>
              </div>
            ) : verificationStatus === 'valid' && certificateData ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-green-700">
                      Сертифікат дійсний
                    </h2>
                    <p className="text-gray-600">
                      Номер: <span className="font-mono font-semibold">{certNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                  <div className="text-center mb-6">
                    <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{certificateData.title}</h3>
                    <p className="text-gray-600">
                      видано <span className="font-semibold">{certificateData.userName}</span>
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/70 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Дата видачі</span>
                      </div>
                      <p className="font-semibold">
                        {certificateData.issuedAt.toLocaleDateString('uk-UA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="bg-white/70 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span>Курс</span>
                      </div>
                      <p className="font-semibold">{certificateData.courseCompleted}</p>
                    </div>

                    <div className="bg-white/70 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <User className="w-4 h-4" />
                        <span>Інструктор</span>
                      </div>
                      <p className="font-semibold">{certificateData.instructor}</p>
                    </div>

                    <div className="bg-white/70 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span>Тривалість</span>
                      </div>
                      <p className="font-semibold">{certificateData.duration}</p>
                    </div>
                  </div>

                  {certificateData.score && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">Фінальний результат</p>
                      <p className="text-3xl font-bold text-blue-600">{certificateData.score}%</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Примітка:</strong> Цей сертифікат підтверджує успішне завершення курсу на платформі Nebachiv. 
                    Для додаткової інформації зверніться до support@nebachiv.com
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <h2 className="text-2xl font-bold text-red-700">
                      Сертифікат не знайдено
                    </h2>
                    <p className="text-gray-600">
                      Перевірте правильність введеного номера
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg mb-6 text-center">
                  <p className="text-red-800 mb-4">
                    Сертифікат з номером <span className="font-mono font-semibold">{certNumber || 'не вказано'}</span> не знайдено в базі даних.
                  </p>
                  <p className="text-sm text-red-700">
                    Можливі причини:
                  </p>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Невірний номер сертифіката</li>
                    <li>• Сертифікат ще не внесено в базу</li>
                    <li>• Технічна помилка</li>
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Якщо ви впевнені, що номер правильний, зверніться в підтримку:
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Зв'язатися з підтримкою
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* How to Verify */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Як перевірити сертифікат?</h3>
            <ol className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>Знайдіть номер сертифіката (формат: NEB-YYYY-XXXX)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span>Введіть номер в поле пошуку або використайте пряме посилання</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>Перевірте відповідність даних сертифіката</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}