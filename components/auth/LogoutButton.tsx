'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

interface LogoutButtonProps {
  className?: string
  showIcon?: boolean
  showText?: boolean
}

export default function LogoutButton({ 
  className = '', 
  showIcon = true, 
  showText = true 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      {showText && (isLoading ? 'Вихід...' : 'Вийти')}
    </button>
  )
}