'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Building, Users, Mail, Phone, Globe, MapPin } from 'lucide-react'
import { showToast } from '@/components/ui/toast'
import { validateForm, isValidEmail, isValidSlug } from '@/lib/validation'

export default function SchoolSetupPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    website: ''
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const { isValid, errors } = validateForm(formData, {
      name: { required: true, minLength: 3, maxLength: 100 },
      slug: { 
        required: true, 
        custom: (value) => isValidSlug(value) || 'Тільки маленькі літери, цифри та дефіси'
      },
      email: { 
        required: true, 
        custom: (value) => isValidEmail(value) || 'Невірний формат email'
      },
      phone: { 
        custom: (value) => !value || value.length >= 10 || 'Невірний формат телефону' 
      },
      website: {
        custom: (value) => !value || value.startsWith('http') || 'URL має починатися з http:// або https://'
      }
    })

    if (!isValid) {
      const firstError = Object.values(errors).find(e => e !== null)
      showToast({
        type: 'error',
        title: 'Помилка валідації',
        message: firstError || 'Перевірте правильність заповнення форми'
      })
      return
    }
    
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/school/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create school')
      }

      // Redirect to school dashboard
      router.push('/school')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Авторизація потрібна</h1>
          <p className="text-gray-600">Увійдіть для налаштування мотошколи</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Налаштування мотошколи
            </h1>
            <p className="text-gray-600">
              Створіть профіль вашої мотошколи для управління учнями та курсами
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Основна інформація
                </h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Назва мотошколи *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Наприклад: Мотошкола Безпечної Їзди"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL адреса *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      nebachiv.com/school/
                    </span>
                    <input
                      type="text"
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="school-name"
                      pattern="[a-z0-9-]+"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Тільки маленькі літери, цифри та дефіси
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Опис
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Короткий опис вашої мотошколи..."
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Контактна інформація
                </h2>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="info@school.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+380 XX XXX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Адреса
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Місто, вулиця, номер"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Веб-сайт
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://school.com"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Створення...' : 'Створити мотошколу'}
                </button>
              </div>
            </form>
          </div>

          {/* Benefits */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Що ви отримаєте:</h3>
            <ul className="space-y-2 text-blue-800">
              <li>✓ Панель управління учнями та групами</li>
              <li>✓ Відстеження прогресу навчання</li>
              <li>✓ Аналітика та звіти</li>
              <li>✓ Масовий запис на курси</li>
              <li>✓ Сертифікати та досягнення</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}