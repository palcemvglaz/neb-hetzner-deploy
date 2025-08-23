'use client'

import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock, BookOpen } from 'lucide-react'

interface CourseProgressProps {
  progress: number
  completedItems: number
  totalItems: number
  timeSpent?: number
  estimatedTime?: number
}

export default function CourseProgress({
  progress,
  completedItems,
  totalItems,
  timeSpent,
  estimatedTime
}: CourseProgressProps) {
  const progressPercentage = Math.round((completedItems / totalItems) * 100)

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Прогрес курсу</h3>
        <span className="text-sm text-gray-500">{progressPercentage}% завершено</span>
      </div>

      <Progress value={progress} className="mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-gray-600">
            {completedItems} з {totalItems} уроків
          </span>
        </div>

        {timeSpent && (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">
              {Math.floor(timeSpent / 60)}г {timeSpent % 60}хв витрачено
            </span>
          </div>
        )}

        {estimatedTime && (
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-purple-500" />
            <span className="text-gray-600">
              ~{Math.floor(estimatedTime / 60)}г {estimatedTime % 60}хв всього
            </span>
          </div>
        )}
      </div>
    </div>
  )
}