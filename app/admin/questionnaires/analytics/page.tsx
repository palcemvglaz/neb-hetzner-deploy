'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Users, AlertCircle, TrendingUp, Calendar, Download, Activity, BarChart3, PieChart } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'

interface StatsData {
  overview: {
    totalProfiles: number
    totalBeginner: number
    totalExperienced: number
    lastUpdated: string
  }
  distributions: {
    profileType: Record<string, number>
    riskProfile: Record<string, number>
    overallLevel: Record<string, number>
    school: Record<string, number>
  }
  averages: {
    riskScore: number
    confidenceScore: number
    safetyScore: number
    skillsScore: number
    knowledgeScore: number
    psychologyScore: number
    riskAwareness: number
  }
  redFlags: {
    totalWithRedFlags: number
    avgRedFlagsPerProfile: number
    topRedFlags: [string, number][]
  }
  completionTime: {
    average: number
    min: number
    max: number
  }
  beginnerStats: {
    total: number
    avgRiskScore: number
    avgSafetyScore: number
    profileTypes: Record<string, number>
  }
  experiencedStats: {
    total: number
    avgRiskScore: number
    avgSkillsScore: number
    profileTypes: Record<string, number>
  }
  timeSeries: Record<string, { total: number, beginner: number, experienced: number }>
}

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/questionnaires/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchStats()
    }
  }, [session])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const COLORS = {
    primary: '#3B82F6',
    secondary: '#8B5CF6', 
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4'
  }

  const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.danger, COLORS.info]

  const prepareTimeSeriesData = () => {
    if (!stats?.timeSeries) return []
    
    return Object.entries(stats.timeSeries)
      .map(([date, data]) => ({
        date,
        total: data.total,
        beginner: data.beginner,
        experienced: data.experienced
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  const prepareRiskDistribution = () => {
    if (!stats?.distributions.riskProfile) return []
    
    return Object.entries(stats.distributions.riskProfile).map(([risk, count]) => ({
      name: risk,
      value: count,
      percentage: Math.round((count / stats.overview.totalProfiles) * 100)
    }))
  }

  const prepareScoreComparison = () => {
    if (!stats?.averages) return []
    
    return [
      { category: 'Risk Awareness', beginner: stats.beginnerStats.avgSafetyScore, experienced: stats.experiencedStats.avgRiskScore * 10 },
      { category: 'Safety Score', beginner: stats.beginnerStats.avgSafetyScore, experienced: stats.averages.safetyScore },
      { category: 'Skills Score', beginner: stats.averages.skillsScore, experienced: stats.experiencedStats.avgSkillsScore },
      { category: 'Confidence', beginner: stats.averages.confidenceScore * 10, experienced: stats.averages.confidenceScore * 10 }
    ]
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Please log in to access this page.</div>
      </div>
    )
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/questionnaires">
              <Button variant="outline" className="border-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Questionnaire Analytics</h1>
              <p className="text-gray-400 mt-2">
                Insights and trends from rider questionnaire responses
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Responses</p>
                  <p className="text-2xl font-bold text-white">{stats.overview.totalProfiles}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-blue-900/50 text-blue-400 border-blue-800 text-xs">
                      {stats.overview.totalBeginner} beginners
                    </Badge>
                    <Badge className="bg-purple-900/50 text-purple-400 border-purple-800 text-xs">
                      {stats.overview.totalExperienced} experienced
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">High Risk Users</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.distributions.riskProfile.high || 0) + (stats.distributions.riskProfile.critical || 0)}
                  </p>
                  <p className="text-red-400 text-sm">
                    {Math.round(((stats.distributions.riskProfile.high || 0) + (stats.distributions.riskProfile.critical || 0)) / stats.overview.totalProfiles * 100)}% of total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg Completion Time</p>
                  <p className="text-2xl font-bold text-white">{formatTime(stats.completionTime.average)}</p>
                  <p className="text-gray-400 text-sm">
                    Range: {formatTime(stats.completionTime.min)} - {formatTime(stats.completionTime.max)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-900/50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Red Flags Average</p>
                  <p className="text-2xl font-bold text-white">{stats.redFlags.avgRedFlagsPerProfile.toFixed(1)}</p>
                  <p className="text-orange-400 text-sm">
                    {stats.redFlags.totalWithRedFlags} users affected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Risk Profile Distribution
              </CardTitle>
              <CardDescription className="text-gray-400">
                Distribution of users by risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={prepareRiskDistribution()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {prepareRiskDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [value, 'Users']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Response Timeline */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Response Timeline (30 days)
              </CardTitle>
              <CardDescription className="text-gray-400">
                Daily questionnaire completions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={prepareTimeSeriesData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stackId="1" 
                    stroke={COLORS.primary} 
                    fill={COLORS.primary}
                    fillOpacity={0.6}
                    name="Total"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="beginner" 
                    stackId="2" 
                    stroke={COLORS.success} 
                    fill={COLORS.success}
                    fillOpacity={0.6}
                    name="Beginners"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="experienced" 
                    stackId="3" 
                    stroke={COLORS.secondary} 
                    fill={COLORS.secondary}
                    fillOpacity={0.6}
                    name="Experienced"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Comparison */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Beginner vs Experienced Scores
              </CardTitle>
              <CardDescription className="text-gray-400">
                Average scores comparison between user types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareScoreComparison()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="category" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="beginner" fill={COLORS.success} name="Beginners" />
                  <Bar dataKey="experienced" fill={COLORS.secondary} name="Experienced" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Red Flags */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Top Red Flags
              </CardTitle>
              <CardDescription className="text-gray-400">
                Most common safety concerns identified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.redFlags.topRedFlags.slice(0, 8).map(([flag, count], index) => (
                  <div key={flag} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        index < 3 ? 'bg-red-400' : index < 6 ? 'bg-orange-400' : 'bg-yellow-400'
                      }`} />
                      <span className="text-gray-300 text-sm">{flag}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gray-700 text-gray-300 border-gray-600">
                        {count}
                      </Badge>
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index < 3 ? 'bg-red-400' : index < 6 ? 'bg-orange-400' : 'bg-yellow-400'
                          }`}
                          style={{ width: `${Math.min((count / stats.redFlags.topRedFlags[0][1]) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Insights */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Key Insights</CardTitle>
            <CardDescription className="text-gray-400">
              Automated analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <h4 className="text-blue-400 font-semibold mb-2">Most Active Group</h4>
                <p className="text-gray-300 text-sm">
                  {stats.overview.totalBeginner > stats.overview.totalExperienced ? 'Beginners' : 'Experienced riders'} make up {Math.round(Math.max(stats.overview.totalBeginner, stats.overview.totalExperienced) / stats.overview.totalProfiles * 100)}% of responses
                </p>
              </div>
              
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <h4 className="text-red-400 font-semibold mb-2">Safety Concern</h4>
                <p className="text-gray-300 text-sm">
                  {stats.redFlags.totalWithRedFlags} users ({Math.round(stats.redFlags.totalWithRedFlags / stats.overview.totalProfiles * 100)}%) have red flags requiring attention
                </p>
              </div>
              
              <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <h4 className="text-green-400 font-semibold mb-2">Completion Rate</h4>
                <p className="text-gray-300 text-sm">
                  Average completion time of {formatTime(stats.completionTime.average)} suggests good engagement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}