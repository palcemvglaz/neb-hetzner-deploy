'use client'

import { useState, useEffect } from 'react'
import { Download, Check, Loader2, AlertCircle } from 'lucide-react'
import { useCapacitor } from '@/hooks/useCapacitor'

interface OfflineCourseButtonProps {
  courseId: string
  courseTitle: string
  lessonCount?: number
  totalSize?: string
}

export function OfflineCourseButton({ 
  courseId, 
  courseTitle, 
  lessonCount = 0,
  totalSize = 'Невідомий розмір'
}: OfflineCourseButtonProps) {
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { isNative, isOnline } = useCapacitor()

  useEffect(() => {
    checkDownloadStatus()
  }, [courseId])

  const checkDownloadStatus = async () => {
    try {
      // Check if course is downloaded in cache
      const cache = await caches.open('nebachiv-offline-courses')
      const courseCacheKey = `/api/courses/${courseId}/offline-content`
      const cachedCourse = await cache.match(courseCacheKey)
      
      setIsDownloaded(!!cachedCourse)
    } catch (error) {
      console.error('Error checking download status:', error)
    }
  }

  const downloadCourse = async () => {
    if (!isOnline) {
      setError('Потрібен інтернет для завантаження курсу')
      return
    }

    setIsDownloading(true)
    setError(null)
    setDownloadProgress(0)

    try {
      // Request permission for persistent storage if in browser
      if (!isNative && 'storage' in navigator && 'persist' in navigator.storage) {
        await navigator.storage.persist()
      }

      // Fetch course content for offline use
      const response = await fetch(`/api/courses/${courseId}/offline-content`)
      
      if (!response.ok) {
        throw new Error('Не вдалося завантажити курс')
      }

      const courseData = await response.json()
      
      // Store in cache for offline access
      const cache = await caches.open('nebachiv-offline-courses')
      
      // Store main course data
      await cache.put(
        `/api/courses/${courseId}/offline-content`,
        new Response(JSON.stringify(courseData))
      )

      // Download and cache lessons
      const lessons = courseData.lessons || []
      const totalLessons = lessons.length

      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i]
        setDownloadProgress(Math.round(((i + 1) / totalLessons) * 100))

        // Cache lesson content
        try {
          const lessonResponse = await fetch(`/api/lessons/${lesson.id}/content`)
          if (lessonResponse.ok) {
            await cache.put(`/api/lessons/${lesson.id}/content`, lessonResponse.clone())
          }
        } catch (lessonError) {
          console.warn('Failed to cache lesson:', lesson.id, lessonError)
        }
      }

      // Cache course images and assets
      if (courseData.imageUrl) {
        try {
          const imageResponse = await fetch(courseData.imageUrl)
          if (imageResponse.ok) {
            await cache.put(courseData.imageUrl, imageResponse.clone())
          }
        } catch (imageError) {
          console.warn('Failed to cache course image:', imageError)
        }
      }

      setIsDownloaded(true)
      setDownloadProgress(100)
      
      // Show success notification
      if (isNative) {
        try {
          const { LocalNotifications } = await import('@capacitor/local-notifications')
          await LocalNotifications.schedule({
            notifications: [{
              title: 'Курс завантажено',
              body: `"${courseTitle}" тепер доступний офлайн`,
              id: Date.now(),
              schedule: { at: new Date(Date.now() + 1000) }
            }]
          })
        } catch (notifError) {
          console.warn('Failed to show local notification:', notifError)
        }
      }

      // Store download info in localStorage
      const downloadedCourses = JSON.parse(
        localStorage.getItem('downloaded-courses') || '[]'
      )
      downloadedCourses.push({
        courseId,
        title: courseTitle,
        downloadedAt: new Date().toISOString(),
        lessonCount,
        size: totalSize
      })
      localStorage.setItem('downloaded-courses', JSON.stringify(downloadedCourses))

    } catch (error) {
      console.error('Download failed:', error)
      setError(error instanceof Error ? error.message : 'Помилка завантаження')
    } finally {
      setIsDownloading(false)
    }
  }

  const removeCourse = async () => {
    try {
      const cache = await caches.open('nebachiv-offline-courses')
      
      // Remove main course data
      await cache.delete(`/api/courses/${courseId}/offline-content`)
      
      // Get course data to find lessons to remove
      const response = await fetch(`/api/courses/${courseId}/offline-content`)
      if (response.ok) {
        const courseData = await response.json()
        const lessons = courseData.lessons || []
        
        // Remove cached lessons
        for (const lesson of lessons) {
          await cache.delete(`/api/lessons/${lesson.id}/content`)
        }
        
        // Remove course image
        if (courseData.imageUrl) {
          await cache.delete(courseData.imageUrl)
        }
      }

      // Remove from localStorage
      const downloadedCourses = JSON.parse(
        localStorage.getItem('downloaded-courses') || '[]'
      )
      const updatedCourses = downloadedCourses.filter(
        (course: any) => course.courseId !== courseId
      )
      localStorage.setItem('downloaded-courses', JSON.stringify(updatedCourses))

      setIsDownloaded(false)
      setDownloadProgress(0)

    } catch (error) {
      console.error('Error removing course:', error)
      setError('Не вдалося видалити курс')
    }
  }

  if (!isOnline && !isDownloaded) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <AlertCircle className="w-4 h-4" />
        Потрібен інтернет
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="text-red-600 text-sm flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {isDownloaded ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="text-sm">Доступний офлайн</span>
          </div>
          <button
            onClick={removeCourse}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            Видалити
          </button>
        </div>
      ) : (
        <button
          onClick={downloadCourse}
          disabled={isDownloading || !isOnline}
          className="flex items-center gap-2 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Завантаження {downloadProgress}%
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Завантажити офлайн
            </>
          )}
        </button>
      )}

      <div className="text-xs text-gray-500">
        {lessonCount} уроків • {totalSize}
      </div>
    </div>
  )
}