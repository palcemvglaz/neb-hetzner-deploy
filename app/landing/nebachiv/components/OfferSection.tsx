'use client';

import { Button } from '@/components/ui/button';
import WaitlistForm from './WaitlistForm';

interface OfferSectionProps {
  version: 'ukrainian' | 'hormozi';
}

export default function OfferSection({ version }: OfferSectionProps) {
  const packages = [
    {
      name: version === 'hormozi' ? 'БЕЗКОШТОВНИЙ ТЕСТ СМЕРТІ' : 'Безкоштовний тест',
      price: '₴0',
      originalPrice: null,
      description: version === 'hormozi' 
        ? 'Дізнайся чи ВИЖИВЕШ ти на дорозі' 
        : 'Оцінка рівня безпеки їзди',
      features: [
        '7-хвилинний тест на виживання',
        'Персональна оцінка ризиків',
        'Рекомендації по покращенню',
        'Доступ до базової спільноти'
      ],
      cta: version === 'hormozi' ? 'ПРОЙТИ ТЕСТ ЗАРАЗ' : 'Пройти тест',
      popular: false
    },
    {
      name: version === 'hormozi' ? 'СИСТЕМА НЕВБИВНОСТІ' : 'Повний курс',
      price: '₴9,997',
      originalPrice: '₴49,997',
      description: version === 'hormozi'
        ? 'ПОВНА трансформація за 90 днів'
        : 'Комплексна система навчання',
      features: [
        'База знань з 12,000+ аварій',
        '8 принципів виживання',
        'Персональна карта небезпек',
        'Спільнота 24/7',
        'Гаряча лінія підтримки',
        'Пожиттєві оновлення',
        '90-денна гарантія'
      ],
      cta: version === 'hormozi' ? 'ВРЯТУВАТИ ЖИТТЯ ₴9,997' : 'Замовити курс',
      popular: true
    },
    {
      name: version === 'hormozi' ? 'ЕЛІТА НЕВБИВНИХ' : 'VIP програма',
      price: '₴49,997',
      originalPrice: null,
      description: version === 'hormozi'
        ? 'Стань МЕНТОРОМ для інших'
        : 'Персональний коучинг',
      features: [
        'Все з попереднього пакету',
        'Персональний коучинг від Небачіва',
        'Закриті треки для тренувань',
        'Можливість стати інструктором',
        'Участь у франшизі',
        'Пріоритетна підтримка'
      ],
      cta: version === 'hormozi' ? 'СТАТИ НЕВБИВНИМ' : 'VIP доступ',
      popular: false
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold text-white mb-6 ${
            version === 'hormozi' ? 'text-nebachiv-orange' : ''
          }`}>
            {version === 'hormozi'
              ? 'ОБЕРИ: ЖИТТЯ ЗА ₴9,997 АБО СМЕРТЬ ЗА ₴0'
              : 'Обери свій рівень навчання'
            }
          </h2>
          
          {version === 'hormozi' ? (
            <div className="bg-nebachiv-orange/20 border-2 border-nebachiv-orange p-6 rounded-lg max-w-4xl mx-auto mb-8">
              <p className="text-xl text-nebachiv-orange-light font-bold">
                ⚠️ УВАГА: Ціна твого життя = ₴9,997. Ціна твоїх похорон = ₴50,000. 
                Математика проста.
              </p>
            </div>
          ) : (
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Виберіть програму навчання що відповідає вашим потребам та досвіду
            </p>
          )}
        </div>

        {/* Packages grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-lg ${
                pkg.popular
                  ? version === 'hormozi'
                    ? 'bg-nebachiv-orange/20 border-2 border-nebachiv-orange transform scale-105'
                    : 'bg-nebachiv-blue/20 border-2 border-nebachiv-blue transform scale-105'
                  : 'bg-gray-800 border border-gray-700'
              }`}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold ${
                  version === 'hormozi'
                    ? 'bg-nebachiv-orange text-white'
                    : 'bg-nebachiv-blue text-white'
                }`}>
                  {version === 'hormozi' ? '🔥 НАЙПОПУЛЯРНІШЕ' : '⭐ Рекомендуємо'}
                </div>
              )}

              {/* Package header */}
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold text-white mb-2 ${
                  version === 'hormozi' ? 'text-nebachiv-orange' : ''
                }`}>
                  {pkg.name}
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  {pkg.originalPrice && (
                    <span className="text-gray-500 line-through">{pkg.originalPrice}</span>
                  )}
                  <span className={`text-3xl font-bold ${
                    pkg.popular
                      ? version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
                      : 'text-white'
                  }`}>
                    {pkg.price}
                  </span>
                </div>
                <p className="text-gray-300 mt-2">{pkg.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className={`mt-1 ${
                      pkg.popular
                        ? version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
                        : 'text-nebachiv-blue/200'
                    }`}>
                      ✅
                    </span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={`w-full py-4 text-lg font-bold ${
                  pkg.popular
                    ? version === 'hormozi'
                      ? 'bg-nebachiv-orange hover:bg-nebachiv-orange/80 animate-pulse'
                      : 'bg-nebachiv-blue hover:bg-nebachiv-blue/80'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {pkg.cta}
              </Button>

              {/* Guarantee */}
              {pkg.popular && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    {version === 'hormozi'
                      ? '🛡️ ПОТРІЙНА ГАРАНТІЯ: Результат АБО гроші назад'
                      : '🛡️ 90-денна гарантія повернення коштів'
                    }
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Urgency section */}
        {version === 'hormozi' && (
          <div className="mt-16 bg-black border-2 border-nebachiv-orange p-8 rounded-lg text-center">
            <h3 className="text-3xl font-bold text-nebachiv-orange mb-4">
              ⏰ ОСТАННЄ ПОПЕРЕДЖЕННЯ:
            </h3>
            <p className="text-xl text-white mb-6">
              Залишилось ТІЛЬКИ 23 місця зі знижкою -80%. 
              Завтра ціна повертається до ₴49,997.
            </p>
            <p className="text-nebachiv-orange-light font-bold">
              Поки ти ДУМАЄШ - хтось ДІЄТЬСЯ і ВИЖИВАЄ. 
              Поки ти ВІДКЛАДАЄШ - хтось ПОМИРАЄ.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}