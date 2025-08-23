'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'

export default function InsightsHormoziLanding() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date()
    targetDate.setHours(targetDate.getHours() + 48) // 48 hours from now

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })

      if (distance < 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])


  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Announcement Bar */}
      <div className="bg-nebachiv-orange/80 text-white text-center py-2 text-sm font-bold border-b border-red-800">
        🚨 ОСТАННІ 48 ГОДИН: ЗНИЖКА 40% ЗАКІНЧУЄТЬСЯ {timeLeft.hours}г {timeLeft.minutes}хв {timeLeft.seconds}с
      </div>

      {/* Header - Universal style */}
      <header className="border-b-2 border-black py-4 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <NebachivLogo 
            size="md" 
            variant="primary" 
            showText={true}
          />
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm">Залишилось місць:</div>
              <div className="text-3xl font-black text-nebachiv-orange">17</div>
            </div>
            <BrandedButton
              variant="outline"
              size="sm"
              onClick={() => router.push('/register')}
            >
              Зарєструватись
            </BrandedButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        {/* НЕ СТАНЬ СТАТИСТИКОЮ slogan */}
        <div className="bg-nebachiv-orange/20/20 backdrop-blur-sm border border-nebachiv-orange/20/50 rounded-2xl p-4 max-w-2xl mx-auto mb-8">
          <p className="text-2xl md:text-3xl font-black text-nebachiv-orange">
            НЕ СТАНЬ СТАТИСТИКОЮ
          </p>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
          МИ ПРОАНАЛІЗУВАЛИ 500+ ПИТАНЬ
          <br />
          І ЗНАЄМО ЧОГО{' '}
          <span className="text-nebachiv-orange">ТИ БОЇШСЯ</span>
        </h1>

        <p className="text-xl mb-6 text-gray-700">
          Освітній застосунок для мотоциклістів з доведеною ефективністю
        </p>

        <div className="bg-gray-200 border-2 border-black p-6 mb-8 text-xl">
          <strong>КОНКРЕТНА ОФЕРТА:</strong> Персональний план + відповіді на всі страхи + довічна підтримка
        </div>

        <div className="mb-8">
          <div className="text-6xl font-black mb-2">
            <span className="line-through text-gray-400">₴4,997</span>
          </div>
          <div className="text-8xl font-black text-nebachiv-orange mb-4">₴2,997</div>
          <div className="text-xl font-bold">ТІЛЬКИ ДО КІНЦЯ ТИЖНЯ</div>
        </div>

        <button
          onClick={() => router.push('/register')}
          className="bg-nebachiv-orange hover:bg-nebachiv-orange/80 text-white text-3xl font-black py-6 px-12 border-4 border-black shadow-lg transform hover:scale-105 transition-all mb-4"
        >
          ПОЧАТИ НАВЧАННЯ →
        </button>

        <div className="text-sm text-gray-600">
          ⚠️ Ціна підніметься через 48 годин до ₴4,997
        </div>
      </section>

      {/* 4 Types Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            4 ТИПИ МОТОЦИКЛІСТІВ
            <br />
            (ПРОАНАЛІЗОВАНО 500+ ПИТАНЬ)
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-4 border-nebachiv-orange p-6">
              <div className="text-4xl mb-4">😰</div>
              <h3 className="text-2xl font-bold mb-4">СТРАХІТЛИВИЙ НОВАЧОК - 35%</h3>
              <p className="text-lg mb-4">
                <strong>ТОП СТРАХИ:</strong>
              </p>
              <ul className="space-y-2 text-lg mb-4">
                <li>• "Не знаю як гальмувати"</li>
                <li>• "Страшно в дощ"</li>
                <li>• "Боюсь впасти"</li>
              </ul>
              <p className="text-nebachiv-blue font-bold">
                → РІШЕННЯ: 7-денний покроковий курс
              </p>
            </div>

            <div className="bg-white border-4 border-gray-600 p-6">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold mb-4">ТЕХНІЧНИЙ РАЦІОНАЛІСТ - 25%</h3>
              <p className="text-lg mb-4">
                <strong>ТОП ПИТАННЯ:</strong>
              </p>
              <ul className="space-y-2 text-lg mb-4">
                <li>• "Де точні дані?"</li>
                <li>• "Хочу статистику"</li>
                <li>• "Де докази?"</li>
              </ul>
              <p className="text-nebachiv-blue font-bold">
                → РІШЕННЯ: Аналіз 921 ДТП MAIDS
              </p>
            </div>

            <div className="bg-white border-4 border-gray-600 p-6">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-2xl font-bold mb-4">ЕМОЦІЙНИЙ ШУКАЧ - 20%</h3>
              <p className="text-lg mb-4">
                <strong>ТОП ПОТРЕБИ:</strong>
              </p>
              <ul className="space-y-2 text-lg mb-4">
                <li>• "Хто відчував те саме?"</li>
                <li>• "Потрібна підтримка"</li>
                <li>• "Я не один такий?"</li>
              </ul>
              <p className="text-nebachiv-blue font-bold">
                → РІШЕННЯ: Спільнота 698 райдерів
              </p>
            </div>

            <div className="bg-white border-4 border-gray-600 p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-4">ДОСВІДЧЕНИЙ МЕНТОР - 15%</h3>
              <p className="text-lg mb-4">
                <strong>ТОП ПРОБЛЕМИ:</strong>
              </p>
              <ul className="space-y-2 text-lg mb-4">
                <li>• "Як передати досвід?"</li>
                <li>• "Чому не слухають?"</li>
                <li>• "Де знайти учнів?"</li>
              </ul>
              <p className="text-nebachiv-blue font-bold">
                → РІШЕННЯ: Платформа навчання
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-black text-white p-8 text-2xl font-bold">
              НЕЗАЛЕЖНО ВІД ТИПУ -
              <br />
              МИ ЗНАЄМО <span className="text-nebachiv-orange">ЯК ТОБІ ДОПОМОГТИ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Questions Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            ТОП-10 ПИТАНЬ ЯКІ ЗАДАЮТЬ ВСІ
            <br />
            <span className="text-nebachiv-blue">(РЕАЛЬНІ ПИТАННЯ ВІД 500+ РАЙДЕРІВ)</span>
          </h2>

          <div className="bg-gray-100 border-4 border-black p-8 mb-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">89 разів: "Як правильно гальмувати?"</h3>
                  <p className="text-nebachiv-orange font-semibold">→ 41% втрат контролю через неправильне гальмування (MAIDS)</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">67 разів: "Як зробити щоб мене бачили?"</h3>
                  <p className="text-nebachiv-orange font-semibold">→ 37% водіїв НЕ бачать мотоциклістів (MAIDS)</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">54 рази: "Можна їздити в дощ?"</h3>
                  <p className="text-gray-600">→ 90% не знають техніку для мокрого асфальту</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">45 разів: "Чи нормально що страшно?"</h3>
                  <p className="text-gray-600">→ 100% новачків відчувають страх</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">+ ще 85 найчастіших питань...</h3>
                  <p className="text-nebachiv-blue font-semibold">→ Всі відповіді в нашій системі</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/register')}
              className="bg-nebachiv-blue hover:bg-nebachiv-blue-dark text-white text-lg sm:text-xl md:text-2xl font-black py-4 sm:py-5 md:py-6 px-6 sm:px-8 md:px-12 border-4 border-black shadow-lg transform hover:scale-105 transition-all"
            >
              ОТРИМАТИ ВСІ 89 ВІДПОВІДЕЙ →
            </button>
          </div>
        </div>
      </section>

      {/* 5 Cognitive Biases Section */}
      <section className="bg-gray-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            5 ПОМИЛОК МИСЛЕННЯ
            <br />
            <span className="text-nebachiv-orange">ЯКІ ВБИВАЮТЬ МОТОЦИКЛІСТІВ</span>
          </h2>

          <div className="space-y-8">
            <div className="bg-white border-4 border-nebachiv-orange p-8">
              <h3 className="text-2xl font-bold text-nebachiv-orange mb-4">
                ❌ 1. "ЗІ МНОЮ ТАКОГО НЕ СТАНЕТЬСЯ"
              </h3>
              <p className="text-xl mb-4">
                <strong>ІЛЮЗІЯ КОНТРОЛЮ:</strong> 77% мали навчання, 
                але все одно потрапили в ДТП (MAIDS)
              </p>
              <p className="text-nebachiv-blue text-xl font-bold">
                ✓ РІШЕННЯ: Аналіз 921 реальної аварії
              </p>
            </div>

            <div className="bg-white border-4 border-gray-600 p-8">
              <h3 className="text-2xl font-bold mb-4">
                ❌ 2. "ЯКЩО ВПАДУ - ТОЧНО ПОМРУ"
              </h3>
              <p className="text-xl mb-4">
                <strong>КАТАСТРОФІЗАЦІЯ:</strong> 75% ДТП на швидкості до 51 км/год.
                Більшість - легкі травми.
              </p>
              <p className="text-nebachiv-blue text-xl font-bold">
                ✓ РІШЕННЯ: Правильне екіпірування
              </p>
            </div>

            <div className="bg-white border-4 border-gray-600 p-8">
              <h3 className="text-2xl font-bold mb-4">
                ❌ 3. "ВСІ ТАК РОБЛЯТЬ"
              </h3>
              <p className="text-xl mb-4">
                <strong>СОЦІАЛЬНИЙ ДОКАЗ:</strong> 41% втрат контролю 
                через неправильне гальмування
              </p>
              <p className="text-nebachiv-blue text-xl font-bold">
                ✓ РІШЕННЯ: 8 принципів Небачива
              </p>
            </div>

            <div className="bg-white border-4 border-gray-600 p-8">
              <h3 className="text-2xl font-bold mb-4">
                ❌ 4. "ВАСЯ 10 РОКІВ ЇЗДИТЬ"
              </h3>
              <p className="text-xl mb-4">
                <strong>УПЕРЕДЖЕННЯ ВИЖИВШОГО:</strong> Ти не чуєш 
                історії тих хто не вижив
              </p>
              <p className="text-nebachiv-blue text-xl font-bold">
                ✓ РІШЕННЯ: Статистика MAIDS
              </p>
            </div>

            <div className="bg-white border-4 border-gray-600 p-8">
              <h3 className="text-2xl font-bold mb-4">
                ❌ 5. "ЧИМ БІЛЬШЕ ДОСВІДУ..."
              </h3>
              <p className="text-xl mb-4">
                <strong>ЕФЕКТ ДАННІНГА-КРЮГЕРА:</strong> Пік аварій - 
                після 6 місяців
              </p>
              <p className="text-nebachiv-blue text-xl font-bold">
                ✓ РІШЕННЯ: Постійне навчання
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            698 РАЙДЕРІВ ВЖЕ З НАМИ
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center mb-12">
            <div className="bg-white p-6 border-4 border-gray-600">
              <div className="text-4xl font-black text-nebachiv-blue">35%</div>
              <div className="font-bold">СТРАХІТЛИВІ НОВАЧКИ</div>
              <div className="text-sm text-gray-600 mt-2">Навчились гальмувати</div>
            </div>
            <div className="bg-white p-6 border-4 border-gray-600">
              <div className="text-4xl font-black text-nebachiv-blue">25%</div>
              <div className="font-bold">ТЕХНІЧНІ РАЦІОНАЛІСТИ</div>
              <div className="text-sm text-gray-600 mt-2">Отримали дані MAIDS</div>
            </div>
            <div className="bg-white p-6 border-4 border-gray-600">
              <div className="text-4xl font-black text-nebachiv-blue">20%</div>
              <div className="font-bold">ЕМОЦІЙНІ ШУКАЧІ</div>
              <div className="text-sm text-gray-600 mt-2">Знайшли спільноту</div>
            </div>
            <div className="bg-white p-6 border-4 border-gray-600">
              <div className="text-4xl font-black text-nebachiv-blue">15%</div>
              <div className="font-bold">ДОСВІДЧЕНІ МЕНТОРИ</div>
              <div className="text-sm text-gray-600 mt-2">Навчають новачків</div>
            </div>
          </div>

          {/* Real Testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border-2 border-gray-300">
              <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
              <p className="mb-4">
                "Боявся навіть на 40 км/год. За 7 днів навчився правильно гальмувати. Тепер їжджу в дощ без паніки."
              </p>
              <div className="font-bold">- Олександр, 28</div>
              <div className="text-sm text-gray-600">Страхітливий новачок → Впевнений</div>
            </div>

            <div className="bg-white p-6 border-2 border-gray-300">
              <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
              <p className="mb-4">
                "Нарешті отримала конкретні цифри та дані. Тепер знаю точно коли 70/30, а коли 50/50."
              </p>
              <div className="font-bold">- Марина, 35</div>
              <div className="text-sm text-gray-600">Технічний раціоналіст</div>
            </div>

            <div className="bg-white p-6 border-2 border-gray-300">
              <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
              <p className="mb-4">
                "Знайшов спільноту де мене розуміють. Тепер сам допомагаю новачкам."
              </p>
              <div className="font-bold">- Дмитро, 24</div>
              <div className="text-sm text-gray-600">Емоційний шукач → Ментор</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-8">
            МИ ЗНАЄМО ЩО ТИ ВІДЧУВАЄШ
            <br />
            <span className="text-nebachiv-blue">БО ПРОЙШЛИ ЦЕ САМІ</span>
          </h2>

          <div className="bg-gray-900 p-8 mb-8">
            <div className="text-yellow-300 text-xl mb-4">⚠️ ОСТАННЄ ПОПЕРЕДЖЕННЯ:</div>
            <div className="text-5xl font-black mb-4">
              КОЖЕН 4-Й НОВАЧОК
            </div>
            <div className="text-3xl mb-6">
              ПОПАДАЄ В ДТП В ПЕРШІ 18 МІСЯЦІВ
            </div>
            <div className="text-xl">Скільки вже проїздив ти?</div>
          </div>

          <button
            onClick={() => router.push('/register')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-4xl font-black py-8 px-16 border-4 border-black shadow-lg transform hover:scale-105 transition-all mb-4"
          >
            ПОЧАТИ НАВЧАННЯ →
          </button>

          <div className="text-lg">
            ⚠️ Після закінчення таймера ціна буде ₴4,997
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4 text-center">
        <p>&copy; 2025 Nebachiv. Не покладайся на удачу. Вона закінчується.</p>
      </footer>
    </div>
  )
}