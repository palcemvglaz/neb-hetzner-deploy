'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle, Circle, Clock, PlayCircle } from 'lucide-react'

interface ProgressData {
  enrollment: {
    id: string
    progress: number
    startedAt: string
    completedAt?: string
  }
  stats: {
    completedItems: number
    totalItems: number
    progressPercentage: number
    timeSpent: number
    estimatedTime: number
  }
  sections: Array<{
    id: string
    title: string
    items: Array<{
      id: string
      contentId: string
      order: number
      isRequired: boolean
      isCompleted: boolean
      timeSpent: number
      estimatedTime: number
    }>
  }>
}

interface CourseProgressTrackerProps {
  courseId: string
  onProgressUpdate?: (progress: number) => void
}

export default function CourseProgressTracker({
  courseId,
  onProgressUpdate
}: CourseProgressTrackerProps) {
  const { data: session, status } = useSession()
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProgress = async () => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/progress`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch progress')
      }

      const data = await response.json()
      setProgressData(data)
      
      if (onProgressUpdate) {
        onProgressUpdate(data.stats.progressPercentage)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
      setError('Failed to load progress')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProgress = async (contentId: string, isCompleted: boolean, timeSpent: number = 0) => {
    if (status !== 'authenticated') return

    try {
      const response = await fetch(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          isCompleted,
          timeSpent
        })
      })

      if (response.ok) {
        // Refresh progress data
        await fetchProgress()
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [courseId, session, status])

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded-full mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !progressData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{error || 'Unable to load progress'}</p>
      </div>
    )
  }

  const { stats, sections } = progressData

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}г ${mins}хв`
    }
    return `${mins}хв`
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Загальний прогрес</h3>
          <span className="text-2xl font-bold text-blue-600">
            {stats.progressPercentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${stats.progressPercentage}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <span className="block font-medium text-gray-900">
              {stats.completedItems}/{stats.totalItems}
            </span>
            <span>Завершено уроків</span>
          </div>
          <div>
            <span className="block font-medium text-gray-900">
              {formatTime(stats.timeSpent)}
            </span>
            <span>Витрачено часу</span>
          </div>
          <div>
            <span className="block font-medium text-gray-900">
              {formatTime(stats.estimatedTime)}
            </span>
            <span>Загальна тривалість</span>
          </div>
          <div>
            <span className="block font-medium text-gray-900">
              {stats.estimatedTime > 0 ? Math.round((stats.timeSpent / stats.estimatedTime) * 100) : 0}%
            </span>
            <span>Ефективність</span>
          </div>
        </div>
      </div>

      {/* Section Progress */}
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => {
          const sectionCompleted = section.items.filter(item => item.isCompleted).length
          const sectionTotal = section.items.length
          const sectionProgress = sectionTotal > 0 ? (sectionCompleted / sectionTotal) * 100 : 0

          return (
            <div key={section.id} className="bg-white rounded-lg border overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{section.title}</h4>
                  <span className="text-sm text-gray-500">
                    {sectionCompleted}/{sectionTotal} уроків
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${sectionProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <button
                      onClick={() => updateProgress(item.contentId, !item.isCompleted)}
                      className="flex-shrink-0"
                    >
                      {item.isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300 hover:text-gray-500" />
                      )}
                    </button>

                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Урок {itemIndex + 1}
                        </span>
                        {item.isRequired && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            Обов'язковий
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(item.estimatedTime)}</span>
                        </div>
                        
                        {item.timeSpent > 0 && (
                          <div className="flex items-center gap-1">
                            <PlayCircle className="h-4 w-4" />
                            <span>Витрачено: {formatTime(item.timeSpent)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {item.isCompleted && (
                        <span className="text-xs text-green-600 font-medium">
                          Завершено
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}