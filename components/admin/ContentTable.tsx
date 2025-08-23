'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import Link from 'next/link'
import { 
  Search, Edit, Trash2, Eye, Clock, Tag,
  BookOpen, Video, FileText, HelpCircle, Dumbbell, ClipboardList
} from 'lucide-react'

type ContentItem = {
  id: string
  slug: string
  type: string
  status: string
  isPublished: boolean
  isPremium: boolean
  order: number
  difficulty: string
  translations: Array<{
    title: string
    description: string | null
  }>
  tags: Array<{
    tag: {
      slug: string
      nameUa: string
    }
  }>
  _count: {
    tests: number
    userProgress: number
  }
  createdAt: Date
  updatedAt: Date
}

type ContentTableProps = {
  data: {
    content: ContentItem[]
    total: number
    pages: number
    currentPage: number
  }
}

const typeIcons = {
  ARTICLE: BookOpen,
  VIDEO: Video,
  GUIDE: FileText,
  LESSON: HelpCircle,
  EXERCISE: Dumbbell,
}

const typeLabels = {
  ARTICLE: 'Стаття',
  VIDEO: 'Відео',
  GUIDE: 'Гайд',
  LESSON: 'Урок',
  EXERCISE: 'Вправа',
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  REVIEW: 'bg-yellow-100 text-yellow-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-red-100 text-red-800',
}

const statusLabels = {
  DRAFT: 'Чернетка',
  REVIEW: 'На перевірці',
  PUBLISHED: 'Опубліковано',
  ARCHIVED: 'Архів',
}

const difficultyColors = {
  BEGINNER: 'bg-green-100 text-green-800',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
  ADVANCED: 'bg-red-100 text-red-800',
}

const difficultyLabels = {
  BEGINNER: 'Початковий',
  INTERMEDIATE: 'Середній',
  ADVANCED: 'Складний',
}

export default function ContentTable({ data }: ContentTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    if (typeFilter) {
      params.set('type', typeFilter)
    } else {
      params.delete('type')
    }
    params.set('page', '1')
    router.push(`/admin/content?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`/admin/content?${params.toString()}`)
  }

  const handleDelete = async (contentId: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей контент?')) return

    try {
      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Помилка при видаленні контенту')
      }
    } catch (error) {
      alert('Помилка при видаленні контенту')
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Search and filters */}
      <div className="p-4 border-b">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Пошук за назвою або описом..."
              className="pl-10 pr-3 py-2 border rounded-md w-full"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Всі типи</option>
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-nebachiv-600 text-white rounded-md hover:bg-nebachiv-700"
          >
            Фільтрувати
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Контент
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Складність
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статистика
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Оновлено
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Дії</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.content.map((item) => {
              const Icon = typeIcons[item.type as keyof typeof typeIcons] || BookOpen
              const title = item.translations[0]?.title || 'Без назви'
              const description = item.translations[0]?.description
              
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {title}
                      </div>
                      {description && (
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {description}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {item.isPremium && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            Преміум
                          </span>
                        )}
                        {item.tags.slice(0, 3).map((tagItem) => (
                          <span
                            key={tagItem.tag.slug}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                          >
                            <Tag className="inline h-3 w-3 mr-1" />
                            {tagItem.tag.nameUa}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {typeLabels[item.type as keyof typeof typeLabels] || item.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[item.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[item.status as keyof typeof statusLabels] || item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        difficultyColors[item.difficulty as keyof typeof difficultyColors]
                      }`}
                    >
                      {difficultyLabels[item.difficulty as keyof typeof difficultyLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {item._count.userProgress} переглядів
                      </div>
                      <div className="flex items-center">
                        <ClipboardList className="h-4 w-4 mr-1" />
                        {item._count.tests} тестів
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(item.updatedAt), 'dd MMM yyyy', { locale: uk })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/content/${item.slug}`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/content/${item.id}/edit`}
                        className="text-nebachiv-600 hover:text-nebachiv-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
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
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                ←
              </button>
              {Array.from({ length: Math.min(data.pages, 5) }, (_, i) => i + 1).map((page) => (
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
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}