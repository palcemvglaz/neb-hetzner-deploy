'use client'

import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

const TEST_USERS = [
  { email: 'admin@nebachiv.com', password: 'password123', role: 'ADMIN', color: 'purple', description: 'Головний адмін' },
  { email: 'student1@test.com', password: 'password123', role: 'EXPERIENCED_SAFE', color: 'green', description: 'Олександр К.' },
  { email: 'student2@test.com', password: 'password123', role: 'BEGINNER_CAREFUL', color: 'blue', description: 'Марина П.' },
  { email: 'student3@test.com', password: 'password123', role: 'EXPERIENCED_AGGRESSIVE', color: 'red', description: 'Дмитро С.' },
  { email: 'student4@test.com', password: 'password123', role: 'BEGINNER_FAST', color: 'orange', description: 'Анна І.' },
  { email: 'student5@test.com', password: 'password123', role: 'BEGINNER_ROMANTIC', color: 'pink', description: 'Сергій М.' },
  { email: 'student6@test.com', password: 'password123', role: 'EXPERIENCED_SAFE', color: 'green', description: 'Катерина Б.' },
  { email: 'student7@test.com', password: 'password123', role: 'EXPERIENCED_SAFE', color: 'green', description: 'Віктор Т.' },
  { email: 'student8@test.com', password: 'password123', role: 'EXPERIENCED_AGGRESSIVE', color: 'red', description: 'Юлія Г.' },
  { email: 'student9@test.com', password: 'password123', role: 'EXPERIENCED_SAFE', color: 'green', description: 'Михайло Л.' },
  { email: 'student10@test.com', password: 'password123', role: 'STUDENT (No Q)', color: 'gray', description: 'Роман Н.' },
  { email: 'instructor@test.com', password: 'password123', role: 'INSTRUCTOR', color: 'teal', description: 'Інструктор' },
]

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const quickLogin = async (email: string, password: string) => {
    setIsLoading(email)
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard'
      })
    } catch (error) {
      console.error('Quick login error:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-900/30 hover:bg-purple-800/40 text-purple-200 border-purple-600'
      case 'blue':
        return 'bg-blue-900/30 hover:bg-blue-800/40 text-blue-200 border-blue-600'
      case 'green':
        return 'bg-green-900/30 hover:bg-green-800/40 text-green-200 border-green-600'
      case 'orange':
        return 'bg-orange-900/30 hover:bg-orange-800/40 text-orange-200 border-orange-600'
      case 'red':
        return 'bg-red-900/30 hover:bg-red-800/40 text-red-200 border-red-600'
      case 'pink':
        return 'bg-pink-900/30 hover:bg-pink-800/40 text-pink-200 border-pink-600'
      case 'teal':
        return 'bg-teal-900/30 hover:bg-teal-800/40 text-teal-200 border-teal-600'
      case 'gray':
        return 'bg-gray-800/30 hover:bg-gray-700/40 text-gray-200 border-gray-500'
      default:
        return 'bg-gray-800/30 hover:bg-gray-700/40 text-gray-200 border-gray-500'
    }
  }

  return (
    <div className="space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Увійдіть в свій акаунт
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Або використайте тестовий акаунт
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-600">
                {error === 'OAuthSignin' ? 'Помилка входу через Google. Перевірте налаштування.' : 
                 error === 'CredentialsSignin' ? 'Неправильний email або пароль' :
                 'Помилка входу'}
              </p>
            </div>
          </div>
        )}

        <LoginForm />

        {/* Quick Login for Development */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Швидкий вхід (для тестування)</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {TEST_USERS.map((user) => (
              <button
                key={user.email}
                onClick={() => quickLogin(user.email, user.password)}
                disabled={isLoading !== null}
                className={`relative group flex flex-col items-center justify-center px-3 py-4 border rounded-lg transition-all min-h-[80px] ${
                  getColorClasses(user.color)
                } ${isLoading === user.email ? 'opacity-50' : ''}`}
              >
                {isLoading === user.email && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-transparent"></div>
                  </div>
                )}
                <span className="text-xs font-medium text-center leading-tight mb-1 break-words">
                  {user.role.replace(/_/g, ' ')}
                </span>
                <span className="text-xs opacity-75 text-center leading-tight break-words">
                  {user.description}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Пароль для всіх: password123
          </p>
        </div>
    </div>
  )
}