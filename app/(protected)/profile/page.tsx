'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  User, Mail, Phone, Calendar, Award, BookOpen, 
  Trophy, Target, Clock, Download, Share2, Settings,
  CheckCircle, Star, Zap, Shield
} from 'lucide-react'
import ShareAchievement from '@/components/share-achievement'

// Mock data for achievements
const achievements = [
  {
    id: '1',
    title: 'Перший крок',
    description: 'Завершити перший урок',
    icon: '🎯',
    type: 'milestone',
    unlockedAt: new Date('2024-01-15'),
    progress: 100
  },
  {
    id: '2',
    title: 'Тиждень навчання',
    description: '7 днів поспіль на платформі',
    icon: '🔥',
    type: 'streak',
    unlockedAt: new Date('2024-01-22'),
    progress: 100
  },
  {
    id: '3',
    title: 'Майстер тестів',
    description: 'Пройти 10 тестів з результатом 90%+',
    icon: '🏆',
    type: 'skill',
    unlockedAt: null,
    progress: 70
  },
  {
    id: '4',
    title: 'Експерт безпеки',
    description: 'Завершити всі курси з безпеки',
    icon: '🛡️',
    type: 'course',
    unlockedAt: null,
    progress: 45
  }
]

// Mock certificates
const certificates = [
  {
    id: '1',
    title: 'Основи безпечної їзди',
    issuedAt: new Date('2024-01-20'),
    certificateNumber: 'NEB-2024-0001',
    type: 'COURSE_COMPLETION',
    fileUrl: '#'
  },
  {
    id: '2',
    title: 'Екстрене гальмування',
    issuedAt: new Date('2024-02-01'),
    certificateNumber: 'NEB-2024-0045',
    type: 'SKILL_CERTIFICATION',
    fileUrl: '#'
  }
]

// Mock user stats
const userStats = {
  coursesCompleted: 3,
  testsCompleted: 15,
  totalPoints: 1250,
  studyStreak: 12,
  totalHours: 24.5,
  averageScore: 87
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'certificates'>('overview')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{session?.user?.name || 'Користувач'}</h1>
                <p className="text-gray-600 mb-4">Учень • Приєднався в січні 2024</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {session?.user?.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Активний 12 днів поспіль
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Trophy className="w-4 h-4" />
                    Рівень: Досвідчений
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  href="/settings"
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Налаштування"
                >
                  <Settings className="w-5 h-5 text-gray-700" />
                </Link>
                <button
                  className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  title="Поділитися профілем"
                >
                  <Share2 className="w-5 h-5 text-blue-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.coursesCompleted}</div>
              <div className="text-sm text-gray-600">Курсів завершено</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.testsCompleted}</div>
              <div className="text-sm text-gray-600">Тестів пройдено</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.totalPoints}</div>
              <div className="text-sm text-gray-600">Балів зароблено</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.totalHours}h</div>
              <div className="text-sm text-gray-600">Годин навчання</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Award className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{userStats.averageScore}%</div>
              <div className="text-sm text-gray-600">Середній бал</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Shield className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{certificates.length}</div>
              <div className="text-sm text-gray-600">Сертифікатів</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Огляд
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'achievements'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Досягнення
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'certificates'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Сертифікати
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Поточний прогрес</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">Курс "8 принципів Небачива"</span>
                        <span className="text-sm text-gray-600">65% завершено</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      <div className="mt-4 flex justify-between text-sm text-gray-600">
                        <span>Наступний урок: Принцип блокерів</span>
                        <Link href="/courses" className="text-blue-600 hover:underline">
                          Продовжити →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">Остання активність</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <p className="font-medium">Завершено тест "Розпізнавання небезпеки"</p>
                          <p className="text-sm text-gray-600">Результат: 92% • 2 години тому</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium">Прочитано урок "Екстрене гальмування"</p>
                          <p className="text-sm text-gray-600">Витрачено 15 хвилин • Вчора</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <div className="flex-1">
                          <p className="font-medium">Отримано досягнення "Тиждень навчання"</p>
                          <p className="text-sm text-gray-600">7 днів поспіль на платформі • 3 дні тому</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-6 rounded-lg border-2 ${
                          achievement.unlockedAt
                            ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`text-4xl ${achievement.unlockedAt ? '' : 'opacity-50'}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-lg mb-1">{achievement.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                              </div>
                              {achievement.unlockedAt && (
                                <ShareAchievement
                                  achievement={achievement}
                                  userName={session?.user?.name || 'Користувач'}
                                />
                              )}
                            </div>
                            
                            {achievement.unlockedAt ? (
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>Отримано {achievement.unlockedAt.toLocaleDateString('uk-UA')}</span>
                              </div>
                            ) : (
                              <div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                    style={{width: `${achievement.progress}%`}}
                                  ></div>
                                </div>
                                <p className="text-sm text-gray-600">Прогрес: {achievement.progress}%</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates Tab */}
              {activeTab === 'certificates' && (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-gray-50 p-6 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{cert.title}</h4>
                          <p className="text-sm text-gray-600">
                            Видано: {cert.issuedAt.toLocaleDateString('uk-UA')} • 
                            Номер: {cert.certificateNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <ShareAchievement
                          achievement={{
                            title: cert.title,
                            description: `Сертифікат про завершення`,
                            icon: '🎓',
                            unlockedAt: cert.issuedAt
                          }}
                          userName={session?.user?.name || 'Користувач'}
                          certificateNumber={cert.certificateNumber}
                        />
                        <button className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {certificates.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Ще немає сертифікатів</p>
                      <p className="text-sm mt-2">Завершуйте курси та проходьте тести щоб отримати сертифікати</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}