'use client'

import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { PushNotifications } from '@capacitor/push-notifications'
import { SplashScreen } from '@capacitor/splash-screen'

export default function CapacitorProvider({ children }: { children: React.ReactNode }) {
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    const initCapacitor = async () => {
      // Check if running in Capacitor
      const isNativePlatform = Capacitor.isNativePlatform()
      setIsNative(isNativePlatform)

      if (!isNativePlatform) return

      // Hide splash screen
      await SplashScreen.hide()

      // Set status bar
      if (Capacitor.getPlatform() !== 'web') {
        await StatusBar.setStyle({ style: Style.Light })
        await StatusBar.setBackgroundColor({ color: '#1e40af' })
      }

      // Handle app state changes
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive)
      })

      // Handle back button on Android
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp()
        } else {
          window.history.back()
        }
      })

      // Initialize push notifications
      initPushNotifications()
    }

    initCapacitor()

    return () => {
      App.removeAllListeners()
    }
  }, [])

  const initPushNotifications = async () => {
    // Request permission
    let permStatus = await PushNotifications.checkPermissions()

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions()
    }

    if (permStatus.receive !== 'granted') {
      console.log('Push notification permission not granted')
      return
    }

    // Register with Apple/Google
    await PushNotifications.register()

    // Listen for registration
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value)
      // Send token to your server
    })

    // Listen for errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error))
    })

    // Handle notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification)
      // Haptic feedback
      Haptics.impact({ style: ImpactStyle.Medium })
    })

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue)
    })
  }

  // Add global Capacitor helpers
  useEffect(() => {
    if (!isNative) return

    // Add haptic feedback to buttons
    const addHapticFeedback = () => {
      const buttons = document.querySelectorAll('button, a')
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          Haptics.impact({ style: ImpactStyle.Light })
        })
      })
    }

    // Run on page load and route changes
    addHapticFeedback()
    const observer = new MutationObserver(addHapticFeedback)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [isNative])

  return <>{children}</>
}