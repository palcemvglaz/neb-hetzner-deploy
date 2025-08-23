'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  DollarSign,
  Mail,
  Database,
  Key,
  Save,
  AlertCircle,
  CheckCircle,
  Zap,
  Palette,
  FileText
} from 'lucide-react'

interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    supportEmail: string
    timezone: string
    language: string
    dateFormat: string
  }
  security: {
    requireEmailVerification: boolean
    allowSocialLogin: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    passwordMinLength: number
    require2FA: boolean
  }
  notifications: {
    emailNotifications: boolean
    newUserNotification: boolean
    paymentNotification: boolean
    lowStockNotification: boolean
    systemUpdates: boolean
  }
  payments: {
    currency: string
    stripeEnabled: boolean
    stripePublicKey: string
    liqpayEnabled: boolean
    liqpayPublicKey: string
    taxRate: number
  }
  content: {
    defaultLanguage: string
    enableComments: boolean
    moderateComments: boolean
    enableRatings: boolean
    contentCacheTime: number
  }
  api: {
    kbNebApiUrl: string
    kbNebApiKey: string
    enableWebhooks: boolean
    webhookSecret: string
    rateLimitPerMinute: number
  }
}

const LANGUAGES = [
  { code: 'uk', name: 'Українська' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' }
]

const TIMEZONES = [
  { value: 'Europe/Kiev', label: 'Київ (UTC+2)' },
  { value: 'Europe/London', label: 'Лондон (UTC+0)' },
  { value: 'America/New_York', label: 'Нью-Йорк (UTC-5)' }
]

const CURRENCIES = [
  { code: 'UAH', symbol: '₴', name: 'Гривня' },
  { code: 'USD', symbol: '$', name: 'Долар США' },
  { code: 'EUR', symbol: '€', name: 'Євро' }
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return
    
    setSaving(true)
    setSaveStatus('idle')
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (category: keyof SystemSettings, key: string, value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    })
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'general', name: 'Загальні', icon: Settings },
    { id: 'security', name: 'Безпека', icon: Shield },
    { id: 'notifications', name: 'Сповіщення', icon: Bell },
    { id: 'payments', name: 'Платежі', icon: DollarSign },
    { id: 'content', name: 'Контент', icon: FileText },
    { id: 'api', name: 'API та інтеграції', icon: Zap }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Налаштування системи</h1>
        <p className="text-gray-600">Конфігурація платформи Nebachiv</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">Загальні налаштування</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Назва сайту
                  </label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опис сайту
                  </label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Контактний email
                    </label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email підтримки
                    </label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Часовий пояс
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Мова за замовчуванням
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => updateSetting('general', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">Налаштування безпеки</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.security.requireEmailVerification}
                      onChange={(e) => updateSetting('security', 'requireEmailVerification', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Вимагати підтвердження email</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.security.allowSocialLogin}
                      onChange={(e) => updateSetting('security', 'allowSocialLogin', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Дозволити вхід через соцмережі</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.security.require2FA}
                      onChange={(e) => updateSetting('security', 'require2FA', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Вимагати двофакторну автентифікацію для адмінів</span>
                  </label>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тайм-аут сесії (хвилини)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Максимум спроб входу
                    </label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мінімальна довжина пароля
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Other tabs content... */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">Налаштування сповіщень</h2>
                <p className="text-gray-600">Налаштування email сповіщень...</p>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">Налаштування платежів</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Валюта за замовчуванням
                  </label>
                  <select
                    value={settings.payments.currency}
                    onChange={(e) => updateSetting('payments', 'currency', e.target.value)}
                    className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">Налаштування контенту</h2>
                <p className="text-gray-600">Налаштування контенту та коментарів...</p>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">API та інтеграції</h2>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">KB_NEB Integration</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Налаштування підключення до бази знань Небачив
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API URL
                      </label>
                      <input
                        type="url"
                        value={settings.api.kbNebApiUrl}
                        onChange={(e) => updateSetting('api', 'kbNebApiUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={settings.api.kbNebApiKey}
                        onChange={(e) => updateSetting('api', 'kbNebApiKey', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {saveStatus === 'success' && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600">Налаштування збережено!</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600">Помилка збереження</span>
                </>
              )}
            </div>
            
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Збереження...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Зберегти зміни
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}