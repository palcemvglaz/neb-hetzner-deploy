import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  Users, BookOpen, FileText, TrendingUp, 
  Star, Clock, Award, AlertCircle, MessageSquare, Plus 
} from 'lucide-react'
import Link from 'next/link'

// Mock data for instructor
const instructorStats = {
  totalStudents: 234,
  activeCourses: 5,
  completionRate: 87,
  averageRating: 4.8,
  totalRevenue: 156780,
  thisMonthRevenue: 24500,
  pendingReviews: 12,
  upcomingClasses: 3
}

const recentActivity = [
  { id: 1, type: 'enrollment', student: 'Олександр К.', course: '8 принципів Небачива', time: '2 години тому' },
  { id: 2, type: 'completion', student: 'Марія П.', course: 'Екстрене гальмування', time: '5 годин тому' },
  { id: 3, type: 'review', student: 'Дмитро М.', course: 'Міська їзда', rating: 5, time: '1 день тому' },
  { id: 4, type: 'question', student: 'Віталій Р.', course: '8 принципів Небачива', time: '2 дні тому' },
]

const topCourses = [
  { id: 1, title: '8 принципів Небачива', students: 89, rating: 4.9, revenue: 44500 },
  { id: 2, title: 'Екстрене гальмування', students: 67, rating: 4.8, revenue: 33500 },
  { id: 3, title: 'Міська їзда', students: 45, rating: 4.7, revenue: 22500 },
]

export default async function InstructorDashboard() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Вітаємо, {session?.user?.name || 'Інструкторе'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Ось огляд вашої викладацької діяльності
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-gray-500">+12% цього місяця</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{instructorStats.totalStudents}</div>
          <div className="text-sm text-gray-600">Активних учнів</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span className="text-sm text-gray-500">{instructorStats.activeCourses} курсів</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{instructorStats.completionRate}%</div>
          <div className="text-sm text-gray-600">Завершення курсів</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-yellow-600" />
            <span className="text-sm text-gray-500">Відмінно</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{instructorStats.averageRating}</div>
          <div className="text-sm text-gray-600">Середній рейтинг</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-gray-500">+18% vs минулий</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{instructorStats.thisMonthRevenue.toLocaleString()} ₴</div>
          <div className="text-sm text-gray-600">Дохід цього місяця</div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/instructor/reviews" className="bg-orange-50 border border-orange-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-orange-600" />
            <span className="bg-orange-600 text-white text-sm px-2 py-1 rounded-full">
              {instructorStats.pendingReviews}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Відгуки для відповіді</h3>
          <p className="text-sm text-gray-600 mt-1">Відповідайте на питання учнів</p>
        </Link>

        <Link href="/instructor/schedule" className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
            <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
              {instructorStats.upcomingClasses}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Найближчі заняття</h3>
          <p className="text-sm text-gray-600 mt-1">Переглянути розклад</p>
        </Link>

        <Link href="/instructor/courses/new" className="bg-green-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Plus className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Створити новий курс</h3>
          <p className="text-sm text-gray-600 mt-1">Додати навчальний матеріал</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Остання активність</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'enrollment' ? 'bg-blue-100' :
                    activity.type === 'completion' ? 'bg-green-100' :
                    activity.type === 'review' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'enrollment' && <Users className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'completion' && <Award className="w-5 h-5 text-green-600" />}
                    {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-600" />}
                    {activity.type === 'question' && <AlertCircle className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.student}</span>
                      {activity.type === 'enrollment' && ' записався на курс '}
                      {activity.type === 'completion' && ' завершив курс '}
                      {activity.type === 'review' && ' залишив відгук на курс '}
                      {activity.type === 'question' && ' задав питання в курсі '}
                      <span className="font-medium">{activity.course}</span>
                      {activity.type === 'review' && activity.rating && (
                        <span className="ml-2">
                          {[...Array(activity.rating)].map((_, i) => (
                            <Star key={i} className="inline w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Топ курси</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students} учнів
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{course.revenue.toLocaleString()} ₴</div>
                    <div className="text-sm text-gray-500">дохід</div>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              href="/instructor/courses"
              className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Всі курси →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}