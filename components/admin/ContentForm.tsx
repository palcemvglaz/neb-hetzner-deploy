'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Plus } from 'lucide-react'

type Tag = {
  id: string
  slug: string
  nameUa: string
  nameEn?: string | null
  nameRu?: string | null
}

type ContentFormProps = {
  tags: Tag[]
  content?: {
    id: string
    type: string
    status: string
    isPremium: boolean
    difficulty: string
    estimatedTime?: number | null
    order: number
    translations: Array<{
      language: string
      title: string
      description?: string | null
      body: string
    }>
    tags: Array<{
      tagId: string
    }>
  }
}

export default function ContentForm({ tags, content }: ContentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [type, setType] = useState(content?.type || 'ARTICLE')
  const [status, setStatus] = useState(content?.status || 'DRAFT')
  const [isPremium, setIsPremium] = useState(content?.isPremium || false)
  const [difficulty, setDifficulty] = useState(content?.difficulty || 'BEGINNER')
  const [estimatedTime, setEstimatedTime] = useState(content?.estimatedTime?.toString() || '')
  const [order, setOrder] = useState(content?.order.toString() || '0')
  const [selectedTags, setSelectedTags] = useState<string[]>(
    content?.tags.map(t => t.tagId) || []
  )

  // Translations state
  const [translations, setTranslations] = useState({
    UA: {
      title: content?.translations.find(t => t.language === 'UA')?.title || '',
      description: content?.translations.find(t => t.language === 'UA')?.description || '',
      body: content?.translations.find(t => t.language === 'UA')?.body || '',
    },
    EN: {
      title: content?.translations.find(t => t.language === 'EN')?.title || '',
      description: content?.translations.find(t => t.language === 'EN')?.description || '',
      body: content?.translations.find(t => t.language === 'EN')?.body || '',
    },
    RU: {
      title: content?.translations.find(t => t.language === 'RU')?.title || '',
      description: content?.translations.find(t => t.language === 'RU')?.description || '',
      body: content?.translations.find(t => t.language === 'RU')?.body || '',
    }
  })

  const [activeLanguage, setActiveLanguage] = useState<'UA' | 'EN' | 'RU'>('UA')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const data = {
      type,
      status,
      isPremium,
      difficulty,
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
      order: parseInt(order),
      translations: Object.entries(translations)
        .filter(([_, trans]) => trans.title) // Only include translations with title
        .map(([language, trans]) => ({
          language,
          ...trans
        })),
      tagIds: selectedTags
    }

    try {
      const response = await fetch(
        content ? `/api/admin/content/${content.id}` : '/api/admin/content',
        {
          method: content ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )

      if (response.ok) {
        router.push('/admin/content')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Помилка при збереженні')
      }
    } catch (error) {
      alert('Помилка при збереженні')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Основна інформація</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Тип контенту
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="ARTICLE">Стаття</option>
              <option value="VIDEO">Відео</option>
              <option value="GUIDE">Гайд</option>
              <option value="LESSON">Урок</option>
              <option value="EXERCISE">Вправа</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Статус
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="DRAFT">Чернетка</option>
              <option value="REVIEW">На перевірці</option>
              <option value="PUBLISHED">Опубліковано</option>
              <option value="ARCHIVED">Архів</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Складність
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="BEGINNER">Початковий</option>
              <option value="INTERMEDIATE">Середній</option>
              <option value="ADVANCED">Складний</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Час на вивчення (хв)
            </label>
            <input
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              min="0"
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Порядок сортування
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              min="0"
              required
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="rounded border-gray-300 text-nebachiv-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Преміум контент
              </span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Теги
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer ${
                  selectedTags.includes(tag.id)
                    ? 'bg-nebachiv-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags([...selectedTags, tag.id])
                    } else {
                      setSelectedTags(selectedTags.filter(id => id !== tag.id))
                    }
                  }}
                  className="sr-only"
                />
                {tag.nameUa}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Translations */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Контент</h2>
        
        {/* Language tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {(['UA', 'EN', 'RU'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLanguage(lang)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeLanguage === lang
                    ? 'border-nebachiv-600 text-nebachiv-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {lang === 'UA' ? 'Українська' : lang === 'EN' ? 'English' : 'Русский'}
                {translations[lang].title && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Translation form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Заголовок {activeLanguage === 'UA' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={translations[activeLanguage].title}
              onChange={(e) => setTranslations({
                ...translations,
                [activeLanguage]: {
                  ...translations[activeLanguage],
                  title: e.target.value
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required={activeLanguage === 'UA'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Опис
            </label>
            <textarea
              value={translations[activeLanguage].description}
              onChange={(e) => setTranslations({
                ...translations,
                [activeLanguage]: {
                  ...translations[activeLanguage],
                  description: e.target.value
                }
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Контент {activeLanguage === 'UA' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={translations[activeLanguage].body}
              onChange={(e) => setTranslations({
                ...translations,
                [activeLanguage]: {
                  ...translations[activeLanguage],
                  body: e.target.value
                }
              })}
              rows={20}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm font-mono text-sm"
              placeholder="Використовуйте Markdown для форматування..."
              required={activeLanguage === 'UA'}
            />
            <p className="mt-2 text-sm text-gray-500">
              Підтримується Markdown: **жирний**, *курсив*, [посилання](url), # заголовки, - списки
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/content')}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <X className="h-4 w-4 mr-2 inline" />
          Скасувати
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-nebachiv-600 text-white rounded-md text-sm font-medium hover:bg-nebachiv-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2 inline" />
          {isLoading ? 'Збереження...' : content ? 'Оновити' : 'Створити'}
        </button>
      </div>
    </form>
  )
}