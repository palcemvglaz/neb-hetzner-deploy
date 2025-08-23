'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { NotificationBell } from '@/components/notifications/notification-bell'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-nebachiv-600">Nebachiv</h1>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/guides" className="text-gray-600 hover:text-nebachiv-600 px-3 py-2 rounded-md text-sm font-medium">
                  Гайди
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-nebachiv-600 px-3 py-2 rounded-md text-sm font-medium">
                  Ціни
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-nebachiv-600 px-3 py-2 rounded-md text-sm font-medium">
                  Про нас
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {status === 'loading' ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : session ? (
                <>
                  <NotificationBell />
                  <div className="ml-4"></div>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-nebachiv-600"
                  >
                    <div className="w-8 h-8 bg-nebachiv-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium">{session.user?.name}</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Панель управління
                      </Link>
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Профіль
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Вийти
                      </button>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-nebachiv-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Увійти
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Реєстрація
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-nebachiv-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link href="/guides" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-nebachiv-600">
              Гайди
            </Link>
            <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-nebachiv-600">
              Ціни
            </Link>
            <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-nebachiv-600">
              Про нас
            </Link>
            
            <div className="border-t border-gray-200 pt-4">
              {session ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Привіт, {session.user?.name}!
                  </div>
                  <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-nebachiv-600">
                    Панель управління
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-nebachiv-600"
                  >
                    Вийти
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-nebachiv-600">
                    Увійти
                  </Link>
                  <Link href="/register" className="block px-3 py-2 text-base font-medium text-nebachiv-600 hover:text-nebachiv-500">
                    Реєстрація
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}