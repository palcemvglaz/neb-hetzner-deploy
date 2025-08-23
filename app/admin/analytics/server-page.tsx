import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { analyticsService } from '@/lib/analytics/analytics-service'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Activity,
  Award,
  BarChart3,
  PieChart
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const analytics = await analyticsService.getPlatformAnalytics()

  // Format revenue for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Calculate growth percentages
  const userGrowth = analytics.users.total > 0 
    ? Math.round((analytics.users.new / analytics.users.total) * 100)
    : 0

  const activeUserRate = analytics.users.total > 0
    ? Math.round((analytics.users.active / analytics.users.total) * 100)
    : 0

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Аналітика платформи</h1>
        <p className="text-gray-600">Детальна статистика та інсайти</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Загальний дохід"
          value={formatCurrency(analytics.revenue.total)}
          icon={<DollarSign className="h-6 w-6" />}
          change={`${formatCurrency(analytics.revenue.monthly)} цього місяця`}
          color="green"
        />
        
        <MetricCard
          title="Всього користувачів"
          value={analytics.users.total.toLocaleString()}
          icon={<Users className="h-6 w-6" />}
          change={`+${userGrowth}% за місяць`}
          color="blue"
        />
        
        <MetricCard
          title="Активні користувачі"
          value={`${activeUserRate}%`}
          icon={<Activity className="h-6 w-6" />}
          change={`${analytics.users.active} за 30 днів`}
          color="purple"
        />
        
        <MetricCard
          title="Завершення курсів"
          value={`${analytics.courses.completionRate}%`}
          icon={<Award className="h-6 w-6" />}
          change={`${analytics.courses.totalEnrollments} записів`}
          color="yellow"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Розподіл користувачів
          </h2>
          <div className="space-y-4">
            {Object.entries(analytics.users.byRole).map(([role, count]) => (
              <div key={role}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{getRoleName(role)}</span>
                  <span className="text-gray-600">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getRoleColor(role)}`}
                    style={{ width: `${(count / analytics.users.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Revenue Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Топ курси за доходом
          </h2>
          <div className="space-y-3">
            {analytics.revenue.byCourse
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((course, index) => (
                <div key={course.courseId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-500">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {course.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(course.revenue)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Course Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Статистика курсів
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Всього курсів</span>
              <span className="font-semibold">{analytics.courses.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Опубліковано</span>
              <span className="font-semibold text-green-600">
                {analytics.courses.published}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Загальна кількість записів</span>
              <span className="font-semibold">{analytics.courses.totalEnrollments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Середня кількість записів</span>
              <span className="font-semibold">
                {analytics.courses.published > 0
                  ? Math.round(analytics.courses.totalEnrollments / analytics.courses.published)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Chart */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Залученість користувачів
        </h2>
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.engagement.dailyActiveUsers[analytics.engagement.dailyActiveUsers.length - 1] || 0}
            </p>
            <p className="text-gray-600">Щоденні активні користувачі</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.engagement.weeklyActiveUsers}
            </p>
            <p className="text-gray-600">Тижневі активні користувачі</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {analytics.engagement.monthlyActiveUsers}
            </p>
            <p className="text-gray-600">Місячні активні користувачі</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/reports"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
        >
          <PieChart className="w-5 h-5" />
          Згенерувати звіт
        </Link>
        <Link
          href="/admin/courses"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 flex items-center gap-2"
        >
          <BookOpen className="w-5 h-5" />
          Управління курсами
        </Link>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
  color: 'blue' | 'green' | 'purple' | 'yellow'
}

function MetricCard({ title, value, icon, change, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
      <p className="text-xs text-gray-500 mt-2">{change}</p>
    </div>
  )
}

function getRoleName(role: string): string {
  const roleNames: Record<string, string> = {
    STUDENT: 'Студенти',
    INSTRUCTOR: 'Інструктори',
    SCHOOL_ADMIN: 'Адміни шкіл',
    ADMIN: 'Адміністратори'
  }
  return roleNames[role] || role
}

function getRoleColor(role: string): string {
  const roleColors: Record<string, string> = {
    STUDENT: 'bg-blue-500',
    INSTRUCTOR: 'bg-green-500',
    SCHOOL_ADMIN: 'bg-purple-500',
    ADMIN: 'bg-red-500'
  }
  return roleColors[role] || 'bg-gray-500'
}