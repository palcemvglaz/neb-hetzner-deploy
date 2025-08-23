'use client'

import { useState } from 'react'
import { 
  Search, Filter, Download, Mail, MoreVertical,
  User, BookOpen, Award, Clock, TrendingUp,
  CheckCircle, AlertCircle, XCircle
} from 'lucide-react'

// Mock data
const students = [
  {
    id: '1',
    name: 'Олександр Коваленко',
    email: 'alex.kovalenko@gmail.com',
    enrolledCourses: 3,
    completedCourses: 2,
    averageProgress: 85,
    lastActive: '2024-02-18T10:30:00',
    status: 'active',
    totalSpent: 1497
  },
  {
    id: '2',
    name: 'Марія Петренко',
    email: 'maria.petrenko@gmail.com',
    enrolledCourses: 2,
    completedCourses: 1,
    averageProgress: 65,
    lastActive: '2024-02-17T15:45:00',
    status: 'active',
    totalSpent: 998
  },
  {
    id: '3',
    name: 'Дмитро Мельник',
    email: 'dmytro.m@gmail.com',
    enrolledCourses: 4,
    completedCourses: 4,
    averageProgress: 100,
    lastActive: '2024-02-16T09:00:00',
    status: 'completed',
    totalSpent: 1996
  },
  {
    id: '4',
    name: 'Віталій Романенко',
    email: 'vitaliy.r@gmail.com',
    enrolledCourses: 1,
    completedCourses: 0,
    averageProgress: 15,
    lastActive: '2024-02-10T14:20:00',
    status: 'inactive',
    totalSpent: 499
  }
]

const courseProgress = [
  { studentId: '1', courseName: '8 принципів Небачива', progress: 100, lastAccessed: '2024-02-18' },
  { studentId: '1', courseName: 'Екстрене гальмування', progress: 75, lastAccessed: '2024-02-17' },
  { studentId: '1', courseName: 'Міська їзда', progress: 45, lastAccessed: '2024-02-15' },
  { studentId: '2', courseName: '8 принципів Небачива', progress: 100, lastAccessed: '2024-02-16' },
  { studentId: '2', courseName: 'Екстрене гальмування', progress: 30, lastAccessed: '2024-02-17' },
]

export default function InstructorStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'completed':
        return <Award className="w-5 h-5 text-blue-500" />
      case 'inactive':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активний'
      case 'completed':
        return 'Завершив'
      case 'inactive':
        return 'Неактивний'
      default:
        return 'Невідомо'
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Учні</h1>
          <p className="mt-2 text-gray-600">Управління та відстеження прогресу учнів</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-5 h-5" />
          <span>Експорт даних</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{students.length}</div>
          <div className="text-sm text-gray-600">Всього учнів</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {students.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Активних</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {students.filter(s => s.completedCourses > 0).length}
          </div>
          <div className="text-sm text-gray-600">Завершили курси</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(students.reduce((acc, s) => acc + s.averageProgress, 0) / students.length)}%
          </div>
          <div className="text-sm text-gray-600">Середній прогрес</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Пошук учнів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Всі статуси</option>
            <option value="active">Активні</option>
            <option value="completed">Завершили</option>
            <option value="inactive">Неактивні</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Учень
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Курси
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Прогрес
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Остання активність
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Дії</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      {student.enrolledCourses}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {student.completedCourses}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${student.averageProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {student.averageProgress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(student.status)}
                    <span className="text-sm text-gray-900">
                      {getStatusLabel(student.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(student.lastActive).toLocaleDateString('uk-UA', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === student.id ? null : student.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {showDropdown === student.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => setSelectedStudent(student.id)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left"
                        >
                          <User className="w-4 h-4 text-gray-500" />
                          <span>Детальніше</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>Надіслати email</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Деталі учня</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Student info and course progress would go here */}
              <p className="text-gray-600">Детальна інформація про учня та його прогрес...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}