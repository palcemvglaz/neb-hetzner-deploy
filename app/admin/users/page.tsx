'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserPlus,
  CheckCircle,
  XCircle,
  Shield,
  GraduationCap,
  Building
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string | null
  role: 'STUDENT' | 'INSTRUCTOR' | 'SCHOOL_ADMIN' | 'ADMIN'
  emailVerified: Date | null
  createdAt: string
  lastLoginAt: string | null
  _count: {
    enrollments: number
    payments: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      
      if (response.ok) {
        await fetchUsers()
        setShowEditModal(false)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Ви впевнені що хочете видалити цього користувача?')) return
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      case 'INSTRUCTOR':
        return <GraduationCap className="h-4 w-4" />
      case 'SCHOOL_ADMIN':
        return <Building className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-800'
      case 'SCHOOL_ADMIN':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
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
        <h1 className="text-2xl font-bold text-gray-900">Користувачі</h1>
        <p className="text-gray-600">Управління користувачами платформи</p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук за email або ім'ям..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">Всі ролі</option>
          <option value="STUDENT">Студенти</option>
          <option value="INSTRUCTOR">Інструктори</option>
          <option value="SCHOOL_ADMIN">Адміни шкіл</option>
          <option value="ADMIN">Адміністратори</option>
        </select>

        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <UserPlus className="h-4 w-4" />
          Додати користувача
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Користувач
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Активність
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статистика
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || 'Без імені'}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.emailVerified ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Підтверджено</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm">Не підтверджено</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    Зареєстровано: {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Останній вхід: {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString('uk-UA')
                      : 'Ніколи'
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    Курсів: {user._count.enrollments}
                  </div>
                  <div className="text-sm text-gray-500">
                    Платежів: {user._count.payments}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowEditModal(true)
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Користувачів не знайдено</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Редагувати користувача</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ім'я</label>
                <input
                  type="text"
                  value={selectedUser.name || ''}
                  disabled
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Роль</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as any })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="STUDENT">Студент</option>
                  <option value="INSTRUCTOR">Інструктор</option>
                  <option value="SCHOOL_ADMIN">Адмін школи</option>
                  <option value="ADMIN">Адміністратор</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button
                onClick={() => updateUserRole(selectedUser.id, selectedUser.role)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}