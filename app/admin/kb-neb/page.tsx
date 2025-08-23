'use client'

import { useState, useEffect } from 'react'
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Database,
  Download,
  Upload,
  FileText,
  Globe,
  TrendingUp,
  Activity,
  FolderOpen,
  GitBranch,
  Info
} from 'lucide-react'

interface SyncStatus {
  lastSync: string | null
  totalItems: number
  syncedItems: number
  failedItems: number
  isRunning: boolean
  currentItem: string | null
}

interface ContentStats {
  byFormat: Record<string, number>
  byLanguage: Record<string, number>
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  cornerstone: number
  highValue: number
}

const FORMAT_NAMES: Record<string, string> = {
  'M': 'Master текст',
  'T': 'Тези',
  'B': 'Блог',
  'W': 'Web/SEO',
  'V': 'Відео скрипт',
  'I': 'Instagram',
  'RAW': 'Необроблений'
}

const LANGUAGE_NAMES: Record<string, string> = {
  'UA': 'Українська',
  'EN': 'Англійська',
  'RU': 'Російська'
}

const STATUS_COLORS: Record<string, string> = {
  'done': 'text-green-600 bg-green-50',
  'doing': 'text-yellow-600 bg-yellow-50',
  'todo': 'text-gray-600 bg-gray-50',
  'check': 'text-blue-600 bg-blue-50',
  'translate': 'text-purple-600 bg-purple-50'
}

export default function KBNebSyncPage() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    totalItems: 0,
    syncedItems: 0,
    failedItems: 0,
    isRunning: false,
    currentItem: null
  })
  const [contentStats, setContentStats] = useState<ContentStats | null>(null)
  const [syncHistory, setSyncHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFormat, setSelectedFormat] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [forceUpdate, setForceUpdate] = useState(false)
  const [dryRun, setDryRun] = useState(false)

  useEffect(() => {
    fetchSyncStatus()
    fetchContentStats()
    fetchSyncHistory()
  }, [])

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/admin/kb-neb/status')
      const data = await response.json()
      setSyncStatus(data)
    } catch (error) {
      console.error('Error fetching sync status:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchContentStats = async () => {
    try {
      const response = await fetch('/api/admin/kb-neb/stats')
      const data = await response.json()
      setContentStats(data)
    } catch (error) {
      console.error('Error fetching content stats:', error)
    }
  }

  const fetchSyncHistory = async () => {
    try {
      const response = await fetch('/api/admin/kb-neb/history')
      const data = await response.json()
      setSyncHistory(data)
    } catch (error) {
      console.error('Error fetching sync history:', error)
    }
  }

  const startSync = async () => {
    setSyncStatus(prev => ({ ...prev, isRunning: true }))
    
    try {
      const params = new URLSearchParams()
      if (selectedFormat !== 'all') params.append('format', selectedFormat)
      if (selectedLanguage !== 'all') params.append('language', selectedLanguage)
      if (forceUpdate) params.append('force-update', 'true')
      if (dryRun) params.append('dry-run', 'true')
      
      const response = await fetch(`/api/admin/kb-neb/sync?${params}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // Poll for status updates
        const pollInterval = setInterval(async () => {
          await fetchSyncStatus()
          const status = await response.json()
          if (!status.isRunning) {
            clearInterval(pollInterval)
            fetchContentStats()
            fetchSyncHistory()
          }
        }, 2000)
      }
    } catch (error) {
      console.error('Error starting sync:', error)
      setSyncStatus(prev => ({ ...prev, isRunning: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KB_NEB Синхронізація</h1>
        <p className="text-gray-600">Імпорт контенту з бази знань Небачив</p>
      </div>

      {/* Sync Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Статус синхронізації</h2>
          <div className="flex items-center gap-2">
            {syncStatus.isRunning ? (
              <>
                <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                <span className="text-blue-600">Синхронізація...</span>
              </>
            ) : syncStatus.lastSync ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">
                  Остання: {new Date(syncStatus.lastSync).toLocaleString('uk-UA')}
                </span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500">Ще не синхронізовано</span>
              </>
            )}
          </div>
        </div>

        {syncStatus.isRunning && syncStatus.currentItem && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Обробка: {syncStatus.currentItem}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{syncStatus.totalItems}</p>
            <p className="text-sm text-gray-600">Всього файлів</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{syncStatus.syncedItems}</p>
            <p className="text-sm text-gray-600">Синхронізовано</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{syncStatus.failedItems}</p>
            <p className="text-sm text-gray-600">Помилок</p>
          </div>
        </div>

        {syncStatus.totalItems > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(syncStatus.syncedItems / syncStatus.totalItems) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sync Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Налаштування синхронізації</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Формат контенту
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              disabled={syncStatus.isRunning}
            >
              <option value="all">Всі формати</option>
              {Object.entries(FORMAT_NAMES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Мова
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              disabled={syncStatus.isRunning}
            >
              <option value="all">Всі мови</option>
              {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={forceUpdate}
              onChange={(e) => setForceUpdate(e.target.checked)}
              disabled={syncStatus.isRunning}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Примусово оновити існуючий контент</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
              disabled={syncStatus.isRunning}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Тестовий запуск (без змін)</span>
          </label>
        </div>

        <button
          onClick={startSync}
          disabled={syncStatus.isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {syncStatus.isRunning ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Синхронізація...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Почати синхронізацію
            </>
          )}
        </button>
      </div>

      {/* Content Statistics */}
      {contentStats && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Статистика контенту</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">За форматом</h3>
              <div className="space-y-2">
                {Object.entries(contentStats.byFormat).map(([format, count]) => (
                  <div key={format} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{FORMAT_NAMES[format] || format}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">За мовою</h3>
              <div className="space-y-2">
                {Object.entries(contentStats.byLanguage).map(([lang, count]) => (
                  <div key={lang} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{LANGUAGE_NAMES[lang] || lang}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">За статусом</h3>
              <div className="space-y-2">
                {Object.entries(contentStats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className={`text-sm px-2 py-1 rounded ${STATUS_COLORS[status] || 'text-gray-600'}`}>
                      {status}
                    </span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Важливість</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Основні концепції</span>
                  <span className="text-sm font-medium">{contentStats.cornerstone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Високої цінності</span>
                  <span className="text-sm font-medium">{contentStats.highValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KB_NEB Info */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Про KB_NEB</h3>
            <p className="text-sm text-blue-800 mb-2">
              База знань розташована: <code className="bg-blue-100 px-2 py-1 rounded">/Users/chyngys/scripts/kb_neb/vault_output</code>
            </p>
            <p className="text-sm text-blue-800">
              Містить проаналізовані знання про безпеку мотоциклістів, патерни аварій, 
              8 принципів виживання та навчальні матеріали на основі 12,000+ реальних ДТП.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}