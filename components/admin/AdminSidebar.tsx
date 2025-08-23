'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  BookOpen, 
  ClipboardList, 
  Settings, 
  CreditCard,
  School,
  RefreshCw,
  BarChart
} from 'lucide-react'

const navigation = [
  { name: 'Огляд', href: '/admin', icon: Home },
  { name: 'Користувачі', href: '/admin/users', icon: Users },
  { name: 'Контент', href: '/admin/content', icon: BookOpen },
  { name: 'Тести', href: '/admin/tests', icon: ClipboardList },
  { name: 'Школи', href: '/admin/schools', icon: School },
  { name: 'Платежі', href: '/admin/payments', icon: CreditCard },
  { name: 'KB_NEB Sync', href: '/admin/kb-neb', icon: RefreshCw },
  { name: 'Аналітика', href: '/admin/analytics', icon: BarChart },
  { name: 'Налаштування', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center bg-gray-800">
          <h1 className="text-2xl font-bold text-white">Nebachiv Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== '/admin' && pathname.startsWith(item.href))
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="group block flex-shrink-0">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin Panel</p>
                <p className="text-xs font-medium text-gray-400">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}