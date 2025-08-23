'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { 
  User, Settings, Award, BookOpen, HelpCircle, 
  Phone, FileText, Shield, LogOut, ChevronRight,
  Download, Bell, Moon, Globe
} from 'lucide-react'

export default function MenuPage() {
  const { data: session } = useSession()

  const menuItems = [
    { section: 'Навчання', items: [
      { icon: BookOpen, label: 'Мої курси', href: '/dashboard' },
      { icon: Award, label: 'Досягнення', href: '/profile#achievements' },
      { icon: Download, label: 'Завантажені уроки', href: '/downloads' },
    ]},
    { section: 'Підтримка', items: [
      { icon: HelpCircle, label: 'FAQ', href: '/faq' },
      { icon: Phone, label: 'Контакти', href: '/contact' },
      { icon: FileText, label: 'Умови використання', href: '/terms' },
      { icon: Shield, label: 'Конфіденційність', href: '/privacy' },
    ]},
    { section: 'Налаштування', items: [
      { icon: Bell, label: 'Сповіщення', href: '/settings/notifications' },
      { icon: Moon, label: 'Темна тема', href: '/settings/theme', toggle: true },
      { icon: Globe, label: 'Мова', href: '/settings/language' },
      { icon: Settings, label: 'Налаштування', href: '/settings' },
    ]},
  ]

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 text-white p-6">
        {session ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{session.user?.name || 'Користувач'}</h1>
              <p className="text-blue-200">{session.user?.email}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold mb-4">Меню</h1>
            <Link 
              href="/login"
              className="inline-block bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold"
            >
              Увійти
            </Link>
          </div>
        )}
      </div>

      {/* Menu Sections */}
      <div className="p-4 space-y-6">
        {menuItems.map((section) => (
          <div key={section.section}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              {section.section}
            </h2>
            <div className="bg-white rounded-lg shadow divide-y">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.toggle ? (
                    <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        {session && (
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Вийти</span>
            </button>
          </div>
        )}

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 py-8">
          <p>Nebachiv v1.0.0</p>
          <p className="mt-1">© 2024 Nebachiv. Всі права захищені.</p>
        </div>
      </div>
    </div>
  )
}