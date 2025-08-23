import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import AchievementBadge from '@/components/achievements/AchievementBadge'
import { Trophy, Target, Star } from 'lucide-react'

async function getUserAchievements(userId: string) {
  const [userAchievements, enrollments, completedCourses, totalTimeSpent] = await Promise.all([
    prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' }
    }),
    prisma.enrollment.count({
      where: { userId }
    }),
    prisma.enrollment.findMany({
      where: { 
        userId,
        progress: 100
      },
      select: {
        completedAt: true,
        startedAt: true
      }
    }),
    prisma.userProgress.aggregate({
      where: { userId },
      _sum: { timeSpent: true }
    })
  ])

  // Check for speed completions
  const speedCompletions = completedCourses.filter((course: any) => {
    if (!course.completedAt) return false
    const timeDiff = course.completedAt.getTime() - course.startedAt.getTime()
    return timeDiff <= 24 * 60 * 60 * 1000
  }).length

  return {
    userAchievements,
    stats: {
      enrollments,
      completedCourses: completedCourses.length,
      speedCompletions,
      totalTimeSpent: totalTimeSpent._sum.timeSpent || 0
    }
  }
}

// Predefined achievements (same as in API)
const ACHIEVEMENTS = [
  {
    id: 'first-login',
    type: 'milestone',
    title: 'Перші кроки',
    description: 'Увійшли до платформи',
    icon: 'star',
    condition: { type: 'login', count: 1 }
  },
  {
    id: 'first-course',
    type: 'learning',
    title: 'Студент',
    description: 'Розпочали перший курс',
    icon: 'book',
    condition: { type: 'enrollment', count: 1 }
  },
  {
    id: 'course-complete',
    type: 'learning',
    title: 'Випускник',
    description: 'Завершили перший курс',
    icon: 'trophy',
    condition: { type: 'course_completion', count: 1 }
  },
  {
    id: 'three-courses',
    type: 'learning',
    title: 'Знавець',
    description: 'Завершили 3 курси',
    icon: 'target',
    condition: { type: 'course_completion', count: 3 }
  },
  {
    id: 'speed-learner',
    type: 'special',
    title: 'Швидкий учень',
    description: 'Завершили курс за один день',
    icon: 'zap',
    condition: { type: 'speed_completion', hours: 24 }
  },
  {
    id: 'dedicated-learner',
    type: 'time',
    title: 'Відданий учень',
    description: 'Провели 10 годин у навчанні',
    icon: 'clock',
    condition: { type: 'time_spent', hours: 600 }
  }
]

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/dashboard')
  }

  const { userAchievements, stats } = await getUserAchievements(session.user.id)

  // Calculate progress for each achievement
  const achievementsWithProgress = ACHIEVEMENTS.map(achievement => {
    const isUnlocked = userAchievements.some((ua: any) => ua.achievementId === achievement.id)
    
    let progress = 0
    let maxProgress = 1

    switch (achievement.condition.type) {
      case 'login':
        progress = 1 // User is logged in
        maxProgress = achievement.condition.count || 1
        break
      case 'enrollment':
        progress = stats.enrollments
        maxProgress = achievement.condition.count || 1
        break
      case 'course_completion':
        progress = stats.completedCourses
        maxProgress = achievement.condition.count || 1
        break
      case 'speed_completion':
        progress = stats.speedCompletions
        maxProgress = 1
        break
      case 'time_spent':
        progress = stats.totalTimeSpent
        maxProgress = achievement.condition.hours || 1
        break
    }

    return {
      ...achievement,
      isUnlocked,
      progress: Math.min(progress, maxProgress),
      maxProgress,
      unlockedAt: userAchievements.find((ua: any) => ua.achievementId === achievement.id)?.unlockedAt
    }
  })

  const unlockedCount = achievementsWithProgress.filter(a => a.isUnlocked).length
  const completionPercentage = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🏆 Досягнення
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Відстежуйте свій прогрес та здобувайте нагороди за навчання
        </p>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Загальний прогрес</h2>
            <span className="text-2xl font-bold text-nebachiv-600">
              {unlockedCount}/{ACHIEVEMENTS.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-nebachiv-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600">
            Здобуто {completionPercentage}% досягнень
          </p>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="space-y-8">
        {/* Unlocked Achievements */}
        {unlockedCount > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Здобуті досягнення ({unlockedCount})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievementsWithProgress
                .filter(achievement => achievement.isUnlocked)
                .map(achievement => (
                  <AchievementBadge
                    key={achievement.id}
                    type={achievement.type}
                    title={achievement.title}
                    description={achievement.description}
                    isUnlocked={achievement.isUnlocked}
                    progress={achievement.progress}
                    maxProgress={achievement.maxProgress}
                    icon={achievement.icon}
                  />
                ))}
            </div>
          </div>
        )}

        {/* In Progress Achievements */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            В процесі ({ACHIEVEMENTS.length - unlockedCount})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievementsWithProgress
              .filter(achievement => !achievement.isUnlocked)
              .map(achievement => (
                <AchievementBadge
                  key={achievement.id}
                  type={achievement.type}
                  title={achievement.title}
                  description={achievement.description}
                  isUnlocked={achievement.isUnlocked}
                  progress={achievement.progress}
                  maxProgress={achievement.maxProgress}
                  icon={achievement.icon}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ваша статистика</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-nebachiv-600">{stats.enrollments}</div>
            <div className="text-sm text-gray-600">Записи на курси</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.completedCourses}</div>
            <div className="text-sm text-gray-600">Завершені курси</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{Math.floor(stats.totalTimeSpent / 60)}г</div>
            <div className="text-sm text-gray-600">Часу навчання</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{unlockedCount}</div>
            <div className="text-sm text-gray-600">Досягнень</div>
          </div>
        </div>
      </div>
    </div>
  )
}