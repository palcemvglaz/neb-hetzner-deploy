'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Building,
  Users,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface SchoolGroup {
  id: string
  name: string
  _count: {
    students: number
  }
}

interface School {
  id: string
  name: string
  description: string | null
  address: string | null
  city: string
  phone: string | null
  email: string | null
  website: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  rating: number
  adminId: string
  admin: {
    name: string | null
    email: string
  }
  groups: SchoolGroup[]
  _count: {
    students: number
    instructors: number
    courses: number
    certificates: number
  }
  createdAt: string
  updatedAt: string
}

const CITIES = [
  'Київ', 'Харків', 'Одеса', 'Дніпро', 'Донецьк', 'Запоріжжя', 
  'Львів', 'Кривий Ріг', 'Миколаїв', 'Маріуполь', 'Луганськ',
  'Вінниця', 'Херсон', 'Полтава', 'Чернігів', 'Черкаси'
]

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [cityFilter, setCityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/admin/schools')
      
      if (response.status === 401) {
        console.error('Unauthorized: Please login as admin')
        window.location.href = '/login'
        return
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setSchools(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching schools:', error)
      setSchools([])
    } finally {
      setLoading(false)
    }
  }

  const deleteSchool = async (schoolId: string) => {
    if (!confirm('Ви впевнені що хочете видалити цю мотошколу? Всі дані студентів будуть збережені.')) return
    
    try {
      const response = await fetch(`/api/admin/schools/${schoolId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchSchools()
      }
    } catch (error) {
      console.error('Error deleting school:', error)
    }
  }

  const updateSchoolStatus = async (schoolId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/schools/${schoolId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        await fetchSchools()
      }
    } catch (error) {
      console.error('Error updating school:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'INACTIVE':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSchools = schools.filter(school => {
    const matchesSearch = !searchTerm || 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCity = cityFilter === 'all' || school.city === cityFilter
    const matchesStatus = statusFilter === 'all' || school.status === statusFilter
    
    return matchesSearch && matchesCity && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Мотошколи</h1>
        <p className="text-gray-600">Управління мотошколами та їх групами</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{schools.length}</p>
              <p className="text-sm text-gray-600">Всього шкіл</p>
            </div>
            <Building className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {schools.filter(s => s.status === 'ACTIVE').length}
              </p>
              <p className="text-sm text-gray-600">Активних</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {schools.reduce((sum, s) => sum + s._count.students, 0)}
              </p>
              <p className="text-sm text-gray-600">Студентів</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {schools.reduce((sum, s) => sum + s._count.certificates, 0)}
              </p>
              <p className="text-sm text-gray-600">Сертифікатів</p>
            </div>
            <Award className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук за назвою або email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Всі міста</option>
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Всі статуси</option>
          <option value="ACTIVE">Активні</option>
          <option value="INACTIVE">Неактивні</option>
          <option value="PENDING">Очікують</option>
        </select>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Додати школу
        </button>
      </div>

      {/* Schools Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredSchools.map((school) => (
          <div key={school.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {school.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(school.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(school.status)}`}>
                      {school.status === 'ACTIVE' ? 'Активна' : 
                       school.status === 'INACTIVE' ? 'Неактивна' : 'Очікує'}
                    </span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{school.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/schools/${school.id}`}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => deleteSchool(school.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {school.description && (
                <p className="text-gray-600 text-sm mb-4">{school.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{school.city}</span>
                  {school.address && <span className="text-xs">({school.address})</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{school._count.students} студентів</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4" />
                  <span>{school._count.instructors} інструкторів</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4" />
                  <span>{school._count.certificates} сертифікатів</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Контакти:</span>
                  <div className="flex items-center gap-3">
                    {school.phone && (
                      <a href={`tel:${school.phone}`} className="text-gray-600 hover:text-gray-900">
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    {school.email && (
                      <a href={`mailto:${school.email}`} className="text-gray-600 hover:text-gray-900">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {school.website && (
                      <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Адміністратор: <span className="font-medium">{school.admin.name || school.admin.email}</span></p>
                </div>
              </div>

              {school.groups.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Групи:</p>
                  <div className="flex flex-wrap gap-2">
                    {school.groups.map(group => (
                      <span key={group.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {group.name} ({group._count.students})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Мотошкіл не знайдено</p>
        </div>
      )}

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Додати нову мотошколу</h3>
            <p className="text-gray-600 mb-4">
              Функція створення мотошкіл буде доступна найближчим часом.
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  )
}