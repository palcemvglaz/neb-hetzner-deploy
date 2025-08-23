'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function TestNextAuthPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('admin@nebachiv.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult('⏳ Signing in...')
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      setResult(`Result: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">NextAuth Test Page</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Session Status: {status}</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {!session ? (
        <div>
          <form onSubmit={handleSignIn} className="space-y-4 mb-6">
            <div>
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="space-y-2">
            <button
              onClick={() => signIn('credentials', { email: 'admin@nebachiv.com', password: 'admin123', redirect: false })}
              className="block w-full px-4 py-2 bg-purple-600 text-white rounded"
            >
              Quick Admin Login
            </button>
            <button
              onClick={() => signIn('credentials', { email: 'student@nebachiv.com', password: 'student123', redirect: false })}
              className="block w-full px-4 py-2 bg-green-600 text-white rounded"
            >
              Quick Student Login
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-4">✅ Signed in as: {session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Sign Out
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}