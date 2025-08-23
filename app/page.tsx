'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'
import { ChevronRight, Shield, CheckIcon, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [waitlistCount, setWaitlistCount] = useState(127)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    
    // Mouse parallax effect (same as main landing)
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'homepage',
          metadata: { 
            page: 'main_homepage',
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
      {/* Header - Same as main landing */}
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

      {/* Hero Section - Same style as main landing */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        
        {/* Video Background with Fallback - Same as main */}
        <div className="absolute inset-0"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}>
          {/* Fallback image */}
          <img 
            src="/marketing_data/photos good for promo site/IMG_5806.png" 
            alt="Motorcycle rider" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          />
          
          {/* Video overlay */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/videos_bg/hero-background.mp4" type="video/mp4" />
          </video>
          
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        </div>
        
        {/* Main Content - Teaser focused */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gray-900/80 border border-gray-700 text-gray-300 text-sm font-medium backdrop-blur-sm">
                <Shield className="w-4 h-4 mr-2 text-nebachiv-blue" />
                Компетентність замість удачі
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight" style={{ 
              textShadow: '2px 2px 6px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.8)'
            }}>
              <span className="text-white">
                НЕ СТАНЬ
                <br />
                <span className="text-nebachiv-blue">СТАТИСТИКОЮ</span>
              </span>
            </h1>

            {/* Subheadline */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-gray-300" style={{ 
              textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
            }}>
              Як не розкластись в першому році
            </h2>

            {/* Stats */}
            <div className="flex justify-center items-center gap-8 mb-10 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-nebachiv-blue">698</div>
                <div className="text-gray-400">райдерів вдячні</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">89%</div>
                <div className="text-gray-400">зниження ризику</div>
              </div>
              <div className="w-px h-12 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{waitlistCount.toLocaleString()}</div>
                <div className="text-gray-400">в очікуванні</div>
              </div>
            </div>

            {/* Email Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="bg-black/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Додатись в ліст очікування
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ваш email"
                      className="flex-1 px-6 py-4 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nebachiv-blue focus:border-nebachiv-blue text-lg"
                      required
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="bg-gradient-to-r from-nebachiv-blue to-nebachiv-blue-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-nebachiv-blue/25 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 min-w-[200px]"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Відправити"
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
                  <br />
                  Також додай нас в контакти, щоб не пропустити важливе.
                </p>
                <p className="text-gray-400">
                  Ти учасник №<span className="font-bold text-white">{waitlistCount.toLocaleString()}</span> в очікуванні повного курсу
                </p>
              </div>
            )}

          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
        </div>
      </section>

      {/* Mini About Section */}
      <section className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-8">
            <span className="text-nebachiv-blue">NEBACHIV</span>
            <span className="text-white"> - це ваш наступний логічний крок після отримання категорії А</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Це система виживання, створена на основі аналізу 12,000+ реальних аварій.
            <br />
            <span className="text-nebachiv-blue font-bold">Те, що рятує життя мотоновачкам.</span>
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-lg font-bold text-white mb-2">Психологія безпеки</h3>
              <p className="text-gray-400 text-sm">8 принципів мислення на дорозі</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Швидкий результат</h3>
              <p className="text-gray-400 text-sm">Прості вправи які одразу дають ефект</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-white mb-2">Доведена ефективність</h3>
              <p className="text-gray-400 text-sm">Перевірено в місті</p>
            </div>
          </div>

          {/* Real Testimonials Block */}
          <div className="mt-16 pt-12 border-t border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-8">Що кажуть райдери:</h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <p className="text-gray-300 mb-4 text-sm">
                  "Ваші уроки врятували мені життя! Вантажівка різко повернула переді мною. Завдяки вашій техніці екстреного гальмування зміг зупинитись за метр до зіткнення. Дружина плакала від щастя!"
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-white">Володимир К.</div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <p className="text-gray-300 mb-4 text-sm">
                  "За 3 місяці пройшла від повного початківця до впевненого водія. Вчора проїхала 500 км по Карпатах - це було неймовірно! Дякую за вашу працю!"
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-white">Катерина П.</div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <p className="text-gray-300 mb-4 text-sm">
                  "Маю досвід водіння мото 11 років. Розглянуті випадки взяті із життя та повністю відповідають дійсній небезпеці на дорозі. Таке відео має бути в програмі навчання усіх мотоциклістів!"
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-white">Станіслав М.</div>
                </div>
              </div>
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-8">
              Реальні відгуки з YouTube
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-950 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Nebachiv. Не покладайся на удачу. Вона закінчується.
          </p>
        </div>
      </footer>
    </div>
  )
}