'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, TrendingUp, Award, AlertTriangle, Zap, Cloud, Brain, Map, Flag } from 'lucide-react'

interface SkillCategory {
  name: string
  icon: React.ReactNode
  color: string
  skills: {
    name: string
    value: number
    maxValue: number
  }[]
}

interface UserData {
  user: {
    id: string
    name: string
    email: string
  }
  skillMap?: {
    basicSkills: any
    advancedSkills: any  // Note: contains sportSkills from backend
    stuntSkills: any
    safetySkills: any
    weatherSkills?: any  // New: weather conditions skills
    overallLevel: number
  }
  questionnaireProfile?: {
    profileType: string
  }
}

const getSkillLevelLabel = (value: number): { label: string; color: string } => {
  if (value >= 90) return { label: 'Master', color: 'text-purple-400' }
  if (value >= 75) return { label: 'Expert', color: 'text-blue-400' }
  if (value >= 60) return { label: 'Advanced', color: 'text-green-400' }
  if (value >= 40) return { label: 'Intermediate', color: 'text-yellow-400' }
  if (value >= 20) return { label: 'Beginner', color: 'text-orange-400' }
  return { label: 'Novice', color: 'text-gray-400' }
}

const getOverallRating = (level: number) => {
  const stars = []
  for (let i = 1; i <= 10; i++) {
    if (i <= level) {
      stars.push(
        <span key={i} className="text-yellow-400 text-2xl">★</span>
      )
    } else {
      stars.push(
        <span key={i} className="text-gray-600 text-2xl">★</span>
      )
    }
  }
  return stars
}

export default function SkillsPage() {
  const params = useParams()
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const userId = params.userId as string

  useEffect(() => {
    fetchSkills()
  }, [userId])

  const fetchSkills = async () => {
    try {
      const response = await fetch(`/api/riders/${userId}/timeline`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching skills:', error)
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

  if (!data || !data.skillMap) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Skills data not available</p>
          <Link href="/riders">
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700">
              Back to Riders
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const { user, skillMap, questionnaireProfile } = data

  const skillCategories: SkillCategory[] = [
    // 1. RIDING CONCEPTS - Theory and safety awareness
    {
      name: 'Riding Concepts',
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-indigo-900/50 border-indigo-800',
      skills: [
        // Safety awareness
        { name: 'Oversaturation Mgmt', value: skillMap.safetySkills.oversaturationManagement || 0, maxValue: 100 },
        { name: 'Positioning', value: skillMap.safetySkills.positioning || 0, maxValue: 100 },
        { name: 'Visibility', value: skillMap.safetySkills.visibility || 0, maxValue: 100 },
        { name: 'Concentration', value: skillMap.safetySkills.concentration || 0, maxValue: 100 },
        // Concepts
        { name: 'Wave Warning', value: skillMap.safetySkills.waveWarning || 0, maxValue: 100 },
        { name: 'Blocker Concept', value: skillMap.safetySkills.blockerConcept || 0, maxValue: 100 },
        { name: 'Perception Error', value: skillMap.safetySkills.perceptionErrorConcept || 0, maxValue: 100 },
        // Advanced concepts from basic skills
        { name: 'Trajectory Understanding', value: skillMap.basicSkills.trajectoryUnderstanding || 0, maxValue: 100 },
        { name: 'Blocker Handling', value: skillMap.basicSkills.blockerHandling || 0, maxValue: 100 },
      ].filter(skill => skill.value > 0).slice(0, 6)
    },
    // 2. BASIC SKILLS - Everyday riding fundamentals
    {
      name: 'Basic Skills',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-blue-900/50 border-blue-800',
      skills: [
        // City Riding
        { name: 'Lane Positioning', value: skillMap.basicSkills.lanePositioning || 0, maxValue: 100 },
        { name: 'Lane Filtering', value: skillMap.basicSkills.laneFiltering || 0, maxValue: 100 },
        { name: 'Slow Speed Control', value: skillMap.basicSkills.slowSpeedControl || 0, maxValue: 100 },
        { name: 'Peripheral Vision', value: skillMap.basicSkills.peripheralVision || 0, maxValue: 100 },
        // Highway  
        { name: 'High Speed Control', value: skillMap.basicSkills.highSpeedControl || 0, maxValue: 100 },
        { name: 'Overtaking', value: skillMap.basicSkills.overtaking || 0, maxValue: 100 },
        // Basic Braking
        { name: 'Smooth Braking', value: skillMap.basicSkills.smoothBraking || 0, maxValue: 100 },
        { name: 'Emergency Braking 60', value: skillMap.basicSkills.emergencyBraking60 || 0, maxValue: 100 },
        // Basic Cornering
        { name: 'Counter Steering', value: skillMap.basicSkills.counterSteering || 0, maxValue: 100 },
        { name: 'Entry Speed Control', value: skillMap.basicSkills.entrySpeedControl || 0, maxValue: 100 },
        // Basic Acceleration
        { name: 'Quick Start', value: skillMap.basicSkills.quickStartFromLight || 0, maxValue: 100 },
      ].filter(skill => skill.value > 0).slice(0, 6)
    },
    // 3. ADVANCED SKILLS - Expert techniques and basic stunts
    {
      name: 'Advanced Skills', 
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-purple-900/50 border-purple-800',
      skills: [
        // Advanced Braking
        { name: 'Emergency Braking 100', value: skillMap.basicSkills.emergencyBraking100 || 0, maxValue: 100 },
        { name: 'Emergency Braking 150', value: skillMap.basicSkills.emergencyBraking150 || 0, maxValue: 100 },
        { name: 'Trail Braking', value: skillMap.basicSkills.trailBraking || 0, maxValue: 100 },
        { name: 'Block Front Control', value: skillMap.basicSkills.blockFrontControl || 0, maxValue: 100 },
        // Advanced Cornering
        { name: 'Full Lock Turn', value: skillMap.basicSkills.fullLockTurn || 0, maxValue: 100 },
        { name: 'Lock 360', value: skillMap.basicSkills.lock360 || 0, maxValue: 100 },
        { name: 'Racing Line', value: skillMap.basicSkills.racingLine || 0, maxValue: 100 },
        { name: 'Knee Down', value: skillMap.basicSkills.kneeDown || 0, maxValue: 100 },
        { name: 'Quick Flick', value: skillMap.basicSkills.quickFlick || 0, maxValue: 100 },
        // Basic Stunts
        { name: 'Stoppie', value: skillMap.basicSkills.stoppie || 0, maxValue: 100 },
        { name: 'Power Wheelie', value: skillMap.stuntSkills.powerWheelie || 0, maxValue: 100 },
        { name: 'Static Balance', value: skillMap.stuntSkills.staticBalance || 0, maxValue: 100 },
        { name: 'Clutchless Gear Up', value: skillMap.basicSkills.clutchlessGearUp || 0, maxValue: 100 },
      ].filter(skill => skill.value > 0).slice(0, 6)
    },
    // 4. ADVENTURE SKILLS - Touring, weather, basic off-road
    {
      name: 'Adventure Skills',
      icon: <Map className="w-5 h-5" />,
      color: 'bg-green-900/50 border-green-800',
      skills: [
        // Weather Conditions
        { name: 'Rain Riding', value: skillMap.advancedSkills.rainRiding || 0, maxValue: 100 },
        { name: 'Night Riding', value: skillMap.advancedSkills.nightRiding || 0, maxValue: 100 },
        { name: 'Mist Riding', value: skillMap.advancedSkills.mistRiding || 0, maxValue: 100 },
        { name: 'Cold Weather', value: skillMap.advancedSkills.coldWeatherRiding || 0, maxValue: 100 },
        // Basic Off-road
        { name: 'Standing Position', value: skillMap.advancedSkills.standingPosition || 0, maxValue: 100 },
        { name: 'Dirt Riding', value: skillMap.advancedSkills.corneringDirt || 0, maxValue: 100 },
        // Long Distance (simulated values for now)
        { name: 'Fatigue Management', value: 30, maxValue: 100 },
        { name: 'Navigation', value: 40, maxValue: 100 },
      ].filter(skill => skill.value > 0).slice(0, 6)
    },
    // 5. SPORT/DIRT SKILLS - Track, gymkhana, extreme stunts
    {
      name: 'Sport/Dirt Skills',
      icon: <Flag className="w-5 h-5" />,
      color: 'bg-red-900/50 border-red-800',
      skills: [
        // Track Riding
        { name: 'Track Days', value: skillMap.advancedSkills.basicTrackDays || 0, maxValue: 100 },
        { name: 'Block Pass', value: skillMap.advancedSkills.blockPass || 0, maxValue: 100 },
        { name: 'Chicane Pass', value: skillMap.advancedSkills.chicanePass || 0, maxValue: 100 },
        { name: 'Braking Pass', value: skillMap.advancedSkills.brakingPass || 0, maxValue: 100 },
        // Gymkhana
        { name: 'GP8 < 35 sec', value: skillMap.advancedSkills.gp8under35 || 0, maxValue: 100 },
        { name: 'GP8 < 30 sec', value: skillMap.advancedSkills.gp8under30 || 0, maxValue: 100 },
        // Serious Off-road
        { name: 'Jumping', value: skillMap.advancedSkills.jumping || 0, maxValue: 100 },
        { name: 'Power Sliding', value: skillMap.advancedSkills.powerSliding || 0, maxValue: 100 },
        // Extreme Stunts
        { name: 'Clutch Wheelie', value: skillMap.stuntSkills.clutchWheelie || 0, maxValue: 100 },
        { name: 'Balance Point', value: skillMap.stuntSkills.balancePoint || 0, maxValue: 100 },
        { name: 'Burnout', value: skillMap.stuntSkills.burnout || 0, maxValue: 100 },
        { name: 'Drift', value: skillMap.stuntSkills.drift || 0, maxValue: 100 },
        { name: 'Rear Slide', value: skillMap.stuntSkills.rearSlide90 || 0, maxValue: 100 },
      ].filter(skill => skill.value > 0).slice(0, 6)
    }
  ]

  // Calculate average skill per category
  const categoryAverages = skillCategories.map(cat => ({
    name: cat.name,
    average: Math.round(cat.skills.reduce((sum, skill) => sum + skill.value, 0) / cat.skills.length)
  }))

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
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
                {user.name || 'Unknown Rider'} - Skills Map
              </h1>
              <p className="text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex gap-2">
                <Badge className="bg-blue-900/50 text-blue-400 border-blue-800">
                  Level {skillMap.overallLevel}
                </Badge>
                {questionnaireProfile && (
                  <Badge className="bg-purple-900/50 text-purple-400 border-purple-800">
                    {questionnaireProfile.profileType}
                  </Badge>
                )}
                <Link href={`/profile/${userId}/timeline`}>
                  <Button size="sm" variant="outline" className="border-gray-600 hover:bg-gray-700">
                    View Timeline
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Rating */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Overall Skill Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              {getOverallRating(skillMap.overallLevel)}
            </div>
            <p className="text-center text-gray-400 mt-4">
              Level {skillMap.overallLevel} / 10
            </p>
          </CardContent>
        </Card>

        {/* Category Summary */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Skill Categories Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categoryAverages.map((cat) => (
                <div key={cat.name} className="text-center">
                  <p className="text-gray-400 text-sm mb-2">{cat.name}</p>
                  <div className="relative w-20 h-20 mx-auto">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-700"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(cat.average / 100) * 226} 226`}
                        className={
                          cat.average >= 75 ? 'text-purple-400' :
                          cat.average >= 50 ? 'text-blue-400' :
                          cat.average >= 25 ? 'text-green-400' :
                          'text-yellow-400'
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold">{cat.average}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skillCategories.map((category) => (
            <Card key={category.name} className={`bg-gray-800 border-gray-700`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${category.color} border flex items-center justify-center`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-white">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.skills.map((skill) => {
                    const levelInfo = getSkillLevelLabel(skill.value)
                    return (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 text-sm">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${levelInfo.color}`}>
                              {levelInfo.label}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {skill.value}%
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={skill.value} 
                          className="h-2 bg-gray-700"
                        />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skills Legend */}
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white text-lg">Skill Level Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <Badge className="bg-gray-900/50 text-gray-400 border-gray-800 mb-2">0-19%</Badge>
                <p className="text-xs text-gray-500">Novice</p>
              </div>
              <div className="text-center">
                <Badge className="bg-orange-900/50 text-orange-400 border-orange-800 mb-2">20-39%</Badge>
                <p className="text-xs text-gray-500">Beginner</p>
              </div>
              <div className="text-center">
                <Badge className="bg-yellow-900/50 text-yellow-400 border-yellow-800 mb-2">40-59%</Badge>
                <p className="text-xs text-gray-500">Intermediate</p>
              </div>
              <div className="text-center">
                <Badge className="bg-green-900/50 text-green-400 border-green-800 mb-2">60-74%</Badge>
                <p className="text-xs text-gray-500">Advanced</p>
              </div>
              <div className="text-center">
                <Badge className="bg-blue-900/50 text-blue-400 border-blue-800 mb-2">75-89%</Badge>
                <p className="text-xs text-gray-500">Expert</p>
              </div>
              <div className="text-center">
                <Badge className="bg-purple-900/50 text-purple-400 border-purple-800 mb-2">90-100%</Badge>
                <p className="text-xs text-gray-500">Master</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}