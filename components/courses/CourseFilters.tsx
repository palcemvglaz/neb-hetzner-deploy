'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Search } from 'lucide-react'

export default function CourseFilters({ 
  categories 
}: { 
  categories: Array<{ id: string, slug: string, translations: Array<{ name: string }>, _count: { courses: number } }> 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/courses?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Filter className="h-5 w-5 mr-2" />
        Фільтри
      </h2>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Пошук
        </label>
        <form action="/courses" method="get">
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={searchParams.get('search') || ''}
              placeholder="Назва курсу..."
              className="w-full pl-10 pr-3 py-2 border rounded-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="mt-2 w-full px-4 py-2 bg-nebachiv-600 text-white rounded-md hover:bg-nebachiv-700"
          >
            Знайти
          </button>
        </form>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Категорія
        </label>
        <select
          name="category"
          onChange={(e) => handleFilterChange('category', e.target.value)}
          defaultValue={searchParams.get('category') || 'all'}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="all">Всі категорії</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.translations[0]?.name || cat.slug} ({cat._count.courses})
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Складність
        </label>
        <select
          name="difficulty"
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          defaultValue={searchParams.get('difficulty') || 'all'}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="all">Всі рівні</option>
          <option value="BEGINNER">Початковий</option>
          <option value="INTERMEDIATE">Середній</option>
          <option value="ADVANCED">Складний</option>
        </select>
      </div>

      {/* Premium filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Тип доступу
        </label>
        <select
          name="premium"
          onChange={(e) => handleFilterChange('premium', e.target.value)}
          defaultValue={searchParams.get('premium') || 'all'}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="all">Всі курси</option>
          <option value="false">Безкоштовні</option>
          <option value="true">Преміум</option>
        </select>
      </div>
    </div>
  )
}