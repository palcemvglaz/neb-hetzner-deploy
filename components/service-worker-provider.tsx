'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export default function ServiceWorkerProvider() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowUpdatePrompt(true)
                }
              })
            }
          })
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
        })

      // Handle install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        
        // Show prompt after 30 seconds
        setTimeout(() => {
          setShowInstallPrompt(true)
        }, 30000)
      })

      // Listen for app installed
      window.addEventListener('appinstalled', () => {
        setShowInstallPrompt(false)
        setDeferredPrompt(null)
      })
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('App installed')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
    }
    window.location.reload()
  }

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Встановити Nebachiv</h3>
              <p className="text-sm text-gray-600 mb-3">
                Встановіть додаток для швидкого доступу та офлайн режиму
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Встановити
                </button>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="px-4 py-2 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                >
                  Пізніше
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Доступне оновлення</h3>
              <p className="text-sm text-blue-100">
                Нова версія додатку готова до встановлення
              </p>
            </div>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-white text-blue-600 text-sm rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Оновити
            </button>
          </div>
        </div>
      )}
    </>
  )
}