'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BookOpen,
  Award,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Clock
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    completionRate: number
    userGrowth: number
    revenueGrowth: number
  }
  userActivity: Array<{
    date: string
    registrations: number
    activeUsers: number
    completions: number
  }>
  revenue: Array<{
    month: string
    subscriptions: number
    oneTime: number
    total: number
  }>
  coursePopularity: Array<{
    name: string
    enrollments: number
    completions: number
    rating: number
  }>
  userDistribution: Array<{
    name: string
    value: number
  }>
  topContent: Array<{
    title: string
    views: number
    category: string
    completionRate: number
  }>
  testPerformance: Array<{
    category: string
    avgScore: number
    attempts: number
    passRate: number
  }>
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30days')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналітика</h1>
          <p className="text-gray-600">Детальна статистика платформи</p>
        </div>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="7days">Останні 7 днів</option>
          <option value="30days">Останні 30 днів</option>
          <option value="90days">Останні 90 днів</option>
          <option value="year">Останній рік</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Користувачі"
          value={analytics.overview.totalUsers.toLocaleString()}
          subtitle={`${analytics.overview.activeUsers} активних`}
          change={`+${analytics.overview.userGrowth}%`}
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Дохід"
          value={`₴${analytics.overview.totalRevenue.toLocaleString()}`}
          subtitle="За період"
          change={`+${analytics.overview.revenueGrowth}%`}
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Завершеність"
          value={`${analytics.overview.completionRate}%`}
          subtitle="Середня по курсах"
          icon={<Target className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Активність"
          value={`${Math.round((analytics.overview.activeUsers / analytics.overview.totalUsers) * 100)}%`}
          subtitle="Активних користувачів"
          icon={<Activity className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* User Activity Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Активність користувачів</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.userActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="registrations" 
              stroke="#8b5cf6" 
              name="Реєстрації"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="activeUsers" 
              stroke="#3b82f6" 
              name="Активні"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="completions" 
              stroke="#10b981" 
              name="Завершення"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Дохід по місяцях</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="subscriptions" fill="#8b5cf6" name="Підписки" />
              <Bar dataKey="oneTime" fill="#3b82f6" name="Одноразові" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Розподіл користувачів</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={analytics.userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Популярні курси</h2>
          <div className="space-y-4">
            {analytics.coursePopularity.map((course, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{course.name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>{course.enrollments} записів</span>
                    <span>{course.completions} завершень</span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-yellow-500" />
                      {course.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round((course.completions / course.enrollments) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">завершеність</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Результати тестів</h2>
          <div className="space-y-4">
            {analytics.testPerformance.map((test, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{test.category}</h3>
                  <span className="text-sm text-gray-600">{test.attempts} спроб</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Середній бал</span>
                      <span>{test.avgScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${test.avgScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{test.passRate}%</div>
                    <div className="text-xs text-gray-500">склали</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Топ контент</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2 text-sm font-medium text-gray-700">Назва</th>
                <th className="text-left py-2 text-sm font-medium text-gray-700">Категорія</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Перегляди</th>
                <th className="text-right py-2 text-sm font-medium text-gray-700">Завершеність</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topContent.map((content, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 text-sm">{content.title}</td>
                  <td className="py-3 text-sm text-gray-600">{content.category}</td>
                  <td className="py-3 text-sm text-right">{content.views.toLocaleString()}</td>
                  <td className="py-3 text-sm text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                      ${content.completionRate >= 80 ? 'bg-green-100 text-green-800' :
                        content.completionRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {content.completionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  change?: string
  icon: React.ReactNode
  color: 'purple' | 'green' | 'blue' | 'yellow'
}

function StatCard({ title, value, subtitle, change, icon, color }: StatCardProps) {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && (
          <span className="text-sm font-medium text-green-600">{change}</span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  )
}