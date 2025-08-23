import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings,
  Building,
  UserPlus,
  GraduationCap
} from 'lucide-react'

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'SCHOOL_ADMIN') {
    redirect('/login')
  }

  const navigation = [
    {
      name: 'Головна',
      href: '/school',
      icon: LayoutDashboard,
      current: false
    },
    {
      name: 'Учні',
      href: '/school/students',
      icon: Users,
      current: false
    },
    {
      name: 'Групи',
      href: '/school/groups',
      icon: UserPlus,
      current: false
    },
    {
      name: 'Курси',
      href: '/courses',
      icon: BookOpen,
      current: false
    },
    {
      name: 'Аналітика',
      href: '/school/analytics',
      icon: BarChart3,
      current: false
    },
    {
      name: 'Звіти',
      href: '/school/reports',
      icon: GraduationCap,
      current: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/school" className="flex items-center space-x-2">
                <Building className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Мотошкола</span>
              </Link>
              
              <div className="hidden md:flex space-x-6">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user.name || session.user.email}
              </span>
              <Link
                href="/profile"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Профіль
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto py-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}