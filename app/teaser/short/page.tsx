'use client'

import { useState, useEffect, useRef } from 'react'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { ArrowRight } from 'lucide-react'

export default function ShortTeaserPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setMousePosition({ x: x * 20, y: y * 20 })
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'teaser_short',
          metadata: { variant: 'short', timestamp: new Date().toISOString() }
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setSubmitted(true)
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
      {/* Minimal Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <NebachivLogo size="sm" variant="primary" showText={true} />
        </div>
      </nav>

      {/* Ultra Short Hero */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        
        {/* Video Background */}
        <div className="absolute inset-0" style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out',
        }}>
          <img 
            src="/marketing_data/photos good for promo site/IMG_5806.png" 
            alt="Motorcycle rider" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.6)' }}
          />
          <video 
            autoPlay loop muted playsInline preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.6)' }}
            onError={(e) => e.currentTarget.style.display = 'none'}
          >
            <source src="/videos_bg/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Minimal Content */}
        <div className="relative z-20 text-center px-4 max-w-2xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Ultra Short Headline */}
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight" style={{ 
              textShadow: '2px 2px 6px rgba(0,0,0,0.9)'
            }}>
              <span className="text-white">НЕ СТАНЬ</span>
              <br />
              <span className="text-nebachiv-orange">СТАТИСТИКОЮ</span>
            </h1>
            
            {/* One Line Value Prop */}
            <p className="text-2xl text-gray-200 mb-10 font-medium">
              89% аварій передбачувані. Дізнайся як.
            </p>

            {/* Immediate Email Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-black/70 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Твій email"
                    className="flex-1 px-6 py-4 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nebachiv-blue text-lg"
                    required
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="bg-gradient-to-r from-nebachiv-blue to-nebachiv-blue-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Вижити
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
                {error && <div className="mt-4 text-nebachiv-orange text-center text-sm">{error}</div>}
              </form>
            ) : (
              <div className="bg-green-900/70 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">
                  Перевір пошту
                </h3>
                <p className="text-gray-200">
                  Ми надіслали перший урок виживання
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}