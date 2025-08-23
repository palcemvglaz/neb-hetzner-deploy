import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { 
  BarChart3, TrendingUp, Clock, Target, 
  Calendar, Award, BookOpen, Zap 
} from 'lucide-react'

async function getLearningStats(userId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalProgress,
    recentProgress,
    weeklyProgress,
    enrollments,
    achievements
  ] = await Promise.all([
    // All time progress
    prisma.userProgress.aggregate({
      where: { userId },
      _sum: { timeSpent: true, pointsEarned: true },
      _count: { id: true }
    }),

    // Last 30 days activity
    prisma.userProgress.findMany({
      where: {
        userId,
        lastAccessedAt: { gte: thirtyDaysAgo }
      },
      select: {
        lastAccessedAt: true,
        timeSpent: true,
        pointsEarned: true,
        status: true
      },
      orderBy: { lastAccessedAt: 'desc' }
    }),

    // Last 7 days
    prisma.userProgress.findMany({
      where: {
        userId,
        lastAccessedAt: { gte: sevenDaysAgo }
      },
      select: {
        timeSpent: true,
        status: true
      }
    }),

    // Course enrollments with progress
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            translations: {
              where: { language: 'UA' },
              select: { title: true }
            }
          }
        }
      },
      orderBy: { progress: 'desc' }
    }),

    // User achievements
    prisma.userAchievement.count({
      where: { userId }
    })
  ])

  // Calculate daily activity for the last 30 days
  const dailyActivity = new Map<string, number>()
  
  // Initialize all days with 0
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    dailyActivity.set(dateKey, 0)
  }
  
  // Fill in actual activity
  recentProgress.forEach((progress: any) => {
    const dateKey = progress.lastAccessedAt.toISOString().split('T')[0]
    const current = dailyActivity.get(dateKey) || 0
    dailyActivity.set(dateKey, current + progress.timeSpent)
  })

  // Convert to array and sort by date
  const activityData = Array.from(dailyActivity.entries())
    .map(([date, timeSpent]) => ({ date, timeSpent }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate learning streak
  const activeDays = new Set(recentProgress.map((p: any) => p.lastAccessedAt.toISOString().split('T')[0]))
  let currentStreak = 0
  
  // Count streak from today backwards
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    
    if (activeDays.has(dateKey)) {
      currentStreak++
    } else {
      break
    }
  }

  return {
    totalTimeSpent: totalProgress._sum.timeSpent || 0,
    totalPointsEarned: totalProgress._sum.pointsEarned || 0,
    totalActivities: totalProgress._count,
    weeklyTimeSpent: weeklyProgress.reduce((sum: number, p: any) => sum + p.timeSpent, 0),
    weeklyCompleted: weeklyProgress.filter((p: any) => p.status === 'COMPLETED').length,
    currentStreak,
    activeDaysCount: activeDays.size,
    activityData,
    enrollments,
    achievements
  }
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/dashboard')
  }

  const stats = await getLearningStats(session.user.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Аналітика навчання
        </h1>
        <p className="text-lg text-gray-600">
          Аналіз вашого прогресу та статистика навчання
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Загальний час</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(stats.totalTimeSpent / 60)}г {stats.totalTimeSpent % 60}хв
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Бали</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPointsEarned}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Серія днів</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.currentStreak}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Досягнення</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.achievements}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Цього тижня
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Час навчання</span>
              <span className="font-semibold">
                {Math.floor(stats.weeklyTimeSpent / 60)}г {stats.weeklyTimeSpent % 60}хв
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Завершено уроків</span>
              <span className="font-semibold">{stats.weeklyCompleted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Активних днів</span>
              <span className="font-semibold">{Math.min(stats.activeDaysCount, 7)}/7</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-500" />
            Активність за 30 днів
          </h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-600 mb-2">
              Щоденна активність (хвилини)
            </div>
            <div className="grid grid-cols-10 gap-1">
              {stats.activityData.slice(-20).map((day, index) => (
                <div
                  key={index}
                  className={`h-4 w-4 rounded-sm ${
                    day.timeSpent > 0
                      ? day.timeSpent > 60
                        ? 'bg-green-600'
                        : day.timeSpent > 30
                        ? 'bg-green-400'
                        : 'bg-green-200'
                      : 'bg-gray-100'
                  }`}
                  title={`${day.date}: ${day.timeSpent} хв`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Менше активності ← → Більше активності
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-nebachiv-600" />
          Прогрес по курсах
        </h3>
        
        {stats.enrollments.length > 0 ? (
          <div className="space-y-4">
            {stats.enrollments.map((enrollment: any) => {
              const courseName = enrollment.course.translations[0]?.title || 'Без назви'
              const progress = enrollment.progress
              
              return (
                <div key={enrollment.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{courseName}</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-nebachiv-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Ви ще не записані на жоден курс</p>
          </div>
        )}
      </div>
    </div>
  )
}