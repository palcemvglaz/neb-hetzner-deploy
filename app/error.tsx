'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Упс! Щось пішло не так
        </h1>
        
        <p className="text-gray-600 mb-8">
          Виникла неочікувана помилка під час роботи програми. 
          Ми вже працюємо над її вирішенням.
        </p>
        
        {process.env.NODE_ENV === 'development' && error?.message && (
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
              Технічні деталі (тільки для розробників)
            </summary>
            <div className="mt-3 space-y-2">
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-gray-500">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          </details>
        )}
        
        <div className="flex gap-4 justify-center">
          <a
            href="/"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            На головну
          </a>
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Спробувати ще раз
          </button>
        </div>
      </div>
    </div>
  )
}