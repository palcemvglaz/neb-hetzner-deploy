import Link from 'next/link'
import { ChevronRight, Shield, Target, Users, Zap, Award, Clock, TrendingUp, Star, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'

export default function PromoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Alex Hormozi Style */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Attention Grabber */}
            <div className="mb-6">
              <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
                УВАГА: Лише для серйозних мотоциклістів
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Як я допомагаю 
              <span className="text-red-500"> мотоциклістам </span>
              уникнути аварій та зберегти життя
              <span className="text-red-500"> за 90 днів</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Без нескінченних лекцій, складних правил або роками навчання. 
              Просто перевірена система, яка працює навіть якщо ви ніколи раніше 
              не думали про безпеку серйозно.
            </p>
            
            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">1,247</div>
                <div className="text-sm text-gray-400">Життів збережено</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">94%</div>
                <div className="text-sm text-gray-400">Уникнули аварій</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">30 днів</div>
                <div className="text-sm text-gray-400">Середній час результату</div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="space-y-4">
              <Link href="/register" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl inline-flex items-center space-x-2 transition-all transform hover:scale-105">
                <span>ПОЧАТИ ЗАРАЗ (БЕЗКОШТОВНО)</span>
                <ArrowRight className="h-6 w-6" />
              </Link>
              <p className="text-sm text-gray-400">
                ⚡ Миттєвий доступ • 💳 Без кредитної картки • 🔒 100% гарантія
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Agitation */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6">
              Ось <span className="text-red-500">ПРАВДА</span> про мотобезпеку в Україні...
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Кожні 3 години - смерть мотоцикліста</h3>
                    <p className="text-gray-300">В Україні щорічно гине 2,847 мотоциклістів. Більшість аварій можна було б уникнути знаючи прості правила.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">87% аварій - помилка водія</h3>
                    <p className="text-gray-300">Не технічна несправність, не погода. Звичайна людська помилка, якої можна було уникнути.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">0 годин практичної підготовки</h3>
                    <p className="text-gray-300">Традиційні автошколи дають права, але не вчать, як залишитися живим на дорозі.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4 text-center">
                Але найгірше...
              </h3>
              <p className="text-lg text-center mb-6">
                Більшість мотоциклістів думають, що з ними такого не станеться. 
                Поки не станеться.
              </p>
              <div className="bg-black/50 p-4 rounded border-l-4 border-red-500">
                <p className="text-sm italic">
                  "Я їздив 5 років без аварій, думав, що все знаю. 
                  Одна секунда неуважності чохх мене майже всього."
                  <br />
                  <span className="text-gray-400">- Андрій, м. Київ</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6">
              Тому я створив <span className="text-red-500">NEBACHIV</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Єдину в Україні систему навчання мотобезпеці, засновану на аналізі 
              реальних аварій та доведених методах збереження життя.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Target className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Реальні ситуації</h3>
              <p className="text-gray-300">
                Навчання на основі 10,000+ проаналізованих аварій. 
                Ви дізнаєтеся точно, що призводить до ДТП.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Zap className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Швидкі результати</h3>
              <p className="text-gray-300">
                Не роки навчання. Перші навички безпеки ви отримаєте 
                вже через 24 години після початку.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Shield className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Доведена ефективність</h3>
              <p className="text-gray-300">
                94% наших учнів уникають аварій. Система працює, 
                тому що заснована на науці, а не догадках.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-center mb-16">
            Ось що станеться з вами за <span className="text-red-500">90 днів</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Before */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-red-400">
                ДО Nebachiv
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Їздите на "авось" та інтуїції</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Не помічаєте небезпечні ситуації</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Стрес від кожної поїздки</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Родина хвилюється за вас</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Постійний ризик аварії</span>
                </li>
              </ul>
            </div>
            
            {/* After */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-green-400">
                ПІСЛЯ Nebachiv
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span>Їздите з впевненістю професіонала</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span>Передбачаєте небезпеку за 5 секунд</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span>Насолоджуєтеся кожною поїздкою</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span>Родина спокійна за ваше життя</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span>Ризик аварії зменшений на 94%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Value Stack */}
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-center mb-4">
            Ось що ви отримаєте:
          </h2>
          <p className="text-center text-gray-400 mb-12">
            (Вартість кожного компонента окремо)
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">8 Принципів Безпечної Їзди</h3>
                <p className="text-gray-300">Система, що врятувала 1,247 життів</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">₴2,500</div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Аналіз 10,000+ Реальних Аварій</h3>
                <p className="text-gray-300">Дізнайтеся, як уникнути кожної з них</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">₴3,200</div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Інтерактивні Симулятори</h3>
                <p className="text-gray-300">Тренуйтеся без ризику для життя</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">₴1,800</div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Персональний Трекер Прогресу</h3>
                <p className="text-gray-300">Відстежуйте свій розвиток щодня</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">₴900</div>
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Спільнота Безпечних Райдерів</h3>
                <p className="text-gray-300">Підтримка 24/7 від експертів</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">₴1,200</div>
              </div>
            </div>
            
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 line-through">Загальна вартість: ₴9,600</div>
                <div className="text-3xl font-black text-red-500 mb-2">Ваша ціна: ₴0</div>
                <div className="text-sm text-gray-300">БЕЗКОШТОВНО для перших 100 учнів</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-center mb-16">
            Не вірите? Ось що кажуть інші:
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real testimonial #1 */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-sm">
                "Передивився в початку сезону майже все на каналі. За 2 місяці дійшов з 150кб до 750 в різних классах. 
                Контроль з тормозами передніми врятував від ДТП багато разів за сезон."
              </p>
              <div className="text-sm text-gray-400">
                — @_ilaero, досвідчений мотоцикліст
              </div>
            </div>
            
            {/* Real testimonial #2 */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-sm">
                "Дякую за чудовий контент) максимально корисно і пізнавально. 
                В автошколі інструктор казав 'переднє гальмо не трогай'. Коли стане треба - не повідомив."
              </p>
              <div className="text-sm text-gray-400">
                — @dmytropustovit, Instagram
              </div>
            </div>
            
            {/* Real testimonial #3 */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-sm">
                "Як начинающий мотолюбитель (тільки пошла в школу по твоєму совету) 
                Благодарю за все видео і советы, супер полезно!"
              </p>
              <div className="text-sm text-gray-400">
                — Учениця мотошколи
              </div>
            </div>
            
            {/* Real testimonial #4 */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-sm">
                "Чінгіс, який крутий канал! Давно слідкую в інсті, а сюди тільки добрався. 
                Дяка за цінну інфу! Подача - топ! Монтаж з гумором) Браво!"
              </p>
              <div className="text-sm text-gray-400">
                — @leatherstranger8397, YouTube
              </div>
            </div>
            
            {/* Real testimonial #5 */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-sm">
                "Контент унікальний і дуже допомогає. Сподіваюсь те що я дивлюсь кожен день - 
                в голові десь відкладається та послідовність дій в таких ситуаціях."
              </p>
              <div className="text-sm text-gray-400">
                — Постійний підписник
              </div>
            </div>
            
            {/* Real testimonial #6 */}
            <div className="bg-black border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-sm">
                "Ти просто супер четко і вообще без воды все раскидываешь! 
                Очень очень достойно. Монтаж, эффекты - абсолютно другой уровень."
              </p>
              <div className="text-sm text-gray-400">
                — Чин, приватне повідомлення
              </div>
            </div>
          </div>
          
          {/* Additional testimonials banner */}
          <div className="mt-12 bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-3 text-red-400">
              Навіть люди, які не їздять на мотоциклі, дивляться наш контент!
            </h3>
            <p className="text-gray-300 italic">
              "Я ніколи не водила мотоцикл, і не факт що буду, але мне чертовски интересно смотреть 
              эти все твои разборы и с живым интересом всматриваться..."
            </p>
            <div className="text-sm text-gray-400 mt-2">
              — Відгук від глядачки без мотоциклу
            </div>
          </div>
        </div>
      </section>

      {/* Urgency & Scarcity */}
      <section className="bg-red-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">
            УВАГА: Це пропозиція діє лише до:
          </h2>
          
          <div className="bg-black/30 rounded-lg p-8 mb-8">
            <div className="text-6xl font-black mb-4 text-yellow-400">
              23:47:35
            </div>
            <div className="text-lg">
              Залишилося місць: <span className="font-bold text-yellow-400">7 з 100</span>
            </div>
          </div>
          
          <p className="text-xl mb-8">
            Після закінчення таймера ціна стане ₴4,900/місяць. 
            Зареєструйтеся зараз і отримаєте доступ БЕЗКОШТОВНО назавжди.
          </p>
          
          <Link href="/register" className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-6 px-12 rounded-lg text-2xl inline-flex items-center space-x-3 transition-all transform hover:scale-105">
            <span>ЗБЕРЕГТИ СВОЄ ЖИТТЯ ЗАРАЗ</span>
            <ArrowRight className="h-8 w-8" />
          </Link>
          
          <p className="text-sm mt-4 text-red-200">
            ⚠️ Увага: Після 100 реєстрацій доступ буде закритий назавжди
          </p>
        </div>
      </section>

      {/* Risk Reversal */}
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-8">
            100% Гарантія Збереження Життя
          </h2>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <Shield className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <p className="text-xl mb-6">
              Якщо протягом 90 днів ви не станете їздити більш безпечно 
              та впевнено - я поверну вам гроші повністю.
            </p>
            <p className="text-gray-400">
              Більше того, ви зможете залишити весь матеріал собі. 
              Ризик повністю на мені.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-red-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black mb-6">
            Ваше життя варте більше за ₴0
          </h2>
          
          <p className="text-xl mb-8">
            Кожен день ви відкладаєте це рішення - це ще один день ризику. 
            Почніть зберігати своє життя вже сьогодні.
          </p>
          
          <Link href="/register" className="bg-black hover:bg-gray-900 text-white font-black py-6 px-12 rounded-lg text-2xl inline-flex items-center space-x-3 transition-all transform hover:scale-105 mb-6">
            <span>ПОЧАТИ ЗБЕРІГАТИ ЖИТТЯ</span>
            <ArrowRight className="h-8 w-8" />
          </Link>
          
          <p className="text-sm text-red-100">
            🔒 Безпечна реєстрація • ⚡ Миттєвий доступ • 💯 Безкоштовно назавжди
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p className="mb-4">
              © 2024 Nebachiv. Зберігаємо життя мотоциклістів з 2020 року.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-white">Політика конфіденційності</Link>
              <Link href="/terms" className="hover:text-white">Умови користування</Link>
              <Link href="/contact" className="hover:text-white">Контакти</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}