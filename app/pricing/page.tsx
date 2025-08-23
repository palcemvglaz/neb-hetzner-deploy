'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, X, Star } from 'lucide-react'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Безкоштовний',
      price: 0,
      description: 'Для початківців, які хочуть спробувати',
      features: [
        { text: 'Доступ до базових принципів', included: true },
        { text: '3 безкоштовні уроки', included: true },
        { text: 'Тест "Чи виживеш ти цього сезону"', included: true },
        { text: 'Форум спільноти', included: true },
        { text: 'Повний доступ до курсів', included: false },
        { text: 'Персональний план навчання', included: false },
        { text: 'Сертифікати', included: false },
        { text: 'Підтримка інструктора', included: false },
      ],
      cta: 'Почати безкоштовно',
      highlighted: false,
    },
    {
      name: 'Небачив Pro',
      price: billingPeriod === 'monthly' ? 499 : 399,
      originalPrice: billingPeriod === 'monthly' ? 999 : 799,
      period: billingPeriod === 'monthly' ? '/міс' : '/міс при оплаті за рік',
      description: 'Все необхідне для безпечної їзди',
      features: [
        { text: 'Все з безкоштовного плану', included: true },
        { text: 'Повний доступ до всіх курсів', included: true },
        { text: 'Персональний план навчання', included: true },
        { text: 'Інтерактивні тести та симулятори', included: true },
        { text: 'Відеорозбори реальних аварій', included: true },
        { text: 'Сертифікати про проходження', included: true },
        { text: 'Закритий Telegram-чат', included: true },
        { text: 'Щомісячні онлайн-зустрічі', included: true },
      ],
      cta: 'Обрати Pro',
      highlighted: true,
      badge: 'Найпопулярніший',
    },
    {
      name: 'Мотошкола',
      price: 'За запитом',
      description: 'Для мотошкіл та інструкторів',
      features: [
        { text: 'Все з Pro плану', included: true },
        { text: 'До 50 учнівських акаунтів', included: true },
        { text: 'Адмін-панель для інструкторів', included: true },
        { text: 'Брендування під вашу школу', included: true },
        { text: 'Аналітика прогресу учнів', included: true },
        { text: 'Пріоритетна підтримка', included: true },
        { text: 'Навчання інструкторів', included: true },
        { text: 'Інтеграція з вашими системами', included: true },
      ],
      cta: 'Зв\'язатися з нами',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Інвестуй в свою безпеку</h1>
            <p className="text-xl text-blue-100 mb-8">
              Вартість навчання vs вартість аварії — вибір очевидний
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingPeriod === 'monthly' 
                    ? 'bg-white text-blue-900' 
                    : 'text-white hover:text-blue-200'
                }`}
              >
                Щомісяця
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  billingPeriod === 'yearly' 
                    ? 'bg-white text-blue-900' 
                    : 'text-white hover:text-blue-200'
                }`}
              >
                Щорічно
                <span className="ml-2 text-yellow-400 text-sm">-20%</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                  plan.highlighted 
                    ? 'ring-4 ring-blue-500 transform scale-105' 
                    : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    {plan.badge}
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    {typeof plan.price === 'number' ? (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">{plan.price} ₴</span>
                          {plan.period && (
                            <span className="text-gray-600">{plan.period}</span>
                          )}
                        </div>
                        {plan.originalPrice && (
                          <div className="mt-1">
                            <span className="text-gray-400 line-through">{plan.originalPrice} ₴</span>
                            <span className="ml-2 text-green-600 font-semibold">
                              Економія {plan.originalPrice - plan.price} ₴
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-3xl font-bold">{plan.price}</div>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={plan.name === 'Мотошкола' ? '/contact' : '/register'}
                    className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Comparison */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Порівняйте вартість навчання з наслідками
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  Інвестиція в навчання
                </h3>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>499 ₴/міс за повний доступ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Необмежений доступ до знань</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Постійне оновлення матеріалів</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Підтримка експертів</span>
                  </li>
                </ul>
                <div className="mt-6 text-3xl font-bold text-green-800">
                  5,988 ₴/рік
                </div>
              </div>
              
              <div className="bg-red-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-red-800 mb-4">
                  Вартість однієї аварії
                </h3>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-center gap-2">
                    <X className="w-5 h-5" />
                    <span>Ремонт мотоцикла: 20,000-100,000 ₴</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-5 h-5" />
                    <span>Лікування: 10,000-500,000 ₴</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-5 h-5" />
                    <span>Втрата працездатності</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-5 h-5" />
                    <span>Моральні страждання</span>
                  </li>
                </ul>
                <div className="mt-6 text-3xl font-bold text-red-800">
                  30,000 - ∞ ₴
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Що кажуть наші учні про вартість навчання
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Заплатив за річну підписку менше, ніж коштує один шолом. 
                  Знання, які отримав — безцінні. Вже двічі уникнув аварій завдяки принципам Небачива."
                </p>
                <div className="font-semibold">Максим П.</div>
                <div className="text-sm text-gray-500">Honda CB650R</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Спочатку здавалося дорого. Потім друг потрапив в аварію — 
                  лікування 150,000 грн. Тепер розумію, що 499 грн/міс — це копійки за життя."
                </p>
                <div className="font-semibold">Андрій К.</div>
                <div className="text-sm text-gray-500">Yamaha MT-09</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Часті питання про оплату</h2>
            
            <div className="space-y-4 text-left">
              <details className="bg-gray-50 p-6 rounded-lg">
                <summary className="font-semibold cursor-pointer">
                  Чи можу я скасувати підписку в будь-який час?
                </summary>
                <p className="mt-3 text-gray-600">
                  Так, ви можете скасувати підписку в будь-який момент. 
                  Доступ зберігається до кінця оплаченого періоду.
                </p>
              </details>
              
              <details className="bg-gray-50 p-6 rounded-lg">
                <summary className="font-semibold cursor-pointer">
                  Чи є знижки для студентів?
                </summary>
                <p className="mt-3 text-gray-600">
                  Так, ми надаємо 30% знижку для студентів денної форми навчання. 
                  Напишіть нам на support@nebachiv.com з підтвердженням статусу.
                </p>
              </details>
              
              <details className="bg-gray-50 p-6 rounded-lg">
                <summary className="font-semibold cursor-pointer">
                  Які способи оплати доступні?
                </summary>
                <p className="mt-3 text-gray-600">
                  Ми приймаємо оплату через Stripe (карти Visa/Mastercard), 
                  а також криптовалюту для міжнародних платежів.
                </p>
              </details>
            </div>
            
            <Link 
              href="/faq"
              className="inline-block mt-8 text-blue-600 font-semibold hover:text-blue-700"
            >
              Всі питання та відповіді →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Готові інвестувати в свою безпеку?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Приєднуйтесь до тисяч мотоциклістів, які обрали знання замість ризику
          </p>
          
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-sm mx-auto mb-8">
            <p className="text-yellow-300 font-semibold mb-2">
              🔥 Спеціальна пропозиція
            </p>
            <p className="text-2xl font-bold mb-2">
              Перший місяць за 199 ₴
            </p>
            <p className="text-sm">
              Для нових користувачів • Без прихованих платежів
            </p>
          </div>
          
          <Link 
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all"
          >
            Почати з Pro за 199 ₴
          </Link>
        </div>
      </section>
    </div>
  )
}