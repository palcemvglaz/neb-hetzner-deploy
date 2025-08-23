'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Clock, Users, TrendingUp, Target, BookOpen, Brain, Zap } from 'lucide-react'

interface CourseRecommendation {
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

interface CourseRecommendationsProps {
  limit?: number
  showReasons?: boolean
  layout?: 'grid' | 'list'
  title?: string
}

export function CourseRecommendations({ 
  limit = 6, 
  showReasons = true,
  layout = 'grid',
  title = 'Рекомендовані курси'
}: CourseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecommendations()
  }, [limit])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/recommendations?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      
      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setError('Не вдалося завантажити рекомендації')
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CONTINUATION':
        return <TrendingUp className="w-4 h-4" />
      case 'SIMILAR':
        return <Target className="w-4 h-4" />
      case 'TRENDING':
        return <Star className="w-4 h-4" />
      case 'PERSONALIZED':
        return <Brain className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CONTINUATION':
        return 'Продовження'
      case 'SIMILAR':
        return 'Схожий'
      case 'TRENDING':
        return 'Популярний'
      case 'PERSONALIZED':
        return 'Персональний'
      default:
        return 'Рекомендований'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-100'
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100'
      case 'LOW':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className={`grid ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'gap-4'}`}>
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchRecommendations}
          className="mt-2 text-red-700 hover:text-red-800 underline"
        >
          Спробувати знову
        </button>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Немає рекомендацій</h3>
        <p className="text-gray-600">
          Завершіть кілька уроків, щоб отримати персональні рекомендації
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          {title}
        </h2>
        <div className="text-sm text-gray-500">
          AI-рекомендації на основі вашого прогресу
        </div>
      </div>

      <div className={`${
        layout === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      }`}>
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.course.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              {/* Header with type and priority */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(recommendation.type)}
                  <span className="text-sm text-gray-600">
                    {getTypeLabel(recommendation.type)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(recommendation.priority)}`}>
                    {recommendation.priority}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs ml-1">
                      {(recommendation.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
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
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>

              {/* Recommendation reasons */}
              {showReasons && recommendation.reasons.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Чому рекомендуємо:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {recommendation.reasons.slice(0, 2).map((reason, index) => (
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

      {/* Show more link */}
      {recommendations.length >= limit && (
        <div className="text-center">
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <Brain className="w-4 h-4" />
            Переглянути всі рекомендації
          </Link>
        </div>
      )}
    </div>
  )
}