'use client'

import { useState, useEffect, useRef } from 'react'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react'

export default function StatsTeaserPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stats, setStats] = useState({
    accidents: 0,
    notSeen: 0,
    fatalError: 0,
    panicBrake: 0
  })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    
    // Animate counters
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      
      setStats({
        accidents: Math.floor(921 * progress),
        notSeen: Math.floor(37 * progress),
        fatalError: Math.floor(52 * progress),
        panicBrake: Math.floor(41 * progress)
      })

      if (step >= steps) clearInterval(timer)
    }, interval)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setMousePosition({ x: x * 20, y: y * 20 })
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      clearInterval(timer)
      window.removeEventListener('mousemove', handleMouseMove)
    }
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
          source: 'teaser_stats',
          metadata: { variant: 'stats', timestamp: new Date().toISOString() }
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
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <NebachivLogo size="md" variant="primary" showText={true} />
        </div>
      </nav>

      {/* Stats Focused Hero */}
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
            style={{ filter: 'brightness(0.5)' }}
          />
          <video 
            autoPlay loop muted playsInline preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.5)' }}
            onError={(e) => e.currentTarget.style.display = 'none'}
          >
            <source src="/videos_bg/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        {/* Stats Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight" style={{ 
              textShadow: '2px 2px 6px rgba(0,0,0,0.9)'
            }}>
              <span className="text-white">ОФІЦІЙНЕ MAIDS ДОСЛІДЖЕННЯ</span>
              <br />
              <span className="text-nebachiv-orange">921 ДЕТАЛЬНИЙ АНАЛІЗ ДТП</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Найбільше європейське дослідження мотоциклетних аварій<br/>
              <span className="text-sm text-gray-400">5 країн • 2000+ змінних • Методологія OECD</span>
            </p>

            {/* Big Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="bg-black/60 backdrop-blur-sm border border-nebachiv-orange/20/50 rounded-2xl p-6 hover:border-nebachiv-orange/80 transition-all">
                <div className="text-4xl mb-4">😱</div>
                <div className="text-4xl font-black text-nebachiv-orange mb-2">
                  {stats.notSeen}%
                </div>
                <div className="text-sm text-gray-300">Водії НЕ БАЧАТЬ<br/>мотоциклістів</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-nebachiv-orange/20/50 rounded-2xl p-6 hover:border-nebachiv-orange/80 transition-all">
                <div className="text-4xl mb-4">💀</div>
                <div className="text-4xl font-black text-nebachiv-orange mb-2">
                  {stats.fatalError}%
                </div>
                <div className="text-sm text-gray-300">Смертей через<br/>власні помилки</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-yellow-900/50 rounded-2xl p-6 hover:border-yellow-700 transition-all">
                <div className="text-4xl mb-4">🛑</div>
                <div className="text-4xl font-black text-yellow-500 mb-2">
                  {stats.panicBrake}%
                </div>
                <div className="text-sm text-gray-300">Падінь через<br/>паніку з гальмами</div>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                <div className="text-4xl mb-4">📊</div>
                <div className="text-4xl font-black text-white mb-2">
                  {stats.accidents}
                </div>
                <div className="text-sm text-gray-300">Детальних<br/>аналізів ДТП</div>
              </div>
            </div>

            {/* Shocking Facts */}
            <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
              <div className="bg-nebachiv-orange/20/20 backdrop-blur-sm border border-nebachiv-orange/20/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-nebachiv-orange mb-3">ШОКУЮЧИЙ ФАКТ #1</h3>
                <p className="text-gray-200">
                  <span className="text-2xl font-bold text-white">72%</span> помилок водіїв - 
                  це "perception failure". Вони просто <span className="text-nebachiv-orange">НЕ ПОМІЧАЮТЬ</span> мотоциклістів.
                </p>
              </div>
              
              <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-900/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">ПАРАДОКС</h3>
                <p className="text-gray-200">
                  <span className="text-2xl font-bold text-white">77%</span> мали навчання в мотошколі, 
                  але <span className="text-yellow-400">ВСЕ ОДНО</span> потрапили в ДТП.
                </p>
              </div>
              
              <div className="bg-green-900/20 backdrop-blur-sm border border-green-900/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-green-400 mb-3">РІШЕННЯ</h3>
                <p className="text-gray-200">
                  Водії з мото-правами <span className="text-2xl font-bold text-white">НАБАГАТО</span> рідше 
                  <span className="text-green-400">не помічають</span> мотоциклістів!
                </p>
              </div>
            </div>
            
            {/* Key Message */}
            <div className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-10 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Кожен 3-й водій тебе <span className="text-nebachiv-orange">НЕ БАЧИТЬ</span>
              </h2>
              <p className="text-xl text-gray-200 mb-4">
                32% аварій - <span className="text-yellow-500">навіть секунди не було</span> щоб відреагувати
              </p>
              <p className="text-lg text-gray-300">
                Твої навички гальмування <span className="text-nebachiv-blue font-bold">вирішать твою долю</span>
              </p>
            </div>

            {/* Email Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="bg-black/70 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Отримай повний звіт MAIDS + як вижити
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email для шокуючої статистики"
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
                          НЕ СТАНЬ СТАТИСТИКОЮ
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                  
                  {error && <div className="mt-4 text-nebachiv-orange text-center text-sm">{error}</div>}
                </div>
              </form>
            ) : (
              <div className="max-w-2xl mx-auto bg-green-900/60 backdrop-blur-sm border border-green-700 rounded-2xl p-8">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">
                  Повний звіт MAIDS надіслано!
                </h3>
                <p className="text-gray-200">
                  Перевір пошту - там 40+ шокуючих фактів<br/>
                  та покрокова інструкція <span className="text-green-400">як вижити</span>
                </p>
              </div>
            )}

            {/* Bottom Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center max-w-3xl mx-auto">
              <div className="bg-black/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="text-3xl font-bold text-nebachiv-orange">75%</div>
                <div className="text-xs text-gray-400">ДТП при швидкості<br/><span className="text-white">до 51 км/год</span></div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="text-3xl font-bold text-yellow-400">18 міс</div>
                <div className="text-xs text-gray-400">Критичний період<br/><span className="text-white">для новачків</span></div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400">-37%</div>
                <div className="text-xs text-gray-400">Ризику з ABS<br/><span className="text-white">доведено MAIDS</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}