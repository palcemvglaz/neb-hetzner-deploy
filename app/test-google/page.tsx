'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { isProviderAvailable } from '@/lib/auth/providers'

export default function TestGooglePage() {
  const { data: session, status } = useSession()

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Google OAuth Test</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Session Status: {status}</h2>
        <pre className="mt-2 text-sm">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {!session ? (
        <div className="space-y-4">
          {isProviderAvailable('google') ? (
            <>
              <p>Ви не авторизовані. Увійдіть через Google:</p>
              <button
                onClick={() => signIn('google')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Увійти через Google
              </button>
            </>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                ⚠️ Google OAuth не налаштований. Для налаштування дотримуйтесь інструкцій нижче.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p>✅ Ви увійшли як: <strong>{session.user?.email}</strong></p>
          <p>👤 Роль: <strong>{session.user?.role}</strong></p>
          
          {session.user?.role === 'ADMIN' && (
            <div className="p-4 bg-purple-100 border border-purple-300 rounded">
              <p className="text-purple-800">
                🔑 Ви маєте права адміністратора!
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Вийти
            </button>
            
            {session.user?.role === 'ADMIN' && (
              <a
                href="/admin"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Перейти в Адмін панель
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">ℹ️ Налаштування Google OAuth</h3>
        <p className="text-sm text-blue-700">
          Для роботи Google OAuth потрібно налаштувати GOOGLE_CLIENT_ID та GOOGLE_CLIENT_SECRET в .env файлі.
        </p>
        <p className="text-sm text-blue-700 mt-2">
          Користувач <code>puladesign@gmail.com</code> автоматично отримає роль ADMIN.
        </p>
      </div>
    </div>
  )
}