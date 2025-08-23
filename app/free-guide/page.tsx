'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FreeGuidePage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-green-900/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-black mb-4">Дякую, {name}!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Гайд "8 Принципів Небачива" вже летить на твою пошту.
            <br />
            Перевір inbox (та папку спам).
          </p>
          
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <p className="text-yellow-400 font-bold mb-2">🎁 Спеціальна пропозиція для тебе:</p>
            <p className="text-gray-300 mb-4">
              Як подяка за довіру, ти отримуєш знижку 40% на повний курс.
              <br />
              Діє наступні 24 години.
            </p>
            <Link
              href="/register"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 text-xl font-bold rounded-lg transition-all transform hover:scale-105"
            >
              Забрати курс зі знижкою 40%
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm">
            Якщо лист не прийшов за 5 хвилин, напиши мені в Telegram: @motochyn
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-6">
              Безкоштовний гайд
              <br />
              <span className="text-yellow-400">"8 Принципів Небачива"</span>
            </h1>
            <p className="text-xl text-gray-300">
              Основа виживання на дорозі, яку повинен знати кожен мотоцикліст
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - What's Inside */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Що всередині:</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <h3 className="font-bold text-yellow-400">Бачити "Далеко"</h3>
                    <p className="text-gray-400">Як позиціонувати себе для максимальної видимості</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <h3 className="font-bold text-yellow-400">Блокери видимості</h3>
                    <p className="text-gray-400">Що таке "блокери" і чому вони вбивають</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <h3 className="font-bold text-yellow-400">Позиціонування</h3>
                    <p className="text-gray-400">Де їхати в смузі щоб тебе бачили</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <h3 className="font-bold text-yellow-400">Відповідальність</h3>
                    <p className="text-gray-400">Чому "він винен" = твоя смерть</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <span className="text-2xl">5️⃣</span>
                  <div>
                    <h3 className="font-bold text-yellow-400">Концентрація</h3>
                    <p className="text-gray-400">Як не "відключатись" за кермом</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <span className="text-2xl">6️⃣</span>
                  <div>
                    <h3 className="font-bold text-yellow-400">Помилка сприйняття</h3>
                    <p className="text-gray-400">Чому водії дивляться але не бачать</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <span className="text-2xl">7️⃣</span>
                  <div>
                    <h3 className="font-bold text-yellow-400">Хвильова природа</h3>
                    <p className="text-gray-400">Коли небезпека максимальна</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <span className="text-2xl">8️⃣</span>
                  <div>
                    <h3 className="font-bold text-yellow-400">Не заперечуй смерть</h3>
                    <p className="text-gray-400">Чому потрібно тренувати екстрене гальмування</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-red-900/30 rounded-lg">
                <p className="text-red-400 font-medium">
                  ⚠️ Це НЕ теорія з підручника. Це реальні принципи, 
                  вироблені на основі аналізу 12,000+ аварій.
                </p>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-gray-900 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Отримай гайд безкоштовно
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Як тебе звати?
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="Твоє ім'я"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email для отримання гайду
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="moto@example.com"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-4 text-xl font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Відправляємо...' : '📧 Отримати гайд'}
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Ніякого спаму. Тільки корисний контент про безпеку на мотоциклі.
                  <br />
                  Можеш відписатись в будь-який момент.
                </p>
              </form>
              
              {/* Trust badges */}
              <div className="mt-8 pt-8 border-t border-gray-800">
                <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    SSL захист
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Миттєва доставка
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}