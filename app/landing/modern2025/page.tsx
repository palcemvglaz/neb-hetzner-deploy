'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronRightIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  AcademicCapIcon, 
  CheckIcon,
  PlayIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'
import { RealTestimonials } from '@/components/landing/RealTestimonials'

export default function Modern2025Landing() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [stats, setStats] = useState({
    riders: 0,
    accidents: 0,
    livesSaved: 0
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animated counter effect
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      
      setStats({
        riders: Math.floor(698 * progress),
        accidents: Math.floor(921 * progress),
        livesSaved: Math.floor(89 * progress)
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    localStorage.setItem('pendingEmail', email)
    router.push('/register')
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Navigation - Universal style with glassmorphism */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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

      {/* Hero Section - Immersive 2025 Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Advanced Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900"></div>
          
          {/* Floating orbs with glassmorphism */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-nebachiv-blue/30 to-gray-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-nebachiv-blue/20 to-nebachiv-blue/200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gray-600/15 to-nebachiv-blue/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')] opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge with modern glassmorphism */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full mb-8 hover:bg-white/10 transition-all duration-300">
            <SparklesIcon className="w-5 h-5 text-nebachiv-blue" />
            <span className="text-sm font-medium text-white/90">Навчило {stats.riders} райдерів • {stats.livesSaved}% зниження ризику</span>
          </div>
          
          {/* Main Heading - 2025 Typography */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 tracking-tight leading-none">
            <span className="block text-white drop-shadow-2xl">
              Навчися уникати
            </span>
            <span className="block bg-gradient-to-r from-nebachiv-blue via-gray-400 to-nebachiv-blue-light bg-clip-text text-transparent">
              80% мото-аварій
            </span>
            <span className="block text-white/80 text-5xl sm:text-6xl lg:text-7xl mt-4">
              за 7 днів
            </span>
          </h1>
          
          {/* Subtitle with better hierarchy */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Освітній застосунок для мотоциклістів.<br/>
            Перша система навчання на основі 921 ДТП (MAIDS дослідження).
            <span className="block mt-2 text-lg text-white/50">Те, чого не розкажуть в жодній мотошколі.</span>
          </p>

          {/* CTA Section with modern design */}
          <div className="space-y-6 mb-16">
            <button
              onClick={() => router.push('/register')}
              className="group relative px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-nebachiv-blue via-gray-600 to-nebachiv-blue-dark rounded-2xl overflow-hidden shadow-2xl hover:shadow-nebachiv-blue/25 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                Почати навчання
                <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <p className="text-white/50 text-sm">
              Кредитна картка не потрібна • Доступ за 60 секунд
            </p>
          </div>

          {/* Trust indicators with glassmorphism cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-nebachiv-blue">{stats.riders.toLocaleString()}</div>
              <div className="text-sm text-white/70 mt-1">Навчено райдерів</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-gray-400">{stats.livesSaved}%</div>
              <div className="text-sm text-white/70 mt-1">Зниження ризику</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-nebachiv-orange">0</div>
              <div className="text-sm text-white/70 mt-1">Серйозних ДТП</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-nebachiv-blue">4.9</div>
              <div className="text-sm text-white/70 mt-1">Рейтинг (2,847)</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Problem Section - Modern Bento Grid */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Твоя мотошкола</span>
              <span className="block bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange bg-clip-text text-transparent">
                не розповіла тобі головного
              </span>
            </h2>
          </div>
          
          {/* Bento grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "Дотримуйся ПДР і все буде добре",
                reality: "37% дтп - водії НЕ ПОБАЧИЛИ мотоцикліста (MAIDS)",
                icon: "⚠️"
              },
              {
                title: "Їзди повільно і обережно",
                reality: "50% аварій на швидкості до 50 км/год (MAIDS)",
                icon: "🐌"
              },
              {
                title: "Яскравий шолом = тебе побачать",
                reality: "72% помилок водіїв - perception failure (не помітили) MAIDS",
                icon: "👁️"
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:scale-105">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-white/70">
                    <span className="text-nebachiv-orange font-medium">Реальність:</span> {item.reality}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange/5 to-nebachiv-orange/200/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Key insight card */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-blue/20 to-gray-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative p-12 bg-white/5 backdrop-blur-2xl border border-yellow-500/20 rounded-3xl text-center">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-relaxed">
                Після мотошколи ти знаєш як <span className="text-nebachiv-blue">керувати мотоциклом</span>,
                <br />
                але не знаєш як <span className="bg-gradient-to-r from-nebachiv-blue to-gray-400 bg-clip-text text-transparent font-bold">уникнути 37% сліпоти водіїв</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Advanced Grid */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Що ти отримаєш за</span>
              <span className="block bg-gradient-to-r from-nebachiv-blue to-gray-400 bg-clip-text text-transparent">
                7 днів
              </span>
            </h2>
            <p className="text-xl text-white/60">
              Те, на що іншим потрібно роки та декілька аварій
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Принципи виживання",
                items: [
                  "8 принципів Небачива - як думати на дорозі",
                  "Концепція \"блокерів\" - звідки з'являється смерть",
                  "Хвильова природа небезпеки - коли бути готовим",
                  "Правило \"ніхто нікому нічого не винен\""
                ],
                gradient: "from-nebachiv-blue/20 to-gray-500/20"
              },
              {
                icon: ChartBarIcon,
                title: "Аналіз реальних аварій",
                items: [
                  "12 типів \"раптових\" аварій і як їх передбачити",
                  "Смертельні перехрестя - алгоритм проїзду",
                  "\"Ліве зі двору\" - чому це вбиває і як уникнути",
                  "Відеорозбори з поясненням кожної помилки"
                ],
                gradient: "from-gray-500/20 to-nebachiv-blue/20"
              },
              {
                icon: AcademicCapIcon,
                title: "Технічні навички",
                items: [
                  "Екстрене гальмування - 90% не вміють",
                  "Trail braking - як це врятує в повороті",
                  "Контрруління на швидкості",
                  "Баланс на малій швидкості"
                ],
                gradient: "from-nebachiv-blue/20 to-cyan-500/20"
              },
              {
                icon: SparklesIcon,
                title: "Практичні тренування",
                items: [
                  "Симулятор небезпечних ситуацій",
                  "Тести на розпізнавання загроз",
                  "Чек-листи щоденних вправ",
                  "Персональний план тренувань"
                ],
                gradient: "from-nebachiv-blue/20 to-gray-500/20"
              }
            ].map((card, index) => {
              const IconComponent = card.icon
              return (
                <div key={index} className="group">
                  <div className="relative h-full p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-4 bg-gradient-to-br ${card.gradient} rounded-2xl`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                    </div>
                    <ul className="space-y-4">
                      {card.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <CheckIcon className="w-5 h-5 text-nebachiv-blue mt-0.5 flex-shrink-0" />
                          <span className="text-white/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl`}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Grid */}
      <RealTestimonials 
        count={6}
        title="Вони вижили завдяки системі"
        subtitle="Реальні відгуки з YouTube каналу • 698 коментарів проаналізовано"
      />

      {/* Final CTA - Immersive */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-nebachiv-orange/10/20 to-black"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange/200 bg-clip-text text-transparent">
              Кожен день без цих знань
            </span>
            <span className="block text-white mt-2">
              це гра в рулетку з життям
            </span>
          </h2>
          
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            77% мали базове навчання, але все одно розбились (MAIDS).
            <span className="font-bold text-nebachiv-orange">Чи достатньо твого навчання?</span>
          </p>
          
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-blue/20 to-gray-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative p-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-nebachiv-orange/20/30 text-nebachiv-orange-light px-4 py-2 rounded-full text-sm font-medium mb-8">
                <SparklesIcon className="w-4 h-4" />
                Обмежена пропозиція
              </div>
              
              <p className="text-2xl sm:text-3xl font-bold text-white mb-8">
                Перші 100 учнів отримують:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Повний курс зі знижкою 40%',
                  'Особиста консультація зі мною',
                  'Щотижневі оновлення контенту',
                  'Довічні оновлення',
                  'Сертифікат про завершення',
                  'Аналіз відео реальних ДТП'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <CheckIcon className="w-5 h-5 text-nebachiv-blue flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl mb-8">
                <span className="text-white/70">Залишилось місць:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-nebachiv-blue to-gray-400 bg-clip-text text-transparent">17</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/register')}
            className="group relative px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-nebachiv-blue via-gray-600 to-nebachiv-blue-dark rounded-2xl overflow-hidden shadow-2xl hover:shadow-nebachiv-blue/25 transition-all duration-300 hover:scale-105 mb-6"
          >
            <span className="relative z-10 flex items-center gap-3">
              Почати навчання
              <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          
          <p className="text-white/50">
            Ціна підніметься через 48 годин
          </p>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <blockquote className="mb-8">
            <p className="text-2xl text-white/70 italic font-light mb-4">
              "Не покладайся на удачу. Вона закінчується."
            </p>
            <cite className="text-white/40 not-italic text-lg">
              — Чингіз Барінов, засновник Небачив
            </cite>
          </blockquote>
          
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/30 text-sm">
              © 2025 Небачив. Їзди безпечно, їзди розумно.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}