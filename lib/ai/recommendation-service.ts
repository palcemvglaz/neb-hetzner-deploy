import { prisma } from '@/lib/prisma'

export interface CourseRecommendation {
  course: {
    id: string
    slug: string
    title: string
    description: string
    difficulty: string
    price: number
    isPremium: boolean
    category?: {
      slug: string
      name: string
    }
  }
  score: number
  reasons: string[]
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  type: 'CONTINUATION' | 'SIMILAR' | 'PREREQUISITE' | 'TRENDING' | 'PERSONALIZED'
}

export interface UserLearningProfile {
  userId: string
  preferences: {
    difficulty: string[]
    categories: string[]
    learningStyle: 'VISUAL' | 'PRACTICAL' | 'THEORETICAL' | 'MIXED'
    pacePreference: 'FAST' | 'MEDIUM' | 'SLOW'
  }
  statistics: {
    completedCourses: number
    averageTestScore: number
    totalLearningTime: number
    favoriteCategories: string[]
    strongTopics: string[]
    improvementAreas: string[]
  }
  achievements: {
    totalPoints: number
    streakDays: number
    perfectScores: number
  }
}

export class RecommendationService {
  /**
   * Get personalized course recommendations for a user
   */
  async getRecommendations(userId: string, limit: number = 10): Promise<CourseRecommendation[]> {
    // Get user learning profile
    const userProfile = await this.buildUserLearningProfile(userId)
    
    // Get all available courses
    const availableCourses = await this.getAvailableCourses(userId)
    
    // Generate different types of recommendations
    const recommendations: CourseRecommendation[] = []
    
    // 1. Continuation recommendations (next logical step)
    const continuationRecs = await this.getContinuationRecommendations(userId, userProfile, availableCourses)
    recommendations.push(...continuationRecs)
    
    // 2. Similar course recommendations (based on completed courses)
    const similarRecs = await this.getSimilarCourseRecommendations(userId, userProfile, availableCourses)
    recommendations.push(...similarRecs)
    
    // 3. Difficulty progression recommendations
    const difficultyRecs = await this.getDifficultyProgressionRecommendations(userProfile, availableCourses)
    recommendations.push(...difficultyRecs)
    
    // 4. Trending course recommendations
    const trendingRecs = await this.getTrendingRecommendations(availableCourses)
    recommendations.push(...trendingRecs)
    
    // 5. Knowledge gap recommendations
    const gapRecs = await this.getKnowledgeGapRecommendations(userProfile, availableCourses)
    recommendations.push(...gapRecs)
    
    // Remove duplicates and sort by score
    const uniqueRecommendations = this.removeDuplicateRecommendations(recommendations)
    const sortedRecommendations = this.rankRecommendations(uniqueRecommendations, userProfile)
    
    return sortedRecommendations.slice(0, limit)
  }

  /**
   * Build comprehensive user learning profile
   */
  private async buildUserLearningProfile(userId: string): Promise<UserLearningProfile> {
    const [
      enrollments,
      testResults,
      userProgress,
      achievements
    ] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              category: {
                include: {
                  translations: {
                    where: { language: 'UA' }
                  }
                }
              },
              translations: {
                where: { language: 'UA' }
              }
            }
          }
        }
      }),
      prisma.testResult.findMany({
        where: { userId },
        include: {
          test: {
            include: {
              content: {
                include: {
                  courseSectionItems: {
                    include: {
                      section: {
                        include: {
                          course: {
                            include: {
                              category: true
                            }
                          }
                        }
                      }
                    }
                  }
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
                      course: {
                        include: {
                          category: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.userAchievement.findMany({
        where: { userId }
      })
    ])

    // Analyze completion patterns
    const completedCourses = enrollments.filter(e => e.completedAt).length
    const averageTestScore = testResults.length > 0 
      ? testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length
      : 0

    // Analyze favorite categories
    const categoryFrequency: Record<string, number> = {}
    enrollments.forEach(enrollment => {
      if (enrollment.course.category) {
        const categorySlug = enrollment.course.category.slug
        categoryFrequency[categorySlug] = (categoryFrequency[categorySlug] || 0) + 1
      }
    })

    const favoriteCategories = Object.entries(categoryFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    // Analyze learning patterns
    const totalLearningTime = userProgress.reduce((sum, progress) => sum + (progress.timeSpent || 0), 0)
    
    // Determine learning pace
    const avgCompletionTime = enrollments
      .filter(e => e.completedAt && e.startedAt)
      .map(e => {
        const timeDiff = new Date(e.completedAt!).getTime() - new Date(e.startedAt).getTime()
        return timeDiff / (1000 * 60 * 60 * 24) // days
      })
    
    const avgDaysToComplete = avgCompletionTime.length > 0 
      ? avgCompletionTime.reduce((sum, days) => sum + days, 0) / avgCompletionTime.length
      : 0

    const pacePreference: 'FAST' | 'MEDIUM' | 'SLOW' = 
      avgDaysToComplete < 3 ? 'FAST' : 
      avgDaysToComplete < 7 ? 'MEDIUM' : 'SLOW'

    // Analyze difficulty preferences
    const difficultyFrequency: Record<string, number> = {}
    enrollments.forEach(enrollment => {
      const difficulty = enrollment.course.difficulty
      difficultyFrequency[difficulty] = (difficultyFrequency[difficulty] || 0) + 1
    })

    const preferredDifficulties = Object.entries(difficultyFrequency)
      .sort(([,a], [,b]) => b - a)
      .map(([difficulty]) => difficulty)

    // Analyze strong topics (high test scores)
    const topicScores: Record<string, number[]> = {}
    testResults.forEach(result => {
      const course = result.test.content.courseSectionItems[0]?.section.course
      if (course?.category) {
        const category = course.category.slug
        if (!topicScores[category]) topicScores[category] = []
        topicScores[category].push(result.score)
      }
    })

    const strongTopics = Object.entries(topicScores)
      .map(([topic, scores]) => ({
        topic,
        avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }))
      .filter(({ avgScore }) => avgScore >= 80)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3)
      .map(({ topic }) => topic)

    const improvementAreas = Object.entries(topicScores)
      .map(([topic, scores]) => ({
        topic,
        avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length
      }))
      .filter(({ avgScore }) => avgScore < 70)
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 3)
      .map(({ topic }) => topic)

    // Calculate achievement stats
    const totalPoints = achievements.reduce((sum, achievement) => {
      // Assuming points are stored in achievement metadata or calculated
      return sum + 10 // placeholder
    }, 0)

    // Calculate streak (simplified)
    const streakDays = 0 // Will be calculated by achievement service

    const perfectScores = testResults.filter(result => result.score === 100).length

    return {
      userId,
      preferences: {
        difficulty: preferredDifficulties,
        categories: favoriteCategories,
        learningStyle: 'MIXED', // This could be determined through user behavior analysis
        pacePreference
      },
      statistics: {
        completedCourses,
        averageTestScore,
        totalLearningTime,
        favoriteCategories,
        strongTopics,
        improvementAreas
      },
      achievements: {
        totalPoints,
        streakDays,
        perfectScores
      }
    }
  }

  /**
   * Get courses available for recommendation (not enrolled)
   */
  private async getAvailableCourses(userId: string) {
    const enrolledCourseIds = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true }
    }).then(enrollments => enrollments.map(e => e.courseId))

    return prisma.course.findMany({
      where: {
        isPublished: true,
        id: {
          notIn: enrolledCourseIds
        }
      },
      include: {
        category: {
          include: {
            translations: {
              where: { language: 'UA' }
            }
          }
        },
        translations: {
          where: { language: 'UA' }
        },
        sections: {
          include: {
            items: true
          }
        }
      }
    })
  }

  /**
   * Get continuation recommendations (next logical steps)
   */
  private async getContinuationRecommendations(
    userId: string, 
    userProfile: UserLearningProfile, 
    availableCourses: any[]
  ): Promise<CourseRecommendation[]> {
    const recommendations: CourseRecommendation[] = []

    // Recommend courses in favorite categories
    userProfile.preferences.categories.forEach((category, index) => {
      const categoryWeight = 1 - (index * 0.2) // Decrease weight for less favorite categories
      
      const coursesInCategory = availableCourses.filter(course => 
        course.category?.slug === category
      )

      coursesInCategory.forEach(course => {
        const score = categoryWeight * 0.8 + 0.2 // Base score for category match
        
        recommendations.push({
          course: {
            id: course.id,
            slug: course.slug,
            title: course.translations[0]?.title || course.slug,
            description: course.translations[0]?.description || '',
            difficulty: course.difficulty,
            price: course.price,
            isPremium: course.isPremium,
            category: course.category ? {
              slug: course.category.slug,
              name: course.category.translations[0]?.name || course.category.slug
            } : undefined
          },
          score,
          reasons: [`Продовження навчання в улюбленій категорії: ${category}`],
          priority: 'HIGH',
          type: 'CONTINUATION'
        })
      })
    })

    return recommendations
  }

  /**
   * Get similar course recommendations
   */
  private async getSimilarCourseRecommendations(
    userId: string,
    userProfile: UserLearningProfile,
    availableCourses: any[]
  ): Promise<CourseRecommendation[]> {
    const recommendations: CourseRecommendation[] = []

    // Recommend courses with similar difficulty
    const preferredDifficulty = userProfile.preferences.difficulty[0]
    
    const similarDifficultyCourses = availableCourses.filter(course => 
      course.difficulty === preferredDifficulty
    )

    similarDifficultyCourses.forEach(course => {
      const score = 0.6 // Base score for difficulty match
      
      recommendations.push({
        course: {
          id: course.id,
          slug: course.slug,
          title: course.translations[0]?.title || course.slug,
          description: course.translations[0]?.description || '',
          difficulty: course.difficulty,
          price: course.price,
          isPremium: course.isPremium,
          category: course.category ? {
            slug: course.category.slug,
            name: course.category.translations[0]?.name || course.category.slug
          } : undefined
        },
        score,
        reasons: [`Відповідає вашому рівню: ${preferredDifficulty}`],
        priority: 'MEDIUM',
        type: 'SIMILAR'
      })
    })

    return recommendations
  }

  /**
   * Get difficulty progression recommendations
   */
  private async getDifficultyProgressionRecommendations(
    userProfile: UserLearningProfile,
    availableCourses: any[]
  ): Promise<CourseRecommendation[]> {
    const recommendations: CourseRecommendation[] = []

    // If user has good scores and completed courses, suggest next difficulty level
    if (userProfile.statistics.averageTestScore >= 80 && userProfile.statistics.completedCourses >= 2) {
      const currentDifficulty = userProfile.preferences.difficulty[0]
      let nextDifficulty = ''

      if (currentDifficulty === 'BEGINNER') nextDifficulty = 'INTERMEDIATE'
      else if (currentDifficulty === 'INTERMEDIATE') nextDifficulty = 'ADVANCED'

      if (nextDifficulty) {
        const nextLevelCourses = availableCourses.filter(course => 
          course.difficulty === nextDifficulty
        )

        nextLevelCourses.forEach(course => {
          recommendations.push({
            course: {
              id: course.id,
              slug: course.slug,
              title: course.translations[0]?.title || course.slug,
              description: course.translations[0]?.description || '',
              difficulty: course.difficulty,
              price: course.price,
              isPremium: course.isPremium,
              category: course.category ? {
                slug: course.category.slug,
                name: course.category.translations[0]?.name || course.category.slug
              } : undefined
            },
            score: 0.7,
            reasons: ['Готові до наступного рівня складності', `Високий середній бал: ${userProfile.statistics.averageTestScore}%`],
            priority: 'HIGH',
            type: 'CONTINUATION'
          })
        })
      }
    }

    return recommendations
  }

  /**
   * Get trending course recommendations
   */
  private async getTrendingRecommendations(availableCourses: any[]): Promise<CourseRecommendation[]> {
    // Simple trending logic based on recent enrollments
    const trendingCourses = await prisma.course.findMany({
      where: {
        isPublished: true,
        enrollments: {
          some: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }
      },
      include: {
        category: {
          include: {
            translations: {
              where: { language: 'UA' }
            }
          }
        },
        translations: {
          where: { language: 'UA' }
        },
        _count: {
          select: {
            enrollments: {
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
              }
            }
          }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      },
      take: 5
    })

    return trendingCourses.map(course => ({
      course: {
        id: course.id,
        slug: course.slug,
        title: course.translations[0]?.title || course.slug,
        description: course.translations[0]?.description || '',
        difficulty: course.difficulty,
        price: course.price,
        isPremium: course.isPremium,
        category: course.category ? {
          slug: course.category.slug,
          name: course.category.translations[0]?.name || course.category.slug
        } : undefined
      },
      score: 0.5,
      reasons: ['Популярний серед інших студентів', `${course._count.enrollments} нових записів цього місяця`],
      priority: 'LOW',
      type: 'TRENDING'
    }))
  }

  /**
   * Get knowledge gap recommendations
   */
  private async getKnowledgeGapRecommendations(
    userProfile: UserLearningProfile,
    availableCourses: any[]
  ): Promise<CourseRecommendation[]> {
    const recommendations: CourseRecommendation[] = []

    // Recommend courses in improvement areas
    userProfile.statistics.improvementAreas.forEach(area => {
      const coursesInArea = availableCourses.filter(course => 
        course.category?.slug === area
      )

      coursesInArea.forEach(course => {
        recommendations.push({
          course: {
            id: course.id,
            slug: course.slug,
            title: course.translations[0]?.title || course.slug,
            description: course.translations[0]?.description || '',
            difficulty: course.difficulty,
            price: course.price,
            isPremium: course.isPremium,
            category: course.category ? {
              slug: course.category.slug,
              name: course.category.translations[0]?.name || course.category.slug
            } : undefined
          },
          score: 0.8,
          reasons: ['Поліпшення знань у слабшій темі', `Рекомендовано для покращення результатів`],
          priority: 'HIGH',
          type: 'PERSONALIZED'
        })
      })
    })

    return recommendations
  }

  /**
   * Remove duplicate recommendations
   */
  private removeDuplicateRecommendations(recommendations: CourseRecommendation[]): CourseRecommendation[] {
    const seen = new Set<string>()
    return recommendations.filter(rec => {
      if (seen.has(rec.course.id)) {
        return false
      }
      seen.add(rec.course.id)
      return true
    })
  }

  /**
   * Rank and sort recommendations by relevance
   */
  private rankRecommendations(
    recommendations: CourseRecommendation[],
    userProfile: UserLearningProfile
  ): CourseRecommendation[] {
    return recommendations
      .map(rec => {
        // Boost score based on user preferences
        let boostedScore = rec.score

        // Boost for favorite categories
        if (rec.course.category && userProfile.preferences.categories.includes(rec.course.category.slug)) {
          boostedScore += 0.3
        }

        // Boost for preferred difficulty
        if (userProfile.preferences.difficulty.includes(rec.course.difficulty)) {
          boostedScore += 0.2
        }

        // Boost high priority recommendations
        if (rec.priority === 'HIGH') {
          boostedScore += 0.1
        }

        return { ...rec, score: boostedScore }
      })
      .sort((a, b) => b.score - a.score)
  }
}

export const recommendationService = new RecommendationService()