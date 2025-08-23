'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'
import { ChevronRight, Shield } from 'lucide-react'

export default function TeaserMatrixTransitionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(127)
  const [matrixActive, setMatrixActive] = useState(false)
  const [matrixOpacity, setMatrixOpacity] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    // Start Matrix effect after 3 seconds
    const activationTimer = setTimeout(() => {
      setMatrixActive(true)
    }, 3000)

    // Gradually increase matrix opacity
    const opacityInterval = setInterval(() => {
      setMatrixOpacity(prev => {
        if (!matrixActive) return 0
        if (prev >= 0.7) return 0.7
        return prev + 0.02
      })
    }, 100)

    return () => {
      clearTimeout(activationTimer)
      clearInterval(opacityInterval)
    }
  }, [matrixActive])

  useEffect(() => {
    if (!matrixActive) return

    // Matrix rain effect
    const canvas = document.getElementById('matrix-transition') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const matrixChars = 'НЕБАЧИВСТАТИСТИКАМОТОЦИКЛБЕЗПЕКА0123456789NEBACHIV'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -100)
    }

    function drawMatrix() {
      if (!ctx) return
      
      ctx.fillStyle = `rgba(0, 0, 0, 0.04)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = `rgba(0, 255, 65, ${matrixOpacity})`
      ctx.font = fontSize + 'px Courier New'

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(drawMatrix, 35)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [matrixActive, matrixOpacity])

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
          source: 'teaser_matrix_transition',
          metadata: { 
            page: 'teaser_matrix_transition',
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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NebachivLogo 
              size="md" 
              variant="primary" 
              showText={true}
            />
            <div className="flex items-center space-x-4">
              <BrandedButton
                variant="ghost"
                size="sm"
                onClick={() => router.push('/register')}
              >
                Увійти
              </BrandedButton>
              <BrandedButton
                variant="gradient"
                size="sm"
                onClick={() => router.push('/register')}
              >
                Зарєструватись
              </BrandedButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video that transitions to Matrix */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Video Background */}
        <div className="absolute inset-0" style={{ filter: `brightness(${1 - matrixOpacity * 0.5})` }}>
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
          
          {/* Dark overlay that increases with matrix */}
          <div 
            className="absolute inset-0 bg-black transition-opacity duration-1000"
            style={{ opacity: matrixOpacity * 0.5 }}
          ></div>
        </div>

        {/* Matrix Rain (appears after delay) */}
        {matrixActive && (
          <canvas 
            id="matrix-transition" 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ opacity: matrixOpacity }}
          ></canvas>
        )}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 z-20"></div>
        
        {/* Main Content */}
        <div className="relative z-30 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge - changes color when matrix activates */}
            <div className="mb-8">
              <div className={`inline-flex items-center px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-1000 ${
                matrixActive 
                  ? 'bg-black/80 border border-green-400 text-green-400' 
                  : 'bg-gray-900/80 border border-gray-700 text-gray-300'
              }`}>
                <Shield className={`w-4 h-4 mr-2 transition-colors duration-1000 ${
                  matrixActive ? 'text-green-400' : 'text-nebachiv-blue'
                }`} />
                {matrixActive ? 'MATRIX PROTOCOL ACTIVATED' : 'Компетентність замість удачі'}
              </div>
            </div>
            
            {/* Main Headline - changes style when matrix activates */}
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight transition-all duration-1000 ${
              matrixActive ? 'text-green-400 matrix-text' : ''
            }`} style={{ 
              textShadow: matrixActive 
                ? '0 0 10px rgba(0, 255, 65, 0.8)' 
                : '2px 2px 6px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.8)'
            }}>
              <span className={matrixActive ? 'text-green-400' : 'text-white'}>
                НЕ СТАНЬ
                <br />
                <span className={matrixActive ? 'text-green-300' : 'text-nebachiv-blue'}>
                  СТАТИСТИКОЮ
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-6 transition-all duration-1000 ${
              matrixActive ? 'text-green-300 font-mono' : 'text-gray-300'
            }`} style={{ 
              textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
            }}>
              {matrixActive 
                ? 'ENTERING_SURVIVAL_MATRIX...' 
                : 'Як не розкластись в першому році'}
            </h2>

            {/* Stats - transform to matrix style */}
            <div className="flex justify-center items-center gap-8 mb-10 text-sm">
              <div className={`text-center transition-all duration-1000 ${
                matrixActive ? 'bg-black/80 px-4 py-2 border border-green-400' : ''
              }`}>
                <div className={`text-2xl font-bold transition-all duration-1000 ${
                  matrixActive ? 'text-green-400 font-mono' : 'text-nebachiv-blue'
                }`}>698</div>
                <div className={`transition-all duration-1000 ${
                  matrixActive ? 'text-green-300 font-mono' : 'text-gray-400'
                }`}>{matrixActive ? 'RIDERS_SAVED' : 'райдерів вдячні'}</div>
              </div>
              <div className={`w-px h-12 transition-all duration-1000 ${
                matrixActive ? 'bg-green-400' : 'bg-gray-600'
              }`}></div>
              <div className={`text-center transition-all duration-1000 ${
                matrixActive ? 'bg-black/80 px-4 py-2 border border-green-400' : ''
              }`}>
                <div className={`text-2xl font-bold transition-all duration-1000 ${
                  matrixActive ? 'text-green-400 font-mono' : 'text-green-400'
                }`}>89%</div>
                <div className={`transition-all duration-1000 ${
                  matrixActive ? 'text-green-300 font-mono' : 'text-gray-400'
                }`}>{matrixActive ? 'RISK_REDUCED' : 'зниження ризику'}</div>
              </div>
              <div className={`w-px h-12 transition-all duration-1000 ${
                matrixActive ? 'bg-green-400' : 'bg-gray-600'
              }`}></div>
              <div className={`text-center transition-all duration-1000 ${
                matrixActive ? 'bg-black/80 px-4 py-2 border border-green-400' : ''
              }`}>
                <div className={`text-2xl font-bold transition-all duration-1000 ${
                  matrixActive ? 'text-green-400 font-mono' : 'text-yellow-400'
                }`}>{waitlistCount.toLocaleString()}</div>
                <div className={`transition-all duration-1000 ${
                  matrixActive ? 'text-green-300 font-mono' : 'text-gray-400'
                }`}>{matrixActive ? 'IN_QUEUE' : 'в очікуванні'}</div>
              </div>
            </div>

            {/* Email Form - transforms style */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className={`backdrop-blur-sm p-8 transition-all duration-1000 ${
                  matrixActive 
                    ? 'bg-black/80 border border-green-400' 
                    : 'bg-black/60 border border-gray-700 rounded-2xl'
                }`}>
                  <h3 className={`text-2xl font-bold mb-6 transition-all duration-1000 ${
                    matrixActive ? 'text-green-400 font-mono' : 'text-white'
                  }`}>
                    {matrixActive ? '> ENTER_THE_MATRIX' : 'Додатись в ліст очікування'}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={matrixActive ? "your.email@matrix.net" : "Ваш email"}
                      className={`flex-1 px-6 py-4 focus:outline-none focus:ring-2 text-lg transition-all duration-1000 ${
                        matrixActive 
                          ? 'bg-black border border-green-400 text-green-400 placeholder-green-600 focus:ring-green-400 focus:border-green-300 font-mono'
                          : 'bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-nebachiv-blue focus:border-nebachiv-blue'
                      }`}
                      required
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !email}
                      className={`px-8 py-4 font-bold text-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[200px] ${
                        matrixActive
                          ? 'bg-green-400 text-black hover:bg-green-300 hover:shadow-lg hover:shadow-green-400/25 font-mono'
                          : 'bg-gradient-to-r from-nebachiv-blue to-nebachiv-blue-dark text-white rounded-lg transform hover:scale-105 hover:shadow-lg hover:shadow-nebachiv-blue/25'
                      }`}
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        matrixActive ? "EXECUTE" : "Відправити"
                      )}
                    </button>
                  </div>
                  
                  {error && (
                    <div className={`mt-4 text-center ${matrixActive ? 'text-nebachiv-orange font-mono' : 'text-nebachiv-orange'}`}>
                      {matrixActive && '> ERROR: '}{error}
                    </div>
                  )}
                  
                </div>
              </form>
            ) : (
              <div className={`max-w-2xl mx-auto backdrop-blur-sm p-8 ${
                matrixActive 
                  ? 'bg-black/80 border border-green-400' 
                  : 'bg-green-900/60 border border-green-700 rounded-2xl'
              }`}>
                <div className="text-6xl mb-4">✅</div>
                <h3 className={`text-3xl font-bold mb-4 ${
                  matrixActive ? 'text-green-400 font-mono' : 'text-green-400'
                }`}>
                  {matrixActive ? 'ACCESS_GRANTED' : 'Вітаємо! Ти в списку'}
                </h3>
                <p className={`text-xl mb-6 ${
                  matrixActive ? 'text-green-300' : 'text-gray-200'
                }`}>
                  {matrixActive 
                    ? 'Check your email. The Matrix has you now.' 
                    : 'Перевір свою пошту - ми вже надіслали перший урок.'}
                </p>
                <p className={matrixActive ? 'text-green-400 font-mono' : 'text-gray-400'}>
                  {matrixActive ? 'POSITION: #' : 'Ти учасник №'}
                  <span className="font-bold text-white">{waitlistCount.toLocaleString()}</span>
                  {!matrixActive && ' в очікуванні повного курсу'}
                </p>
              </div>
            )}

            {/* Transition indicator */}
            {!matrixActive && (
              <div className="mt-8 text-gray-500 text-sm">
                Matrix activation in {3 - Math.floor((Date.now() % 3000) / 1000)}...
              </div>
            )}

          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <ChevronRight className={`w-6 h-6 transition-colors duration-1000 ${
            matrixActive ? 'text-green-400' : 'text-gray-400'
          } rotate-90`} />
        </div>
      </section>

      <style jsx>{`
        @keyframes matrix-text {
          0%, 100% { 
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .matrix-text {
          animation: matrix-text 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}