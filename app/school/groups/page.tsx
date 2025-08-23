'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  UserPlus,
  MoreVertical
} from 'lucide-react'

interface Group {
  id: string
  name: string
  description?: string
  _count: {
    users: number
  }
}

export default function SchoolGroupsPage() {
  const { data: session } = useSession()
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.role === 'SCHOOL') {
      fetchGroups()
    }
  }, [session])

  const fetchGroups = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/school/groups')
      if (!res.ok) throw new Error('Failed to fetch groups')
      
      const data = await res.json()
      setGroups(data.groups)
    } catch (error) {
      console.error('Error fetching groups:', error)
      setError('Помилка завантаження груп')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/school/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create group')
      }

      setGroups(prev => [...prev, data.group])
      setShowCreateModal(false)
      setFormData({ name: '', description: '' })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsSubmitting(false)
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Групи учнів</h1>
              <p className="text-gray-600">
                Організуйте учнів у групи для зручного управління
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Створити групу
            </button>
          </div>

          {/* Groups Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Завантаження груп...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Груп поки немає</h3>
              <p className="text-gray-600 mb-6">
                Створіть першу групу для організації учнів
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Створити групу
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div key={group.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {group.name}
                      </h3>
                      {group.description && (
                        <p className="text-sm text-gray-600">{group.description}</p>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {group._count.users} {group._count.users === 1 ? 'учень' : 'учнів'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Group Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-semibold mb-4">Створити нову групу</h2>
                
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Назва групи *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Наприклад: Група А, Вечірня група..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Опис (необов'язково)
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Короткий опис групи..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false)
                        setFormData({ name: '', description: '' })
                        setError(null)
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Скасувати
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Створення...' : 'Створити'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}