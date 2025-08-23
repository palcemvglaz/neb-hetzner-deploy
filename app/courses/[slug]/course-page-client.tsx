'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Session } from 'next-auth'
import { 
  Clock, BookOpen, Users, Star, Award, Play, 
  CheckCircle, Lock, ChevronDown, ChevronUp,
  BarChart, Target, Shield, Zap
} from 'lucide-react'
import CourseReviews from '@/components/course-reviews'
import { showToast } from '@/components/ui/toast'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

interface CourseData {
  id: string
  slug: string
  title: string
  description: string
  longDescription: string
  category: string
  difficulty: string
  duration: string
  totalHours: number
  lessons: number
  students: number
  rating: number
  totalReviews: number
  isPremium: boolean
  price: number
  testId: string | null
  instructor: {
    name: string
    title: string
    bio: string
    image: string
  }
  whatYouLearn: string[]
  requirements: string[]
  sections: {
    id: string
    title: string
    description?: string
    lessons: {
      id: string
      title: string
      duration: string
      isCompleted: boolean
      isFree: boolean
    }[]
  }[]
}

interface CoursePageClientProps {
  course: CourseData
  isEnrolled: boolean
  progress: number
  session: Session | null
}

export default function CoursePageClient({ 
  course, 
  isEnrolled, 
  progress, 
  session 
}: CoursePageClientProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([course.sections[0]?.id || ''])
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview')

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs 
            items={[
              { label: 'Курси', href: '/courses' },
              { label: course.category },
              { label: course.title }
            ]}
          />
        </div>
      </div>

      {/* Course Header */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-800/50 px-3 py-1 rounded-full text-sm">
                    {course.category}
                  </span>
                  <span className="bg-blue-800/50 px-3 py-1 rounded-full text-sm">
                    {course.difficulty}
                  </span>
                  {!course.isPremium && (
                    <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Безкоштовно
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-blue-100 mb-6">{course.description}</p>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(course.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-blue-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{course.rating.toFixed(1)}</span>
                    <span className="text-blue-200">({course.totalReviews} відгуків)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-300" />
                    <span>{course.students} учнів</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-blue-200">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {course.lessons} уроків
                  </span>
                  <span className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    {course.totalHours} годин
                  </span>
                </div>
              </div>
              
              {/* Course Card */}
              <div className="bg-white text-gray-900 rounded-lg p-6">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-16 h-16 text-gray-400" />
                </div>
                
                {session ? (
                  isEnrolled ? (
                    <>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Ваш прогрес</span>
                          <span className="font-semibold">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <Link
                        href={`/learn/${course.slug}`}
                        className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Продовжити навчання
                      </Link>
                      {course.testId && progress === 100 && (
                        <Link
                          href={`/tests/${course.testId}`}
                          className="block w-full mt-2 bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Пройти тест
                        </Link>
                      )}
                    </>
                  ) : course.isPremium ? (
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/stripe/checkout', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              courseId: course.id,
                              type: 'course'
                            })
                          })
                          
                          const data = await res.json()
                          
                          if (res.ok && data.url) {
                            window.location.href = data.url
                          } else {
                            showToast({
                              type: 'error',
                              title: 'Помилка оплати',
                              message: data.error || 'Не вдалося створити сесію оплати'
                            })
                          }
                        } catch (error) {
                          console.error('Checkout error:', error)
                          showToast({
                            type: 'error',
                            title: 'Помилка',
                            message: 'Не вдалося перейти до оплати. Спробуйте ще раз.'
                          })
                        }
                      }}
                      className="w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Купити курс - {course.price} ₴
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/courses/${course.id}/enroll`, { method: 'POST' })
                          if (res.ok) {
                            showToast({
                              type: 'success',
                              title: 'Успішно!',
                              message: 'Ви записані на курс'
                            })
                            setTimeout(() => window.location.reload(), 1500)
                          } else {
                            const data = await res.json()
                            showToast({
                              type: 'error',
                              title: 'Помилка',
                              message: data.error || 'Не вдалося записатися на курс'
                            })
                          }
                        } catch (error) {
                          console.error('Enrollment error:', error)
                          showToast({
                            type: 'error',
                            title: 'Помилка',
                            message: 'Не вдалося записатися на курс. Спробуйте ще раз.'
                          })
                        }
                      }}
                      className="w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Почати безкоштовний курс
                    </button>
                  )
                ) : (
                  <>
                    <p className="text-center mb-4">
                      {course.isPremium ? `${course.price} ₴` : 'Безкоштовно'}
                    </p>
                    <Link
                      href="/register"
                      className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-2"
                    >
                      Зареєструватися
                    </Link>
                    <Link
                      href="/login"
                      className="block w-full text-center text-blue-600 hover:underline"
                    >
                      Вже є акаунт? Увійти
                    </Link>
                  </>
                )}
                
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Необмежений доступ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-500" />
                    <span>Сертифікат після завершення</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>30-денна гарантія повернення</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'overview' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Огляд
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'curriculum' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Програма курсу
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'reviews' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Відгуки ({course.totalReviews})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* About Course */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Про курс</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {course.longDescription}
                    </p>
                  </div>

                  {/* What You'll Learn */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Що ви вивчите</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {course.whatYouLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Вимоги</h2>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Instructor */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                    <h3 className="text-xl font-bold mb-4">Інструктор</h3>
                    <div className="text-center mb-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
                      <h4 className="font-semibold">{course.instructor.name}</h4>
                      <p className="text-sm text-gray-600">{course.instructor.title}</p>
                    </div>
                    <p className="text-gray-700 mb-4">{course.instructor.bio}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>4.9 рейтинг інструктора</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>3,489 учнів</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-500" />
                        <span>12 курсів</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Програма курсу</h2>
                <div className="space-y-4">
                  {course.sections.map((section) => (
                    <div key={section.id} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-center gap-4">
                            <h3 className="font-semibold text-left">{section.title}</h3>
                            <span className="text-sm text-gray-600">
                              {section.lessons.length} уроків
                            </span>
                          </div>
                          {section.description && (
                            <p className="text-sm text-gray-600 text-left">
                              {section.description}
                            </p>
                          )}
                        </div>
                        {expandedSections.includes(section.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      {expandedSections.includes(section.id) && (
                        <div className="p-4 space-y-3">
                          {section.lessons.map((lesson) => (
                            <div 
                              key={lesson.id}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.isCompleted ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : lesson.isFree ? (
                                  <Play className="w-5 h-5 text-blue-500" />
                                ) : (
                                  <Lock className="w-5 h-5 text-gray-400" />
                                )}
                                <span className={lesson.isCompleted ? 'text-gray-500' : ''}>
                                  {lesson.title}
                                </span>
                                {lesson.isFree && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Безкоштовно
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <CourseReviews 
                courseId={course.id}
                courseSlug={course.slug}
                averageRating={course.rating}
                totalReviews={course.totalReviews}
                userCanReview={Boolean(session && progress === 100)}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}