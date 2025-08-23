'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Trophy, Calendar, TrendingUp, ChevronRight, ArrowLeft } from 'lucide-react'

interface ProfileData {
  user: {
    id: string
    name: string
    email: string
    createdAt: string
    riderProfile?: string
  }
  stats: {
    totalCourses: number
    completedCourses: number
    recentEvents: number
    skillLevel: number
  }
  skillMap?: any
  recentEvents?: any[]
  currentBike?: any
  questionnaireProfile?: any
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const userId = params.userId as string

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/riders/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Rider not found</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const { user, stats, skillMap, recentEvents, questionnaireProfile } = data

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name || 'Rider'}</h1>
                  <p className="text-gray-400">{user.email}</p>
                  {user.riderProfile && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                        {user.riderProfile.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-400">
                  Level {stats.skillLevel}
                </div>
                <p className="text-gray-400 text-sm">Overall Skill</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalCourses}</p>
                <p className="text-sm text-gray-400">Courses</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stats.completedCourses}</p>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stats.recentEvents}</p>
                <p className="text-sm text-gray-400">Events</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{stats.skillLevel}</p>
                <p className="text-sm text-gray-400">Skill Level</p>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            href={`/profile/${userId}/skills`}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">🎯 Skill Tree</h3>
                <p className="text-gray-400">View detailed skills breakdown and progress</p>
                {skillMap && (
                  <div className="mt-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Basic Skills</p>
                        <p className="text-lg font-semibold text-white">
                          {Object.keys(skillMap.basicSkills || {}).length} skills
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Advanced</p>
                        <p className="text-lg font-semibold text-white">
                          {Object.keys(skillMap.advancedSkills || {}).length} skills
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </Link>

          <Link 
            href={`/profile/${userId}/timeline`}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">📅 Timeline</h3>
                <p className="text-gray-400">Your journey as a motorcycle rider</p>
                {recentEvents && recentEvents.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Latest event</p>
                    <p className="text-lg font-semibold text-white">
                      {recentEvents[0].title}
                    </p>
                  </div>
                )}
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>

        {/* Recent Timeline Events */}
        {recentEvents && recentEvents.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Recent Timeline</h2>
            <div className="space-y-4">
              {recentEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl">
                    {event.eventType === 'LICENSE_OBTAINED' && '🎓'}
                    {event.eventType === 'FIRST_BIKE' && '🏍️'}
                    {event.eventType === 'ACHIEVEMENT' && '🏆'}
                    {event.eventType === 'MILESTONE' && '🎯'}
                    {event.eventType === 'COURSE_COMPLETED' && '✅'}
                    {event.eventType === 'TRAINING' && '📚'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{event.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(event.eventDate).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              href={`/profile/${userId}/timeline`}
              className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300"
            >
              View full timeline
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}