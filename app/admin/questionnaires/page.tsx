'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle, Search, Filter, Download, Eye, Users, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import Link from 'next/link'

interface QuestionnaireProfile {
  id: string
  userId: string
  userName: string
  userEmail: string
  schoolName?: string
  profileType: string
  type: 'beginner' | 'experienced'
  age: string
  profession: string
  motorcycle: string
  ridingSeasons: string
  riskScore: number
  confidenceScore: number
  safetyScore: number
  skillsScore: number
  knowledgeScore: number
  psychologyScore: number
  riskAwareness: number
  overallLevel: string
  riskProfile: string
  redFlags: string[]
  recommendations: string[]
  completionTime: number
  createdAt: string
  answers: Record<string, any>
}

interface Pagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export default function QuestionnairesPage() {
  const { data: session } = useSession()
  const [profiles, setProfiles] = useState<QuestionnaireProfile[]>([])
  const [pagination, setPagination] = useState<Pagination>({ total: 0, limit: 50, offset: 0, hasMore: false })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    profileType: '',
    riskProfile: '',
    search: ''
  })

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString()
      })
      
      if (filters.type) params.append('type', filters.type)
      if (filters.profileType) params.append('profileType', filters.profileType)
      if (filters.riskProfile) params.append('riskProfile', filters.riskProfile)
      
      const response = await fetch(`/api/admin/questionnaires?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch questionnaire data')
      }
      
      const data = await response.json()
      setProfiles(data.profiles)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching profiles:', error)
      toast.error('Failed to load questionnaire data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchProfiles()
    }
  }, [session, pagination.offset, pagination.limit, filters.type, filters.profileType, filters.riskProfile])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, offset: 0 })) // Reset to first page
  }

  const getRiskBadgeColor = (riskProfile: string) => {
    switch (riskProfile.toLowerCase()) {
      case 'low': return 'bg-green-900/50 text-green-400 border-green-800'
      case 'moderate': return 'bg-yellow-900/50 text-yellow-400 border-yellow-800'
      case 'high': return 'bg-orange-900/50 text-orange-400 border-orange-800'
      case 'critical': return 'bg-red-900/50 text-red-400 border-red-800'
      default: return 'bg-gray-900/50 text-gray-400 border-gray-800'
    }
  }

  const getTypeBadgeColor = (type: string) => {
    return type === 'beginner' 
      ? 'bg-blue-900/50 text-blue-400 border-blue-800'
      : 'bg-purple-900/50 text-purple-400 border-purple-800'
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const exportToCSV = async () => {
    try {
      const response = await fetch('/api/admin/questionnaires?limit=1000') // Get all for export
      const data = await response.json()
      
      const csvContent = [
        // Header
        'Name,Email,Age,Profession,Motorcycle,Riding Seasons,Type,Profile,Risk Level,Risk Score,Safety Score,Skills Score,Red Flags,Completion Time,Date',
        // Data
        ...data.profiles.map((profile: QuestionnaireProfile) => 
          [
            profile.userName || '',
            profile.userEmail || '',
            profile.age || '',
            profile.profession || '',
            profile.motorcycle || '',
            profile.ridingSeasons || '',
            profile.type,
            profile.profileType,
            profile.riskProfile,
            profile.riskScore,
            profile.safetyScore,
            profile.skillsScore,
            profile.redFlags.length,
            formatTime(profile.completionTime),
            format(new Date(profile.createdAt), 'yyyy-MM-dd')
          ].join(',')
        )
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `questionnaires-${format(new Date(), 'yyyy-MM-dd')}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('CSV exported successfully')
    } catch (error) {
      toast.error('Failed to export CSV')
    }
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Please log in to access this page.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Questionnaire Responses</h1>
            <p className="text-gray-400 mt-2">
              Manage and analyze rider questionnaire responses
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/admin/questionnaires/analytics">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Button onClick={exportToCSV} variant="outline" className="border-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Responses</p>
                  <p className="text-2xl font-bold text-white">{pagination.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">
                    {profiles.filter(p => {
                      const monthAgo = new Date()
                      monthAgo.setMonth(monthAgo.getMonth() - 1)
                      return new Date(p.createdAt) > monthAgo
                    }).length}
                  </p>
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
                  <p className="text-gray-400 text-sm">High Risk</p>
                  <p className="text-2xl font-bold text-white">
                    {profiles.filter(p => p.riskProfile === 'high' || p.riskProfile === 'critical').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">With Red Flags</p>
                  <p className="text-2xl font-bold text-white">
                    {profiles.filter(p => p.redFlags.length > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search by name or email"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Type</label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="experienced">Experienced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Risk Profile</label>
                <Select value={filters.riskProfile} onValueChange={(value) => handleFilterChange('riskProfile', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="All risk levels" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="">All risk levels</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Profile Type</label>
                <Select value={filters.profileType} onValueChange={(value) => handleFilterChange('profileType', value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="All profiles" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="">All profiles</SelectItem>
                    <SelectItem value="BEGINNER_CAREFUL">Beginner Careful</SelectItem>
                    <SelectItem value="BEGINNER_FAST">Beginner Fast</SelectItem>
                    <SelectItem value="BEGINNER_ROMANTIC">Beginner Romantic</SelectItem>
                    <SelectItem value="EXPERIENCED_SAFE">Experienced Safe</SelectItem>
                    <SelectItem value="EXPERIENCED_AGGRESSIVE">Experienced Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responses Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Questionnaire Responses</CardTitle>
            <CardDescription className="text-gray-400">
              All questionnaire responses from users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading responses...</p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No questionnaire responses found</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Age</TableHead>
                      <TableHead className="text-gray-300">Profession</TableHead>
                      <TableHead className="text-gray-300">Motorcycle</TableHead>
                      <TableHead className="text-gray-300">Seasons</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Profile</TableHead>
                      <TableHead className="text-gray-300">Risk</TableHead>
                      <TableHead className="text-gray-300">Scores</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id} className="border-gray-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{profile.userName || 'Unknown'}</p>
                            <p className="text-gray-400 text-xs">{profile.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-sm">{profile.age}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-sm">{profile.profession}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-sm font-medium">{profile.motorcycle}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-sm">
                            {profile.ridingSeasons !== 'N/A' ? `${profile.ridingSeasons} seasons` : 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeBadgeColor(profile.type)}>
                            {profile.type === 'beginner' ? 'Beginner' : 'Experienced'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-xs">{profile.profileType}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskBadgeColor(profile.riskProfile)}>
                            {profile.riskProfile}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div className="text-white">R: {profile.riskScore.toFixed(1)}</div>
                            <div className="text-gray-400">S: {profile.safetyScore.toFixed(0)}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-300 text-xs">
                            {format(new Date(profile.createdAt), 'dd.MM.yy')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Link href={`/profile/${profile.userId}`}>
                              <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300" title="View Skills">
                                🎯
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination.total > pagination.limit && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-gray-400 text-sm">
                      Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} responses
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.offset === 0}
                        onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                        className="border-gray-700 text-gray-300"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasMore}
                        onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                        className="border-gray-700 text-gray-300"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}