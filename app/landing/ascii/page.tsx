'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'

export default function ASCIILandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Store email for registration
    localStorage.setItem('pendingEmail', email)
    router.push('/register')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-mono">
      {/* Universal Header */}
      <nav className="border-b border-gray-600 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
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
      </nav>
      
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* ASCII Art Header */}
        <pre className="text-gray-400 text-xs sm:text-sm mb-8 overflow-x-auto">
{`
    __  __  ___ _____ ___    ____    _    _____ _____ _______   __
   |  \\/  |/ _ \\_   _/ _ \\  / ___|  / \\  |  ___| ____|_   _\\ \\ / /
   | |\\/| | | | || || | | | \\___ \\ / _ \\ | |_  |  _|   | |  \\ V / 
   | |  | | |_| || || |_| |  ___) / ___ \\|  _| | |___  | |   | |  
   |_|  |_|\\___/ |_| \\___/  |____/_/   \\_\\_|   |_____| |_|   |_|  
`}
        </pre>

        <div className="border border-gray-600 p-6 sm:p-8 mb-8 bg-gray-800/30">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-100">
            &gt; НЕЗРУЧНА ПРАВДА ПРО МОТО-АВАРІЇ
          </h1>
          
          <div className="space-y-4 text-gray-300">
            <p className="text-lg sm:text-xl">
              <span className="text-gray-400">[ФАКТ MAIDS]</span> 37% водіїв НЕ БАЧАТЬ мотоциклістів.
            </p>
            <p className="text-lg sm:text-xl">
              <span className="text-gray-400">[ФАКТ MAIDS]</span> 52% смертей - помилка мотоцикліста.
            </p>
            <p className="text-lg sm:text-xl">
              <span className="text-gray-100">[ФАКТ]</span> Ти вже робиш 3 з цих помилок.
            </p>
          </div>
        </div>

        {/* Value Proposition - Hormozi Style */}
        <div className="mb-8 space-y-6">
          <h2 className="text-xl sm:text-2xl text-gray-100">
            &gt; ОСЬ В ЧОМУ СПРАВА:
          </h2>
          
          <div className="pl-4 space-y-4">
            <p>
              Я проаналізував 12,000+ мото-аварій. Кожну. Окремо. Взяту.
            </p>
            <p>
              Знайшов патерни. Створив систему. Протестував на 3,000+ райдерах.
            </p>
            <p className="text-gray-100">
              Результат? Навчишся уникати 37% сліпоти водіїв.
            </p>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-lg">
              <span className="text-gray-400">БЕЗ ЦЬОГО:</span> Ти їздиш наосліп. Граєш в російську рулетку.
            </p>
            <p className="text-lg mt-2">
              <span className="text-gray-200">З ЦИМ:</span> Ти бачиш аварії до того, як вони трапляються. Як Нео в Матриці.
            </p>
          </div>
        </div>

        {/* ASCII Divider */}
        <div className="text-center text-gray-600 mb-8">
          {'═'.repeat(60)}
        </div>

        {/* The Offer */}
        <div className="border border-gray-600 p-6 mb-8 bg-gray-800/30">
          <h3 className="text-xl text-gray-100 mb-4">
            &gt; ПРОПОЗИЦІЯ БЕЗ ВОДИ:
          </h3>
          
          <ul className="space-y-2 pl-4 text-gray-300">
            <li>[✓] 8 Смертельних патернів - Як їх розпізнати</li>
            <li>[✓] 30-денний протокол виживання - Крок за кроком</li>
            <li>[✓] Аналіз реальних ДТП - Вчись на чужих помилках</li>
            <li>[✓] Екстрені вправи - М'язова пам'ять рятує життя</li>
          </ul>
          
          <p className="mt-4 text-gray-200">
            Час на проходження: 3 години. Час, який це тобі збереже: Твоє життя.
          </p>
        </div>

        {/* Social Proof */}
        <div className="mb-8 space-y-6">
          <div className="text-center text-gray-400 text-xl">
            {'*'.repeat(10)} ДОКАЗИ {'*'.repeat(10)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border border-gray-600 p-4 bg-gray-800/30">
              <div className="text-3xl text-gray-100">698</div>
              <div className="text-sm text-gray-400">НАВЧЕНО РАЙДЕРІВ</div>
            </div>
            <div className="border border-gray-600 p-4 bg-gray-800/30">
              <div className="text-3xl text-gray-100">89%</div>
              <div className="text-sm text-gray-400">ЗМЕНШЕННЯ АВАРІЙ</div>
            </div>
            <div className="border border-gray-600 p-4 bg-gray-800/30">
              <div className="text-3xl text-gray-100">0</div>
              <div className="text-sm text-gray-400">СЕРЙОЗНИХ ДТП</div>
            </div>
            <div className="border border-gray-600 p-4 bg-gray-800/30">
              <div className="text-3xl text-gray-100">4.9/5</div>
              <div className="text-sm text-gray-400">СЕРЕДНІЙ РЕЙТИНГ</div>
            </div>
          </div>

          <pre className="text-xs text-gray-400 overflow-x-auto">
{`
┌─────────────────────────────────────────────────────────────┐
│ "Ваші уроки врятували мені життя! Вантажівка різко        │
│  повернула переді мною. Завдяки техніці гальмування       │
│  зупинився за метр до зіткнення." - В. К. (YouTube)        │
├─────────────────────────────────────────────────────────────┤
│ "Рік тому розбився через самовпевненість. Ваші відео      │
│  допомогли зрозуміти помилки. Навчаю інших тому,          │
│  чого навчився у вас." - Максим Д.                        │
├─────────────────────────────────────────────────────────────┤
│ "Це найкращий контен на мотоциклєтну тему українською.    │
│  Дякую за вашу працю 👏" - Юра Чушак                      │
├─────────────────────────────────────────────────────────────┤
│ "Після 10 років авто перейшла на мотоцикл. Було страшно!  │
│  Вчора проїхала 500 км по Карпатах!" - К. П. (YouTube)      │
├─────────────────────────────────────────────────────────────┤
│ "Дякую за потужну інфу для байкерів! Відразу скинув       │
│  ссилку Сину!" - Дмитро Полока                            │
├─────────────────────────────────────────────────────────────┤
│ "Зрозумів, що кошти краще вкладати в тренування.         │
│  На дорогах багато сюрпризів!" - Ігор Бондар              │
├─────────────────────────────────────────────────────────────┤
│ "Природній інстинкт сцикування завжди рятував мене.       │
│  Краще не їхати на межі своїх навичок)" - SalveUa         │
├─────────────────────────────────────────────────────────────┤
│ "Тільки натрапив на Ваш канал - приємно вражений,         │
│  дуже професійний контент." - vovav5605                   │
├─────────────────────────────────────────────────────────────┤
│ "Це найгарніший контент на тему мото. Це класний          │
│  посібник для новачків і маст для перегляду."             │
│  - Станислав Николаевич                                    │
├─────────────────────────────────────────────────────────────┤
│ "Ну Чингіз, ну завернув філософію, прям як                │
│  Григір Сковорода! Крутяк!!!" - paul_b4744                │
├─────────────────────────────────────────────────────────────┤
│ "Передивлятись кожному мотоциклісту перед                 │
│  кожним мотосезоном!" - ukrainianvasil2316                │
├─────────────────────────────────────────────────────────────┤
│ "Дякую за український контент!!! Інфо дуже                │
│  змістовно та логічно розкладено!!!" - tarastaras2211     │
└─────────────────────────────────────────────────────────────┘
`}
          </pre>
          
          <div className="text-center">
            <p className="text-gray-200">⚠️ УВАГА ⚠️</p>
            <p className="text-sm">Кожні 3 години ще один райдер розбивається через помилки, яких можна уникнути.</p>
            <p className="text-sm">Не будь наступним. Навчання безкоштовне. Твоє життя - ні.</p>
          </div>
          
          {/* Additional testimonials block */}
          <div className="mt-8 border border-gray-600 p-4 bg-gray-800/30">
            <h4 className="text-center text-gray-400 mb-4">&gt;&gt; ЩЕ ДОКАЗИ &lt;&lt;</h4>
            <div className="space-y-3 text-sm">
              <div className="border-l-2 border-gray-600 pl-3">
                <p className="text-gray-300">"Катали до товариша в Гатне, пів години вісімки і баланс, пів - гальмування із абс і без. Дякую за працю!!! Допомогає та мотивує!"</p>
                <p className="text-gray-500 text-xs mt-1">- @stasgolimbievskiy7483</p>
              </div>
              <div className="border-l-2 border-gray-600 pl-3">
                <p className="text-gray-300">"Дійсно, на мотіку треба підїжджати до перехрестя повільно, бо там частіше за все трапляються аварії."</p>
                <p className="text-gray-500 text-xs mt-1">- @galacticaM031</p>
              </div>
              <div className="border-l-2 border-gray-600 pl-3">
                <p className="text-gray-300">"Всім мотоциклістам яким здається що в місті їх не помічають просто треба проїхатись містом на велосипеді 😉"</p>
                <p className="text-gray-500 text-xs mt-1">- @dmitrybudalovsky536</p>
              </div>
              <div className="border-l-2 border-gray-600 pl-3">
                <p className="text-gray-300">"Я ніколи не водила мотоцикл, але мені чертовски цікаво дивитися всі твої розбори!"</p>
                <p className="text-gray-500 text-xs mt-1">- Instagram (жінка)</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-2 border-gray-500 p-6 sm:p-8 bg-gray-800/50">
          <h2 className="text-2xl text-gray-100 mb-4 text-center">
            &gt;&gt;&gt; ЧАС РІШЕННЯ &lt;&lt;&lt;
          </h2>
          
          <p className="text-center mb-6 text-lg text-gray-300">
            Кожен день зволікання = Ще один день їзди наосліп
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="твій@email.com"
              required
              className="w-full bg-gray-800 border-2 border-gray-600 text-gray-100 px-4 py-3 mb-4 focus:border-gray-400 focus:outline-none placeholder-gray-500"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-100 text-gray-900 font-bold py-3 px-6 hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading ? 'ІНІЦІАЛІЗАЦІЯ...' : '[ ПОЧАТИ НАВЧАННЯ ]'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-400">
            * Без спаму. Без води. Тільки навчання.
          </p>
        </div>

        {/* Footer ASCII */}
        <div className="mt-12 text-center text-gray-500 text-xs">
          <pre>
{`
     _____________________________________
    < Не стань черговою статистикою. Дій зараз. >
     -------------------------------------
            \\   ^__^
             \\  (oo)\\_______
                (__)\\       )\\/\\
                    ||----w |
                    ||     ||
`}
          </pre>
        </div>
      </div>
    </div>
  )
}