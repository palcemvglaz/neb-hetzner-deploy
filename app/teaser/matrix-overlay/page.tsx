'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'
import { ChevronRight, Shield } from 'lucide-react'

export default function TeaserMatrixOverlayPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(127)
  const [matrixIntensity, setMatrixIntensity] = useState(0.3) // Control matrix opacity

  useEffect(() => {
    setIsVisible(true)
    
    // Matrix rain effect overlay
    const canvas = document.getElementById('matrix-overlay') as HTMLCanvasElement
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
      
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Matrix characters with dynamic opacity
      ctx.fillStyle = '#00ff41'
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

    const interval = setInterval(drawMatrix, 50)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [matrixIntensity])

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
          source: 'teaser_matrix_overlay',
          metadata: { 
            page: 'teaser_matrix_overlay',
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

      {/* Hero Section with Video + Matrix Overlay */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Video Background */}
        <div className="absolute inset-0">
          {/* Fallback image */}
          <img 
            src="/marketing_data/photos good for promo site/IMG_5806.png" 
            alt="Motorcycle rider" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.8)' }}
          />
          
          {/* Video */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.8) contrast(1.1)' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/videos_bg/hero-background.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Matrix Rain Overlay */}
        <canvas 
          id="matrix-overlay" 
          className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
          style={{ opacity: matrixIntensity }}
        ></canvas>

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 z-20"></div>
        
        {/* Main Content */}
        <div className="relative z-30 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-black/80 border border-green-400 text-green-400 text-sm font-medium backdrop-blur-sm">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                MATRIX SURVIVAL PROTOCOL
              </div>
            </div>
            
            {/* Main Headline with glitch effect */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight matrix-glitch">
              <span className="text-white">
                НЕ СТАНЬ
                <br />
                <span className="text-green-400">СТАТИСТИКОЮ</span>
              </span>
            </h1>

            {/* Subheadline */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-green-300">
              Система виживання в цифровому світі дороги
            </h2>

            {/* Stats with Matrix style */}
            <div className="flex justify-center items-center gap-8 mb-10 text-sm">
              <div className="text-center bg-black/60 px-4 py-2 border border-green-400">
                <div className="text-2xl font-bold text-green-400 font-mono">698</div>
                <div className="text-green-300">RIDERS_SAVED</div>
              </div>
              <div className="w-px h-12 bg-green-400"></div>
              <div className="text-center bg-black/60 px-4 py-2 border border-green-400">
                <div className="text-2xl font-bold text-green-400 font-mono">89%</div>
                <div className="text-green-300">RISK_REDUCED</div>
              </div>
              <div className="w-px h-12 bg-green-400"></div>
              <div className="text-center bg-black/60 px-4 py-2 border border-green-400">
                <div className="text-2xl font-bold text-yellow-400 font-mono">{waitlistCount}</div>
                <div className="text-green-300">IN_QUEUE</div>
              </div>
            </div>

            {/* Email Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="bg-black/80 backdrop-blur-sm border border-green-400 rounded-none p-8">
                  <h3 className="text-2xl font-bold text-green-400 mb-6 font-mono">
                    &gt; ENTER_THE_MATRIX
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@matrix.net"
                      className="flex-1 px-6 py-4 bg-black border border-green-400 text-green-400 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-300 text-lg font-mono"
                      required
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="bg-green-400 text-black px-8 py-4 font-bold text-lg font-mono transition-all duration-300 hover:bg-green-300 hover:shadow-lg hover:shadow-green-400/25 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[200px]"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "EXECUTE"
                      )}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mt-4 text-nebachiv-orange text-center font-mono">&gt; ERROR: {error}</div>
                  )}
                  
                </div>
              </form>
            ) : (
              <div className="max-w-2xl mx-auto bg-black/80 backdrop-blur-sm border border-green-400 p-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-3xl font-bold text-green-400 mb-4 font-mono">
                  ACCESS_GRANTED
                </h3>
                <p className="text-xl text-green-300 mb-6">
                  Check your email. The Matrix has you now.
                </p>
                <p className="text-green-400 font-mono">
                  POSITION: #{waitlistCount.toLocaleString()}
                </p>
              </div>
            )}

            {/* Matrix intensity control */}
            <div className="mt-8 flex items-center justify-center gap-4 text-green-400 text-sm">
              <span className="font-mono">MATRIX_INTENSITY:</span>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.1"
                value={matrixIntensity}
                onChange={(e) => setMatrixIntensity(parseFloat(e.target.value))}
                className="w-32"
              />
              <span className="font-mono">{(matrixIntensity * 100).toFixed(0)}%</span>
            </div>

          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
          <ChevronRight className="w-6 h-6 text-green-400 rotate-90" />
        </div>
      </section>

      <style jsx>{`
        @keyframes matrix-glitch {
          0%, 100% { 
            text-shadow: 
              0 0 10px rgba(0, 255, 65, 0.8),
              0 0 20px rgba(0, 255, 65, 0.6),
              0 0 30px rgba(0, 255, 65, 0.4);
          }
          50% {
            text-shadow: 
              0 0 5px rgba(0, 255, 65, 1),
              0 0 15px rgba(0, 255, 65, 0.8),
              0 0 25px rgba(0, 255, 65, 0.6);
          }
        }
        
        .matrix-glitch {
          animation: matrix-glitch 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}