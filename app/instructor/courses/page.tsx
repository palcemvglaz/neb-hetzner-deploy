'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, Search, Filter, MoreVertical, 
  Users, Star, TrendingUp, Clock, Eye, Edit, Trash2,
  BarChart3, BookOpen
} from 'lucide-react'

// Mock data
const courses = [
  {
    id: '1',
    title: '8 принципів Небачива',
    status: 'published',
    students: 89,
    rating: 4.9,
    reviews: 45,
    revenue: 44500,
    lastUpdated: '2024-02-10',
    completionRate: 92,
    lessons: 8
  },
  {
    id: '2',
    title: 'Екстрене гальмування',
    status: 'published',
    students: 67,
    rating: 4.8,
    reviews: 32,
    revenue: 33500,
    lastUpdated: '2024-02-05',
    completionRate: 88,
    lessons: 5
  },
  {
    id: '3',
    title: 'Міська їзда: Виживання в хаосі',
    status: 'draft',
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: 0,
    lastUpdated: '2024-02-15',
    completionRate: 0,
    lessons: 12
  },
]

export default function InstructorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDropdown, setShowDropdown] = useState<string | null>(null)

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мої курси</h1>
          <p className="mt-2 text-gray-600">Управління навчальними матеріалами</p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Створити курс</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Пошук курсів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Всі статуси</option>
              <option value="published">Опубліковані</option>
              <option value="draft">Чернетки</option>
              <option value="archived">Архівовані</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      course.status === 'published' 
                        ? 'bg-green-100 text-green-700'
                        : course.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {course.status === 'published' ? 'Опублікований' : 
                       course.status === 'draft' ? 'Чернетка' : 'Архівований'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons} уроків
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students} учнів
                    </span>
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {course.rating} ({course.reviews})
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {course.completionRate}% завершують
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Оновлено: {new Date(course.lastUpdated).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                  
                  {/* Stats */}
                  {course.status === 'published' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {course.revenue.toLocaleString()} ₴
                        </div>
                        <div className="text-sm text-gray-600">Загальний дохід</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {course.students}
                        </div>
                        <div className="text-sm text-gray-600">Активних учнів</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {course.completionRate}%
                        </div>
                        <div className="text-sm text-gray-600">Завершення</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="relative ml-4">
                  <button
                    onClick={() => setShowDropdown(showDropdown === course.id ? null : course.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  {showDropdown === course.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <Link
                        href={`/instructor/courses/${course.id}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span>Переглянути</span>
                      </Link>
                      <Link
                        href={`/instructor/courses/${course.id}/edit`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                        <span>Редагувати</span>
                      </Link>
                      <Link
                        href={`/instructor/courses/${course.id}/analytics`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 text-gray-500" />
                        <span>Аналітика</span>
                      </Link>
                      <button
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Видалити</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Курсів не знайдено</p>
          <Link
            href="/instructor/courses/new"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Створити перший курс →
          </Link>
        </div>
      )}
    </div>
  )
}