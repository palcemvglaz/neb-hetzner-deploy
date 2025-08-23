'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
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
  ArrowRight
} from 'lucide-react'

export default function RideiconSoftLanding() {
  const [stats, setStats] = useState({
    students: 3567,
    accidentsPrevented: 89,
    schoolsPartners: 47,
    completionRate: 94
  })

  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [videoError, setVideoError] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    // Animate stats
    const timer = setTimeout(() => {
      setStats({
        students: 3567,
        accidentsPrevented: 89,
        schoolsPartners: 47,
        completionRate: 94
      })
    }, 500)
    
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
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const featuredThemes = [
    {
      id: 'vision-blocker',
      title: 'Vision & Blocker',
      description: 'Навчіться бачити небезпеку за кілометр',
      image: '/marketing_data/photos good for promo site/IMG_0461.png',
      difficulty: 'Початковий',
      duration: '45 хв',
      category: 'Безпека'
    },
    {
      id: 'critical-moments',
      title: 'Критичні Моменти',
      description: 'Секунди, що рятують життя',
      image: '/marketing_data/photos good for promo site/IMG_6137.png',
      difficulty: 'Просунутий',
      duration: '60 хв',
      category: 'Тактика'
    },
    {
      id: 'positioning-theory',
      title: 'Теорія Позиціонування',
      description: 'Правильна позиція = безпека',
      image: '/marketing_data/photos good for promo site/IMG_1976.png',
      difficulty: 'Середній',
      duration: '35 хв',
      category: 'Техніка'
    }
  ]

  const testimonials = [
    {
      name: 'Володимир К.',
      role: 'Врятоване життя, 342 лайки',
      content: 'Ваші уроки врятували мені життя! Місяць тому потрапив у критичну ситуацію - вантажівка різко повернула переді мною. Завдяки вашій техніці екстреного гальмування зміг зупинитись за метр до зіткнення. Дружина плакала від щастя, коли я повернувся додому. Дякую вам за те, що робите! 🙏',
      rating: 5,
      avatar: '/marketing_data/photos good for promo site/IMG_0963.png'
    },
    {
      name: 'Максим Д.',
      role: 'Історія відновлення, 489 лайків',
      content: 'Рік тому розбився через свою самовпевненість. Після відновлення боявся сідати на мотоцикл. Ваші відео допомогли зрозуміти мої помилки і повернути впевненість. Тепер їжджу з дотриманням всіх правил безпеки. Навчаю інших тому, чого навчився у вас. Ви робите світ безпечнішим!',
      rating: 5,
      avatar: '/marketing_data/photos good for promo site/IMG_1409.png'
    },
    {
      name: 'Катерина П.',
      role: 'Від страху до впевненості, 256 лайків',
      content: 'Після 10 років водіння авто перейшла на мотоцикл. Було страшно! Але ваш систематичний підхід до навчання допоміг подолати всі страхи. За 3 місяці пройшла від повного початківця до впевненого водія. Вчора проїхала 500 км по Карпатах - це було неймовірно! ❤️🏍️',
      rating: 5,
      avatar: '/marketing_data/photos good for promo site/IMG_3929.png'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        
        {/* Animated background lines - monochrome */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-white to-transparent top-1/4 animate-scan"></div>
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-nebachiv-orange to-transparent top-2/4 animate-scan-reverse"></div>
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-gray-500 to-transparent top-3/4 animate-scan-slow"></div>
          </div>
        </div>
        
        {/* Video Background with Fallback */}
        <div className="absolute inset-0"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
            zIndex: 1
          }}>
          {/* Fallback image always present */}
          <img 
            src="/marketing_data/photos good for promo site/IMG_5806.png" 
            alt="Motorcycle rider" 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.4)' }}
          />
          
          {/* Video overlay */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.4)' }}
          >
            <source src="/videos_bg/hero-background.mp4" type="video/mp4" />
          </video>
          
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          {/* Animated particles overlay - monochrome */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-nebachiv-orange rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo & Badge */}
            <div className="mb-8">
              <img 
                src="/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_06 PM.png" 
                alt="Nebachiv Logo" 
                className="w-40 h-40 mx-auto mb-6 object-contain animate-float"
              />
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-white text-sm font-medium">
                <Shield className="w-4 h-4 mr-2" />
                37% водіїв не бачать мотоциклістів - Європейське дослідження 921 ДТП
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="text-white">
                НАВЧИСЬ
              </span>
              <br />
              <span className="text-nebachiv-orange">
                НЕ ДАТИ СЕБЕ ЗБИТИ
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              <span className="text-white font-semibold">Мотошкола дала базу. Ми даємо майстерність.</span>
              <br />
              <span className="text-gray-400">Наступний рівень після <span className="text-nebachiv-orange font-bold">отримання прав</span></span>
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  921
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Проаналізованих випадків</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-nebachiv-orange mb-2">
                  8
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Принципів безпеки</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  30+
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Навчальних модулів</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-nebachiv-orange mb-2">
                  94%
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Успішно завершують</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/register"
                className="group bg-white text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                ПОЧАТИ НАВЧАННЯ
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/demo"
                className="group border-2 border-gray-700 hover:border-white text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                БЕЗКОШТОВНИЙ УРОК
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
        </div>
      </section>

      {/* The Key Difference Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
            <span className="text-white">МОТОШКОЛА + NEBACHIV = ПОВНА ПІДГОТОВКА</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-black border border-gray-800 p-8 hover:border-white transition-all">
              <h3 className="text-2xl font-bold text-white mb-6">БАЗОВІ НАВИЧКИ (МОТОШКОЛА):</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-gray-500 mr-3">✓</span>
                  <span>Керувати мотоциклом на майданчику</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-3">✓</span>
                  <span>Правила дорожнього руху в ідеальних умовах</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-3">✓</span>
                  <span>Базове гальмування на прямій</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-3">✓</span>
                  <span>Повороти з мінімальною швидкістю</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black border border-gray-800 p-8 hover:border-white transition-all">
              <h3 className="text-2xl font-bold text-white mb-6">ПРОСУНУТІ НАВИЧКИ (NEBACHIV):</h3>
              <ul className="space-y-4 text-white">
                <li className="flex items-start">
                  <span className="text-nebachiv-orange mr-3">→</span>
                  <span className="font-semibold">Передбачати 37% водіїв, які тебе не бачать</span>
                </li>
                <li className="flex items-start">
                  <span className="text-nebachiv-orange mr-3">→</span>
                  <span className="font-semibold">Розпізнавати 8 небезпечних сценаріїв за 3 секунди</span>
                </li>
                <li className="flex items-start">
                  <span className="text-nebachiv-orange mr-3">→</span>
                  <span className="font-semibold">Діяти коли інші порушують ПДР</span>
                </li>
                <li className="flex items-start">
                  <span className="text-nebachiv-orange mr-3">→</span>
                  <span className="font-semibold">Контролювати ситуацію в 360°</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center bg-gray-800 p-8 border border-gray-700">
            <p className="text-2xl font-semibold text-white mb-6">
              Отримав права? <span className="text-nebachiv-orange">Час ставати майстром!</span>
            </p>
            <Link 
              href="/register"
              className="inline-block bg-white text-black px-10 py-4 font-bold text-xl hover:bg-gray-100 transition-all"
            >
              ПРОДОВЖИТИ НАВЧАННЯ →
            </Link>
          </div>
        </div>
      </section>

      {/* Video Transition Section */}
      <section className="relative h-40 bg-black overflow-hidden">
        <img 
          src="/marketing_data/photos good for promo site/IMG_7735.png" 
          alt="Riders" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.3) contrast(1.2)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        <div className="absolute inset-0">
          <div className="h-full w-full bg-nebachiv-orange opacity-20"></div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">
                ТЕ, ЧОГО НІКОЛИ НЕ РОЗКАЖУТЬ В МОТОШКОЛІ
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Рекомендовано кращими мотошколами України як <span className="text-white font-semibold">наступний крок після отримання прав</span>
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "8 ПРИНЦИПІВ БЕЗПЕКИ",
                description: "Перевірена система на основі 921 ДТП (MAIDS дослідження)",
                color: "from-gray-800 to-gray-900"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "ПРАКТИЧНІ СЦЕНАРІЇ", 
                description: "Реальні ситуації з українських доріг",
                color: "from-gray-800 to-gray-900"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "ІНТЕРАКТИВНІ ТЕСТИ",
                description: "Перевірте знання в безпечному середовищі",
                color: "from-gray-800 to-gray-900"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "СПІЛЬНОТА РАЙДЕРІВ",
                description: "Обмінюйтесь досвідом з іншими мотоциклістами",
                color: "from-gray-800 to-gray-900"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "СЕРТИФІКАТИ",
                description: "Підтвердьте свою кваліфікацію офіційними документами",
                color: "from-gray-800 to-gray-900"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "ПРОГРЕС АНАЛІТИКА",
                description: "Відстежуйте свій розвиток у деталях",
                color: "from-gray-800 to-gray-900"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-black border border-gray-800 rounded-2xl p-8 hover:border-white transition-all duration-300"
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-4 group-hover:text-nebachiv-orange transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Themes Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">
                НАВЧИСЬ БАЧИТИ НЕВИДИМЕ
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Найефективніші уроки для швидкого покращення навичок
            </p>
          </div>
          
          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredThemes.map((theme, index) => (
              <div 
                key={theme.id}
                className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={theme.image} 
                    alt={theme.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-nebachiv-orange text-white text-xs font-bold rounded-full">
                      {theme.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-white text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{theme.duration}</span>
                      <span>•</span>
                      <span>{theme.difficulty}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-nebachiv-blue transition-colors">
                    {theme.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {theme.description}
                  </p>
                  
                  {/* CTA */}
                  <Link 
                    href={`/themes/${theme.id}`}
                    className="inline-flex items-center text-nebachiv-orange hover:text-white font-semibold group-hover:translate-x-2 transition-all duration-300"
                  >
                    НАВЧИСЬ ЗАРАЗ
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
                
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-nebachiv-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
          
          {/* View All CTA */}
          <div className="text-center mt-12">
            <Link 
              href="/register"
              className="inline-flex items-center bg-nebachiv-orange hover:bg-nebachiv-orange/80 text-white px-10 py-5 font-bold text-xl transition-all duration-300 transform hover:scale-105"
            >
              ОТРИМАТИ ДОСТУП ЗА $97
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <p className="text-sm text-gray-400 mt-4">⚠️ Залишилось 17 місць на цей тиждень</p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">
                ЦІ НАВИЧКИ <span className="text-nebachiv-orange">ВРЯТУВАЛИ ЖИТТЯ</span>
              </span>
            </h2>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-black border border-gray-800 rounded-2xl p-8 hover:border-white transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-nebachiv-orange rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">
                ОФІЦІЙНО ПІДТРИМУЮТЬ
              </span>
            </h2>
          </div>
          
          {/* Partners Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {[
              '/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_14 PM.png',
              '/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_25 PM.png',
              '/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_33 PM.png',
              '/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_37 PM.png'
            ].map((logo, index) => (
              <div key={index} className="flex items-center justify-center p-8 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition-all duration-300">
                <img src={logo} alt={`Partner ${index + 1}`} className="h-20 object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-white">
                НАША <span className="text-nebachiv-orange">СПІЛЬНОТА</span>
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Тисячі райдерів вже навчаються безпечній їзді
            </p>
          </div>
          
          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              '/marketing_data/photos good for promo site/IMG_4436.png',
              '/marketing_data/photos good for promo site/IMG_2717.png',
              '/marketing_data/photos good for promo site/5D3N4510.png',
              '/marketing_data/photos good for promo site/IMG_9719.png',
              '/marketing_data/photos good for promo site/IMG_1798.png',
              '/marketing_data/photos good for promo site/BRS_3731.png',
              '/marketing_data/photos good for promo site/IMG_7735.png',
              '/marketing_data/photos good for promo site/5D3N4975.png'
            ].map((img, index) => (
              <div 
                key={index}
                className="relative overflow-hidden rounded-lg group h-48 md:h-64"
              >
                <img 
                  src={img} 
                  alt={`Rider ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-white">
              ГОТОВИЙ СТАТИ
            </span>
            <br />
            <span className="text-nebachiv-orange">
              НЕВИДИМИМ НА ДОРОЗІ?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Приєднуйся до спільноти мотоциклістів, які знають секрети безпечної їзди
          </p>
          
          <div className="bg-gray-900 p-12 mb-8 border border-gray-800">
            <p className="text-white text-2xl font-bold mb-6">
              Ти вмієш водити мотоцикл. Час навчитися не дати себе збити.
            </p>
            <p className="text-3xl font-black text-nebachiv-orange mb-8">
              Повний курс: $97
            </p>
            <Link 
              href="/register"
              className="inline-block bg-white text-black px-12 py-6 font-black text-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              СТАТИ НЕВИДИМИМ ДЛЯ НЕБЕЗПЕКИ →
            </Link>
          </div>
          
          <p className="text-gray-400 text-sm">
            P.S. Партнери 200+ мотошкіл. Питай про Nebachiv у свого інструктора!
          </p>
        </div>
      </section>
    </div>
  )
}