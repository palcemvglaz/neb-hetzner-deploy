'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Home, BookOpen, Target, User, Menu, Building, WifiOff } from 'lucide-react'
import { useCapacitor } from '@/hooks/useCapacitor'

const navItems = [
  { href: '/', icon: Home, label: 'Головна' },
  { href: '/courses', icon: BookOpen, label: 'Курси' },
  { href: '/tests', icon: Target, label: 'Тести' },
  { href: '/profile', icon: User, label: 'Профіль' },
  { href: '/menu', icon: Menu, label: 'Меню' }
]

export default function MobileNavigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { isNative, isOnline, hapticFeedback } = useCapacitor()

  // Don't show on auth pages or admin pages
  if (pathname.includes('/login') || 
      pathname.includes('/register') || 
      pathname.includes('/admin')) {
    return null
  }

  // Dynamic nav items based on user role
  let dynamicNavItems = [...navItems]
  
  if (session?.user?.role === 'SCHOOL_ADMIN') {
    // Replace profile with school dashboard for school admins
    dynamicNavItems[3] = { href: '/school', icon: Building, label: 'Школа' }
  }

  const handleNavClick = async () => {
    if (isNative) {
      await hapticFeedback('light')
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-red-500 text-white text-center py-1 text-xs">
          <WifiOff className="w-3 h-3 inline mr-1" />
          Немає з'єднання
        </div>
      )}
      
      <div className="grid grid-cols-5 h-16">
        {dynamicNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || 
            (href !== '/' && pathname.startsWith(href))
          
          return (
            <Link
              key={href}
              href={href}
              onClick={handleNavClick}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}