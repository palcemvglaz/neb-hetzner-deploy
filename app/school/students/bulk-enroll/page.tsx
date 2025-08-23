'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  slug: string
  price: number
  level: string
}

interface Student {
  id: string
  name: string
  email: string
  schoolGroup?: {
    name: string
  }
}

interface Group {
  id: string
  name: string
  _count: {
    users: number
  }
}

export default function BulkEnrollPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [selectionMode, setSelectionMode] = useState<'individual' | 'group'>('individual')
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.role === 'SCHOOL') {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [coursesRes, studentsRes, groupsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/school/students?limit=1000'),
        fetch('/api/school/groups')
      ])

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        setCourses(coursesData.courses || [])
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setStudents(studentsData.students || [])
      }

      if (groupsRes.ok) {
        const groupsData = await groupsRes.json()
        setGroups(groupsData.groups || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Помилка завантаження даних')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map(s => s.id))
    }
  }

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleBulkEnroll = async () => {
    if (!selectedCourse) {
      setError('Оберіть курс')
      return
    }

    let studentIds: string[] = []
    
    if (selectionMode === 'group' && selectedGroup) {
      // Get students from selected group
      studentIds = students
        .filter(student => student.schoolGroup?.name === groups.find(g => g.id === selectedGroup)?.name)
        .map(student => student.id)
    } else {
      studentIds = selectedStudents
    }

    if (studentIds.length === 0) {
      setError('Оберіть учнів для запису')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/school/bulk-enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          studentIds
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll students')
      }

      setResult(data)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Завантаження...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Масовий запис учнів</h1>
            <p className="text-gray-600">Запишіть групу учнів на курс одночасно</p>
          </div>

          {result ? (
            /* Success Result */
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Запис успішний!</h2>
              <p className="text-gray-600 mb-6">{result.message}</p>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-800">{result.enrolled}</div>
                    <div className="text-sm text-green-600">Нових записів</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-800">{result.alreadyEnrolled || 0}</div>
                    <div className="text-sm text-yellow-600">Вже записані</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setResult(null)
                    setSelectedCourse('')
                    setSelectedStudents([])
                    setSelectedGroup('')
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Новий запис
                </button>
                <button
                  onClick={() => router.push('/school/students')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Переглянути учнів
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Course Selection */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Оберіть курс
                </h2>
                
                <div className="grid gap-4">
                  {courses.map((course) => (
                    <label
                      key={course.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedCourse === course.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="course"
                        value={course.id}
                        checked={selectedCourse === course.id}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {course.level}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {course.price === 0 ? 'Безкоштовно' : `${course.price} ₴`}
                            </span>
                          </div>
                        </div>
                        {selectedCourse === course.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Student Selection */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Оберіть учнів
                </h2>

                {/* Selection Mode */}
                <div className="flex gap-4 mb-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="selectionMode"
                      value="individual"
                      checked={selectionMode === 'individual'}
                      onChange={(e) => setSelectionMode(e.target.value as any)}
                      className="mr-2"
                    />
                    Обрати окремих учнів
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="selectionMode"
                      value="group"
                      checked={selectionMode === 'group'}
                      onChange={(e) => setSelectionMode(e.target.value as any)}
                      className="mr-2"
                    />
                    Обрати групу
                  </label>
                </div>

                {selectionMode === 'group' ? (
                  /* Group Selection */
                  <div className="space-y-4">
                    {groups.length === 0 ? (
                      <p className="text-gray-500">Немає доступних груп</p>
                    ) : (
                      groups.map((group) => (
                        <label
                          key={group.id}
                          className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-colors ${
                            selectedGroup === group.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <input
                              type="radio"
                              name="group"
                              value={group.id}
                              checked={selectedGroup === group.id}
                              onChange={(e) => setSelectedGroup(e.target.value)}
                              className="mr-3"
                            />
                            <span className="font-medium">{group.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({group._count.users} учнів)
                            </span>
                          </div>
                          {selectedGroup === group.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </label>
                      ))
                    )}
                  </div>
                ) : (
                  /* Individual Selection */
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">
                        Обрано: {selectedStudents.length} з {students.length} учнів
                      </span>
                      <button
                        onClick={handleSelectAllStudents}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {selectedStudents.length === students.length ? 'Скасувати всі' : 'Обрати всіх'}
                      </button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {students.map((student) => (
                        <label
                          key={student.id}
                          className={`p-3 border rounded-lg cursor-pointer flex items-center transition-colors ${
                            selectedStudents.includes(student.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentToggle(student.id)}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{student.name || 'Без імені'}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                            {student.schoolGroup && (
                              <div className="text-xs text-purple-600">
                                Група: {student.schoolGroup.name}
                              </div>
                            )}
                          </div>
                          {selectedStudents.includes(student.id) && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-900">Помилка</h3>
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Скасувати
                </button>
                <button
                  onClick={handleBulkEnroll}
                  disabled={isSubmitting || !selectedCourse || (selectionMode === 'individual' && selectedStudents.length === 0) || (selectionMode === 'group' && !selectedGroup)}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Запис учнів...
                    </>
                  ) : (
                    <>
                      Записати учнів на курс
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}