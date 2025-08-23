import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MessageCircle, Clock, MapPin, Users } from 'lucide-react'

export default function ContactPage() {
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
              NEBACHIV <span className="text-red-500">КОНТАКТИ</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-red-900/20 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Є питання? <span className="text-red-500">Ми готові допомогти</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Наша команда експертів з мотобезпеки працює 24/7, щоб відповісти 
            на ваші питання та допомогти зберегти ваше життя.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Emergency Support */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center">
              <Phone className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-red-400">Экстрена підтримка</h3>
              <p className="text-gray-300 mb-4">
                Якщо ви потрапили в аварію або маєте невідкладні питання з безпеки
              </p>
              <a href="tel:+380934567890" className="text-red-400 font-bold text-xl hover:text-red-300">
                +38 (093) 456-78-90
              </a>
              <p className="text-xs text-gray-500 mt-2">24/7 • Безкоштовно</p>
            </div>

            {/* General Questions */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Загальні питання</h3>
              <p className="text-gray-300 mb-4">
                Питання про курси, реєстрацію, платежі або технічну підтримку
              </p>
              <a href="mailto:support@nebachiv.com" className="text-blue-400 font-bold text-xl hover:text-blue-300">
                support@nebachiv.com
              </a>
              <p className="text-xs text-gray-500 mt-2">Відповідаємо протягом 2 годин</p>
            </div>

            {/* Community */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <MessageCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Спільнота</h3>
              <p className="text-gray-300 mb-4">
                Приєднуйтеся до нашої спільноти для обговорення та обміну досвідом
              </p>
              <a href="https://t.me/nebachiv" className="text-green-400 font-bold text-xl hover:text-green-300">
                Telegram: @nebachiv
              </a>
              <p className="text-xs text-gray-500 mt-2">Активна спільнота 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              Напишіть нам
            </h2>
            <p className="text-xl text-gray-300">
              Заповніть форму нижче, і ми зв'яжемося з вами протягом години
            </p>
          </div>

          <div className="bg-black border border-gray-800 rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2">
                    Ім'я *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="Ваше повне ім'я"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                    placeholder="+38 (099) 123-45-67"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold mb-2">
                  Тема
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                >
                  <option value="">Оберіть тему</option>
                  <option value="course">Питання про курси</option>
                  <option value="technical">Технічна підтримка</option>
                  <option value="payment">Питання про оплату</option>
                  <option value="partnership">Партнерство</option>
                  <option value="feedback">Відгук або пропозиція</option>
                  <option value="emergency">Екстрена ситуація</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2">
                  Повідомлення *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  placeholder="Опишіть ваше питання детально..."
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105"
                >
                  Надіслати повідомлення
                </button>
                <p className="text-sm text-gray-400 mt-3">
                  ⚡ Гарантована відповідь протягом години
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              Часті питання
            </h2>
            <p className="text-xl text-gray-300">
              Відповіді на найпопулярніші питання про Nebachiv
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-red-400">
                  Скільки коштує навчання?
                </h3>
                <p className="text-gray-300">
                  Перші 100 учнів отримують повний доступ БЕЗКОШТОВНО назавжди. 
                  Після цього вартість становитиме ₴4,900/місяць.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-red-400">
                  Скільки часу займає навчання?
                </h3>
                <p className="text-gray-300">
                  Базові навички безпеки ви отримаєте за 24 години. Повний курс 
                  займає 90 днів при 15-20 хвилинах занять щодня.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-red-400">
                  Чи підходить для початківців?
                </h3>
                <p className="text-gray-300">
                  Так! Система Nebachiv створена як для початківців, так і для 
                  досвідчених мотоциклістів. Кожен знайде щось нове.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-red-400">
                  Є гарантія повернення коштів?
                </h3>
                <p className="text-gray-300">
                  100% гарантія протягом 90 днів. Якщо не станете їздити безпечніше - 
                  повернемо всі гроші без питань.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-red-400">
                  Чи можна навчатися з телефону?
                </h3>
                <p className="text-gray-300">
                  Так! Платформа оптимізована для всіх пристроїв. Навчайтеся 
                  коли зручно - вдома, на роботі, в дорозі.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3 text-red-400">
                  Чи є підтримка після навчання?
                </h3>
                <p className="text-gray-300">
                  Так! Пожиттєвий доступ до спільноти та підтримка експертів 24/7. 
                  Ви ніколи не залишитеся наодинці з питаннями.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Info */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Наша адреса</h3>
              <p className="text-gray-300">
                м. Київ, вул. Хрещатик, 22<br />
                офіс 1205 (12 поверх)
              </p>
            </div>

            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Час роботи</h3>
              <p className="text-gray-300">
                Пн-Пт: 9:00-21:00<br />
                Сб-Нд: 10:00-18:00<br />
                <span className="text-red-400">Екстрена підтримка 24/7</span>
              </p>
            </div>

            <div className="text-center">
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Наша команда</h3>
              <p className="text-gray-300">
                12 експертів з мотобезпеки<br />
                8 інструкторів<br />
                4 техспеціалісти
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-red-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">
            Не відкладайте своє життя на завтра
          </h2>
          <p className="text-xl mb-8">
            Кожен день без правильних знань - це ризик для вашого життя. 
            Почніть навчання прямо зараз.
          </p>
          <Link href="/register" className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 px-8 rounded-lg text-xl inline-block transition-all transform hover:scale-105">
            ЗБЕРЕГТИ СВОЄ ЖИТТЯ ЗАРАЗ
          </Link>
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
              <Link href="/promo" className="hover:text-white">Головна</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}