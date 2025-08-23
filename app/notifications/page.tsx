'use client'

import { useState, useEffect } from 'react'
import { Bell, Trash2, MoreVertical } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { uk } from 'date-fns/locale'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  actionUrl?: string
  isRead: boolean
  createdAt: Date
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const unreadOnly = filter === 'unread'
      const response = await fetch(`/api/notifications?limit=100&unreadOnly=${unreadOnly}`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'COURSE_ENROLLMENT':
        return '📚'
      case 'LESSON_COMPLETED':
        return '✅'
      case 'TEST_PASSED':
        return '🎉'
      case 'TEST_FAILED':
        return '📝'
      case 'CERTIFICATE_EARNED':
        return '🏆'
      case 'PAYMENT_SUCCESS':
        return '💳'
      case 'SYSTEM_ANNOUNCEMENT':
        return '📢'
      case 'ACHIEVEMENT_UNLOCKED':
        return '🎖️'
      default:
        return '🔔'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'COURSE_ENROLLMENT':
        return 'Запис на курс'
      case 'LESSON_COMPLETED':
        return 'Урок завершено'
      case 'TEST_PASSED':
        return 'Тест пройдено'
      case 'TEST_FAILED':
        return 'Тест не пройдено'
      case 'CERTIFICATE_EARNED':
        return 'Сертифікат отримано'
      case 'PAYMENT_SUCCESS':
        return 'Оплата'
      case 'SYSTEM_ANNOUNCEMENT':
        return 'Оголошення'
      case 'ACHIEVEMENT_UNLOCKED':
        return 'Досягнення'
      default:
        return 'Повідомлення'
    }
  }

  const filteredNotifications = notifications

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Bell className="w-8 h-8 text-blue-600" />
                  Повідомлення
                </h1>
                <p className="text-gray-600 mt-2">
                  Всі ваші повідомлення та оновлення
                </p>
              </div>
              
              {/* Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Всі
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Непрочитані
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'unread' ? 'Немає непрочитаних повідомлень' : 'Немає повідомлень'}
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread' 
                    ? 'Всі ваші повідомлення прочитані!'
                    : 'Повідомлення з\'являться тут коли будуть доступні'
                  }
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
                    !notification.isRead ? 'ring-2 ring-blue-100' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">
                            {getNotificationIcon(notification.type)}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {getTypeLabel(notification.type)}
                            </span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          
                          <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${
                            !notification.isRead ? 'font-bold' : ''
                          }`}>
                            {notification.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-3">
                            {notification.message}
                          </p>
                          
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: uk
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}