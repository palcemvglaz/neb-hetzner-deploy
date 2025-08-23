'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function DebugPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('admin@nebachiv.com')
  const [password, setPassword] = useState('admin123')
  const [result, setResult] = useState<any>(null)

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setResult(res)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Authentication</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Session Status: {status}</h2>
        <pre className="mt-2 text-sm">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="font-bold mb-2">Manual Login Test</h2>
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Test Login
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-4 bg-yellow-100 rounded">
            <h3 className="font-bold">Login Result:</h3>
            <pre className="text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {session && (
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      )}

      <div className="mt-8">
        <h2 className="font-bold mb-2">Quick Login Buttons</h2>
        <div className="space-x-2">
          <button
            onClick={() => {
              setEmail('admin@nebachiv.com')
              setPassword('admin123')
              handleLogin()
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Login as Admin
          </button>
          <button
            onClick={() => {
              setEmail('student@nebachiv.com')
              setPassword('student123')
              handleLogin()
            }}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Login as Student
          </button>
        </div>
      </div>
    </div>
  )
}