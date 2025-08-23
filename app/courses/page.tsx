'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Clock, BookOpen, Users, Star, ChevronRight, Grid, List } from 'lucide-react'

// Mock courses data based on KB_NEB principles
const courses = [
  {
    id: '1',
    slug: '8-principles',
    title: '8 принципів Небачива',
    description: 'Базовий курс безпечної їзди. Система принципів, яка дозволяє передбачати небезпеку.',
    category: 'Основи безпеки',
    difficulty: 'Початківець',
    duration: '7 днів',
    lessons: 8,
    students: 1234,
    rating: 4.9,
    isPremium: false,
    isFeatured: true,
    tags: ['безпека', 'основи', 'принципи'],
    instructor: 'Чингіз Барінов'
  },
  {
    id: '2',
    slug: 'emergency-braking',
    title: 'Екстрене гальмування',
    description: 'Практичний курс з відпрацювання навичок екстреного гальмування в різних умовах.',
    category: 'Технічні навички',
    difficulty: 'Середній',
    duration: '3 дні',
    lessons: 5,
    students: 892,
    rating: 4.8,
    isPremium: true,
    tags: ['гальмування', 'практика', 'техніка'],
    instructor: 'Олександр Петров'
  },
  {
    id: '3',
    slug: 'city-riding',
    title: 'Міська їзда: Виживання в хаосі',
    description: 'Все про безпечну їзду в умовах міста. Перехрестя, пробки, пішоходи.',
    category: 'Міська їзда',
    difficulty: 'Середній',
    duration: '14 днів',
    lessons: 12,
    students: 2341,
    rating: 4.7,
    isPremium: true,
    tags: ['місто', 'трафік', 'перехрестя'],
    instructor: 'Марія Коваленко'
  },
  {
    id: '4',
    slug: 'cornering-mastery',
    title: 'Майстерність проходження поворотів',
    description: 'Від базових принципів до trail braking. Фізика, техніка, практика.',
    category: 'Технічні навички',
    difficulty: 'Просунутий',
    duration: '10 днів',
    lessons: 8,
    students: 567,
    rating: 4.9,
    isPremium: true,
    tags: ['повороти', 'техніка', 'trail braking'],
    instructor: 'Дмитро Савченко'
  },
  {
    id: '5',
    slug: 'night-riding',
    title: 'Нічна їзда: Особливості та небезпеки',
    description: 'Як залишатися видимим та безпечним вночі. Освітлення, позиціонування, тактика.',
    category: 'Спеціальні умови',
    difficulty: 'Середній',
    duration: '5 днів',
    lessons: 6,
    students: 423,
    rating: 4.6,
    isPremium: true,
    tags: ['ніч', 'видимість', 'освітлення'],
    instructor: 'Андрій Мельник'
  },
  {
    id: '6',
    slug: 'group-riding',
    title: 'Групові поїздки: Правила та безпека',
    description: 'Формування колони, сигнали, комунікація, безпечні дистанції.',
    category: 'Соціальна їзда',
    difficulty: 'Початківець',
    duration: '3 дні',
    lessons: 4,
    students: 789,
    rating: 4.5,
    isPremium: false,
    tags: ['група', 'колона', 'комунікація'],
    instructor: 'Віталій Шевченко'
  }
]

const categories = ['Всі категорії', 'Основи безпеки', 'Технічні навички', 'Міська їзда', 'Спеціальні умови', 'Соціальна їзда']
const difficulties = ['Всі рівні', 'Початківець', 'Середній', 'Просунутий']

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Всі категорії')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Всі рівні')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filteredCourses, setFilteredCourses] = useState(courses)

  // Filter courses
  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'Всі категорії') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'Всі рівні') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty)
    }

    // Sort
    switch (sortBy) {
      case 'featured':
        filtered = [...filtered].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
        break
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.students - a.students)
        break
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        // In real app, would sort by creation date
        filtered = [...filtered].reverse()
        break
    }

    setFilteredCourses(filtered)
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Курси безпечної їзди</h1>
            <p className="text-xl text-blue-100">
              Від базових принципів до майстерності — навчайтеся у кращих
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Пошук курсів..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Рекомендовані</option>
                  <option value="popular">Популярні</option>
                  <option value="rating">За рейтингом</option>
                  <option value="newest">Найновіші</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results Count */}
            <p className="mt-4 text-gray-600">
              Знайдено курсів: {filteredCourses.length}
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid/List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Курсів за вашим запитом не знайдено
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('Всі категорії')
                    setSelectedDifficulty('Всі рівні')
                  }}
                  className="mt-4 text-blue-600 font-semibold hover:underline"
                >
                  Скинути фільтри
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className={`block bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${
                      viewMode === 'list' ? 'p-6' : ''
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View
                      <div>
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg relative">
                          {course.isFeatured && (
                            <span className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                              Рекомендовано
                            </span>
                          )}
                          {course.isPremium && (
                            <span className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Pro
                            </span>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span className="bg-gray-100 px-2 py-1 rounded">{course.category}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{course.difficulty}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {course.lessons} уроків
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                {course.students}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {course.rating}
                              </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div className="flex items-center gap-6">
                        <div className="w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0 relative">
                          {course.isPremium && (
                            <span className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              Pro
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold">{course.title}</h3>
                            {course.isFeatured && (
                              <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
                                Рекомендовано
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{course.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>{course.category}</span>
                            <span>•</span>
                            <span>{course.difficulty}</span>
                            <span>•</span>
                            <span>{course.duration}</span>
                            <span>•</span>
                            <span>{course.lessons} уроків</span>
                            <span>•</span>
                            <span>Інструктор: {course.instructor}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{course.rating}</span>
                          </div>
                          <p className="text-sm text-gray-500">{course.students} учнів</p>
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Не знайшли потрібний курс?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Напишіть нам, яку тему хотіли б вивчити, і ми розглянемо можливість створення курсу
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all"
          >
            Запропонувати тему
          </Link>
        </div>
      </section>
    </div>
  )
}