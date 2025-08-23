'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Save, Plus, Trash2, GripVertical,
  Image, Video, FileText, Link as LinkIcon
} from 'lucide-react'

export default function NewCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'BEGINNER',
    price: 0,
    isPremium: false,
    learningOutcomes: [''],
    requirements: [''],
  })

  const [sections, setSections] = useState([
    {
      id: '1',
      title: '',
      description: '',
      lessons: [
        { id: '1-1', title: '', type: 'video', duration: '', content: '' }
      ]
    }
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Here would be API call to create course
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/instructor/courses')
    } catch (error) {
      console.error('Error creating course:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSection = () => {
    const newSection = {
      id: `${Date.now()}`,
      title: '',
      description: '',
      lessons: []
    }
    setSections([...sections, newSection])
  }

  const addLesson = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: [
            ...section.lessons,
            {
              id: `${sectionId}-${Date.now()}`,
              title: '',
              type: 'video',
              duration: '',
              content: ''
            }
          ]
        }
      }
      return section
    }))
  }

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId))
  }

  const removeLesson = (sectionId: string, lessonId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter(l => l.id !== lessonId)
        }
      }
      return section
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/instructor/courses"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад до курсів</span>
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">Створити новий курс</h1>
        <p className="mt-2 text-gray-600">Заповніть інформацію про курс та додайте навчальні матеріали</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Основна інформація</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назва курсу
              </label>
              <input
                type="text"
                required
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Наприклад: Екстрене гальмування для початківців"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Опис курсу
              </label>
              <textarea
                required
                rows={4}
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Опишіть, що учні дізнаються з цього курсу..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категорія
                </label>
                <select
                  required
                  value={courseData.category}
                  onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Оберіть категорію</option>
                  <option value="safety">Основи безпеки</option>
                  <option value="technical">Технічні навички</option>
                  <option value="city">Міська їзда</option>
                  <option value="special">Спеціальні умови</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Складність
                </label>
                <select
                  value={courseData.difficulty}
                  onChange={(e) => setCourseData({ ...courseData, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BEGINNER">Початківець</option>
                  <option value="INTERMEDIATE">Середній</option>
                  <option value="ADVANCED">Просунутий</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ціна (₴)
                </label>
                <input
                  type="number"
                  min="0"
                  value={courseData.price}
                  onChange={(e) => setCourseData({ ...courseData, price: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Результати навчання</h2>
          <p className="text-sm text-gray-600 mb-4">Що учні зможуть робити після завершення курсу?</p>
          
          <div className="space-y-3">
            {courseData.learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => {
                    const newOutcomes = [...courseData.learningOutcomes]
                    newOutcomes[index] = e.target.value
                    setCourseData({ ...courseData, learningOutcomes: newOutcomes })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Наприклад: Виконувати екстрене гальмування безпечно"
                />
                {courseData.learningOutcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCourseData({
                        ...courseData,
                        learningOutcomes: courseData.learningOutcomes.filter((_, i) => i !== index)
                      })
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setCourseData({ ...courseData, learningOutcomes: [...courseData.learningOutcomes, ''] })}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Додати результат</span>
            </button>
          </div>
        </div>

        {/* Course Sections */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Структура курсу</h2>
          
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      required
                      placeholder={`Розділ ${sectionIndex + 1}: Назва`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Опис розділу (необов'язково)"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                {/* Lessons */}
                <div className="ml-8 space-y-3">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <select className="px-3 py-1 border border-gray-300 rounded">
                        <option value="video">Відео</option>
                        <option value="text">Текст</option>
                        <option value="quiz">Тест</option>
                      </select>
                      <input
                        type="text"
                        required
                        placeholder={`Урок ${lessonIndex + 1}: Назва`}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Тривалість"
                        className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeLesson(section.id, lesson.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addLesson(section.id)}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Додати урок</span>
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>Додати розділ</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? 'Збереження...' : 'Створити курс'}</span>
          </button>
          <Link
            href="/instructor/courses"
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  )
}