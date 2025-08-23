'use client'

import { Capacitor } from '@capacitor/core'

export interface PushNotificationConfig {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  requireInteraction?: boolean
  silent?: boolean
}

export class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null
  private permission: NotificationPermission = 'default'

  async initialize(): Promise<boolean> {
    try {
      // Check if we're in a supported environment
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported')
        return false
      }

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered for push notifications')

      // Check current permission
      this.permission = Notification.permission

      // If we're in a Capacitor app, also initialize native push notifications
      if (Capacitor.isNativePlatform()) {
        await this.initializeNativePush()
      }

      return true
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      return false
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        // Request permission for native push notifications
        const { PushNotifications } = await import('@capacitor/push-notifications')
        
        const permission = await PushNotifications.requestPermissions()
        return permission.receive === 'granted'
      } else {
        // Request permission for web push notifications
        this.permission = await Notification.requestPermission()
        return this.permission === 'granted'
      }
    } catch (error) {
      console.error('Failed to request push permission:', error)
      return false
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.warn('Service worker not registered')
      return null
    }

    try {
      return await this.registration.pushManager.getSubscription()
    } catch (error) {
      console.error('Failed to get push subscription:', error)
      return null
    }
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.warn('Service worker not registered')
      return null
    }

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission()
      if (!granted) {
        throw new Error('Push permission not granted')
      }
    }

    try {
      // Check if already subscribed
      let subscription = await this.registration.pushManager.getSubscription()
      
      if (!subscription) {
        // Create new subscription
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
          throw new Error('VAPID public key not configured')
        }

        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
        })
      }

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription)
      
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      throw error
    }
  }

  async unsubscribe(): Promise<boolean> {
    try {
      const subscription = await this.getSubscription()
      
      if (subscription) {
        const success = await subscription.unsubscribe()
        
        if (success) {
          // Notify server about unsubscription
          await this.removeSubscriptionFromServer(subscription)
        }
        
        return success
      }
      
      return true
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  async showLocalNotification(config: PushNotificationConfig): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      // Use native local notifications
      const { LocalNotifications } = await import('@capacitor/local-notifications')
      
      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now(),
          title: config.title,
          body: config.body,
          extra: config.data,
          schedule: { at: new Date(Date.now() + 100) } // Show immediately
        }]
      })
    } else {
      // Use web notifications
      if (this.permission === 'granted') {
        new Notification(config.title, {
          body: config.body,
          icon: config.icon || '/icons/icon-192x192.png',
          badge: config.badge || '/icons/badge-72x72.png',
          tag: config.tag,
          data: config.data,
          requireInteraction: config.requireInteraction,
          silent: config.silent,
          actions: config.actions
        })
      }
    }
  }

  private async initializeNativePush(): Promise<void> {
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications')

      // Add listeners for native push notifications
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value)
      })

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error)
      })

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification)
      })

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification)
        
        // Handle notification tap
        if (notification.notification.data?.url) {
          window.location.href = notification.notification.data.url
        }
      })

      // Register for push notifications
      await PushNotifications.register()
    } catch (error) {
      console.error('Failed to initialize native push notifications:', error)
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
          platform: Capacitor.getPlatform()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send subscription to server')
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error)
      throw error
    }
  }

  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON()
        })
      })
    } catch (error) {
      console.error('Error removing subscription from server:', error)
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    
    return outputArray
  }

  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    ) || Capacitor.isNativePlatform()
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission
  }
}

export const pushNotificationService = new PushNotificationService()