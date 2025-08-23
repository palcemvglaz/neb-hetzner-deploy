'use client'

import { useState, useEffect } from 'react'
import { Trash2, Download, Eye } from 'lucide-react'

interface WaitlistEntry {
  id: string
  email: string
  name: string | null
  phone: string | null
  interests: string | null
  source: string
  createdAt: string
}

export default function WaitlistAdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0 })

  useEffect(() => {
    fetchWaitlistData()
  }, [])

  const fetchWaitlistData = async () => {
    try {
      const response = await fetch('/api/waitlist')
      const data = await response.json()
      setEntries(data.recent || [])
      setStats({ total: data.total || 0 })
    } catch (error) {
      console.error('Error fetching waitlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteEntry = async (id: string) => {
    if (!confirm('Видалити цей запис з waitlist?')) return
    
    try {
      const response = await fetch(`/api/admin/waitlist/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== id))
        setStats(prev => ({ total: prev.total - 1 }))
      } else {
        alert('Помилка при видаленні')
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Помилка при видаленні')
    }
  }

  const exportToCsv = () => {
    const csvContent = [
      ['Email', 'Name', 'Phone', 'Source', 'Created At'],
      ...entries.map(entry => [
        entry.email,
        entry.name || '',
        entry.phone || '',
        entry.source,
        new Date(entry.createdAt).toLocaleDateString('uk-UA')
      ])
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading waitlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Waitlist Management</h1>
              <p className="text-gray-300">Manage newsletter signups and pre-registrations</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={exportToCsv}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
            <p className="text-sm text-gray-300 mt-1">Total Signups</p>
          </div>
        </div>

        {/* Waitlist Table */}
        <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Waitlist Entries</h2>
          </div>
          
          {entries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.name || 'No name'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {entry.phone || 'No phone'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {entry.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(entry.createdAt).toLocaleDateString('uk-UA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-400">No waitlist entries found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}