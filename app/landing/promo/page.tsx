'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Shield, Star, Clock, Users, AlertTriangle, CheckCircle, Phone, Heart } from 'lucide-react'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'
import { getRandomTestimonials } from '@/lib/data/real-testimonials'

export default function PromoLanding() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [timeLeft, setTimeLeft] = useState(72) // hours

  // Timer countdown for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 3600000) // Update every hour
    return () => clearInterval(timer)
  }, [])

  // Testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Real testimonials
  const testimonialData = getRandomTestimonials(3)
  const testimonials = testimonialData.map(t => ({
    text: t.text,
    author: t.name,
    role: t.role || ''
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        setEmail('')
      }
    } catch (error) {
      } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-800 via-neutral-900 to-zinc-900 text-neutral-100">
      {/* Header with Logo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-stone-800/95 via-neutral-800/95 to-stone-800/95 backdrop-blur-xl border-b border-stone-600/30 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <NebachivLogo 
              size="md" 
              variant="primary" 
              showText={true}
            />
            <p className="text-stone-200 font-medium">
              ⭐ <strong>ЕКСКЛЮЗИВНА ПРОПОЗИЦІЯ:</strong> Ранній доступ закінчується через {timeLeft} годин
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section - Calm Olive Style */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Calming Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-stone-900 to-neutral-950/30"></div>
          <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-r from-amber-700/8 to-yellow-700/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-40 w-96 h-96 bg-gradient-to-r from-stone-600/8 to-amber-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDQpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')] opacity-15"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20">
          {/* Calm Attention Badge */}
          <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-800/20 to-yellow-800/20 border border-amber-600/30 rounded-full mb-8 backdrop-blur-xl">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <span className="text-amber-100 font-semibold">ВАЖЛИВА ІНФОРМАЦІЯ: Твоя безпека має значення</span>
          </div>

          {/* Headline with Brand Colors */}
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="text-neutral-100">УВАГА!</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange via-yellow-500 to-nebachiv-orange">
              БЕЗПЕКА ЖИТТЯ
            </span>
            <br />
            <span className="text-neutral-100">на мотоциклі!</span>
          </h1>

          {/* НЕ СТАНЬ СТАТИСТИКОЮ slogan */}
          <div className="bg-nebachiv-orange/20/20 backdrop-blur-sm border border-nebachiv-orange/50 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
            <p className="text-3xl md:text-4xl font-black text-nebachiv-orange mb-2">
              НЕ СТАНЬ СТАТИСТИКОЮ
            </p>
            <p className="text-lg text-gray-300">
              Новачки потрапляють в ДТП втричі частіше
            </p>
          </div>

          {/* Calm Statistics */}
          <div className="bg-gradient-to-r from-stone-800/50 to-neutral-800/50 backdrop-blur-xl border border-stone-600/30 rounded-3xl p-10 mb-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-amber-300 mb-6">
              ФАКТИ, ЯКІ ВАРТО ЗНАТИ:
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 group-hover:scale-110 transition-transform">37%</div>
                <p className="text-stone-300 mt-2 font-medium">водіїв НЕ бачать мотоциклістів (MAIDS)</p>
              </div>
              <div className="group">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-400 group-hover:scale-110 transition-transform">52%</div>
                <p className="text-stone-300 mt-2 font-medium">смертей через помилки мотоцикліста (MAIDS)</p>
              </div>
              <div className="group">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 group-hover:scale-110 transition-transform">88%</div>
                <p className="text-stone-300 mt-2 font-medium">ДТП через людський фактор (MAIDS)</p>
              </div>
            </div>
          </div>

          {/* The Calm Solution */}
          <div className="bg-gradient-to-r from-lime-900/25 to-green-900/25 backdrop-blur-xl border border-lime-700/30 rounded-3xl p-10 mb-8 shadow-2xl">
            <h3 className="text-3xl font-bold text-lime-300 mb-6">
              У МЕНЕ Є ЕФЕКТИВНЕ РІШЕННЯ!
            </h3>
            <p className="text-xl text-neutral-100 leading-relaxed mb-8">
              <strong>Мотошкола навчила керувати мотоциклом.</strong> Nebachiv навчить як тебе намагатимуться збити і як цього уникнути.
              <br /><br />
              <strong className="text-lime-400">Наступний логічний крок</strong> після отримання прав - на основі аналізу <strong className="text-lime-400">тисяч реальних ДТП</strong>!
            </p>
            
            {/* Calm Benefit Stack */}
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                "🎯 8 критичних патернів - розпізнавай і уникай",
                "🧠 921 реальних ДТП MAIDS - найбільше дослідження Європи",
                "⚡ Більшість мотоциклістів роблять 8 помилок екстренного гальмування",
                "🛡️ Принципи Небачива - система мислення на дорозі",
                "📱 Мобільний додаток - тренуйся будь-де",
                "📱 Мобільний додаток - тренуйся будь-де"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 bg-stone-800/30 backdrop-blur-sm p-4 rounded-xl border border-stone-600/20 hover:bg-stone-700/30 transition-all">
                  <span className="text-lg text-stone-200">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calm Social Proof */}
          <div className="bg-gradient-to-r from-slate-800/30 to-stone-800/30 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-orange-400" />
              <h4 className="text-2xl font-bold text-stone-300">ВІДГУКИ НАШИХ СТУДЕНТІВ:</h4>
            </div>
            <div className="relative h-24 overflow-hidden">
              <div 
                className="transition-transform duration-500"
                style={{ transform: `translateY(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="h-24 flex items-center">
                    <blockquote className="text-stone-200 italic text-lg leading-relaxed">
                      "{testimonial.text}"
                      <footer className="text-amber-300 font-semibold mt-2">
                        — {testimonial.author}, {testimonial.role}
                      </footer>
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calm Offer */}
          <div className="bg-gradient-to-r from-yellow-900/25 to-amber-900/25 backdrop-blur-xl border border-yellow-700/30 rounded-3xl p-10 mb-8 shadow-2xl">
            <h3 className="text-3xl font-black text-yellow-300 mb-6">
              ЕКСКЛЮЗИВНА ПРОПОЗИЦІЯ!
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left">
                <h4 className="text-2xl font-bold text-neutral-100 mb-4">ТИ ОТРИМАЄШ:</h4>
                <ul className="space-y-3">
                  {[
                    "Повний курс безпечного водіння (вартість 2,500 грн)",
                    "Персональний план тренувань (вартість 1,200 грн)", 
                    "Персональна консультація (вартість 800 грн)",
                    "Довічні оновлення (безцінно)",
                    "Гарантія результату 100%"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-lime-400 flex-shrink-0" />
                      <span className="text-stone-200 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-stone-800/50 to-neutral-800/50 backdrop-blur-xl border border-stone-600/30 rounded-2xl p-8">
                  <p className="text-stone-400 line-through text-2xl mb-2">Звичайна ціна: 4,500 грн</p>
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 mb-2">БЕЗКОШТОВНО!</p>
                  <p className="text-yellow-300 font-semibold">Тільки для перших 100 учнів</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calm Urgency Counter */}
          <div className="bg-gradient-to-r from-nebachiv-orange/25 to-amber-800/25 backdrop-blur-xl border border-orange-600/30 rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center justify-center gap-6">
              <Clock className="w-10 h-10 text-orange-300 animate-pulse" />
              <div className="text-center">
                <p className="text-orange-300 font-semibold text-xl mb-2">ЗАЛИШИЛОСЬ МІСЦЬ:</p>
                <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">17</p>
              </div>
              <Clock className="w-10 h-10 text-orange-300 animate-pulse" />
            </div>
          </div>

          {/* Calm Call to Action */}
          {!isSubmitted ? (
            <div className="bg-gradient-to-r from-lime-900/30 to-green-900/30 backdrop-blur-xl border border-lime-600/30 rounded-3xl p-10 shadow-2xl">
              <h3 className="text-3xl font-bold text-lime-300 mb-6">
                ЗАБЕРИ СВОЄ МІСЦЕ ЗАРАЗ!
              </h3>
              <p className="text-neutral-100 mb-8 text-xl leading-relaxed">
                <strong>Твій інструктор порекомендує Nebachiv</strong> - наступний логічний крок після отримання прав. <strong>Почни зараз!</strong>
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Твій email для безпечного майбутнього"
                  className="w-full px-8 py-5 bg-stone-800/50 border border-lime-600/30 rounded-2xl text-neutral-100 placeholder-stone-400 text-lg focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all backdrop-blur-sm"
                  required
                  disabled={isLoading}
                />
                <BrandedButton
                  type="submit"
                  disabled={isLoading}
                  variant="gradient"
                  size="xl"
                  className="w-full"
                >
                  {isLoading ? (
                    'ЗБЕРІГАЄМО ТВОЮ БЕЗПЕКУ...'
                  ) : (
                    <>
                      ПОЧАТИ НАВЧАННЯ
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </>
                  )}
                </BrandedButton>
              </form>
              <p className="text-sm text-stone-400 mt-6 text-center">
                ⚡ Доступ відкриється через 60 секунд після реєстрації
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-lime-900/30 to-green-900/30 backdrop-blur-xl border border-lime-600/30 rounded-3xl p-10 shadow-2xl">
              <div className="text-6xl mb-6">🎉</div>
              <h3 className="text-4xl font-black text-lime-300 mb-6">
                ВІТАЮ! ТВОЯ БЕЗПЕКА ЗАБЕЗПЕЧЕНА!
              </h3>
              <p className="text-xl text-neutral-100 mb-6 leading-relaxed">
                Перевірка email надіслана. Натисни посилання і отримай доступ!
              </p>
              <div className="flex items-center justify-center gap-3 text-lime-400">
                <Shield className="w-8 h-8" />
                <span className="font-semibold text-lg">Твоя безпека тепер під професійним захистом</span>
              </div>
            </div>
          )}

          {/* Calm Final Notice */}
          <div className="mt-8 p-6 bg-gradient-to-r from-nebachiv-orange/20 to-amber-800/20 backdrop-blur-xl border border-orange-600/30 rounded-2xl">
            <p className="text-orange-300 text-lg text-center">
              ⚠️ <strong>ВАЖЛИВО:</strong> Ціна підніметься до 4,500 грн через {timeLeft} годин. 
              Не втрать шанс забезпечити своє безпечне майбутнє!
            </p>
          </div>
        </div>
      </section>

      {/* Calm Trust Indicators */}
      <section className="py-20 bg-gradient-to-b from-stone-800/50 to-neutral-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group p-8 bg-stone-800/30 backdrop-blur-xl border border-stone-600/30 rounded-2xl hover:bg-stone-700/30 transition-all">
              <Users className="w-14 h-14 text-amber-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">3,567</div>
              <p className="text-stone-300 mt-2 font-medium">Підписників YouTube</p>
            </div>
            <div className="group p-8 bg-stone-800/30 backdrop-blur-xl border border-stone-600/30 rounded-2xl hover:bg-stone-700/30 transition-all">
              <Star className="w-14 h-14 text-yellow-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">4.8/5</div>
              <p className="text-stone-300 mt-2 font-medium">Рейтинг контенту</p>
            </div>
            <div className="group p-8 bg-stone-800/30 backdrop-blur-xl border border-stone-600/30 rounded-2xl hover:bg-stone-700/30 transition-all">
              <Shield className="w-14 h-14 text-lime-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">12K+</div>
              <p className="text-stone-300 mt-2 font-medium">Проаналізованих ДТП</p>
            </div>
            <div className="group p-8 bg-stone-800/30 backdrop-blur-xl border border-stone-600/30 rounded-2xl hover:bg-stone-700/30 transition-all">
              <Heart className="w-14 h-14 text-orange-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">8</div>
              <p className="text-stone-300 mt-2 font-medium">Принципів безпеки</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calm Footer */}
      <footer className="py-16 bg-gradient-to-t from-zinc-900 to-stone-800 border-t border-stone-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-stone-300 mb-6 text-lg">
            Маєш питання? Зв'язуйся зі мною особисто:
          </p>
          <div className="flex items-center justify-center gap-3 text-amber-300 mb-8">
            <Phone className="w-6 h-6" />
            <span className="font-semibold text-xl">Чингіз Барінов, засновник Nebachiv</span>
          </div>
          <div className="text-center text-stone-400 text-lg mb-4">
            Рекомендовано топовими мотошколами України
          </div>
          <div className="border-t border-stone-600 pt-8">
            <p className="text-stone-400">
              © 2025 Nebachiv. Твоє життя - наш пріоритет.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}