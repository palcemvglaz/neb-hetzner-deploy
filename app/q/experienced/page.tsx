'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import QuestionnairePage from '../questionnaire-component'
import { User, LogIn, Loader2 } from 'lucide-react'

export default function ExperiencedQuestionnairePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSigningIn, setIsSigningIn] = useState<string | null>(null)

  // Test student accounts for quick testing
  const testStudents = [
    { email: 'student1@test.com', name: 'Студент 1', description: 'Початківець' },
    { email: 'student2@test.com', name: 'Студент 2', description: 'Досвідчений' },
    { email: 'student3@test.com', name: 'Студент 3', description: 'Спортсмен' },
    { email: 'beginner@test.com', name: 'Новачок', description: 'Перший сезон' },
    { email: 'experienced@test.com', name: 'Досвідчений', description: '3 сезони' }
  ]

  const handleQuickLogin = async (email: string) => {
    setIsSigningIn(email)
    try {
      const result = await signIn('credentials', {
        email,
        password: 'password123',
        redirect: false
      })
      
      if (result?.ok) {
        // Refresh the page to update session
        window.location.reload()
      } else {
        console.error('Login failed')
      }
    } catch (error) {
      console.error('Error during login:', error)
    } finally {
      setIsSigningIn(null)
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Завантаження...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - show login options
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Main login card */}
          <div className="bg-gray-900/90 backdrop-blur rounded-2xl border border-gray-800 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Анкета досвідченого райдера
              </h1>
              <p className="text-gray-400">
                Для проходження тесту потрібно увійти в систему
              </p>
            </div>

            {/* Quick test login buttons */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Швидкий вхід для тестування
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {testStudents.map((student) => (
                  <button
                    key={student.email}
                    onClick={() => handleQuickLogin(student.email)}
                    disabled={isSigningIn !== null}
                    className={`
                      relative group flex items-center gap-3 p-4 rounded-xl border transition-all
                      ${isSigningIn === student.email
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                      }
                      ${isSigningIn !== null && isSigningIn !== student.email ? 'opacity-50' : ''}
                    `}
                  >
                    {isSigningIn === student.email ? (
                      <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div className="text-left flex-1">
                      <div className="font-semibold text-white">{student.name}</div>
                      <div className="text-xs text-gray-400">{student.description}</div>
                    </div>
                    {isSigningIn !== student.email && (
                      <LogIn className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Regular login button */}
            <div className="border-t border-gray-800 pt-6">
              <button
                onClick={() => router.push('/login')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                Увійти з власним аккаунтом
              </button>
            </div>

            {/* Info text */}
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
              <p className="text-sm text-blue-300">
                💡 Використовуйте тестові аккаунти для швидкого тестування функціоналу. 
                Пароль для всіх: <code className="bg-gray-800 px-2 py-1 rounded">password123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated - show questionnaire
  return <QuestionnairePage type="experienced" />
}