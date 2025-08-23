'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

type User = {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: Date
  lastLoginAt: Date | null
  school: { name: string } | null
  subscription: { plan: string; status: string } | null
}

type UsersTableProps = {
  data: {
    users: User[]
    total: number
    pages: number
    currentPage: number
  }
}

const roleLabels: Record<string, string> = {
  STUDENT: 'Студент',
  INSTRUCTOR: 'Інструктор',
  SCHOOL_ADMIN: 'Адмін школи',
  ADMIN: 'Адміністратор',
}

const roleColors: Record<string, string> = {
  STUDENT: 'bg-blue-100 text-blue-800',
  INSTRUCTOR: 'bg-green-100 text-green-800',
  SCHOOL_ADMIN: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-red-100 text-red-800',
}

export default function UsersTable({ data }: UsersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`/admin/users?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Помилка при видаленні користувача')
      }
    } catch (error) {
      alert('Помилка при видаленні користувача')
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Search */}
      <div className="p-4 border-b">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Пошук за email або ім'ям..."
              className="pl-10 pr-3 py-2 border rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-nebachiv-600 text-white rounded-md hover:bg-nebachiv-700"
          >
            Пошук
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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
                Школа
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Підписка
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Реєстрація
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Останній вхід
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Дії</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.users.map((user) => (
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
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      roleColors[user.role] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {roleLabels[user.role] || user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.school?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.subscription ? (
                    <span className="capitalize">
                      {user.subscription.plan} ({user.subscription.status})
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: uk })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLoginAt
                    ? format(new Date(user.lastLoginAt), 'dd MMM yyyy HH:mm', { locale: uk })
                    : 'Ніколи'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                      className="text-nebachiv-600 hover:text-nebachiv-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="px-4 py-3 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Показано {(data.currentPage - 1) * 10 + 1} -{' '}
              {Math.min(data.currentPage * 10, data.total)} з {data.total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(data.currentPage - 1)}
                disabled={data.currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded text-sm ${
                    page === data.currentPage
                      ? 'bg-nebachiv-600 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(data.currentPage + 1)}
                disabled={data.currentPage === data.pages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}