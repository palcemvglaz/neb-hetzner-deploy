'use client';

import React from 'react';
import Link from 'next/link';

// Landing pages data
const landingPages = [
  {
    id: 'nebachiv-main',
    title: 'Nebachiv Main Landing',
    path: '/landing/nebachiv',
    description: 'Основний лендінг платформи з українською версією',
    features: ['750+ testimonials', 'Waitlist форма', 'Модульна структура'],
    status: 'production',
    facts: ['88% ДТП через людський фактор', '2.3x ризик новачків', '92% помилки гальмування']
  },
  {
    id: 'nebachiv-hormozi',
    title: 'Nebachiv Hormozi Version',
    path: '/landing/nebachiv/hormozi',
    description: 'Агресивний маркетинг в стилі Alex Hormozi',
    features: ['High-pressure copy', 'Scarcity tactics', 'Grand Slam Offer'],
    status: 'production',
    facts: ['MAIDS дослідження', 'Реальні testimonials', 'Шокуюча статистика']
  },
  {
    id: 'nebachiv-trailer',
    title: 'Nebachiv Trailer',
    path: '/landing/nebachiv/trailer',
    description: 'Мінімалістичний трейлер з Apple естетикою',
    features: ['Scroll flow', 'Premium typography', 'Subtle animations'],
    status: 'production',
    facts: ['Топ відгуки', 'Елегантний дизайн', 'Mobile-first']
  },
  {
    id: 'edtech',
    title: 'EdTech Investment Landing',
    path: '/landing/edtech',
    description: 'Лендінг для інвесторів та партнерів',
    features: ['Tech stack A+', 'Market analysis', 'Financial projections'],
    status: 'production',
    facts: ['₴120M ARR потенціал', 'Production-ready', 'KB_NEB AI система']
  },
  {
    id: 'promo',
    title: 'Promo Landing',
    path: '/landing/promo',
    description: 'Промо сторінка з waitlist',
    features: ['Категоризовані testimonials', 'Email capture', 'Social proof'],
    status: 'production',
    facts: ['MAIDS статистика', 'Реальні метрики', 'Verified data']
  },
  {
    id: 'rideicon',
    title: 'RideIcon Style',
    path: '/landing/rideicon',
    description: 'Стильний лендінг з градієнтами',
    features: ['Modern design', 'Gradient effects', 'Interactive stats'],
    status: 'experimental',
    facts: ['Visual appeal', 'Animation heavy', 'Desktop focused']
  },
  {
    id: 'modern2025',
    title: 'Modern 2025',
    path: '/landing/modern2025',
    description: 'Сучасний дизайн 2025',
    features: ['Latest trends', 'Minimalist UI', 'Fast loading'],
    status: 'experimental',
    facts: ['Next-gen design', 'Performance optimized', 'Future-proof']
  },
  {
    id: 'ascii',
    title: 'ASCII Landing',
    path: '/landing/ascii',
    description: 'Унікальний ASCII-art лендінг',
    features: ['Terminal style', 'Retro design', 'Unique UX'],
    status: 'experimental',
    facts: ['Creative approach', 'Developer-friendly', 'Memorable']
  },
  {
    id: 'apple',
    title: 'Apple Style',
    path: '/landing/apple',
    description: 'Premium дизайн в стилі Apple',
    features: ['Clean design', 'Premium feel', 'Smooth animations'],
    status: 'experimental',
    facts: ['Minimalist', 'High-end feel', 'Brand focused']
  },
  {
    id: 'nebachiv-roosh',
    title: 'Nebachiv Roosh Style',
    path: '/landing/nebachiv-roosh',
    description: 'Мінімалістичний лендінг в стилі Roosh.tech',
    features: ['Tech-inspired', 'Clean typography', 'Partner logos', 'Modular design'],
    status: 'production',
    facts: ['Мотошкола → керування', 'Nebachiv → виживання', '921 ДТП MAIDS', '237+ врятованих']
  },
  {
    id: 'nebachiv-alpine',
    title: 'Nebachiv Alpine Style', 
    path: '/landing/nebachiv-alpine',
    description: 'Мотоекіпірування стиль як Alpinestars',
    features: ['Racing aesthetic', 'Hero slider', 'Gear categories', 'Visual storytelling'],
    status: 'production',
    facts: ['8 помилок гальмування', 'Критичні моменти', 'Система позиціонування', 'Спільнота райдерів']
  }
];

export default function LandingDirectory() {
  const productionLandings = landingPages.filter(l => l.status === 'production');
  const experimentalLandings = landingPages.filter(l => l.status === 'experimental');

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">🚀 Landing Pages Directory</h1>
              <p className="text-gray-600 mt-2">Всі маркетингові лендінги Nebachiv платформи</p>
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <span className="font-medium">✅ Оновлено реальними фактами з MAIDS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Facts Banner */}
        <div className="bg-nebachiv-blue/20 border-2 border-nebachiv-blue-light rounded-xl p-6 mb-12">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">📊 Ключові факти для всіх лендінгів (MAIDS Study)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-indigo-600">88%</div>
              <div className="text-sm text-gray-600">ДТП через людський фактор</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-nebachiv-orange">2.3x</div>
              <div className="text-sm text-gray-600">Вищий ризик у новачків</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">1,999</div>
              <div className="text-sm text-gray-600">Реальних ДТП проаналізовано</div>
            </div>
          </div>
        </div>

        {/* Production Landings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎯 Production Landing Pages
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {productionLandings.map((landing) => (
              <div key={landing.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{landing.title}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    PRODUCTION
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{landing.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {landing.features.map((feature, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Використані факти:</h4>
                  <div className="space-y-1">
                    {landing.facts.map((fact, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-center">
                        <span className="text-green-500 mr-1">✓</span>
                        {fact}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link 
                    href={landing.path}
                    className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Відкрити лендінг
                  </Link>
                  <a 
                    href={`/docs/LANDING_PAGES_UPDATE_REPORT.md#${landing.id}`}
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Звіт змін
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experimental Landings */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🧪 Experimental Landing Pages
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {experimentalLandings.map((landing) => (
              <div key={landing.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{landing.title}</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                    EXPERIMENTAL
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{landing.description}</p>
                
                <Link 
                  href={landing.path}
                  className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Переглянути
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Documentation Links */}
        <section className="mt-12 bg-gray-100 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Документація</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a 
              href="/docs/LANDING_PAGES_UPDATE_REPORT.md"
              className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">📊 Звіт оновлення лендінгів</h3>
              <p className="text-gray-600">Детальний звіт про заміну вигаданих цифр реальними фактами</p>
            </a>
            <a 
              href="/Users/chyngys/scripts/kb_neb/vault_output/marketing_data/FACTS_FOR_MARKETING.md"
              className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-2">📈 Факти для маркетингу</h3>
              <p className="text-gray-600">Всі перевірені факти з MAIDS дослідження для використання</p>
            </a>
          </div>
        </section>

        {/* Server Check Reminder */}
        <div className="mt-8 text-center text-gray-500">
          <p>🖥️ Переконайтесь що сервер працює на порту 3205 перед відкриттям лендінгів</p>
        </div>
      </main>
    </div>
  );
}