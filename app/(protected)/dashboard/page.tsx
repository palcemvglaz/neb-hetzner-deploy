import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  BookOpen, Trophy, Clock, TrendingUp, 
  Target, Award, ChevronRight, Calendar
} from 'lucide-react'

async function getStudentStats(userId: string) {
  const [
    enrollments,
    totalPoints,
    achievements,
    recentProgress
  ] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true
      }
    }),
    prisma.xPTransaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    }),
    prisma.userAchievement.count({
      where: { userId }
    }),
    prisma.progress.findMany({
      where: { userId },
      include: {
        lesson: true
      },
      orderBy: { lastAccessedAt: 'desc' },
      take: 5
    })
  ])

  const totalCourses = enrollments.length
  const completedCourses = enrollments.filter((e: any) => e.progress === 100).length
  const inProgressCourses = enrollments.filter((e: any) => e.progress > 0 && e.progress < 100).length

  return {
    enrollments,
    totalCourses,
    completedCourses,
    inProgressCourses,
    totalPoints: totalPoints._sum.amount || 0,
    achievements,
    recentProgress
  }
}

async function getActiveCourses(userId: string) {
  return prisma.enrollment.findMany({
    where: {
      userId,
      progress: { lt: 100 }
    },
    include: {
      course: {
        include: {
          _count: {
            select: { modules: true }
          }
        }
      }
    },
    orderBy: { lastAccessedAt: 'desc' },
    take: 3
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  // Redirect non-students to appropriate dashboards
  if (session.user.role === 'ADMIN') {
    redirect('/admin')
  } else if (session.user.role === 'SCHOOL_ADMIN' || session.user.role === 'INSTRUCTOR') {
    redirect('/school')
  }

  // Only fetch student data if the user is actually a student
  if (session.user.role !== 'STUDENT') {
    redirect('/') // Fallback redirect
  }

  const [stats, activeCourses] = await Promise.all([
    getStudentStats(session.user.id),
    getActiveCourses(session.user.id)
  ])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Вітаємо, {session.user.name || 'Студент'}!
        </h1>
        <p className="mt-2 text-gray-300">
          Ваш прогрес у навчанні мотоциклетної майстерності
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Всього курсів
                  </dt>
                  <dd className="text-lg font-medium text-white">
                    {stats.totalCourses}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Завершено
                  </dt>
                  <dd className="text-lg font-medium text-white">
                    {stats.completedCourses}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <Link 
          href="/analytics"
          className="bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow block border border-gray-700 hover:border-gray-600"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-6 w-6 text-nebachiv-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Бали
                  </dt>
                  <dd className="text-lg font-medium text-white">
                    {stats.totalPoints}
                  </dd>
                </dl>
              </div>
              <div className="flex-shrink-0">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>

        <Link 
          href="/achievements"
          className="bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow block border border-gray-700 hover:border-gray-600"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Досягнення
                  </dt>
                  <dd className="text-lg font-medium text-white">
                    {stats.achievements}
                  </dd>
                </dl>
              </div>
              <div className="flex-shrink-0">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* My Progress Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-white mb-4">
          Мій прогрес як райдера
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/profile/${session.user.id}/skills`}
            className="bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-700 hover:border-gray-600 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  🎯 Skill Tree
                </h3>
                <p className="text-sm text-gray-300">
                  Переглянь свої навички водіння та рівень майстерності
                </p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </Link>

          <Link
            href={`/profile/${session.user.id}/timeline`}
            className="bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-700 hover:border-gray-600 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  📅 Timeline
                </h3>
                <p className="text-sm text-gray-300">
                  Твоя історія як мотоцикліста - від початку до сьогодні
                </p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </Link>

          <Link
            href={`/profile/${session.user.id}`}
            className="bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-700 hover:border-gray-600 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  👤 Мій профіль
                </h3>
                <p className="text-sm text-gray-300">
                  Загальна інформація та статистика твого розвитку
                </p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>
      </div>

      {/* Active courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">
            Активні курси
          </h2>
          <Link
            href="/courses"
            className="text-sm text-nebachiv-600 hover:text-nebachiv-700 flex items-center"
          >
            Всі курси
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {activeCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeCourses.map((enrollment: any) => {
              const course = enrollment.course
              const title = course.title || 'Без назви'
              const description = course.description || ''
              
              return (
                <Link
                  key={enrollment.id}
                  href={`/courses/${course.slug}`}
                  className="bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-700 hover:border-gray-600"
                >
                  <h3 className="text-lg font-medium text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course._count.modules} модулів
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-nebachiv-600 h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-300">
                      Прогрес: {enrollment.progress}%
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-4">
              У вас поки немає активних курсів
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center px-4 py-2 bg-nebachiv-600 text-white rounded-md hover:bg-nebachiv-700"
            >
              Переглянути курси
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        )}
      </div>

      {/* Recent activity */}
      {stats.recentProgress.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-white mb-4">
            Остання активність
          </h2>
          <div className="bg-gray-800 shadow rounded-lg border border-gray-700">
            <ul className="divide-y divide-gray-700">
              {stats.recentProgress.map((progress: any) => {
                const title = progress.lesson?.title || 'Без назви'
                const timeAgo = getTimeAgo(new Date(progress.lastAccessedAt))
                
                return (
                  <li key={progress.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-white">
                            {title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {timeAgo}
                          </p>
                        </div>
                      </div>
                      {progress.isCompleted && (
                        <div className="flex items-center text-sm text-green-600">
                          <Trophy className="h-4 w-4 mr-1" />
                          Завершено
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} хв. тому`
  } else if (diffInMinutes < 24 * 60) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} год. тому`
  } else {
    const days = Math.floor(diffInMinutes / (24 * 60))
    return `${days} дн. тому`
  }
}