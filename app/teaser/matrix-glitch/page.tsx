'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'
import { ChevronRight, Shield } from 'lucide-react'

export default function TeaserMatrixGlitchPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(127)
  const [glitchActive, setGlitchActive] = useState(false)
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsVisible(true)
    
    // Periodic glitch effect every 10-15 seconds
    const triggerGlitch = () => {
      setGlitchActive(true)
      
      // Rapid intensity changes for glitch effect
      let intensity = 0
      const glitchAnimation = setInterval(() => {
        intensity += 0.1
        if (intensity > 1) {
          intensity = Math.random()
        }
        setGlitchIntensity(intensity)
      }, 50)
      
      // End glitch after 1-2 seconds
      setTimeout(() => {
        clearInterval(glitchAnimation)
        setGlitchActive(false)
        setGlitchIntensity(0)
      }, 1000 + Math.random() * 1000)
    }

    // Initial glitch after 5 seconds
    const initialTimer = setTimeout(triggerGlitch, 5000)
    
    // Periodic glitches
    glitchIntervalRef.current = setInterval(() => {
      triggerGlitch()
    }, 10000 + Math.random() * 5000) // 10-15 seconds

    return () => {
      clearTimeout(initialTimer)
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!glitchActive) return

    // Matrix rain effect during glitch
    const canvas = document.getElementById('matrix-glitch') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const matrixChars = 'НЕБАЧИВСТАТИСТИКАМОТОЦИКЛБЕЗПЕКА0123456789NEBACHIV!@#$%^&*()'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height / fontSize)
    }

    function drawMatrix() {
      if (!ctx || !glitchActive) return
      
      // Glitchy clear effect
      if (Math.random() > 0.7) {
        ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + Math.random() * 0.1})`
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Random color glitches
      const colors = ['#00ff41', '#ff0041', '#0041ff', '#ffff41']
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
      ctx.font = fontSize + 'px Courier New'

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
        
        // Random position offsets for glitch
        const xOffset = glitchActive ? (Math.random() - 0.5) * 10 : 0
        const yOffset = glitchActive ? (Math.random() - 0.5) * 5 : 0
        
        ctx.fillText(text, i * fontSize + xOffset, drops[i] * fontSize + yOffset)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
        
        // Random drop speed during glitch
        if (glitchActive && Math.random() > 0.9) {
          drops[i] += Math.floor(Math.random() * 5)
        }
      }
    }

    const interval = setInterval(drawMatrix, 35)

    return () => {
      clearInterval(interval)
    }
  }, [glitchActive])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'teaser_matrix_glitch',
          metadata: { 
            page: 'teaser_matrix_glitch',
            timestamp: new Date().toISOString()
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        setWaitlistCount(prev => prev + (data.isNew ? 1 : 0))
      } else {
        setError(data.error || 'Щось пішло не так')
      }
    } catch (err) {
      setError('Помилка підключення. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  // Manual glitch trigger
  const triggerManualGlitch = () => {
    setGlitchActive(true)
    setTimeout(() => setGlitchActive(false), 1500)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${
        glitchActive 
          ? 'bg-black/90 border-green-400' 
          : 'bg-black/80 border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={glitchActive ? 'glitch-effect' : ''}>
              <NebachivLogo 
                size="md" 
                variant="primary" 
                showText={true}
              />
            </div>
            <div className="flex items-center space-x-4">
              <BrandedButton
                variant="ghost"
                size="sm"
                onClick={() => router.push('/register')}
                className={glitchActive ? 'glitch-text' : ''}
              >
                Увійти
              </BrandedButton>
              <BrandedButton
                variant="gradient"
                size="sm"
                onClick={() => router.push('/register')}
                className={glitchActive ? 'glitch-button' : ''}
              >
                Зарєструватись
              </BrandedButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Glitch Effects */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Video Background */}
        <div 
          className={`absolute inset-0 ${glitchActive ? 'glitch-video' : ''}`}
          style={{ 
            filter: glitchActive 
              ? `brightness(${0.5 + glitchIntensity * 0.5}) contrast(${1 + glitchIntensity}) hue-rotate(${glitchIntensity * 180}deg)` 
              : 'brightness(0.7)'
          }}
        >
          {/* Fallback image */}
          <img 
            src="/marketing_data/photos good for promo site/IMG_5806.png" 
            alt="Motorcycle rider" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Video */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/videos_bg/hero-background.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Matrix Rain (only during glitch) */}
        {glitchActive && (
          <canvas 
            id="matrix-glitch" 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ 
              opacity: glitchIntensity,
              mixBlendMode: 'screen'
            }}
          ></canvas>
        )}

        {/* Glitch overlay effects */}
        {glitchActive && (
          <>
            <div className="absolute inset-0 z-15 pointer-events-none glitch-overlay-1"></div>
            <div className="absolute inset-0 z-15 pointer-events-none glitch-overlay-2"></div>
          </>
        )}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 z-20"></div>
        
        {/* Main Content */}
        <div className="relative z-30 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${
            glitchActive ? 'glitch-content' : ''
          }`}>
            
            {/* Badge */}
            <div className="mb-8">
              <div className={`inline-flex items-center px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                glitchActive 
                  ? 'bg-nebachiv-orange/20/80 border border-nebachiv-orange text-nebachiv-orange' 
                  : 'bg-gray-900/80 border border-gray-700 text-gray-300'
              }`}>
                <Shield className={`w-4 h-4 mr-2 ${glitchActive ? 'text-nebachiv-orange' : 'text-nebachiv-blue'}`} />
                {glitchActive ? 'SYSTEM_ERROR_DETECTED' : 'Компетентність замість удачі'}
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight ${
              glitchActive ? 'glitch-title' : ''
            }`} style={{ 
              textShadow: '2px 2px 6px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.8)'
            }}>
              <span className="text-white">
                НЕ СТАНЬ
                <br />
                <span className={glitchActive ? 'text-nebachiv-orange' : 'text-nebachiv-blue'}>
                  СТАТИСТИКОЮ
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-gray-300 ${
              glitchActive ? 'glitch-subtitle' : ''
            }`} style={{ 
              textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
            }}>
              {glitchActive 
                ? 'ERROR: REALITY_BREACH_DETECTED' 
                : 'Як не розкластись в першому році'}
            </h2>

            {/* Stats */}
            <div className="flex justify-center items-center gap-8 mb-10 text-sm">
              <div className={`text-center ${glitchActive ? 'glitch-stat' : ''}`}>
                <div className="text-2xl font-bold text-nebachiv-blue">
                  {glitchActive ? Math.floor(Math.random() * 999) : 698}
                </div>
                <div className="text-gray-400">райдерів вдячні</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div className={`text-center ${glitchActive ? 'glitch-stat' : ''}`}>
                <div className="text-2xl font-bold text-green-400">
                  {glitchActive ? Math.floor(Math.random() * 100) : 89}%
                </div>
                <div className="text-gray-400">зниження ризику</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div className={`text-center ${glitchActive ? 'glitch-stat' : ''}`}>
                <div className="text-2xl font-bold text-yellow-400">
                  {glitchActive ? Math.floor(Math.random() * 999) : waitlistCount}
                </div>
                <div className="text-gray-400">в очікуванні</div>
              </div>
            </div>

            {/* Email Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className={`backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 ${
                  glitchActive 
                    ? 'bg-nebachiv-orange/20/60 border-nebachiv-orange' 
                    : 'bg-black/60 border-gray-700'
                }`}>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {glitchActive ? 'WARNING: ENTER AT YOUR RISK' : 'Додатись в ліст очікування'}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={glitchActive ? "ERR0R@GL1TCH.SYS" : "Ваш email"}
                      className={`flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 text-lg transition-all duration-300 ${
                        glitchActive 
                          ? 'bg-black border border-nebachiv-orange text-nebachiv-orange placeholder-nebachiv-orange focus:ring-nebachiv-orange'
                          : 'bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:ring-nebachiv-blue focus:border-nebachiv-blue'
                      }`}
                      required
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !email}
                      className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[200px] ${
                        glitchActive
                          ? 'bg-nebachiv-orange text-white hover:bg-nebachiv-orange'
                          : 'bg-gradient-to-r from-nebachiv-blue to-nebachiv-blue-dark text-white hover:shadow-lg hover:shadow-nebachiv-blue/25'
                      }`}
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        glitchActive ? "OVERRIDE" : "Відправити"
                      )}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mt-4 text-nebachiv-orange text-center">{error}</div>
                  )}
                  
                </div>
              </form>
            ) : (
              <div className="max-w-2xl mx-auto bg-green-900/60 backdrop-blur-sm border border-green-700 rounded-2xl p-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-3xl font-bold text-green-400 mb-4">
                  Вітаємо! Ти в списку
                </h3>
                <p className="text-xl text-gray-200 mb-6">
                  Перевір свою пошту - ми вже надіслали перший урок.
                </p>
                <p className="text-gray-400">
                  Ти учасник №<span className="font-bold text-white">{waitlistCount.toLocaleString()}</span> в очікуванні повного курсу
                </p>
              </div>
            )}

            {/* Manual glitch trigger */}
            <button
              onClick={triggerManualGlitch}
              className="mt-8 text-gray-500 hover:text-gray-300 text-sm underline"
            >
              [trigger glitch manually]
            </button>

          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <ChevronRight className={`w-6 h-6 ${glitchActive ? 'text-nebachiv-orange' : 'text-gray-400'} rotate-90`} />
        </div>
      </section>

      <style jsx>{`
        @keyframes glitch {
          0%, 100% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          20% {
            transform: translate(-2px, 2px);
            filter: hue-rotate(90deg);
          }
          40% {
            transform: translate(-2px, -2px);
            filter: hue-rotate(180deg);
          }
          60% {
            transform: translate(2px, 2px);
            filter: hue-rotate(270deg);
          }
          80% {
            transform: translate(2px, -2px);
            filter: hue-rotate(360deg);
          }
        }

        .glitch-effect {
          animation: glitch 0.3s linear infinite;
        }

        .glitch-text {
          animation: glitch 0.2s linear infinite;
          text-shadow: 
            2px 0 red,
            -2px 0 blue,
            0 2px green;
        }

        .glitch-button {
          animation: glitch 0.4s linear infinite;
        }

        .glitch-video {
          animation: glitch 0.5s linear infinite;
        }

        .glitch-content {
          animation: glitch 0.15s linear infinite;
        }

        .glitch-title {
          animation: glitch 0.3s linear infinite;
          text-shadow: 
            3px 0 #ff0041,
            -3px 0 #0041ff,
            0 3px #00ff41,
            0 -3px #ffff41;
        }

        .glitch-subtitle {
          animation: glitch 0.25s linear infinite reverse;
        }

        .glitch-stat {
          animation: glitch 0.1s linear infinite;
        }

        .glitch-overlay-1 {
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 0, 0, 0.1) 50%,
            transparent 100%
          );
          animation: scan 4s linear infinite;
        }

        .glitch-overlay-2 {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 255, 0, 0.05),
            rgba(0, 255, 0, 0.05) 1px,
            transparent 1px,
            transparent 2px
          );
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  )
}