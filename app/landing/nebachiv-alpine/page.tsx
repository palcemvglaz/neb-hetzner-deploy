'use client'

import { useState, useEffect } from 'react'
import { Play, ChevronRight, Shield, Star, Clock, Users, ArrowRight } from 'lucide-react'

export default function NebachivAlpineLanding() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState('')

  const heroSlides = [
    {
      image: '/marketing_data/photos good for promo site/IMG_5806.png',
      title: 'НАВЧИСЬ НЕ ДАТИ СЕБЕ ЗБИТИ',
      subtitle: 'Система виживання для міста',
      cta: 'ПОЧАТИ ЗАРАЗ'
    },
    {
      image: '/marketing_data/photos good for promo site/IMG_6137.png', 
      title: 'КРИТИЧНІ МОМЕНТИ',
      subtitle: 'Секунди, що рятують життя',
      cta: 'ДІЗНАТИСЯ БІЛЬШЕ'
    },
    {
      image: '/marketing_data/photos good for promo site/IMG_1976.png',
      title: 'ПРАВИЛЬНЕ ПОЗИЦІОНУВАННЯ',
      subtitle: 'Твоя позиція = твоя безпека',
      cta: 'ВИВЧИТИ ТЕХНІКУ'
    }
  ]

  const gearCategories = [
    {
      title: 'Vision & Blocker',
      description: 'Навчіться бачити небезпеку за кілометр',
      image: '/marketing_data/photos good for promo site/IMG_0461.png',
      difficulty: 'Початковий',
      duration: '45 хв'
    },
    {
      title: 'Критичні Моменти',
      description: 'Секунди, що рятують життя', 
      image: '/marketing_data/photos good for promo site/IMG_6137.png',
      difficulty: 'Просунутий',
      duration: '60 хв'
    },
    {
      title: 'Теорія Позиціонування',
      description: 'Правильна позиція = безпека',
      image: '/marketing_data/photos good for promo site/IMG_1976.png',
      difficulty: 'Середній', 
      duration: '35 хв'
    },
    {
      title: 'Екстрене Гальмування',
      description: '8 найпоширеніших помилок',
      image: '/marketing_data/photos good for promo site/IMG_4436.png',
      difficulty: 'Критично важливо',
      duration: '50 хв'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_06 PM.png" 
              alt="Nebachiv" 
              className="h-12 w-auto"
            />
            <span className="ml-3 text-xl font-bold">NEBACHIV</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#courses" className="hover:text-nebachiv-orange transition-colors font-medium">КУРСИ</a>
            <a href="#gear" className="hover:text-nebachiv-orange transition-colors font-medium">НАВЧАННЯ</a>
            <a href="#about" className="hover:text-nebachiv-orange transition-colors font-medium">ПРО НАС</a>
            <button className="bg-nebachiv-orange text-white px-6 py-2 rounded font-bold hover:bg-nebachiv-orange/80 transition-colors">
              ПОЧАТИ
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-300">
                  {slide.subtitle}
                </p>
                <button className="bg-nebachiv-orange text-white px-10 py-4 text-lg font-bold rounded hover:bg-nebachiv-orange/80 transition-all transform hover:scale-105">
                  {slide.cta}
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-nebachiv-orange' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-nebachiv-orange py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-black">37%</div>
              <div className="text-sm uppercase tracking-wider">ВОДІЇВ НЕ БАЧАТЬ</div>
            </div>
            <div>
              <div className="text-3xl font-black">921</div>
              <div className="text-sm uppercase tracking-wider">ДТП MAIDS</div>
            </div>
            <div>
              <div className="text-3xl font-black">237+</div>
              <div className="text-sm uppercase tracking-wider">ВРЯТОВАНИХ</div>
            </div>
            <div>
              <div className="text-3xl font-black">18</div>
              <div className="text-sm uppercase tracking-wider">РОКІВ БЕЗ АВАРІЙ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section id="courses" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              ВИЖИВАННЯ В МІСТІ
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Мотошкола навчила керувати мотоциклом. 
              <span className="text-nebachiv-orange font-bold"> Nebachiv навчить як тебе намагатимуться збити і як цього уникнути.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {gearCategories.map((category, index) => (
              <div 
                key={index}
                className="group bg-black border border-gray-800 rounded-lg overflow-hidden hover:border-nebachiv-orange transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-nebachiv-orange text-white px-3 py-1 text-xs font-bold rounded">
                      {category.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 text-white text-sm">
                    <Clock className="inline-block w-4 h-4 mr-1" />
                    {category.duration}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-nebachiv-orange transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  
                  <button className="mt-4 text-nebachiv-orange font-bold hover:text-nebachiv-orange transition-colors flex items-center">
                    ПОЧАТИ НАВЧАННЯ
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">
                БІЛЬШІСТЬ МОТОЦИКЛІСТІВ РОБЛЯТЬ
                <span className="text-nebachiv-orange"> 8 ПОМИЛОК</span> ЕКСТРЕННОГО ГАЛЬМУВАННЯ
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Дослідження MAIDS показує: 52% смертей через помилки самих мотоциклістів. 
                32% аварій - навіть секунди не було на реакцію.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-nebachiv-orange mr-3" />
                  <span>Техніка екстренного гальмування</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-nebachiv-orange mr-3" />
                  <span>Система передбачення небезпеки</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-nebachiv-orange mr-3" />
                  <span>Правильне позиціонування в трафіку</span>
                </div>
              </div>

              <button className="mt-8 bg-nebachiv-orange text-white px-8 py-4 font-bold rounded hover:bg-nebachiv-orange/80 transition-all">
                НАВЧИТИСЯ ПРАВИЛЬНО ГАЛЬМУВАТИ
              </button>
            </div>
            
            <div className="relative">
              <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                <img 
                  src="/marketing_data/photos good for promo site/IMG_7735.png" 
                  alt="Мотоциклісти в дорозі"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button className="bg-nebachiv-orange rounded-full p-6 hover:bg-nebachiv-orange/80 transition-colors">
                    <Play className="w-8 h-8 text-white" fill="white" />
                  </button>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-nebachiv-orange text-white p-6 rounded-lg">
                <div className="text-2xl font-black">89%</div>
                <div className="text-sm">менше ризику аварії</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Gallery */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16">
            НАША <span className="text-nebachiv-orange">СПІЛЬНОТА</span>
          </h2>
          
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
              <div key={index} className="relative overflow-hidden rounded-lg group aspect-square">
                <img 
                  src={img} 
                  alt={`Rider ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-nebachiv-orange/20 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-nebachiv-orange">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            ГОТОВИЙ СТАТИ НЕВИДИМИМ ДЛЯ НЕБЕЗПЕКИ?
          </h2>
          <p className="text-xl mb-8">
            Твій інструктор порекомендував би тобі Nebachiv
          </p>
          
          <form className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Твій email"
                className="flex-1 px-4 py-3 rounded bg-white text-black focus:outline-none"
              />
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 rounded font-bold hover:bg-gray-900 transition-colors"
              >
                ПОЧАТИ
              </button>
            </div>
          </form>
          
          <p className="text-sm mt-4 opacity-80">
            Рекомендовано топовими мотошколами України
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_06 PM.png" 
                alt="Nebachiv" 
                className="h-10 w-auto mr-4"
              />
              <div>
                <div className="font-bold">NEBACHIV</div>
                <div className="text-sm text-gray-400">Система виживання для мотоциклістів</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Nebachiv. Рекомендовано топовими мотошколами України
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}