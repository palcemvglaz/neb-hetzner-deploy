'use client'

import { useState } from 'react'
import { ChevronRight, ArrowRight, Shield, Target, Clock, CheckCircle } from 'lucide-react'

export default function NebachivRooshLanding() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement email submission
    setIsSubmitted(true)
  }

  const partnerLogos = [
    '/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_14 PM.png',
    '/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_25 PM.png',
    '/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_33 PM.png',
    '/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_37 PM.png'
  ]

  const safetyPrinciples = [
    {
      number: '01',
      title: 'Vision & Blocker',
      description: 'Навчіться бачити небезпеку за кілометр і розпізнавати "блокери" огляду'
    },
    {
      number: '02', 
      title: 'Критичні 0.9 секунди',
      description: 'Зменште час реакції з 0.9 до 0.3 секунди в екстренних ситуаціях'
    },
    {
      number: '03',
      title: '8 помилок гальмування', 
      description: 'Виправте найпоширеніші помилки, які роблять 92% мотоциклістів'
    },
    {
      number: '04',
      title: 'Система передбачення',
      description: 'Розпізнавайте 37% водіїв, які вас не бачать, за 3 секунди'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_06 PM.png" 
              alt="Nebachiv" 
              className="h-10 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#principles" className="text-gray-600 hover:text-gray-900 transition-colors">Принципи</a>
            <a href="#expertise" className="text-gray-600 hover:text-gray-900 transition-colors">Експертиза</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Контакт</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Мотошкола навчила
                <br />
                <span className="text-nebachiv-orange">керувати.</span>
                <br />
                Nebachiv навчить
                <br />
                <span className="text-nebachiv-orange">виживати.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Наступний логічний крок після отримання прав.
                <br />
                Базується на аналізі 921 реального ДТП (MAIDS).
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center">
                  Почати навчання
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border border-gray-300 text-gray-900 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Безкоштовний урок
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/marketing_data/photos good for promo site/IMG_5806.png" 
                alt="Motorcycle Safety" 
                className="w-full rounded-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border">
                <div className="text-3xl font-bold text-nebachiv-orange">37%</div>
                <div className="text-sm text-gray-600">водіїв не бачать<br />мотоциклістів</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-gray-500 text-sm mb-8 uppercase tracking-wider">
            Рекомендовано топовими мотошколами України
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {partnerLogos.map((logo, index) => (
              <div key={index} className="flex justify-center">
                <img 
                  src={logo} 
                  alt={`Partner ${index + 1}`} 
                  className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Principles */}
      <section id="principles" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Те, чого не розкажуть
              <br />
              в мотошколі
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              4 ключові принципи виживання в міському трафіку на основі аналізу
              тисяч реальних ДТП
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {safetyPrinciples.map((principle, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start">
                  <span className="text-4xl font-bold text-gray-200 group-hover:text-nebachiv-orange transition-colors">
                    {principle.number}
                  </span>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold mb-3">{principle.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Статистика, яка врятовує життя
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Кожен факт базується на офіційних дослідженнях MAIDS та 18-річному 
                досвіді безаварійної їзди.
              </p>
              
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-nebachiv-orange mb-2">921</div>
                  <div className="text-sm text-gray-600">ДТП проаналізовано<br />в дослідженні MAIDS</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-nebachiv-orange mb-2">237+</div>
                  <div className="text-sm text-gray-600">життів врятовано<br />завдяки навчанню</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-nebachiv-orange mb-2">18</div>
                  <div className="text-sm text-gray-600">років досвіду<br />без жодної аварії</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <img 
                src="/marketing_data/photos good for promo site/IMG_0963.png" 
                alt="Чингіз Небачив" 
                className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="text-xl font-bold mb-2">Чингіз Барінов</h3>
              <p className="text-gray-600 text-sm">Засновник Nebachiv</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовий навчитися виживати?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Твій інструктор порекомендував би тобі Nebachiv.
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Твій email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nebachiv-orange focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="bg-nebachiv-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-nebachiv-orange/80 transition-colors"
                >
                  Почати
                </button>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <p className="text-green-800">Дякую! Перевірте email для доступу до безкоштовного уроку.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src="/marketing_data/Logos/ChatGPT Image Jun 27, 2025, 03_44_06 PM.png" 
                alt="Nebachiv" 
                className="h-8 w-auto mr-4"
              />
              <span className="text-gray-600">© 2025 Nebachiv</span>
            </div>
            <div className="text-sm text-gray-500">
              Рекомендовано топовими мотошколами України
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}