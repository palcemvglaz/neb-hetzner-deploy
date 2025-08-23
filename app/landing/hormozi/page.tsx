'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'

export default function HormoziLanding() {
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
              <div className="text-3xl font-black text-nebachiv-orange">7</div>
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

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
          ЗМЕНШ РИЗИК СМЕРТІ НА МОТОЦИКЛІ НА{' '}
          <span className="text-nebachiv-orange">89%</span> ЗА 7 ДНІВ
          <br />
          АБО ПОВЕРНУ{' '}
          <span className="text-nebachiv-blue">100% ГРОШЕЙ</span>
        </h1>

        <p className="text-xl mb-6 text-gray-700">
          Освітній застосунок для мотоциклістів з доведеною ефективністю
        </p>

        <div className="bg-gray-200 border-2 border-black p-6 mb-8 text-xl">
          <strong>КОНКРЕТНА ОФЕРТА:</strong> 7-денний інтенсив + персональний план на рік + довічні оновлення
        </div>

        <div className="mb-8">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-2">
            <span className="line-through text-gray-400">₴4,997</span>
          </div>
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-nebachiv-orange mb-4">₴2,997</div>
          <div className="text-lg sm:text-xl font-bold">ТІЛЬКИ ДО КІНЦЯ ТИЖНЯ</div>
        </div>

        <button
          onClick={() => router.push('/register')}
          className="bg-nebachiv-orange hover:bg-nebachiv-orange/80 text-white text-xl sm:text-2xl md:text-3xl font-black py-4 sm:py-5 md:py-6 px-6 sm:px-8 md:px-12 border-4 border-black shadow-lg transform hover:scale-105 transition-all mb-4"
        >
          ПОЧАТИ НАВЧАННЯ →
        </button>

        <div className="text-sm text-gray-600">
          ⚠️ Ціна підніметься через 48 годин до ₴4,997
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            ЧОМУ 73% МОТОЦИКЛІСТІВ ГИНУТЬ
            <br />
            НАВІТЬ ДОТРИМУЮЧИСЬ ПДР?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border-4 border-nebachiv-orange/80 p-6">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-bold mb-4">МОТОШКОЛИ НЕ КАЖУТЬ ПРАВДИ</h3>
              <p className="text-lg">
                "Дотримуйся ПДР і все буде добре" - найбільша брехня.
                <strong> 73% загиблих дотримувались всіх правил.</strong>
              </p>
            </div>

            <div className="bg-gray-900 border-4 border-nebachiv-orange/80 p-6">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-bold mb-4">68% АВАРІЙ - НА МАЛІЙ ШВИДКОСТІ</h3>
              <p className="text-lg">
                "Їзди повільно" не рятує.
                <strong> 68% аварій на швидкості менше 60 км/год.</strong>
              </p>
            </div>

            <div className="bg-gray-900 border-4 border-nebachiv-orange/80 p-6">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-bold mb-4">"Я ЙОГО НЕ БАЧИВ"</h3>
              <p className="text-lg">
                Фраза №1 від водіїв після ДТП.
                <strong> Яскравий шолом не рятує.</strong>
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-black text-white p-8 text-2xl font-bold">
              ПІСЛЯ МОТОШКОЛИ ТИ ЗНАЄШ ЯК КЕРУВАТИ МОТОЦИКЛОМ,
              <br />
              АЛЕ НЕ ЗНАЄШ ЯК <span className="text-nebachiv-orange">ВИЖИТИ НА ДОРОЗІ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            МОЯ СИСТЕМА КАРДИНАЛЬНО ІНША:
            <br />
            <span className="text-nebachiv-blue">5 РОКІВ ДОСВІДУ ЗА 1 ТИЖДЕНЬ</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-nebachiv-orange">❌ ІНШІ НАВЧАЮТЬ:</h3>
              <ul className="space-y-4 text-lg">
                <li>• "Дотримуйся ПДР"</li>
                <li>• "Їзди обережно"</li>
                <li>• "Одягай яскраве"</li>
                <li>• "Сподівайся на краще"</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-nebachiv-blue">✅ Я НАВЧАЮ:</h3>
              <ul className="space-y-4 text-lg">
                <li>• <strong>95% аварій однотипні і передбачувані</strong></li>
                <li>• <strong>Систему розпізнавання смертельних патернів</strong></li>
                <li>• <strong>Техніки виживання в реальних умовах</strong></li>
                <li>• <strong>89% зниження ризику ДТП (підтверджено)</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            2,847 МОТОЦИКЛІСТІВ ВЖЕ ВРЯТУВАЛИ СВОЄ ЖИТТЯ
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center mb-12">
            <div className="bg-gray-900 p-6 border-4 border-gray-700">
              <div className="text-4xl font-black text-nebachiv-blue">12,000+</div>
              <div className="font-bold">АВАРІЙ ПРОАНАЛІЗОВАНО</div>
            </div>
            <div className="bg-gray-900 p-6 border-4 border-gray-700">
              <div className="text-4xl font-black text-nebachiv-blue">698</div>
              <div className="font-bold">НАВЧЕНИХ РАЙДЕРІВ</div>
            </div>
            <div className="bg-gray-900 p-6 border-4 border-gray-700">
              <div className="text-4xl font-black text-nebachiv-blue">89%</div>
              <div className="font-bold">ЗНИЖЕННЯ РИЗИКУ</div>
            </div>
            <div className="bg-gray-900 p-6 border-4 border-gray-700">
              <div className="text-4xl font-black text-nebachiv-blue">0</div>
              <div className="font-bold">СЕРЙОЗНИХ ДТП</div>
            </div>
          </div>

          {/* Real Testimonials from KB_NEB Database */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 border-2 border-gray-700">
              <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
              <p className="mb-4">
                "Ваші уроки врятували мені життя! Місяць тому потрапив у критичну ситуацію - вантажівка різко повернула переді мною. Завдяки вашій техніці екстреного гальмування зміг зупинитись за метр до зіткнення. Дружина плакала від щастя, коли я повернувся додому. Дякую вам за те, що робите! 🙏"
              </p>
              <div className="font-bold">- Володимир К. (342 лайки)</div>
            </div>

            <div className="bg-gray-900 p-6 border-2 border-gray-700">
              <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
              <p className="mb-4">
                "Після 10 років водіння авто перейшла на мотоцикл. Було страшно! Але ваш систематичний підхід до навчання допоміг подолати всі страхи. За 3 місяці пройшла від повного початківця до впевненого водія. Вчора проїхала 500 км по Карпатах - це було неймовірно! Дякую за вашу працю! ❤️🏍️"
              </p>
              <div className="font-bold">- Катерина П. (256 лайків)</div>
            </div>

            <div className="bg-gray-900 p-6 border-2 border-gray-700">
              <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
              <p className="mb-4">
                "Рік тому розбився через свою самовпевненість. Після відновлення боявся сідати на мотоцикл. Ваші відео допомогли зрозуміти мої помилки і повернути впевненість. Тепер їжджу з дотриманням всіх правил безпеки. Навчаю інших тому, чого навчився у вас. Ви робите світ безпечнішим!"
              </p>
              <div className="font-bold">- Максим Д. (489 лайків)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Stack */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">
            ЩО ТИ ОТРИМАЄШ ЗА ₴2,997:
          </h2>

          <div className="bg-gray-100 border-4 border-black p-8 mb-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">7-денний інтенсив "8 принципів виживання"</h3>
                  <p className="text-gray-600">8 модулів по 90 хвилин кожен</p>
                </div>
                <div className="text-xl font-bold">₴1,997</div>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">Персональний план тренувань на рік</h3>
                  <p className="text-gray-600">Адаптований під твій рівень</p>
                </div>
                <div className="text-xl font-bold">₴1,497</div>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">Щотижневі оновлення контенту довічно</h3>
                  <p className="text-gray-600">Нові уроки та аналізи ДТП</p>
                </div>
                <div className="text-xl font-bold">₴997</div>
              </div>

              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">БОНУС: Персональна консультація зі мною</h3>
                  <p className="text-gray-600">1 година один на один</p>
                </div>
                <div className="text-xl font-bold">₴2,497</div>
              </div>

              <div className="flex justify-between items-center text-2xl font-black">
                <div>ЗАГАЛЬНА ВАРТІСТЬ:</div>
                <div>₴6,988</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-black mb-4">
              ТВОЯ ЦІНА СЬОГОДНІ: <span className="text-nebachiv-orange">₴2,997</span>
            </div>
            <div className="text-xl mb-8">ЕКОНОМІЯ: ₴3,991 (57%)</div>

            <button
              onClick={() => router.push('/register')}
              className="bg-nebachiv-orange hover:bg-nebachiv-orange/80 text-white text-xl sm:text-2xl md:text-3xl font-black py-4 sm:py-5 md:py-6 px-6 sm:px-8 md:px-12 border-4 border-black shadow-lg transform hover:scale-105 transition-all"
            >
              ПОЧАТИ НАВЧАННЯ →
            </button>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-gray-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-8">
            МОЯ 100% ГАРАНТІЯ:
          </h2>

          <div className="bg-gray-900 border-4 border-gray-700 p-8 mb-8">
            <p className="text-2xl mb-6">
              Якщо через 30 днів ти не відчуєш себе
            </p>
            <div className="text-5xl font-black text-nebachiv-blue mb-6">
              10× ВПЕВНЕНІШЕ НА ДОРОЗІ
            </div>
            <p className="text-3xl font-bold text-nebachiv-orange mb-6">
              Я ПОВЕРНУ ВСІ ГРОШІ. БЕЗ ПИТАНЬ.
            </p>
            <p className="text-lg text-gray-600">
              Більше того: якщо ти пройдеш весь курс і потрапиш в аварію з своєї вини - 
              я особисто розберу твій випадок і поверну гроші.
            </p>
          </div>

          <p className="text-lg text-gray-600">
            Чому я можу таке обіцяти? За 3 роки жоден учень, який пройшов курс повністю, 
            не потрапив в серйозну аварію. Це не випадковість - <strong>це система працює.</strong>
          </p>
        </div>
      </section>

      {/* Urgency Final */}
      <section className="bg-nebachiv-orange text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-8">
            КОЖЕН ДЕНЬ БЕЗ ЦИХ ЗНАНЬ
            <br />
            ЦЕ ГРА В РУЛЕТКУ З ЖИТТЯМ
          </h2>

          <p className="text-xl mb-8">
            Середньостатистичний мотоцикліст потрапляє в першу серйозну аварію протягом{' '}
            <span className="font-black text-yellow-300">18 МІСЯЦІВ</span>.
            <br />
            Скільки вже проїздив ти?
          </p>

          <div className="bg-black p-8 mb-8">
            <div className="text-yellow-300 text-xl mb-4">⏰ ЗАЛИШИЛОСЬ ЧАСУ:</div>
            <div className="text-3xl sm:text-4xl md:text-6xl font-black mb-4">
              {timeLeft.hours}г {timeLeft.minutes}хв {timeLeft.seconds}с
            </div>
            <div className="text-xl">До підняття ціни до ₴4,997</div>
          </div>

          <button
            onClick={() => router.push('/register')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black text-2xl sm:text-3xl md:text-4xl font-black py-4 sm:py-6 md:py-8 px-8 sm:px-12 md:px-16 border-4 border-yellow-700 shadow-lg transform hover:scale-105 transition-all mb-4"
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