'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, BookOpen, Users, FileText, 
  BarChart3, MessageSquare, Settings, LogOut,
  Plus, Calendar
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const menuItems = [
  { href: '/instructor', icon: LayoutDashboard, label: 'Дашборд' },
  { href: '/instructor/courses', icon: BookOpen, label: 'Мої курси' },
  { href: '/instructor/students', icon: Users, label: 'Учні' },
  { href: '/instructor/tests', icon: FileText, label: 'Тести' },
  { href: '/instructor/analytics', icon: BarChart3, label: 'Аналітика' },
  { href: '/instructor/reviews', icon: MessageSquare, label: 'Відгуки' },
  { href: '/instructor/schedule', icon: Calendar, label: 'Розклад' },
  { href: '/instructor/settings', icon: Settings, label: 'Налаштування' },
]

export default function InstructorSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/instructor" className="text-xl font-bold text-gray-900">
            Інструктор
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link
            href="/instructor/courses/new"
            className="flex items-center gap-3 px-3 py-2 mb-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Створити курс</span>
          </Link>

          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/instructor' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Вийти</span>
          </button>
        </div>
      </div>
    </div>
  )
}