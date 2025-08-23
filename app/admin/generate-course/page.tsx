'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, Loader2, BookOpen, FileText } from 'lucide-react'

export default function GenerateCoursePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [availableContent, setAvailableContent] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)

  const scanContent = async () => {
    setIsScanning(true)
    setError(null)
    
    try {
      const res = await fetch('/api/courses/generate', {
        method: 'GET'
      })
      
      if (!res.ok) {
        throw new Error('Failed to scan content')
      }
      
      const data = await res.json()
      setAvailableContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsScanning(false)
    }
  }

  const generateCourse = async () => {
    setIsGenerating(true)
    setError(null)
    setResult(null)
    
    try {
      const res = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseSlug: 'motorcycle-safety-basics'
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate course')
      }
      
      setResult(data)
      
      // Generate test for the course
      const testRes = await fetch(`/api/courses/${data.course.id}/generate-test`, {
        method: 'POST'
      })
      
      if (testRes.ok) {
        const testData = await testRes.json()
        setResult((prev: any) => ({ ...prev, test: testData.test }))
      }
      
      // Redirect to the generated course after 3 seconds
      setTimeout(() => {
        router.push(`/courses/${data.course.slug}`)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Генерація курсу з KB_NEB</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Тестовий курс: "Безпека мотоцикліста: Основи"</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Що буде згенеровано:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Module 1: 8 концептів безпеки (3 уроки)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Module 2: Критичні навички (2 уроки)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>Module 3: Перші кроки новачка (2 уроки)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">Увага</h3>
                    <p className="text-yellow-800">
                      Переконайтеся, що KB_NEB vault_output доступний за адресою:
                      <br />
                      <code className="bg-yellow-100 px-2 py-1 rounded text-sm">
                        /Users/chyngys/scripts/kb_neb/vault_output
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={generateCourse}
                disabled={isGenerating}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Генерація...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5" />
                    Згенерувати курс
                  </>
                )}
              </button>
              
              <button
                onClick={scanContent}
                disabled={isScanning}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Сканування...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Сканувати доступний контент
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Курс успішно згенеровано!</h3>
                  <div className="text-green-800 space-y-1">
                    <p><strong>Назва:</strong> {result.course.title}</p>
                    <p><strong>Slug:</strong> {result.course.slug}</p>
                    <p><strong>Розділів:</strong> {result.course.sectionsCount}</p>
                    <p><strong>Уроків:</strong> {result.course.lessonsCount}</p>
                  </div>
                  <p className="mt-3 text-green-700">
                    Перенаправлення на курс через 3 секунди...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900">Помилка</h3>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Available Content */}
          {availableContent && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Доступний контент ({availableContent.totalFiles} файлів)
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(availableContent.availableContent).map(([dir, files]) => (
                  <div key={dir} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{dir}</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {(files as any[]).slice(0, 5).map((file: any, idx: number) => (
                        <li key={idx}>• {file.title}</li>
                      ))}
                      {(files as any[]).length > 5 && (
                        <li className="text-gray-400">... та ще {(files as any[]).length - 5} файлів</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}