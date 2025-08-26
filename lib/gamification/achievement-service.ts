import { prisma } from '@/lib/db/prisma'
import { notificationService } from '@/lib/communication/notification-service'

export interface Achievement {
  id: string
  name: string
  description: string
  type: AchievementType
  criteria: AchievementCriteria
  icon: string
  points: number
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  category: string
}

export type AchievementType = 
  | 'LESSON_STREAK' 
  | 'COURSE_COMPLETION' 
  | 'TEST_MASTERY'
  | 'TIME_SPENT'
  | 'PERFECT_SCORE'
  | 'SPEED_LEARNER'
  | 'DEDICATION'
  | 'SOCIAL'
  | 'KNOWLEDGE_MASTER'

export interface AchievementCriteria {
  type: string
  target: number
  period?: string // 'daily', 'weekly', 'monthly', 'all-time'
  specificConditions?: Record<string, any>
}

export class AchievementService {
  // Predefined achievements
  private achievements: Achievement[] = [
    // Lesson Streak Achievements
    {
      id: 'first_lesson',
      name: 'Перший крок',
      description: 'Завершіть свій перший урок',
      type: 'LESSON_STREAK',
      criteria: { type: 'lessons_completed', target: 1 },
      icon: '🎯',
      points: 10,
      rarity: 'COMMON',
      category: 'Початок'
    },
    {
      id: 'lesson_streak_3',
      name: 'Упевнений старт',
      description: 'Завершіть 3 уроки поспіль',
      type: 'LESSON_STREAK',
      criteria: { type: 'lesson_streak', target: 3 },
      icon: '🔥',
      points: 25,
      rarity: 'COMMON',
      category: 'Послідовність'
    },
    {
      id: 'lesson_streak_7',
      name: 'Тижневий воїн',
      description: 'Навчайтесь 7 днів поспіль',
      type: 'LESSON_STREAK',
      criteria: { type: 'daily_streak', target: 7 },
      icon: '⚡',
      points: 50,
      rarity: 'RARE',
      category: 'Послідовність'
    },
    {
      id: 'lesson_streak_30',
      name: 'Місячний чемпіон',
      description: 'Навчайтесь 30 днів поспіль',
      type: 'LESSON_STREAK',
      criteria: { type: 'daily_streak', target: 30 },
      icon: '👑',
      points: 200,
      rarity: 'LEGENDARY',
      category: 'Послідовність'
    },

    // Course Completion Achievements
    {
      id: 'first_course',
      name: 'Випускник',
      description: 'Завершіть свій перший курс',
      type: 'COURSE_COMPLETION',
      criteria: { type: 'courses_completed', target: 1 },
      icon: '🎓',
      points: 100,
      rarity: 'RARE',
      category: 'Завершення'
    },
    {
      id: 'course_collector',
      name: 'Колекціонер знань',
      description: 'Завершіть 5 різних курсів',
      type: 'COURSE_COMPLETION',
      criteria: { type: 'courses_completed', target: 5 },
      icon: '📚',
      points: 300,
      rarity: 'EPIC',
      category: 'Завершення'
    },

    // Test Mastery Achievements
    {
      id: 'perfect_test',
      name: 'Ідеальний результат',
      description: 'Отримайте 100% за тест',
      type: 'PERFECT_SCORE',
      criteria: { type: 'perfect_test_score', target: 1 },
      icon: '💯',
      points: 50,
      rarity: 'RARE',
      category: 'Майстерність'
    },
    {
      id: 'test_master',
      name: 'Майстер тестів',
      description: 'Отримайте 100% за 10 тестів',
      type: 'PERFECT_SCORE',
      criteria: { type: 'perfect_test_score', target: 10 },
      icon: '🏆',
      points: 250,
      rarity: 'EPIC',
      category: 'Майстерність'
    },

    // Speed Learning Achievements
    {
      id: 'speed_learner',
      name: 'Швидке навчання',
      description: 'Завершіть урок за половину запланованого часу',
      type: 'SPEED_LEARNER',
      criteria: { type: 'fast_completion', target: 1 },
      icon: '💨',
      points: 30,
      rarity: 'COMMON',
      category: 'Швидкість'
    },
    {
      id: 'lightning_fast',
      name: 'Блискавичний',
      description: 'Завершіть 5 уроків швидше за заплановано',
      type: 'SPEED_LEARNER',
      criteria: { type: 'fast_completion', target: 5 },
      icon: '⚡',
      points: 100,
      rarity: 'RARE',
      category: 'Швидкість'
    },

    // Time-based Achievements
    {
      id: 'dedicated_learner',
      name: 'Відданий учень',
      description: 'Проведіть 10 годин у навчанні',
      type: 'TIME_SPENT',
      criteria: { type: 'time_spent_minutes', target: 600 },
      icon: '⏰',
      points: 150,
      rarity: 'RARE',
      category: 'Відданість'
    },
    {
      id: 'knowledge_seeker',
      name: 'Шукач знань',
      description: 'Проведіть 50 годин у навчанні',
      type: 'TIME_SPENT',
      criteria: { type: 'time_spent_minutes', target: 3000 },
      icon: '🔍',
      points: 500,
      rarity: 'EPIC',
      category: 'Відданість'
    },

    // Knowledge Master Achievements
    {
      id: 'safety_expert',
      name: 'Експерт безпеки',
      description: 'Завершіть всі курси з безпеки мотоциклів',
      type: 'KNOWLEDGE_MASTER',
      criteria: { 
        type: 'category_completion', 
        target: 1,
        specificConditions: { category: 'safety' }
      },
      icon: '🛡️',
      points: 400,
      rarity: 'EPIC',
      category: 'Експертиза'
    }
  ]

  /**
   * Check and award achievements for a user after specific actions
   */
  async checkUserAchievements(userId: string, action: string, metadata?: any): Promise<Achievement[]> {
    const newAchievements: Achievement[] = []

    // Get user's current stats
    const userStats = await this.getUserStats(userId)
    
    // Get user's existing achievements
    const existingAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true }
    })
    const existingIds = existingAchievements.map(a => a.achievementId)

    // Check each achievement
    for (const achievement of this.achievements) {
      // Skip if user already has this achievement
      if (existingIds.includes(achievement.id)) {
        continue
      }

      // Check if achievement criteria is met
      if (await this.checkAchievementCriteria(achievement, userStats, action, metadata)) {
        // Award achievement
        await this.awardAchievement(userId, achievement)
        newAchievements.push(achievement)
      }
    }

    return newAchievements
  }

  /**
   * Award an achievement to a user
   */
  private async awardAchievement(userId: string, achievement: Achievement): Promise<void> {
    try {
      // Create user achievement record
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          title: achievement.name,
          description: achievement.description,
          type: achievement.type,
          progress: 100,
          unlockedAt: new Date()
        }
      })

      // Add points to user (if user has a points system)
      // TODO: Implement user points system

      // Send notification
      await notificationService.notifyAchievementUnlocked(
        userId,
        achievement.name,
        achievement.description
      )

      console.log(`Achievement '${achievement.name}' awarded to user ${userId}`)
    } catch (error) {
      console.error('Error awarding achievement:', error)
    }
  }

  /**
   * Check if achievement criteria is met
   */
  private async checkAchievementCriteria(
    achievement: Achievement, 
    userStats: any, 
    action: string, 
    metadata?: any
  ): Promise<boolean> {
    const { criteria } = achievement

    switch (criteria.type) {
      case 'lessons_completed':
        return userStats.totalLessonsCompleted >= criteria.target

      case 'courses_completed':
        return userStats.totalCoursesCompleted >= criteria.target

      case 'lesson_streak':
        return userStats.currentLessonStreak >= criteria.target

      case 'daily_streak':
        return userStats.currentDailyStreak >= criteria.target

      case 'perfect_test_score':
        return userStats.perfectTestScores >= criteria.target

      case 'fast_completion':
        if (action === 'lesson_completed' && metadata?.completionTime && metadata?.estimatedTime) {
          const isFastCompletion = metadata.completionTime <= (metadata.estimatedTime * 0.5)
          return userStats.fastCompletions + (isFastCompletion ? 1 : 0) >= criteria.target
        }
        return userStats.fastCompletions >= criteria.target

      case 'time_spent_minutes':
        return userStats.totalLearningTimeMinutes >= criteria.target

      case 'category_completion':
        if (criteria.specificConditions?.category) {
          return userStats.categoriesCompleted[criteria.specificConditions.category] >= criteria.target
        }
        return false

      default:
        return false
    }
  }

  /**
   * Get comprehensive user statistics for achievement checking
   */
  private async getUserStats(userId: string): Promise<any> {
    // Get enrollments and completions
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true
          }
        }
      }
    })

    // Get completed lessons
    const completedLessons = await prisma.userProgress.findMany({
      where: { 
        userId,
        status: 'COMPLETED'
      },
      include: {
        content: true
      },
      orderBy: { completedAt: 'desc' }
    })

    // Get test results
    const testResults = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' }
    })

    // Calculate statistics
    const totalLessonsCompleted = completedLessons.length
    const totalCoursesCompleted = enrollments.filter(e => e.completedAt).length
    const perfectTestScores = testResults.filter(r => r.score === 100).length
    const totalLearningTimeMinutes = completedLessons.reduce((sum, lesson) => 
      sum + (lesson.timeSpent || 0), 0
    )

    // Calculate streaks
    const currentLessonStreak = this.calculateLessonStreak(completedLessons)
    const currentDailyStreak = this.calculateDailyStreak(completedLessons)

    // Calculate fast completions
    const fastCompletions = completedLessons.filter(lesson => {
      if (!lesson.timeSpent || !lesson.content.estimatedTime) return false
      return lesson.timeSpent <= (lesson.content.estimatedTime * 0.5)
    }).length

    // Calculate categories completed
    const categoriesCompleted: Record<string, number> = {}
    enrollments.filter(e => e.completedAt).forEach(enrollment => {
      if (enrollment.course.category) {
        const categorySlug = enrollment.course.category.slug
        categoriesCompleted[categorySlug] = (categoriesCompleted[categorySlug] || 0) + 1
      }
    })

    return {
      totalLessonsCompleted,
      totalCoursesCompleted,
      perfectTestScores,
      totalLearningTimeMinutes,
      currentLessonStreak,
      currentDailyStreak,
      fastCompletions,
      categoriesCompleted
    }
  }

  /**
   * Calculate current lesson completion streak
   */
  private calculateLessonStreak(completedLessons: any[]): number {
    if (completedLessons.length === 0) return 0

    let streak = 0
    let lastDate: Date | null = null

    for (const lesson of completedLessons) {
      if (!lesson.completedAt) continue

      const lessonDate = new Date(lesson.completedAt)
      lessonDate.setHours(0, 0, 0, 0)

      if (!lastDate) {
        streak = 1
        lastDate = lessonDate
      } else {
        const dayDiff = Math.floor((lastDate.getTime() - lessonDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (dayDiff === 1) {
          streak++
          lastDate = lessonDate
        } else if (dayDiff === 0) {
          // Same day, continue
          continue
        } else {
          // Gap in streak
          break
        }
      }
    }

    return streak
  }

  /**
   * Calculate current daily learning streak
   */
  private calculateDailyStreak(completedLessons: any[]): number {
    if (completedLessons.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dailyActivity: Set<string> = new Set()
    
    completedLessons.forEach(lesson => {
      if (lesson.completedAt) {
        const date = new Date(lesson.completedAt)
        date.setHours(0, 0, 0, 0)
        dailyActivity.add(date.toISOString())
      }
    })

    let streak = 0
    let currentDate = new Date(today)

    while (dailyActivity.has(currentDate.toISOString())) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    }

    return streak
  }

  /**
   * Get all available achievements
   */
  getAvailableAchievements(): Achievement[] {
    return this.achievements
  }

  /**
   * Get user's achievements with progress
   */
  async getUserAchievements(userId: string): Promise<any[]> {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' }
    })

    return userAchievements.map(ua => {
      const achievement = this.achievements.find(a => a.id === ua.achievementId)
      return {
        ...ua,
        achievement,
        points: achievement?.points || 0,
        rarity: achievement?.rarity || 'COMMON',
        category: achievement?.category || 'Загальне'
      }
    })
  }

  /**
   * Get achievement statistics for user
   */
  async getAchievementStats(userId: string): Promise<any> {
    const userAchievements = await this.getUserAchievements(userId)
    const totalPoints = userAchievements.reduce((sum, ua) => sum + ua.points, 0)
    
    const rarityCount = {
      COMMON: 0,
      RARE: 0,
      EPIC: 0,
      LEGENDARY: 0
    }

    userAchievements.forEach(ua => {
      if (ua.rarity) {
        rarityCount[ua.rarity]++
      }
    })

    return {
      totalAchievements: userAchievements.length,
      totalPoints,
      rarityCount,
      completionPercentage: Math.round((userAchievements.length / this.achievements.length) * 100)
    }
  }
}

export const achievementService = new AchievementService()