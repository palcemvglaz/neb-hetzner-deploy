'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  GraduationCap,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Plus
} from 'lucide-react'
import { Loading } from '@/components/ui/loading'

interface Student {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
  lastLoginAt?: string
  overallProgress: number
  activeEnrollments: number
  completedLessons: number
  schoolGroup?: {
    id: string
    name: string
  }
  enrollments: Array<{
    course: {
      id: string
      title: string
      slug: string
    }
  }>
}

interface StudentsResponse {
  students: Student[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function SchoolStudentsPage() {
  const { data: session } = useSession()
  const [students, setStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState<StudentsResponse['pagination'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    if (session?.user?.role === 'SCHOOL') {
      fetchStudents()
    }
  }, [session, currentPage, searchTerm, selectedFilter])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedFilter !== 'all') params.append('filter', selectedFilter)

      const res = await fetch(`/api/school/students?${params}`)
      if (!res.ok) throw new Error('Failed to fetch students')
      
      const data: StudentsResponse = await res.json()
      setStudents(data.students)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA')
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100'
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getActivityStatus = (lastLogin?: string) => {
    if (!lastLogin) return { status: 'Ніколи не входив', color: 'text-gray-500' }
    
    const daysSinceLogin = Math.floor((Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLogin <= 7) return { status: 'Активний', color: 'text-green-600' }
    if (daysSinceLogin <= 30) return { status: 'Помірно активний', color: 'text-yellow-600' }
    return { status: 'Неактивний', color: 'text-red-600' }
  }

  if (session?.user?.role !== 'SCHOOL') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Немає доступу</h1>
          <p className="text-gray-600">Ви повинні бути адміністратором мотошколи</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Учні мотошколи</h1>
              <p className="text-gray-600">
                {pagination ? `${pagination.total} учнів загалом` : 'Завантаження...'}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/school/students/add"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Додати учня
              </Link>
              <Link
                href="/school/students/bulk-enroll"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
              >
                <GraduationCap className="w-5 h-5" />
                Масовий запис
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Пошук за ім'ям або email..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Всі учні</option>
                  <option value="active">Активні</option>
                  <option value="inactive">Неактивні</option>
                </select>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-8">
                <Loading size="lg" text="Завантаження учнів..." />
              </div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Учнів не знайдено</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Спробуйте інший пошуковий запит' : 'Почніть з додавання першого учня'}
                </p>
                <Link
                  href="/school/students/add"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                  Додати учня
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Учень
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Прогрес
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Курси
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Активність
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Група
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дії
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => {
                        const activity = getActivityStatus(student.lastLoginAt)
                        return (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-blue-600">
                                      {student.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {student.name || 'Без імені'}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {student.email}
                                  </div>
                                  {student.phone && (
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {student.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-1">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">Загальний прогрес</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(student.overallProgress)}`}>
                                      {student.overallProgress}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${student.overallProgress}%` }}
                                    />
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {student.completedLessons} уроків завершено
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {student.activeEnrollments} активних
                              </div>
                              <div className="text-sm text-gray-500">
                                курсів записано
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${activity.color}`}>
                                {activity.status}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.lastLoginAt ? 
                                  `Останній вхід: ${formatDate(student.lastLoginAt)}` :
                                  `Зареєстрований: ${formatDate(student.createdAt)}`
                                }
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {student.schoolGroup ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {student.schoolGroup.name}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">Без групи</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Попередня
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                        disabled={currentPage === pagination.pages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Наступна
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Показано{' '}
                          <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span>
                          {' '}до{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * pagination.limit, pagination.total)}
                          </span>
                          {' '}з{' '}
                          <span className="font-medium">{pagination.total}</span>
                          {' '}результатів
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Попередня
                          </button>
                          
                          {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                            const page = i + 1
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === page
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                            disabled={currentPage === pagination.pages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Наступна
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}