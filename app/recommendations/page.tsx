import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { recommendationService } from '@/lib/ai/recommendation-service'
import { Brain, TrendingUp, Target, Star, BookOpen, Users, Clock, Award } from 'lucide-react'
import Link from 'next/link'

async function getRecommendationsData(userId: string) {
  const recommendations = await recommendationService.getRecommendations(userId, 20)
  
  // Group recommendations by type
  const groupedRecommendations = recommendations.reduce((groups, rec) => {
    const type = rec.type
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(rec)
    return groups
  }, {} as Record<string, any[]>)

  return { recommendations, groupedRecommendations }
}

export default async function RecommendationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const { recommendations, groupedRecommendations } = 
    await getRecommendationsData(session.user.id)

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'CONTINUATION':
        return {
          title: 'Продовження навчання',
          description: 'Курси, які логічно продовжують ваш навчальний шлях',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'bg-blue-500'
        }
      case 'SIMILAR':
        return {
          title: 'Схожі курси',
          description: 'Курси подібні до тих, які ви вже проходили',
          icon: <Target className="w-6 h-6" />,
          color: 'bg-green-500'
        }
      case 'TRENDING':
        return {
          title: 'Популярні курси',
          description: 'Курси, які обирають інші студенти',
          icon: <Star className="w-6 h-6" />,
          color: 'bg-yellow-500'
        }
      case 'PERSONALIZED':
        return {
          title: 'Персональні рекомендації',
          description: 'Курси, підібрані спеціально для вас на основі аналізу',
          icon: <Brain className="w-6 h-6" />,
          color: 'bg-purple-500'
        }
      default:
        return {
          title: 'Рекомендовані курси',
          description: 'Курси для вашого розвитку',
          icon: <BookOpen className="w-6 h-6" />,
          color: 'bg-gray-500'
        }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'text-green-600 bg-green-100'
      case 'INTERMEDIATE':
        return 'text-yellow-600 bg-yellow-100'
      case 'ADVANCED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'Початковий'
      case 'INTERMEDIATE':
        return 'Середній'
      case 'ADVANCED':
        return 'Просунутий'
      default:
        return difficulty
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">AI Рекомендації</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Персональні рекомендації курсів на основі аналізу вашого навчального прогресу
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{recommendations.length}</div>
                    <div className="text-sm text-gray-600">Рекомендацій</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {groupedRecommendations.CONTINUATION?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Продовження</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {groupedRecommendations.TRENDING?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Популярні</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {groupedRecommendations.PERSONALIZED?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Персональні</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations by Type */}
          {Object.entries(groupedRecommendations).map(([type, typeRecommendations]) => {
            const config = getTypeConfig(type)
            
            return (
              <div key={type} className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 ${config.color} rounded-full flex items-center justify-center text-white`}>
                    {config.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
                    <p className="text-gray-600 text-sm">{config.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typeRecommendations.map((recommendation) => (
                    <div
                      key={recommendation.course.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Header with score */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm ml-1 font-medium">
                              {(recommendation.score * 100).toFixed(0)}% відповідність
                            </span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                            {recommendation.priority}
                          </span>
                        </div>

                        {/* Course title */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {recommendation.course.title}
                        </h3>

                        {/* Course description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {recommendation.course.description}
                        </p>

                        {/* Course metadata */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(recommendation.course.difficulty)}`}>
                            {getDifficultyLabel(recommendation.course.difficulty)}
                          </span>
                          
                          {recommendation.course.category && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                              {recommendation.course.category.name}
                            </span>
                          )}

                          {recommendation.course.isPremium && (
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                              Premium
                            </span>
                          )}
                        </div>

                        {/* Recommendation reasons */}
                        {recommendation.reasons.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Чому рекомендуємо:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {recommendation.reasons.slice(0, 2).map((reason: string, index: number) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-purple-500 mt-0.5">•</span>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Price and action */}
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">
                            {recommendation.course.price > 0 ? (
                              `₴${recommendation.course.price}`
                            ) : (
                              <span className="text-green-600">Безкоштовно</span>
                            )}
                          </div>
                          
                          <Link
                            href={`/courses/${recommendation.course.slug}`}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            Детальніше
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* No recommendations state */}
          {recommendations.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Поки що немає рекомендацій
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Запишіться на курси та завершіть кілька уроків, щоб отримати персональні рекомендації на основі вашого навчального стилю
              </p>
              <Link
                href="/courses"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Переглянути всі курси
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}