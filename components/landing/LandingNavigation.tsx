'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { 
    name: 'Landing Pages', 
    href: '/pages',
    children: [
      { name: 'Promo', href: '/landing/promo' },
      { name: 'Nebachiv', href: '/landing/nebachiv' },
      { name: 'Rideicon', href: '/landing/rideicon' },
      { name: 'Alpine', href: '/landing/nebachiv-alpine' },
      { name: 'Modern 2025', href: '/landing/modern2025' },
    ]
  },
  { name: 'Knowledge Base', href: '/pages' },
  { name: 'About', href: '/pages/nebachiv' },
]

export default function LandingNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  return (
    <header className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-nebachiv-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-white">Nebachiv</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div className="relative">
                    <button
                      onMouseEnter={() => setDropdownOpen(item.name)}
                      onMouseLeave={() => setDropdownOpen(null)}
                      className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {dropdownOpen === item.name && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
                        onMouseEnter={() => setDropdownOpen(item.name)}
                        onMouseLeave={() => setDropdownOpen(null)}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            <Link
              href="/landing/promo"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Join Waitlist
            </Link>
            <Link
              href="/admin"
              className="bg-nebachiv-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-nebachiv-blue/80 transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-700">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-nebachiv-blue flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <span className="text-xl font-bold text-white">Nebachiv</span>
                </Link>
                <button
                  type="button"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className="block px-3 py-2 text-base font-semibold text-gray-300 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {item.children && (
                        <div className="ml-4 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-3 py-2 text-sm text-gray-400 hover:text-white"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-gray-700 pt-4">
                    <Link
                      href="/landing/promo"
                      className="block px-3 py-2 text-base font-semibold text-gray-300 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Join Waitlist
                    </Link>
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-base font-semibold text-nebachiv-blue hover:text-nebachiv-blue-light"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}