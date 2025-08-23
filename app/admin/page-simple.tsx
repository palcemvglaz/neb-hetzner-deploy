import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp,
  Activity,
  Award,
  BookOpen,
  Building
} from 'lucide-react'

export default function AdminDashboard() {
  // Mock data instead of database queries
  const stats = {
    totalUsers: 4,
    activeUsers: 3,
    totalPayments: 0,
    monthlyRevenue: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalSchools: 1,
    totalCertificates: 0
  }

  const recentUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@nebachiv.com',
      createdAt: new Date(),
      role: 'ADMIN'
    },
    {
      id: '2', 
      name: 'Demo School',
      email: 'school@nebachiv.com',
      createdAt: new Date(),
      role: 'SCHOOL_ADMIN'
    },
    {
      id: '3',
      name: 'Test Student',
      email: 'student@nebachiv.com', 
      createdAt: new Date(),
      role: 'STUDENT'
    }
  ]

  const recentPayments: any[] = []

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Панель управління</h1>
        <p className="text-gray-600">Огляд платформи Nebachiv</p>
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
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Нові користувачі</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentUsers.map((user) => (
              <div key={user.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name || 'Без імені'}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
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
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Останні платежі</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPayments.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Платежів ще немає
              </div>
            ) : (
              recentPayments.map((payment) => (
                <div key={payment.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {payment.user.name || payment.user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.type === 'SUBSCRIPTION' ? 'Підписка' : 'Одноразовий'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ₴{payment.amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString('uk-UA')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
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