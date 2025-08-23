'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp,
  Activity,
  Award,
  BookOpen,
  Building,
  BarChart
} from 'lucide-react'
import LogoutButton from '@/components/auth/LogoutButton'

interface Stats {
  totalUsers: number
  activeUsers: number
  totalPayments: number
  monthlyRevenue: number
  totalCourses: number
  activeCourses: number
  totalSchools: number
  totalCertificates: number
}

interface User {
  id: string
  name: string | null
  email: string
  createdAt: string
  role: string
}

interface Payment {
  id: string
  amount: number
  type: string
  createdAt: string
  user: {
    name: string | null
    email: string
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPayments: 0,
    monthlyRevenue: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalSchools: 0,
    totalCertificates: 0
  })
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/stats')
        
        if (response.status === 401) {
          console.error('Unauthorized: Please login as admin')
          window.location.href = '/login'
          return
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const data = await response.json()
        
        if (data.stats) {
          setStats(data.stats)
        }
        if (data.recentUsers) {
          setRecentUsers(data.recentUsers)
        }
        if (data.recentPayments) {
          setRecentPayments(data.recentPayments)
        }
      } catch (error) {
        console.error('Failed to load admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Завантаження...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Панель управління</h1>
            <p className="text-gray-300">Огляд платформи Nebachiv</p>
            {session?.user && (
              <p className="text-sm text-gray-400 mt-1">
                Ви увійшли як: {session.user.email} ({session.user.role})
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/analytics"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2"
            >
              <BarChart className="w-5 h-5" />
              Аналітика
            </Link>
            <Link
              href="/admin/courses"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Управління курсами
            </Link>
            <Link
              href="/admin/generate-course"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              Згенерувати курс
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Всього користувачів"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6" />}
          change="+12%"
          color="blue"
        />
        <StatCard
          title="Активні користувачі"
          value={stats.activeUsers}
          icon={<Activity className="h-6 w-6" />}
          subtitle="За останні 30 днів"
          color="green"
        />
        <StatCard
          title="Дохід за місяць"
          value={`₴${stats.monthlyRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
          change="+23%"
          color="purple"
        />
        <StatCard
          title="Завершені платежі"
          value={stats.totalPayments}
          icon={<TrendingUp className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Курсів"
          value={stats.totalCourses}
          icon={<BookOpen className="h-6 w-6" />}
          color="indigo"
        />
        <StatCard
          title="Активних навчань"
          value={stats.activeCourses}
          icon={<GraduationCap className="h-6 w-6" />}
          color="pink"
        />
        <StatCard
          title="Мотошкіл"
          value={stats.totalSchools}
          icon={<Building className="h-6 w-6" />}
          color="orange"
        />
        <StatCard
          title="Сертифікатів"
          value={stats.totalCertificates}
          icon={<Award className="h-6 w-6" />}
          color="teal"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Нові користувачі</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {recentUsers.map((user) => (
              <div key={user.id} className="px-6 py-4 hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user.name || 'Без імені'}
                    </p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                      ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'SCHOOL_ADMIN' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Останні платежі</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="px-6 py-4 hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {payment.user.name || payment.user.email}
                    </p>
                    <p className="text-sm text-gray-400">
                      {payment.type === 'SUBSCRIPTION' ? 'Підписка' : 'Одноразовий'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      ₴{payment.amount}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: string
  subtitle?: string
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'pink' | 'orange' | 'teal'
}

function StatCard({ title, value, icon, change, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    pink: 'bg-pink-50 text-pink-600',
    orange: 'bg-orange-50 text-orange-600',
    teal: 'bg-teal-50 text-teal-600'
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <span className="text-sm font-medium text-green-600">{change}</span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-sm text-gray-300 mt-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  )
}