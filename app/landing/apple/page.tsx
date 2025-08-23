'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRightIcon, ShieldCheckIcon, ChartBarIcon, AcademicCapIcon, CheckIcon } from '@heroicons/react/24/outline'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'
import { RealTestimonials } from '@/components/landing/RealTestimonials'

export default function AppleLandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    localStorage.setItem('pendingEmail', email)
    router.push('/register')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation - Universal style */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'
      }`}>
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Їзди з
            <span className="bg-gradient-to-r from-nebachiv-blue to-gray-400 bg-clip-text text-transparent"> впевненістю</span>
          </h1>
          
          {/* НЕ СТАНЬ СТАТИСТИКОЮ slogan */}
          <div className="mb-6">
            <p className="text-3xl md:text-4xl font-black text-nebachiv-orange mb-2">
              НЕ СТАНЬ СТАТИСТИКОЮ
            </p>
          </div>
          
          <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Освітній застосунок для мотоциклістів.<br/>
            Опануй патерни, які знижують ризик на 89%. 
            На основі MAIDS - офіційного європейського дослідження 921 ДТП.
          </p>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введіть ваш email"
                required
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-nebachiv-blue focus:border-transparent placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? '...' : 'Почати навчання'}
              </button>
            </div>
          </form>
          
          <p className="text-sm text-gray-500">
            Кредитна картка не потрібна. Почни навчання за 60 секунд.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white">37%</div>
              <div className="text-sm text-gray-400 mt-2">Водіїв НЕ бачать мотоциклістів</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">52%</div>
              <div className="text-sm text-gray-400 mt-2">Смертей через помилки райдерів</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">0.9</div>
              <div className="text-sm text-gray-400 mt-2">Секунди на реакцію</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">32%</div>
              <div className="text-sm text-gray-400 mt-2">ДТП - немає часу реагувати</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Все необхідне для безпечної їзди
            </h2>
            <p className="text-lg text-gray-400">
              Наукове навчання, яке дійсно працює
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition">
              <div className="w-16 h-16 bg-nebachiv-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-nebachiv-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">8 смертельних патернів</h3>
              <p className="text-gray-400">
                Розпізнавай та уникай сценаріїв, які спричиняють 88% аварій (MAIDS)
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition">
              <div className="w-16 h-16 bg-nebachiv-blue/200/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Аналіз реальних даних</h3>
              <p className="text-gray-400">
                Навчайся на 921 детально проаналізованих ДТП з MAIDS дослідження
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition">
              <div className="w-16 h-16 bg-nebachiv-blue/200/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Практичні вправи</h3>
              <p className="text-gray-400">
                Формуй м'язову пам'ять вправами для реальних ситуацій
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <RealTestimonials 
        count={6}
        variant="apple"
      />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Почни свій шлях до безпеки сьогодні
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Навчайся на помилках інших - 77% мали навчання, але все одно розбились
          </p>
          
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto">
            <div className="space-y-4 mb-8 text-left">
              {[
                'Доступ до всіх 8 модулів смертельних патернів',
                '30-денна структурована програма',
                'Аналіз відео реальних ДТП',
                'Бібліотека екстрених вправ',
                'Сертифікат про завершення',
                'Довічні оновлення'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => router.push('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition text-lg"
            >
              Почати навчання <ChevronRightIcon className="inline w-5 h-5 ml-2" />
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Безкоштовно назавжди. Доступні преміум функції.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2024 Мото Безпека. Їзди безпечно, їзди розумно.</p>
        </div>
      </footer>
    </div>
  )
}