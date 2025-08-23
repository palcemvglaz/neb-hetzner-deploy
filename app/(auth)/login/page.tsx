'use client'

import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

const TEST_USERS = [
  { email: 'admin@nebachiv.com', password: 'password123', role: 'ADMIN', color: 'purple' },
  { email: 'student@test.com', password: 'password123', role: 'STUDENT (Beginner)', color: 'blue' },
  { email: 'student2@test.com', password: 'password123', role: 'STUDENT (Pro)', color: 'blue' },
  { email: 'instructor@test.com', password: 'password123', role: 'INSTRUCTOR', color: 'green' },
  { email: 'school@test.com', password: 'password123', role: 'SCHOOL_ADMIN', color: 'orange' },
  { email: 'admin@test.com', password: 'password123', role: 'ADMIN', color: 'purple' }
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
        return 'bg-purple-900/20 hover:bg-purple-800/30 text-purple-400 border-purple-700'
      case 'blue':
        return 'bg-blue-900/20 hover:bg-blue-800/30 text-blue-400 border-blue-700'
      case 'green':
        return 'bg-green-900/20 hover:bg-green-800/30 text-green-400 border-green-700'
      case 'orange':
        return 'bg-orange-900/20 hover:bg-orange-800/30 text-orange-400 border-orange-700'
      default:
        return 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600'
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

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {TEST_USERS.map((user) => (
              <button
                key={user.email}
                onClick={() => quickLogin(user.email, user.password)}
                disabled={isLoading !== null}
                className={`relative group flex flex-col items-center justify-center px-4 py-3 border rounded-lg transition-all ${
                  getColorClasses(user.color)
                } ${isLoading === user.email ? 'opacity-50' : ''}`}
              >
                {isLoading === user.email && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-transparent"></div>
                  </div>
                )}
                <span className="text-xs font-medium">{user.role}</span>
                <span className="text-xs opacity-75">{user.email.split('@')[0]}</span>
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