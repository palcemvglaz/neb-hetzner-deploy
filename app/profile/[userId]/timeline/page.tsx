'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, Calendar, Trophy, Bike, AlertTriangle, Zap, GraduationCap, Target } from 'lucide-react'
import { format } from 'date-fns'

interface TimelineEvent {
  id: string
  eventType: string
  eventDate: string
  title: string
  description?: string
  metadata?: any
  icon?: string
}

interface Motorcycle {
  id: string
  brand: string
  model: string
  year?: number
  engineSize?: number
  purchaseDate?: string
  isCurrent: boolean
}

interface UserData {
  user: {
    id: string
    name: string
    email: string
    riderProfile?: any
  }
  events: TimelineEvent[]
  motorcycles: Motorcycle[]
  skillMap?: any
  questionnaireProfile?: any
}

const getEventIcon = (eventType: string, icon?: string) => {
  if (icon) {
    switch (icon) {
      case '🏁': return <span className="text-2xl">🏁</span>
      case '🎓': return <GraduationCap className="w-5 h-5" />
      case '🏍️': return <Bike className="w-5 h-5" />
      case '🛣️': return <span className="text-2xl">🛣️</span>
      case '🦵': return <span className="text-2xl">🦵</span>
      case '⚠️': return <AlertTriangle className="w-5 h-5" />
      case '🚀': return <Zap className="w-5 h-5" />
      case '🛑': return <span className="text-2xl">🛑</span>
      case '🔥': return <span className="text-2xl">🔥</span>
      default: return <Trophy className="w-5 h-5" />
    }
  }
  
  switch (eventType) {
    case 'started_riding': return <span className="text-2xl">🏁</span>
    case 'moto_school': return <GraduationCap className="w-5 h-5" />
    case 'bought_bike': return <Bike className="w-5 h-5" />
    case 'achievement': return <Trophy className="w-5 h-5" />
    case 'accident': return <AlertTriangle className="w-5 h-5" />
    case 'skill_learned': return <Target className="w-5 h-5" />
    default: return <Calendar className="w-5 h-5" />
  }
}

const getEventColor = (eventType: string) => {
  switch (eventType) {
    case 'started_riding': return 'bg-green-900/50 border-green-800'
    case 'moto_school': return 'bg-blue-900/50 border-blue-800'
    case 'bought_bike': return 'bg-purple-900/50 border-purple-800'
    case 'achievement': return 'bg-yellow-900/50 border-yellow-800'
    case 'accident': return 'bg-red-900/50 border-red-800'
    case 'skill_learned': return 'bg-cyan-900/50 border-cyan-800'
    default: return 'bg-gray-900/50 border-gray-800'
  }
}

export default function TimelinePage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const userId = params.userId as string

  useEffect(() => {
    fetchTimeline()
  }, [userId])

  const fetchTimeline = async () => {
    try {
      const response = await fetch(`/api/riders/${userId}/timeline`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching timeline:', error)
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
          <Link href="/riders">
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700">
              Back to Riders
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const { user, events, motorcycles, skillMap } = data

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/riders">
            <Button 
              variant="ghost" 
              size="sm"
              className="mb-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Riders
            </Button>
          </Link>

          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20 bg-gray-800 border-2 border-gray-700">
              <AvatarFallback className="text-2xl text-gray-400">
                {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.name || 'Unknown Rider'}
              </h1>
              <p className="text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex gap-2">
                {skillMap && (
                  <Badge className="bg-blue-900/50 text-blue-400 border-blue-800">
                    Level {skillMap.overallLevel}
                  </Badge>
                )}
                <Link href={`/profile/${userId}/skills`}>
                  <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700">
                    View Skills Map
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Current Motorcycles */}
        {motorcycles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">🏍️ Motorcycles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {motorcycles.map((moto) => (
                <Card key={moto.id} className={`bg-gray-800 border-gray-700 ${moto.isCurrent ? 'ring-2 ring-blue-600' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">
                          {moto.brand} {moto.model}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {moto.year && (
                            <span className="text-gray-400 text-sm">{moto.year}</span>
                          )}
                          {moto.engineSize && (
                            <span className="text-gray-400 text-sm">{moto.engineSize}cc</span>
                          )}
                        </div>
                      </div>
                      {moto.isCurrent && (
                        <Badge className="bg-green-900/50 text-green-400 border-green-800">
                          Current
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">📅 Riding Journey</h2>
          
          {events.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No timeline events yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
              
              {/* Events */}
              <div className="space-y-6">
                {events.map((event, index) => (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Event dot and icon */}
                    <div className={`relative z-10 w-16 h-16 rounded-full ${getEventColor(event.eventType)} border-2 flex items-center justify-center`}>
                      {getEventIcon(event.eventType, event.icon)}
                    </div>
                    
                    {/* Event content */}
                    <Card className="flex-1 bg-gray-800 border-gray-700 hover:border-gray-600 transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-white text-lg">
                            {event.title}
                          </CardTitle>
                          <span className="text-gray-400 text-sm">
                            {format(new Date(event.eventDate), 'MMM yyyy')}
                          </span>
                        </div>
                      </CardHeader>
                      {event.description && (
                        <CardContent>
                          <CardDescription className="text-gray-300">
                            {event.description}
                          </CardDescription>
                          {event.metadata && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {event.metadata.detail && (
                                <Badge className="bg-gray-900/50 text-gray-400 border-gray-800">
                                  {event.metadata.detail}
                                </Badge>
                              )}
                              {event.metadata.difficulty && (
                                <Badge className="bg-purple-900/50 text-purple-400 border-purple-800">
                                  {event.metadata.difficulty}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
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