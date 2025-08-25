'use client'

import { useState, useEffect } from 'react'

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false)
  const [offlineQueue, setOfflineQueue] = useState<any[]>([])

  const processOfflineQueue = async () => {
    setOfflineQueue(currentQueue => {
      if (currentQueue.length === 0) return currentQueue

      // Process each item in the queue
      currentQueue.forEach(async (item) => {
        try {
          await fetch(item.url, item.options)
        } catch (error) {
          console.error('Failed to sync:', error)
        }
      })

      // Clear the queue
      return []
    })
  }

  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine)

    // Event listeners
    const handleOnline = () => {
      setIsOffline(false)
      processOfflineQueue()
    }

    const handleOffline = () => {
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const queueRequest = (url: string, options: RequestInit) => {
    setOfflineQueue(prev => [...prev, { url, options, timestamp: Date.now() }])
  }

  const saveOfflineData = (key: string, data: any) => {
    localStorage.setItem(`offline_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  }

  const getOfflineData = (key: string) => {
    const stored = localStorage.getItem(`offline_${key}`)
    if (!stored) return null
    
    const { data, timestamp } = JSON.parse(stored)
    // Data expires after 7 days
    if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(`offline_${key}`)
      return null
    }
    
    return data
  }

  return {
    isOffline,
    queueRequest,
    saveOfflineData,
    getOfflineData,
    offlineQueue
  }
}