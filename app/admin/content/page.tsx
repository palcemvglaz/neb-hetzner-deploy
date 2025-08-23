'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  Video,
  BookOpen,
  Globe,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

// Based on KB_NEB structure
const CONTENT_CATEGORIES = [
  { id: '02', name: '6 Концепцій', icon: Star, color: 'yellow' },
  { id: '03', name: 'Стратегія та філософія', icon: BookOpen, color: 'purple' },
  { id: '04', name: 'Для новачків', icon: TrendingUp, color: 'green' },
  { id: '05', name: 'Міські сценарії', icon: FileText, color: 'blue' },
  { id: '06', name: 'Траса/Серпантини', icon: Globe, color: 'indigo' },
  { id: '07', name: 'Психологія та ЕГО', icon: AlertCircle, color: 'red' },
  { id: '09', name: 'Технічні навички', icon: CheckCircle, color: 'teal' }
]

const CONTENT_FORMATS = [
  { code: 'M', name: 'Master текст', icon: FileText },
  { code: 'T', name: 'Тези', icon: FileText },
  { code: 'V', name: 'Відео скрипт', icon: Video },
  { code: 'B', name: 'Блог', icon: BookOpen },
  { code: 'I', name: 'Instagram', icon: Globe }
]

const CONTENT_STATUS = [
  { value: 'done', label: 'Готово', color: 'green' },
  { value: 'doing', label: 'В роботі', color: 'yellow' },
  { value: 'todo', label: 'Заплановано', color: 'gray' },
  { value: 'check', label: 'На перевірці', color: 'blue' },
  { value: 'translate', label: 'На переклад', color: 'purple' }
]

interface Content {
  id: string
  title: string
  themeId: string
  category: string
  format: string
  language: string
  status: string
  priority: number
  isCornerstone: boolean
  knowledgeValue: {
    overallScore: number
    valueCategory: string
  }
  createdAt: string
  updatedAt: string
  viewCount: number
  _count: {
    translations: number
  }
}

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formatFilter, setFormatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content')
      
      if (response.status === 401) {
        console.error('Unauthorized: Please login as admin')
        window.location.href = '/login'
        return
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to fetch content')
      }
      
      const data = await response.json()
      // Ensure data is an array
      if (Array.isArray(data)) {
        setContent(data)
      } else {
        console.error('Invalid content data:', data)
        setContent([])
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      setContent([])
    } finally {
      setLoading(false)
    }
  }

  const deleteContent = async (contentId: string) => {
    if (!confirm('Ви впевнені що хочете видалити цей контент?')) return
    
    try {
      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchContent()
      }
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  const getFormatIcon = (format: string) => {
    const fmt = CONTENT_FORMATS.find(f => f.code === format)
    return fmt ? <fmt.icon className="h-4 w-4" /> : <FileText className="h-4 w-4" />
  }

  const getCategoryInfo = (categoryId: string) => {
    return CONTENT_CATEGORIES.find(c => c.id === categoryId) || CONTENT_CATEGORIES[0]
  }

  const getStatusColor = (status: string) => {
    const st = CONTENT_STATUS.find(s => s.value === status)
    return st ? `bg-${st.color}-100 text-${st.color}-800` : 'bg-gray-100 text-gray-800'
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.themeId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesFormat = formatFilter === 'all' || item.format === formatFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesFormat && matchesStatus
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
        <h1 className="text-2xl font-bold text-white">Управління контентом</h1>
        <p className="text-gray-400">Статті, гайди, відео та навчальні матеріали</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{content.length}</p>
              <p className="text-sm text-gray-400">Всього контенту</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {content.filter(c => c.isCornerstone).length}
              </p>
              <p className="text-sm text-gray-400">Основні концепції</p>
            </div>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {content.filter(c => c.status === 'done').length}
              </p>
              <p className="text-sm text-gray-400">Опубліковано</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {content.filter(c => c.status === 'doing').length}
              </p>
              <p className="text-sm text-gray-400">В роботі</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук за назвою або ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Всі категорії</option>
          {CONTENT_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Всі формати</option>
          {CONTENT_FORMATS.map(fmt => (
            <option key={fmt.code} value={fmt.code}>{fmt.name}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Всі статуси</option>
          {CONTENT_STATUS.map(st => (
            <option key={st.value} value={st.value}>{st.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Додати контент
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4">
        {filteredContent.map((item) => {
          const category = getCategoryInfo(item.category)
          const CategoryIcon = category.icon
          
          return (
            <div key={item.id} className="bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-${category.color}-50 text-${category.color}-600`}>
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      {item.isCornerstone && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          ⭐ Основна концепція
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        {getFormatIcon(item.format)}
                        {CONTENT_FORMATS.find(f => f.code === item.format)?.name}
                      </span>
                      <span>{item.language.toUpperCase()}</span>
                      <span>ID: {item.themeId}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.viewCount} переглядів
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {CONTENT_STATUS.find(s => s.value === item.status)?.label}
                      </span>
                      <span className="text-sm text-gray-400">
                        Пріоритет: {item.priority}
                      </span>
                      <span className="text-sm text-gray-400">
                        Оцінка: {item.knowledgeValue.overallScore}/10
                      </span>
                      {item._count.translations > 0 && (
                        <span className="text-sm text-gray-400">
                          🌐 {item._count.translations} перекладів
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/admin/content/${item.id}/edit`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteContent(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Контент не знайдено</p>
        </div>
      )}

      {/* Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Створити новий контент</h2>
            <p className="text-gray-400 mb-4">
              Для створення контенту використовуйте знання з KB_NEB vault
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