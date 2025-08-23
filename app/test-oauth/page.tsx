'use client'

import { signIn } from 'next-auth/react'

export default function TestOAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <h1 className="text-3xl font-bold text-center">Test Google OAuth</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              console.log('Clicking Google button...')
              signIn('google', { callbackUrl: '/dashboard' })
            }}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign in with Google
          </button>
          
          <div className="text-center text-sm text-gray-600">
            <p>Check browser console for logs</p>
            <p>Popup blockers should be disabled</p>
          </div>
        </div>
      </div>
    </div>
  )
}