'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const toastStyles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
}

const iconStyles = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400'
}

export function ToastItem({ toast, onClose }: ToastProps) {
  const Icon = toastIcons[toast.type]

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        ${toastStyles[toast.type]}
        transform transition-all duration-300 ease-in-out
        animate-slide-in-right
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconStyles[toast.type]}`} />
      <div className="flex-1">
        <h3 className="font-semibold">{toast.title}</h3>
        {toast.message && (
          <p className="text-sm mt-1 opacity-90">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleToast = (event: CustomEvent<Toast>) => {
      setToasts(prev => [...prev, event.detail])
    }

    window.addEventListener('show-toast' as any, handleToast)
    return () => window.removeEventListener('show-toast' as any, handleToast)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  )
}

// Helper function to show toast
export function showToast(options: Omit<Toast, 'id'>) {
  const toast: Toast = {
    id: Math.random().toString(36).substring(7),
    duration: 5000,
    ...options
  }
  
  window.dispatchEvent(new CustomEvent('show-toast', { detail: toast }))
}