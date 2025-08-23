'use client'

import { useState } from 'react'
import { Share2, Facebook, Twitter, Linkedin, Link, Check, X } from 'lucide-react'

interface ShareAchievementProps {
  achievement: {
    title: string
    description: string
    icon: string
    unlockedAt: Date
  }
  userName: string
  certificateNumber?: string
}

export default function ShareAchievement({ achievement, userName, certificateNumber }: ShareAchievementProps) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/achievements/verify${certificateNumber ? `?cert=${certificateNumber}` : ''}`
    : ''

  const shareText = certificateNumber
    ? `Я отримав сертифікат "${achievement.title}" на платформі Nebachiv! 🏆 Перевірте за номером: ${certificateNumber}`
    : `Я розблокував досягнення "${achievement.title}" на платформі Nebachiv! ${achievement.icon}`

  const shareToSocial = (platform: string) => {
    let url = ''
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=Nebachiv,МотоБезпека`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        break
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const generateImage = () => {
    // In a real implementation, this would generate a shareable image
    // using Canvas API or server-side image generation
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#1e40af')
      gradient.addColorStop(1, '#7c3aed')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Logo/Brand
      ctx.fillStyle = 'white'
      ctx.font = 'bold 48px sans-serif'
      ctx.fillText('NEBACHIV', 50, 80)
      
      // Achievement icon
      ctx.font = '120px sans-serif'
      ctx.fillText(achievement.icon, canvas.width / 2 - 60, 250)
      
      // Achievement title
      ctx.font = 'bold 64px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(achievement.title, canvas.width / 2, 380)
      
      // User name
      ctx.font = '36px sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fillText(`Отримав: ${userName}`, canvas.width / 2, 450)
      
      // Date
      ctx.font = '28px sans-serif'
      ctx.fillText(achievement.unlockedAt.toLocaleDateString('uk-UA'), canvas.width / 2, 500)
      
      // Certificate number if available
      if (certificateNumber) {
        ctx.font = '24px monospace'
        ctx.fillText(`Сертифікат: ${certificateNumber}`, canvas.width / 2, 560)
      }
    }
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nebachiv-achievement-${achievement.title.toLowerCase().replace(/\s+/g, '-')}.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
        title="Поділитися досягненням"
      >
        <Share2 className="w-5 h-5 text-blue-700" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Поділитися досягненням</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Achievement Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg mb-6 text-center">
              <div className="text-6xl mb-3">{achievement.icon}</div>
              <h4 className="font-bold text-lg mb-2">{achievement.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
              <p className="text-xs text-gray-500">
                Отримано: {achievement.unlockedAt.toLocaleDateString('uk-UA')}
              </p>
              {certificateNumber && (
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  Сертифікат: {certificateNumber}
                </p>
              )}
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">Поділитися в соцмережах:</p>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => shareToSocial('facebook')}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareToSocial('twitter')}
                    className="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                    title="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareToSocial('linkedin')}
                    className="p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareToSocial('telegram')}
                    className="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                    title="Telegram"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.56c-.21 2.27-1.13 7.75-1.6 10.29-.2 1.08-.59 1.44-.97 1.47-.82.07-1.45-.54-2.24-.97-1.24-.68-1.94-1.1-3.14-1.77-1.39-.77-.49-1.2.3-1.89.21-.18 3.82-3.5 3.89-3.8.01-.04.01-.18-.07-.26s-.2-.05-.29-.03c-.12.03-2.09 1.33-5.91 3.9-.56.38-1.07.57-1.52.56-.5-.01-1.47-.28-2.19-.52-.88-.29-1.58-.44-1.52-.93.03-.26.38-.52 1.05-.79 4.11-1.79 6.85-2.97 8.23-3.54 3.92-1.62 4.74-1.9 5.27-1.91.12 0 .38.03.55.18.14.13.18.3.2.44-.01.06-.01.24-.03.38z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Або скопіюйте посилання:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Скопійовано</span>
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4" />
                        <span>Копіювати</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={generateImage}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Завантажити як зображення
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}