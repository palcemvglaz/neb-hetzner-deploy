'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Upload, Settings, Info, AlertCircle, CheckCircle } from 'lucide-react'

export default function KBNebSyncPanel() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [syncOptions, setSyncOptions] = useState({
    format: 'ALL',
    language: 'UA',
    forceUpdate: false,
    dryRun: false,
  })
  const [syncResult, setSyncResult] = useState<any>(null)

  const handleSync = async () => {
    setIsLoading(true)
    setSyncResult(null)

    try {
      const response = await fetch('/api/admin/kb-neb/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncOptions),
      })

      const result = await response.json()

      if (response.ok) {
        setSyncResult(result)
        router.refresh()
      } else {
        setSyncResult({ error: result.error || 'Помилка синхронізації' })
      }
    } catch (error) {
      setSyncResult({ error: 'Помилка з\'єднання з сервером' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Sync configuration */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Налаштування синхронізації
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Формат контенту
            </label>
            <select
              value={syncOptions.format}
              onChange={(e) => setSyncOptions({ ...syncOptions, format: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={isLoading}
            >
              <option value="ALL">Всі формати</option>
              <option value="T">Тези (T)</option>
              <option value="M">Майстер (M)</option>
              <option value="IG">Instagram (IG)</option>
              <option value="TW">Twitter (TW)</option>
              <option value="FB">Facebook (FB)</option>
              <option value="LI">LinkedIn (LI)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Мова
            </label>
            <select
              value={syncOptions.language}
              onChange={(e) => setSyncOptions({ ...syncOptions, language: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={isLoading}
            >
              <option value="UA">Українська</option>
              <option value="EN">English</option>
              <option value="RU">Русский</option>
              <option value="ALL">Всі мови</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={syncOptions.forceUpdate}
              onChange={(e) => setSyncOptions({ ...syncOptions, forceUpdate: e.target.checked })}
              className="rounded border-gray-300 text-nebachiv-600"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-700">
              Примусово оновити існуючий контент
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={syncOptions.dryRun}
              onChange={(e) => setSyncOptions({ ...syncOptions, dryRun: e.target.checked })}
              className="rounded border-gray-300 text-nebachiv-600"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-700">
              Тестовий запуск (без імпорту)
            </span>
          </label>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-nebachiv-600 text-white rounded-md font-medium hover:bg-nebachiv-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Синхронізація...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Запустити синхронізацію
              </>
            )}
          </button>
        </div>
      </div>

      {/* KB_NEB info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Про KB_NEB інтеграцію
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>Шлях до KB_NEB:</strong> /Users/chyngys/scripts/kb_neb
          </p>
          <p>
            <strong>API endpoint:</strong> POST /api/v1/submit
          </p>
          <p>
            <strong>Підтримувані формати:</strong> T (тези), M (майстер), соціальні мережі (IG, TW, FB, LI)
          </p>
          <p className="mt-3">
            Синхронізація імпортує контент з KB_NEB та автоматично створює відповідні матеріали в системі.
            Кожен контент отримує унікальний KB_NEB ID для відстеження оновлень.
          </p>
        </div>
      </div>

      {/* Sync result */}
      {syncResult && (
        <div className={`rounded-lg p-6 ${
          syncResult.error 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <h3 className={`text-sm font-medium mb-2 flex items-center ${
            syncResult.error ? 'text-red-900' : 'text-green-900'
          }`}>
            {syncResult.error ? (
              <>
                <AlertCircle className="h-5 w-5 mr-2" />
                Помилка синхронізації
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Синхронізація завершена
              </>
            )}
          </h3>
          
          {syncResult.error ? (
            <p className="text-sm text-red-700">{syncResult.error}</p>
          ) : (
            <div className="text-sm text-green-700 space-y-1">
              <p>Оброблено файлів: {syncResult.processedFiles}</p>
              <p>Імпортовано: {syncResult.importedFiles}</p>
              <p>Оновлено: {syncResult.updatedFiles}</p>
              <p>Пропущено: {syncResult.skippedFiles}</p>
              {syncResult.errors > 0 && (
                <p className="text-red-600">Помилок: {syncResult.errors}</p>
              )}
              {syncResult.dryRun && (
                <p className="mt-2 font-medium">
                  ⚠️ Це був тестовий запуск. Дані не були змінені.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}