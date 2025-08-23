'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Award,
  ChevronRight,
  Star,
  PlayCircle,
  BookOpen,
  Target,
  ArrowRight,
  CheckIcon,
  AlertTriangle,
  Brain,
  Heart,
  Zap
} from 'lucide-react'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'

export default function InstagramInsightsLanding() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    
    // Mouse parallax effect
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
    setLoading(true)
    localStorage.setItem('pendingEmail', email)
    router.push('/register')
  }

  // Real quotes from Instagram analysis
  const realQuotes = [
    {
      text: "в мене тут головна проблема - не знаю коли гальмувати передом а коли задом",
      author: "Instagram DM",
      fear: "Техніка гальмування"
    },
    {
      text: "після того як друг розбився, боюся сідати на мот",
      author: "Instagram коментар",
      fear: "ПТСР після ДТП"
    },
    {
      text: "гігантська сліпа зона у водіїв, вони нас реально не бачать",
      author: "Instagram DM",
      fear: "Невидимість"
    },
    {
      text: "на форумах всі радять різне, кому вірити?",
      author: "Instagram коментар",
      fear: "Інформаційний хаос"
    },
    {
      text: "мотошкола дала права, але не дала впевненості",
      author: "Instagram DM",
      fear: "Невпевненість"
    }
  ]

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

      {/* Hero Section - Focused on Real Fears */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        
        {/* Video Background with Fallback */}
        <div className="absolute inset-0"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}>
          {/* Fallback image always present */}
          <img 
            src="/marketing_data/photos good for promo site/IMG_5806.png" 
            alt="Motorcycle rider" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.5)' }}
          />
          
          {/* Video overlay */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.5)' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/videos_bg/hero-background.mp4" type="video/mp4" />
          </video>
          
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50"></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Pre-headline */}
            <div className="text-nebachiv-blue text-lg md:text-xl font-bold mb-4 uppercase tracking-wider">
              100+ INSTAGRAM ПЕРЕПИСОК ПРОАНАЛІЗОВАНО
            </div>
            
            {/* Main Headline - Direct Pain Point */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight" style={{ 
              textShadow: '2px 2px 6px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.8)'
            }}>
              <span className="text-white">
                35% не знають
              </span>
              <br />
              <span className="text-nebachiv-blue">
                як правильно гальмувати
              </span>
              <br />
              <span className="text-gray-400 text-3xl md:text-5xl">
                А ти?
              </span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Ми проаналізували страхи 698 райдерів і створили систему, 
              яка трансформує твій страх у впевненість за 7 днів
            </p>
            
            {/* CTA Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Твій email"
                  required
                  className="flex-1 px-6 py-4 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-nebachiv-blue focus:border-transparent placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-nebachiv-blue to-nebachiv-blue-dark text-white rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-nebachiv-blue/25 disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? '...' : 'Подолати страх →'}
                </button>
              </div>
            </form>
            
            {/* Trust Indicator */}
            <p className="text-sm text-gray-500">
              Приєднайся до 698 райдерів, які вже подолали свої страхи
            </p>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
        </div>
      </section>

      {/* Real Fears Section - Based on Instagram Data */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">МИ ЗНАЄМО </span>
              <span className="text-nebachiv-blue">ТВОЇ СТРАХИ</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Бо проаналізували сотні реальних переписок та коментарів райдерів
            </p>
          </div>

          {/* Top Fears Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-black border border-gray-800 p-6 rounded-2xl hover:border-nebachiv-blue transition-all">
              <div className="text-5xl font-black text-nebachiv-blue mb-2">35%</div>
              <h3 className="text-lg font-bold text-white mb-2">Техніка гальмування</h3>
              <p className="text-gray-400 text-sm">"Не знаю коли передом, коли задом"</p>
            </div>
            
            <div className="bg-black border border-gray-800 p-6 rounded-2xl hover:border-nebachiv-blue transition-all">
              <div className="text-5xl font-black text-nebachiv-blue mb-2">28%</div>
              <h3 className="text-lg font-bold text-white mb-2">Страх невидимості</h3>
              <p className="text-gray-400 text-sm">"Водії мене не бачать"</p>
            </div>
            
            <div className="bg-black border border-gray-800 p-6 rounded-2xl hover:border-nebachiv-blue transition-all">
              <div className="text-5xl font-black text-nebachiv-blue mb-2">22%</div>
              <h3 className="text-lg font-bold text-white mb-2">Сліпі зони</h3>
              <p className="text-gray-400 text-sm">"Гігантська сліпа зона"</p>
            </div>
            
            <div className="bg-black border border-gray-800 p-6 rounded-2xl hover:border-nebachiv-blue transition-all">
              <div className="text-5xl font-black text-nebachiv-blue mb-2">18%</div>
              <h3 className="text-lg font-bold text-white mb-2">Мокра дорога</h3>
              <p className="text-gray-400 text-sm">"Страшно в дощ"</p>
            </div>
          </div>

          {/* Real Quotes Carousel */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-nebachiv-blue">
              Реальні цитати з Instagram
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realQuotes.slice(0, 3).map((quote, index) => (
                <div key={index} className="bg-black p-6 rounded-xl">
                  <p className="text-gray-300 italic mb-4">"{quote.text}"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{quote.author}</span>
                    <span className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-400">
                      {quote.fear}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - What They Get */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">СИСТЕМА ТРАНСФОРМАЦІЇ </span>
              <span className="text-nebachiv-blue">СТРАХУ У ВПЕВНЕНІСТЬ</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              За 7 днів ти отримаєш те, що інші набирають роками болючого досвіду
            </p>
          </div>

          {/* Core Solutions Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Solution 1 */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-2xl hover:border-nebachiv-blue transition-all">
              <div className="w-16 h-16 bg-nebachiv-orange/20 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-nebachiv-orange" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Майстер Гальмування
              </h3>
              <p className="text-gray-400 mb-6">
                Відповідь на питання №1 всіх новачків
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">7-денний інтенсив з щоденними вправами</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Розбір всіх 8 типів гальмування</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Практика на різних покриттях</span>
                </li>
              </ul>
            </div>

            {/* Solution 2 */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-2xl hover:border-nebachiv-blue transition-all">
              <div className="w-16 h-16 bg-nebachiv-blue/20 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-nebachiv-blue" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Видимий Райдер
              </h3>
              <p className="text-gray-400 mb-6">
                Система позиціонування від невидимки до хижака
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">3D карта всіх сліпих зон</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">27 небезпечних сценаріїв</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Контроль простору 360°</span>
                </li>
              </ul>
            </div>

            {/* Solution 3 */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-2xl hover:border-nebachiv-blue transition-all">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Психологія Хижака
              </h3>
              <p className="text-gray-400 mb-6">
                Від страху до впевненості через розуміння
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Подолання ПТСР після ДТП</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Техніки контролю паніки</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Менторська підтримка 24/7</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-nebachiv-blue to-nebachiv-blue-dark p-1 rounded-2xl">
            <div className="bg-black p-8 rounded-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-nebachiv-blue mb-2">698</div>
                  <div className="text-sm text-gray-400">Райдерів з нами</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">89%</div>
                  <div className="text-sm text-gray-400">Зниження ризику</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-nebachiv-blue mb-2">7</div>
                  <div className="text-sm text-gray-400">Днів до результату</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">0</div>
                  <div className="text-sm text-gray-400">Серйозних ДТП</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segmentation Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">ДЕ ТИ ЗАРАЗ? </span>
            </h2>
            <p className="text-xl text-gray-400">
              Ми знаємо кожен етап твого шляху
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Beginner */}
            <div className="bg-black border-2 border-gray-800 p-8 rounded-2xl hover:border-nebachiv-blue transition-all">
              <div className="text-6xl mb-4">😰</div>
              <h3 className="text-2xl font-bold text-white mb-2">Новачок</h3>
              <p className="text-nebachiv-blue font-semibold mb-4">25-30% наших учнів</p>
              <ul className="space-y-2 text-gray-400">
                <li>• Щойно з мотошколи</li>
                <li>• Панічний страх міста</li>
                <li>• Шукаєш ментора</li>
                <li>• Готовий платити за безпеку</li>
              </ul>
              <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="text-nebachiv-blue font-bold">Для тебе:</span> Базовий курс + персональний ментор
                </p>
              </div>
            </div>

            {/* Intermediate */}
            <div className="bg-black border-2 border-nebachiv-blue p-8 rounded-2xl">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-2xl font-bold text-white mb-2">Середній рівень</h3>
              <p className="text-nebachiv-blue font-semibold mb-4">40-45% наших учнів</p>
              <ul className="space-y-2 text-gray-400">
                <li>• 1-3 роки досвіду</li>
                <li>• Хочеш вдосконалитись</li>
                <li>• Були дрібні ДТП</li>
                <li>• Шукаєш системні знання</li>
              </ul>
              <div className="mt-6 p-4 bg-nebachiv-blue/10 rounded-lg border border-nebachiv-blue/30">
                <p className="text-sm text-gray-300">
                  <span className="text-nebachiv-blue font-bold">Для тебе:</span> Поглиблений курс + аналіз твоїх помилок
                </p>
              </div>
            </div>

            {/* Experienced */}
            <div className="bg-black border-2 border-gray-800 p-8 rounded-2xl hover:border-nebachiv-blue transition-all">
              <div className="text-6xl mb-4">😎</div>
              <h3 className="text-2xl font-bold text-white mb-2">Досвідчений</h3>
              <p className="text-nebachiv-blue font-semibold mb-4">25-30% наших учнів</p>
              <ul className="space-y-2 text-gray-400">
                <li>• 3+ роки досвіду</li>
                <li>• Ділишся досвідом</li>
                <li>• Критикуєш новачків</li>
                <li>• Потенційний амбасадор</li>
              </ul>
              <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="text-nebachiv-blue font-bold">Для тебе:</span> Менторська програма + спільнота лідерів
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">698 РАЙДЕРІВ </span>
              <span className="text-nebachiv-blue">ВЖЕ З НАМИ</span>
            </h2>
            <p className="text-xl text-gray-400">
              Кожен день без знань - це гра в рулетку з життям
            </p>
          </div>

          {/* Success Stories */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-2xl">
              <div className="flex items-start mb-4">
                <div className="text-4xl mr-4">🏆</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Від страху до впевненості</h3>
                  <p className="text-gray-400">
                    "Після курсу гальмування вперше відчув контроль над мотоциклом. 
                    Тепер знаю що робити в будь-якій ситуації"
                  </p>
                  <p className="text-sm text-nebachiv-blue mt-2">- Олександр, 2 місяці з Nebachiv</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-2xl">
              <div className="flex items-start mb-4">
                <div className="text-4xl mr-4">💪</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Подолав ПТСР після ДТП</h3>
                  <p className="text-gray-400">
                    "Рік не міг сісти на мотоцикл після аварії. 
                    Психологічна підтримка спільноти допомогла повернутись"
                  </p>
                  <p className="text-sm text-nebachiv-blue mt-2">- Максим, 6 місяців з Nebachiv</p>
                </div>
              </div>
            </div>
          </div>

          {/* Urgency Block */}
          <div className="bg-gradient-to-r from-nebachiv-orange/20/20 to-red-800/20 border border-red-800 p-8 rounded-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-nebachiv-orange mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Кожен день без цих знань - російська рулетка
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Середньостатистичний мотоцикліст потрапляє в першу серйозну аварію 
              протягом <span className="text-nebachiv-orange font-bold">18 місяців</span>. 
              Скільки вже проїздив ти?
            </p>
            <button
              onClick={() => router.push('/register')}
              className="bg-nebachiv-orange hover:bg-nebachiv-orange/80 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Не стань статистикою →
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-nebachiv-blue to-nebachiv-blue-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-white">
              ВІД СТРАХУ ДО ВПЕВНЕНОСТІ
            </span>
            <br />
            <span className="text-black">
              ЗА 7 ДНІВ
            </span>
          </h2>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Приєднайся до 698 райдерів, які вже трансформували 
            свій страх у впевненість разом з Nebachiv
          </p>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введи свій email"
                required
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-white/60"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-black text-white rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-900 disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? '...' : 'Почати навчання →'}
              </button>
            </div>
          </form>
          
          <p className="text-white/80 text-lg">
            <span className="font-bold">100% гарантія:</span> Якщо за 30 днів не відчуєш себе впевненіше - повернемо гроші
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Nebachiv. Від страху до впевненості.</p>
          <p className="mt-2">Засновано на аналізі 100+ реальних Instagram переписок</p>
        </div>
      </footer>
    </div>
  )
}