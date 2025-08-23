'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Target,
  Brain,
  Shield,
  Zap,
  BarChart,
  Copy
} from 'lucide-react'
import Link from 'next/link'

// Based on KB_NEB knowledge structure
const TEST_CATEGORIES = [
  { id: 'principles', name: '8 Принципів Небачива', icon: Brain, color: 'purple' },
  { id: 'scenarios', name: 'Небезпечні сценарії', icon: AlertTriangle, color: 'red' },
  { id: 'technical', name: 'Технічні навички', icon: Zap, color: 'yellow' },
  { id: 'perception', name: 'Сприйняття та увага', icon: Eye, color: 'blue' },
  { id: 'emergency', name: 'Екстрені ситуації', icon: Shield, color: 'orange' },
  { id: 'rules', name: 'ПДР та етика', icon: Target, color: 'green' }
]

const DIFFICULTY_LEVELS = [
  { value: 'BEGINNER', label: 'Початківець', color: 'green' },
  { value: 'INTERMEDIATE', label: 'Середній', color: 'yellow' },
  { value: 'ADVANCED', label: 'Просунутий', color: 'red' }
]

interface Test {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  questionsCount: number
  passingScore: number
  timeLimit: number | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  attempts: number
  avgScore: number
  completionRate: number
  createdAt: string
  updatedAt: string
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/admin/tests')
      
      if (response.status === 401) {
        console.error('Unauthorized: Please login as admin')
        window.location.href = '/login'
        return
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setTests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching tests:', error)
      setTests([])
    } finally {
      setLoading(false)
    }
  }

  const deleteTest = async (testId: string) => {
    if (!confirm('Ви впевнені що хочете видалити цей тест? Всі результати також будуть видалені.')) return
    
    try {
      const response = await fetch(`/api/admin/tests/${testId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchTests()
      }
    } catch (error) {
      console.error('Error deleting test:', error)
    }
  }

  const duplicateTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/admin/tests/${testId}/duplicate`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await fetchTests()
      }
    } catch (error) {
      console.error('Error duplicating test:', error)
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return TEST_CATEGORIES.find(c => c.id === categoryId) || TEST_CATEGORIES[0]
  }

  const getDifficultyColor = (difficulty: string) => {
    const level = DIFFICULTY_LEVELS.find(l => l.value === difficulty)
    return level ? `text-${level.color}-600 bg-${level.color}-50` : 'text-gray-600 bg-gray-50'
  }

  const filteredTests = tests.filter(test => {
    const matchesSearch = !searchTerm || 
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || test.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || test.difficulty === difficultyFilter
    
    return matchesSearch && matchesCategory && matchesDifficulty
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
        <h1 className="text-2xl font-bold text-gray-900">Управління тестами</h1>
        <p className="text-gray-600">Тести на знання правил безпеки та технічних навичок</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{tests.length}</p>
              <p className="text-sm text-gray-600">Всього тестів</p>
            </div>
            <HelpCircle className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {tests.reduce((sum, t) => sum + t.questionsCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Питань</p>
            </div>
            <Target className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {tests.reduce((sum, t) => sum + t.attempts, 0)}
              </p>
              <p className="text-sm text-gray-600">Спроб</p>
            </div>
            <BarChart className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {Math.round(tests.reduce((sum, t) => sum + t.completionRate, 0) / tests.length || 0)}%
              </p>
              <p className="text-sm text-gray-600">Завершеність</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук тестів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Всі категорії</option>
          {TEST_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Всі рівні</option>
          {DIFFICULTY_LEVELS.map(level => (
            <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>

        <Link
          href="/admin/tests/create"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Створити тест
        </Link>
      </div>

      {/* Tests Grid */}
      <div className="grid gap-4">
        {filteredTests.map((test) => {
          const category = getCategoryInfo(test.category)
          const CategoryIcon = category.icon
          
          return (
            <div key={test.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-${category.color}-50 text-${category.color}-600`}>
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {test.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(test.difficulty)}`}>
                        {DIFFICULTY_LEVELS.find(l => l.value === test.difficulty)?.label}
                      </span>
                      {test.status === 'PUBLISHED' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : test.status === 'DRAFT' ? (
                        <Clock className="h-5 w-5 text-gray-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{test.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <HelpCircle className="h-4 w-4" />
                        {test.questionsCount} питань
                      </span>
                      <span className="text-gray-500">
                        Прохідний бал: {test.passingScore}%
                      </span>
                      {test.timeLimit && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-4 w-4" />
                          {test.timeLimit} хв
                        </span>
                      )}
                      <span className="text-gray-500">
                        Спроб: {test.attempts}
                      </span>
                      <span className="text-gray-500">
                        Середній бал: {test.avgScore}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/admin/tests/${test.id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/tests/${test.id}/edit`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => duplicateTest(test.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTest(test.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Завершеність</span>
                    <span>{test.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${test.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Тестів не знайдено</p>
        </div>
      )}
    </div>
  )
}