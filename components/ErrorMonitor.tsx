'use client'

import { useEffect, useState } from 'react'
import { X, AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorEvent {
  type: string
  source?: string
  message?: string
  timestamp?: string
}

export default function ErrorMonitor() {
  const [errors, setErrors] = useState<ErrorEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Only enable in development
    if (process.env.NODE_ENV !== 'development') return

    const eventSource = new EventSource('/api/errors/stream')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'connected') {
          setIsConnected(true)
        } else if (data.type === 'error') {
          setErrors(prev => [...prev.slice(-4), data]) // Keep last 5 errors
          setIsMinimized(false) // Auto-expand on new error
          
          // Also log to console for visibility
          console.error('🔴 Error detected:', data.message)
        }
      } catch (e) {
        console.error('Failed to parse error event:', e)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  if (errors.length === 0 || process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all ${
      isMinimized ? 'w-12' : 'w-96'
    }`}>
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600"
        >
          <AlertCircle className="w-6 h-6" />
          {errors.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {errors.length}
            </span>
          )}
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl border border-red-200">
          <div className="bg-red-500 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error Monitor</span>
              {isConnected && (
                <span className="text-xs bg-green-400 px-2 py-0.5 rounded">Live</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setErrors([])}
                className="hover:bg-red-600 p-1 rounded"
                title="Clear errors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="hover:bg-red-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {errors.map((error, index) => (
              <div
                key={index}
                className="p-3 border-b border-gray-100 hover:bg-gray-50"
              >
                <div className="text-xs text-gray-500 mb-1">
                  {error.source} • {new Date(error.timestamp || '').toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-800 font-mono break-all">
                  {error.message?.substring(0, 200)}
                  {(error.message?.length || 0) > 200 && '...'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-2 bg-gray-50 text-xs text-gray-600 rounded-b-lg">
            Monitoring errors in real-time. Check console for details.
          </div>
        </div>
      )}
    </div>
  )
}