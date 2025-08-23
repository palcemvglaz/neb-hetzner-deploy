'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function DebugGooglePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testGoogleAuth = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('Starting Google OAuth...')
      console.log('NEXTAUTH_URL:', process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'not set')
      console.log('Current location:', window.location.origin)
      
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true
      })
      console.log('SignIn result:', result)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testGoogleAuthNoRedirect = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('Starting Google OAuth (no redirect)...')
      const result = await signIn('google', {
        redirect: false
      })
      console.log('SignIn result:', result)
      if (result?.error) {
        setError(result.error)
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Google OAuth</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">OAuth URLs:</h2>
          <p className="text-sm">Sign In URL: http://localhost:3205/api/auth/signin/google</p>
          <p className="text-sm">Callback URL: http://localhost:3205/api/auth/callback/google</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={testGoogleAuth}
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test Google Auth (with redirect)'}
          </button>

          <button
            onClick={testGoogleAuthNoRedirect}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Test Google Auth (no redirect)'}
          </button>

          <a
            href="/api/auth/signin/google"
            className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
          >
            Direct Link to Google OAuth
          </a>

          <button
            onClick={() => {
              console.log('Manual OAuth flow test')
              window.location.href = '/api/auth/signin/google'
            }}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Manual Redirect to Google OAuth
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
          <h3 className="font-bold mb-2">Troubleshooting:</h3>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Відкрийте консоль браузера (F12)</li>
            <li>Натисніть одну з кнопок вище</li>
            <li>Подивіться на помилки в консолі</li>
            <li>Перевірте вкладку Network для заблокованих запитів</li>
          </ol>
        </div>
      </div>
    </div>
  )
}