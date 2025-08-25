'use client'

import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { App, URLOpenListenerEvent } from '@capacitor/app'
import { Network, ConnectionStatus } from '@capacitor/network'
import { Device, DeviceInfo } from '@capacitor/device'

export interface CapacitorState {
  isNative: boolean
  platform: string
  isOnline: boolean
  deviceInfo: DeviceInfo | null
  loading: boolean
}

export function useCapacitor() {
  const [state, setState] = useState<CapacitorState>({
    isNative: false,
    platform: 'web',
    isOnline: true,
    deviceInfo: null,
    loading: true
  })

  useEffect(() => {
    const initCapacitor = async () => {
      try {
        const isNative = Capacitor.isNativePlatform()
        const platform = Capacitor.getPlatform()
        
        // Get device info
        let deviceInfo: DeviceInfo | null = null
        if (isNative) {
          deviceInfo = await Device.getInfo()
        }

        // Get network status
        const networkStatus = await Network.getStatus()

        setState({
          isNative,
          platform,
          isOnline: networkStatus.connected,
          deviceInfo,
          loading: false
        })

        // Configure status bar for native apps
        if (isNative) {
          await StatusBar.setStyle({ style: Style.Light })
          await StatusBar.setBackgroundColor({ color: '#1e40af' })
          
          // Hide splash screen
          await SplashScreen.hide()
        }

        // Listen for network changes
        Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
          setState(prev => ({ ...prev, isOnline: status.connected }))
        })

        // Listen for app URL opens (deep links)
        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
          console.log('App opened with URL:', event.url)
          handleDeepLink(event.url)
        })

        // Listen for app state changes
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active:', isActive)
          if (isActive) {
            // App became active - refresh data if needed
            refreshAppData()
          }
        })

      } catch (error) {
        console.error('Error initializing Capacitor:', error)
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    initCapacitor()

    return () => {
      // Cleanup listeners
      Network.removeAllListeners()
      App.removeAllListeners()
    }
  }, [])

  const handleDeepLink = (url: string) => {
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname

      // Handle different deep link patterns
      if (path.startsWith('/course/')) {
        const courseId = path.split('/')[2]
        window.location.href = `/courses/${courseId}`
      } else if (path.startsWith('/lesson/')) {
        const lessonId = path.split('/')[2]
        window.location.href = `/learn/lesson/${lessonId}`
      } else {
        window.location.href = path
      }
    } catch (error) {
      console.error('Error handling deep link:', error)
    }
  }

  const refreshAppData = async () => {
    // Refresh notifications
    if (window.location.pathname.includes('/dashboard')) {
      window.location.reload()
    }
  }

  const shareContent = async (title: string, text: string, url?: string) => {
    if (state.isNative) {
      const { Share } = await import('@capacitor/share')
      try {
        await Share.share({
          title,
          text,
          url: url || window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
        fallbackShare(title, text, url)
      }
    } else {
      fallbackShare(title, text, url)
    }
  }

  const fallbackShare = (title: string, text: string, url?: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: url || window.location.href,
      }).catch(console.error)
    } else {
      // Copy to clipboard as fallback
      const shareText = `${title}\n${text}\n${url || window.location.href}`
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Посилання скопійовано!')
      }).catch(() => {
        alert('Не вдалося поділитися')
      })
    }
  }

  const openAppSettings = async () => {
    if (state.isNative) {
      const { Browser } = await import('@capacitor/browser')
      try {
        await Browser.open({ url: 'app-settings:' })
      } catch (error) {
        console.error('Error opening app settings:', error)
      }
    }
  }

  const exitApp = async () => {
    if (state.isNative) {
      const { App } = await import('@capacitor/app')
      try {
        await App.exitApp()
      } catch (error) {
        console.error('Error exiting app:', error)
      }
    }
  }

  const hapticFeedback = async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (state.isNative) {
      try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
        const impactStyle = type === 'light' ? ImpactStyle.Light : 
                           type === 'medium' ? ImpactStyle.Medium : ImpactStyle.Heavy
        await Haptics.impact({ style: impactStyle })
      } catch (error) {
        console.error('Error with haptic feedback:', error)
      }
    }
  }

  return {
    ...state,
    shareContent,
    openAppSettings,
    exitApp,
    hapticFeedback
  }
}