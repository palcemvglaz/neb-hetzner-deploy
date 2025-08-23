'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronLeft, ChevronRight, CheckCircle, Circle, 
  Clock, BookOpen, Award, Play, Pause, 
  RotateCcw, Volume2, Settings, FileText,
  ChevronDown, ChevronUp, Home
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface LessonData {
  id: string
  title: string
  content: string
  contentType: string
  videoUrl?: string | null
  duration: number
  section: {
    id: string
    title: string
    course: {
      id: string
      title: string
      slug: string
    }
  }
  navigation: {
    previousLesson: { id: string; title: string } | null
    nextLesson: { id: string; title: string } | null
    allLessons: {
      id: string
      title: string
      isCompleted: boolean
    }[]
  }
}

interface LessonPlayerProps {
  lesson: LessonData
  progress: {
    isCompleted: boolean
    completedAt: Date | null
  }
  userId: string
}

export default function LessonPlayer({ lesson, progress, userId }: LessonPlayerProps) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(progress.isCompleted)
  const [showSidebar, setShowSidebar] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [readingTime, setReadingTime] = useState(0)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)

  // Calculate reading time
  useEffect(() => {
    const wordsPerMinute = 200
    const words = lesson.content.split(/\s+/).length
    const time = Math.ceil(words / wordsPerMinute)
    setReadingTime(time)
  }, [lesson.content])

  // Auto-mark as complete when user spends enough time
  useEffect(() => {
    if (!isCompleted && readingTime > 0) {
      const requiredTime = Math.min(readingTime * 0.8, lesson.duration) * 60 * 1000 // 80% of reading time in ms
      const startTime = Date.now()

      const checkTime = setInterval(() => {
        const elapsed = Date.now() - startTime
        if (elapsed >= requiredTime) {
          markAsComplete()
          clearInterval(checkTime)
        }
      }, 5000) // Check every 5 seconds

      return () => clearInterval(checkTime)
    }
  }, [isCompleted, readingTime, lesson.duration])

  const markAsComplete = async () => {
    if (isMarkingComplete || isCompleted) return

    setIsMarkingComplete(true)
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (res.ok) {
        setIsCompleted(true)
      }
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error)
    } finally {
      setIsMarkingComplete(false)
    }
  }

  const handleNext = () => {
    if (lesson.navigation.nextLesson) {
      router.push(`/courses/${lesson.section.course.slug}/lesson/${lesson.navigation.nextLesson.id}`)
    } else {
      // If no next lesson, go to course completion or course page
      router.push(`/courses/${lesson.section.course.slug}`)
    }
  }

  const handlePrevious = () => {
    if (lesson.navigation.previousLesson) {
      router.push(`/courses/${lesson.section.course.slug}/lesson/${lesson.navigation.previousLesson.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r overflow-hidden`}>
        <div className="p-4 border-b">
          <Link 
            href={`/courses/${lesson.section.course.slug}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Home className="w-4 h-4" />
            <span className="truncate">{lesson.section.course.title}</span>
          </Link>
          <h3 className="font-semibold mt-2">{lesson.section.title}</h3>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="space-y-2">
            {lesson.navigation.allLessons.map((l) => (
              <Link
                key={l.id}
                href={`/courses/${lesson.section.course.slug}/lesson/${l.id}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  l.id === lesson.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {l.isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
                <span className={`text-sm ${l.id === lesson.id ? 'font-medium' : ''}`}>
                  {l.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {showSidebar ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              <div>
                <h1 className="text-xl font-semibold">{lesson.title}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lesson.duration} хв
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    ~{readingTime} хв читання
                  </span>
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Завершено
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isCompleted && (
                <button
                  onClick={markAsComplete}
                  disabled={isMarkingComplete}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Позначити як завершене
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {lesson.contentType === 'VIDEO' && lesson.videoUrl ? (
              <div className="mb-8">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={lesson.videoUrl} type="video/mp4" />
                    Ваш браузер не підтримує відео.
                  </video>
                </div>
              </div>
            ) : lesson.contentType === 'VIDEO' ? (
              <div className="mb-8">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Відео недоступне</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {lesson.content}
              </ReactMarkdown>
            </div>

            {/* Lesson completion message */}
            {isCompleted && (
              <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Урок завершено!</h3>
                    <p className="text-green-700">Ви успішно пройшли цей урок. Продовжуйте навчання!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <footer className="bg-white border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={!lesson.navigation.previousLesson}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                lesson.navigation.previousLesson
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Попередній урок</span>
            </button>

            <div className="flex items-center gap-2">
              {lesson.navigation.allLessons.map((l, idx) => (
                <div
                  key={l.id}
                  className={`w-2 h-2 rounded-full ${
                    l.isCompleted 
                      ? 'bg-green-500' 
                      : l.id === lesson.id
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span className="hidden sm:inline">
                {lesson.navigation.nextLesson ? 'Наступний урок' : 'Завершити розділ'}
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}