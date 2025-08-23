import Link from 'next/link'
import { Star, ArrowLeft, Shield, Clock, Trophy, TrendingUp } from 'lucide-react'

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "Олександр Коваленко",
      location: "м. Київ",
      experience: "15 років водіння",
      avatar: "ОК",
      rating: 5,
      text: "Їздив мотоциклом 15 років і думав, що знаю все. Після курсу Nebachiv зрозумів - я нічого не знав про справжню безпеку. За місяць навчання уникнув 3 потенційно смертельних ситуацій, які раніше навіть не помітив би.",
      result: "Уникнув 3 аварій за місяць",
      timeframe: "Результат за 4 тижні"
    },
    {
      id: 2,
      name: "Марина Петренко",
      location: "м. Львів",
      experience: "2 роки водіння",
      avatar: "МП",
      rating: 5,
      text: "Як початківець, боялася їздити в місті. Система Nebachiv дала мені впевненість і навички, яких не дає жодна автошкола. Тепер їжджу спокійно навіть у щільному трафіку.",
      result: "З страху до впевненості",
      timeframe: "Зміни за 2 тижні"
    },
    {
      id: 3,
      name: "Дмитро Сидоренко",
      location: "м. Харків",
      experience: "8 років водіння",
      avatar: "ДС",
      rating: 5,
      text: "Мав 2 аварії за останні роки. Думав, що це нормально для мотоцикліста. Nebachiv показав, що аварії - це не випадковість, а результат помилок, яких можна уникнути. Вже півроку їжджу без інцидентів.",
      result: "0 аварій за 6 місяців",
      timeframe: "Повна зміна підходу"
    },
    {
      id: 4,
      name: "Анна Мельник",
      location: "м. Одеса",
      experience: "1 рік водіння",
      avatar: "АМ",
      rating: 5,
      text: "Батьки були проти мотоцикла через безпеку. Після того, як показала їм сертифікат Nebachiv і пояснила систему безпеки, яку вивчила, вони заспокоїлися. Тепер підтримують моє захоплення.",
      result: "Підтримка родини",
      timeframe: "Довіра протягом місяця"
    },
    {
      id: 5,
      name: "Роман Іваненко",
      location: "м. Дніпро",
      experience: "5 років водіння",
      avatar: "РІ",
      rating: 5,
      text: "Після серйозної аварії боявся сідати на мотоцикл. Nebachiv не просто повернув мені впевненість - дав розуміння того, як уникнути подібного в майбутньому. Тепер їжджу ще більше і з повним спокоєм.",
      result: "Повернення після травми",
      timeframe: "Реабілітація за 3 місяці"
    },
    {
      id: 6,
      name: "Сергій Бондаренко",
      location: "м. Вінниця",
      experience: "10 років водіння",
      avatar: "СБ",
      rating: 5,
      text: "Працюю інструктором мотошколи і думав, що знаю все про безпеку. Nebachiv відкрив очі на десятки помилок, які роблю я і мої учні. Тепер використовую цю систему у своєму навчанні.",
      result: "Покращив навчання учнів",
      timeframe: "Нові методи за тиждень"
    }
  ]

  const stats = [
    { label: "Життів збережено", value: "1,247+", icon: Shield },
    { label: "Середній час результату", value: "23 дні", icon: Clock },
    { label: "Рівень задоволеності", value: "94%", icon: Trophy },
    { label: "Зменшення ризику", value: "87%", icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/promo" className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Назад до головної</span>
            </Link>
            <div className="text-2xl font-black">
              NEBACHIV <span className="text-red-500">TESTIMONIALS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-red-900/20 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Реальні історії <span className="text-red-500">збережених життів</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Кожна історія - це реальна людина, яка змінила своє ставлення до безпеки 
            та уникнула трагедії завдяки системі Nebachiv.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-3xl font-black text-red-500">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500/30 transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-400">{testimonial.location}</p>
                      <p className="text-xs text-gray-500">{testimonial.experience}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-gray-300 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Results */}
                <div className="border-t border-gray-800 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-green-400">{testimonial.result}</div>
                      <div className="text-xs text-gray-500">{testimonial.timeframe}</div>
                    </div>
                    <div className="text-2xl">✅</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-red-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">
            Станьте наступною історією успіху
          </h2>
          <p className="text-xl mb-8">
            Приєднайтеся до 1,247+ мотоциклістів, які вже зберегли своє життя 
            завдяки системі Nebachiv.
          </p>
          <Link href="/register" className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 px-8 rounded-lg text-xl inline-block transition-all transform hover:scale-105">
            ПОЧАТИ БЕЗКОШТОВНО
          </Link>
          <p className="text-sm mt-4 text-red-200">
            ⚡ Миттєвий доступ • 💳 Без кредитної картки • 🔒 100% гарантія
          </p>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Довіряють експерти галузі</h3>
            <p className="text-gray-400">
              Система Nebachiv рекомендована провідними мотошколами України
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-bold mb-2">Нагорода "Безпека року"</h4>
              <p className="text-sm text-gray-400">
                Асоціація мотоциклістів України, 2023
              </p>
            </div>
            
            <div className="p-6">
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-bold mb-2">Офіційно рекомендовано</h4>
              <p className="text-sm text-gray-400">
                15+ провідними мотошколами країни
              </p>
            </div>
            
            <div className="p-6">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold mb-2">Наукове обґрунтування</h4>
              <p className="text-sm text-gray-400">
                Дослідження КПІ ім. Сікорського, 2024
              </p>
            </div>
          </div>
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