'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  BarChart, 
  Edit3, 
  Eye,
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface Course {
  id: string
  slug: string
  title: string
  description: string
  price: number
  level: string
  category: string
  isPublished: boolean
  enrollments: { id: string }[]
  sections: { lessons: any[] }[]
  _count: {
    enrollments: number
    payments: number
  }
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPrice, setEditingPrice] = useState<{ courseId: string; price: number } | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses')
      if (!res.ok) throw new Error('Failed to fetch courses')
      const data = await res.json()
      setCourses(data.courses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const updateCoursePrice = async (courseId: string, newPrice: number) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice })
      })

      if (!res.ok) throw new Error('Failed to update price')
      
      // Update local state
      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, price: newPrice } : course
      ))
      setEditingPrice(null)
    } catch (err) {
      alert('Error updating price: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const togglePublished = async (courseId: string, isPublished: boolean) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished })
      })

      if (!res.ok) throw new Error('Failed to update status')
      
      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, isPublished: !isPublished } : course
      ))
    } catch (err) {
      alert('Error updating status: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const calculateTotalLessons = (course: Course) => {
    return course.sections.reduce((total, section) => total + section.lessons.length, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Завантаження курсів...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Помилка</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Управління курсами</h1>
              <p className="text-gray-600">Налаштування цін та публікації курсів</p>
            </div>
            <Link
              href="/admin/generate-course"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Згенерувати курс
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всього курсів</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Опубліковано</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.filter(c => c.isPublished).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всього учнів</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.reduce((total, course) => total + course.enrollments.length, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Платні курси</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.filter(c => c.price > 0).length}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Список курсів</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Курс
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ціна
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Учні
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дії
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {calculateTotalLessons(course)} уроків • {course.level}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingPrice?.courseId === course.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editingPrice.price}
                              onChange={(e) => setEditingPrice({
                                courseId: course.id,
                                price: parseFloat(e.target.value) || 0
                              })}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              min="0"
                              step="0.01"
                            />
                            <button
                              onClick={() => updateCoursePrice(course.id, editingPrice.price)}
                              className="text-green-600 hover:text-green-700"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingPrice(null)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {course.price === 0 ? 'Безкоштовно' : `${course.price} ₴`}
                            </span>
                            <button
                              onClick={() => setEditingPrice({ courseId: course.id, price: course.price })}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {course.enrollments.length} записаних
                        </div>
                        <div className="text-sm text-gray-500">
                          {course._count?.payments || 0} покупок
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePublished(course.id, course.isPublished)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            course.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {course.isPublished ? 'Опубліковано' : 'Чернетка'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/courses/${course.slug}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/courses/${course.id}/analytics`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <BarChart className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}