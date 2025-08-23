import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
  className?: string
}

export function Loading({ 
  size = 'md', 
  text = 'Завантаження...', 
  fullScreen = false,
  className = ''
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mb-4`} />
      {text && (
        <p className="text-gray-600 text-sm">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}

export function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  }

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin ${className}`} />
  )
}

export function LoadingSkeleton({ 
  className = '' 
}: { 
  className?: string 
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  )
}