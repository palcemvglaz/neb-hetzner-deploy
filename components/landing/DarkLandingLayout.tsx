import React, { ReactNode } from 'react'

interface DarkLandingLayoutProps {
  children: ReactNode
  className?: string
}

export function DarkLandingLayout({ children, className = '' }: DarkLandingLayoutProps) {
  return (
    <div className={`min-h-screen bg-black text-white ${className}`}>
      {children}
    </div>
  )
}

// Dark theme navigation bar component
export function DarkNavigation({ children }: { children: ReactNode }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {children}
        </div>
      </div>
    </nav>
  )
}

// Dark theme section component
export function DarkSection({ 
  children, 
  className = '',
  gradient = false 
}: { 
  children: ReactNode
  className?: string
  gradient?: boolean
}) {
  return (
    <section className={`relative py-20 px-4 sm:px-6 lg:px-8 ${
      gradient ? 'bg-gradient-to-b from-black via-gray-950 to-black' : 'bg-black'
    } ${className}`}>
      {children}
    </section>
  )
}

// Dark theme card component
export function DarkCard({ 
  children, 
  className = '',
  hover = true
}: { 
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 ${
      hover ? 'hover:border-gray-700 transition-all duration-300' : ''
    } ${className}`}>
      {children}
    </div>
  )
}

// Dark theme button style
export const darkButtonStyles = {
  primary: 'bg-nebachiv-blue hover:bg-nebachiv-blue/80 text-white',
  secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
  ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white'
}

// Dark theme text styles
export const darkTextStyles = {
  heading: 'text-white',
  subheading: 'text-gray-300',
  body: 'text-gray-400',
  muted: 'text-gray-500'
}