import { prisma } from '@/lib/db/prisma'

export interface CourseAnalytics {
  courseId: string
  title: string
  totalEnrollments: number
  activeStudents: number
  completionRate: number
  averageProgress: number
  totalRevenue: number
  ratings: {
    average: number
    total: number
    distribution: Record<number, number>
  }
}

export interface StudentAnalytics {
  userId: string
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalLessonsCompleted: number
  totalTestsPassed: number
  averageTestScore: number
  learningStreak: number
  totalLearningTime: number
}

export interface PlatformAnalytics {
  users: {
    total: number
    new: number
    active: number
    byRole: Record<string, number>
  }
  courses: {
    total: number
    published: number
    totalEnrollments: number
    completionRate: number
  }
  revenue: {
    total: number
    monthly: number
    byCourse: { courseId: string; title: string; revenue: number }[]
  }
  engagement: {
    dailyActiveUsers: number[]
    weeklyActiveUsers: number
    monthlyActiveUsers: number
    averageSessionDuration: number
  }
}

export class AnalyticsService {
  /**
   * Get analytics for a specific course
   */
  async getCourseAnalytics(courseId: string): Promise<CourseAnalytics> {
    const [
      course,
      enrollments,
      activeStudents,
      completedEnrollments,
      progress,
      payments,
      reviews
    ] = await Promise.all([
      prisma.course.findUnique({
        where: { id: courseId },
        include: {
          translations: {
            where: { language: 'UA' },
            take: 1
          }
        }
      }),

      prisma.enrollment.count({
        where: { courseId }
      }),

      prisma.enrollment.count({
        where: {
          courseId,
          user: {
            lastLoginAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }
      }),

      prisma.enrollment.count({
        where: {
          courseId,
          progress: 100
        }
      }),

      prisma.userProgress.findMany({
        where: {
          content: {
            courseSectionItems: {
              some: {
                section: {
                  courseId
                }
              }
            }
          }
        },
        include: {
          user: true
        }
      }),

      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          metadata: {
            contains: courseId
          }
        },
        _sum: {
          amount: true
        }
      }),

      prisma.courseReview.findMany({
        where: { courseId },
        select: { rating: true }
      })
    ])

    if (!course) {
      throw new Error('Course not found')
    }

    // Calculate average progress
    const userProgressMap = progress.reduce((acc, p) => {
      if (!acc[p.userId]) {
        acc[p.userId] = { completed: 0, total: 0 }
      }
      acc[p.userId].total++
      if (p.status === 'COMPLETED') acc[p.userId].completed++
      return acc
    }, {} as Record<string, { completed: number; total: number }>)

    const averageProgress = Object.values(userProgressMap).reduce(
      (sum, up) => sum + (up.completed / up.total) * 100,
      0
    ) / Object.keys(userProgressMap).length || 0

    // Calculate rating distribution
    const ratingDistribution = reviews.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    return {
      courseId,
      title: course.translations[0]?.title || course.slug,
      totalEnrollments: enrollments,
      activeStudents,
      completionRate: enrollments > 0 ? (completedEnrollments / enrollments) * 100 : 0,
      averageProgress: Math.round(averageProgress),
      totalRevenue: payments._sum.amount || 0,
      ratings: {
        average: Math.round(averageRating * 10) / 10,
        total: reviews.length,
        distribution: ratingDistribution
      }
    }
  }

  /**
   * Get analytics for a specific student
   */
  async getStudentAnalytics(userId: string): Promise<StudentAnalytics> {
    const [
      enrollments,
      progress,
      testResults,
      lastActivity
    ] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              sections: {
                include: {
                  items: true
                }
              }
            }
          }
        }
      }),

      prisma.userProgress.findMany({
        where: { userId },
        include: {
          content: {
            include: {
              courseSectionItems: {
                include: {
                  section: {
                    include: {
                      course: true
                    }
                  }
                }
              }
            }
          }
        }
      }),

      prisma.testResult.findMany({
        where: { userId },
        select: {
          score: true,
          passed: true,
          completedAt: true
        }
      }),

      prisma.userProgress.findMany({
        where: { userId },
        orderBy: { lastAccessedAt: 'desc' },
        take: 30,
        select: { completedAt: true }
      })
    ])

    // Calculate course stats
    const completedCourses = enrollments.filter(e => e.progress === 100).length
    const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100).length

    // Calculate lesson stats
    const totalLessonsCompleted = progress.filter(p => p.status === 'COMPLETED').length

    // Calculate test stats
    const passedTests = testResults.filter(t => t.passed).length
    const averageTestScore = testResults.length > 0
      ? testResults.reduce((sum, t) => sum + t.score, 0) / testResults.length
      : 0

    // Calculate learning streak
    const learningStreak = calculateLearningStreak(lastActivity)

    // Calculate total learning time (approximation based on lessons completed)
    const totalLearningTime = totalLessonsCompleted * 15 // 15 minutes per lesson average

    return {
      userId,
      totalCourses: enrollments.length,
      completedCourses,
      inProgressCourses,
      totalLessonsCompleted,
      totalTestsPassed: passedTests,
      averageTestScore: Math.round(averageTestScore),
      learningStreak,
      totalLearningTime
    }
  }

  /**
   * Get platform-wide analytics
   */
  async getPlatformAnalytics(dateRange?: { start: Date; end: Date }): Promise<PlatformAnalytics> {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      newUsers,
      activeUsers,
      usersByRole,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      completedEnrollments,
      totalRevenue,
      monthlyRevenue,
      revenueByCourse,
      dailyActiveUsers,
      weeklyActiveUsers,
      monthlyActiveUsers
    ] = await Promise.all([
      // User stats
      prisma.user.count(),
      
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),

      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: thirtyDaysAgo
          }
        }
      }),

      prisma.user.count({
        where: { role: 'STUDENT' }
      }),

      // Course stats
      prisma.course.count(),

      prisma.course.count({
        where: { isPublished: true }
      }),

      prisma.enrollment.count(),

      prisma.enrollment.count({
        where: { progress: 100 }
      }),

      // Revenue stats
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),

      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          completedAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        },
        _sum: { amount: true }
      }),

      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      }),

      // Engagement stats
      getDailyActiveUsers(7),

      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: sevenDaysAgo
          }
        }
      }),

      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: thirtyDaysAgo
          }
        }
      })
    ])

    // Simple total revenue for now  
    const aggregatedRevenue = revenueByCourse._sum.amount || 0

    return {
      users: {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        byRole: { STUDENT: usersByRole }
      },
      courses: {
        total: totalCourses,
        published: publishedCourses,
        totalEnrollments,
        completionRate: totalEnrollments > 0 
          ? Math.round((completedEnrollments / totalEnrollments) * 100)
          : 0
      },
      revenue: {
        total: aggregatedRevenue,
        monthly: monthlyRevenue._sum.amount || 0,
        byCourse: []
      },
      engagement: {
        dailyActiveUsers: [],
        weeklyActiveUsers,
        monthlyActiveUsers,
        averageSessionDuration: 25 // minutes, placeholder
      }
    }
  }
}

// Helper functions
function calculateLearningStreak(activities: { completedAt: Date | null }[]): number {
  if (activities.length === 0) return 0

  const sortedDates = activities
    .filter(a => a.completedAt)
    .map(a => a.completedAt!.toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  let streak = 0
  let currentDate = new Date()
  
  for (const dateStr of sortedDates) {
    const activityDate = new Date(dateStr)
    const daysDiff = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === streak) {
      streak++
    } else {
      break
    }
  }

  return streak
}

async function getDailyActiveUsers(days: number): Promise<number[]> {
  const results: number[] = []
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const startOfDay = new Date(now)
    startOfDay.setDate(startOfDay.getDate() - i)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(startOfDay)
    endOfDay.setHours(23, 59, 59, 999)

    const count = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    results.unshift(count)
  }

  return results
}

export const analyticsService = new AnalyticsService()