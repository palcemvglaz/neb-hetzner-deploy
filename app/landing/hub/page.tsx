'use client'

import Link from 'next/link'

export default function LandingHub() {
  const landingPages = [
    {
      title: "📧 TEASER MAIN",
      description: "Email capture в стилі головного лендінга з мінімумом тексту",
      href: "/teaser",
      color: "bg-purple-500 hover:bg-purple-600",
      features: ["Швидкий email capture", "Стиль головного лендінга", "Trust elements", "Success states"]
    },
    {
      title: "⚡ TEASER SHORT",
      description: "Ультра-короткий teaser з максимальним фокусом на action",
      href: "/teaser/short",
      color: "bg-pink-500 hover:bg-pink-600",
      features: ["Мінімум тексту", "Одна CTA", "Емоційний заголовок", "Instant action"]
    },
    {
      title: "📊 TEASER STATS",
      description: "Фокус на статистиці та доказах ефективності",
      href: "/teaser/stats",
      color: "bg-cyan-500 hover:bg-cyan-600",
      features: ["Анімовані лічильники", "Візуальна статистика", "Data-driven", "Proof focused"]
    },
    {
      title: "🔥 HORMOZI STYLE",
      description: "Агресивний лендінг в стилі Alex Hormozi з конкретними офертами та гарантіями",
      href: "/landing/hormozi",
      color: "bg-nebachiv-orange hover:bg-nebachiv-orange",
      features: ["Конкретні ціни", "Urgency & Scarcity", "100% гарантія", "Strong CTAs"]
    },
    {
      title: "🏔️ NEBACHIV ALPINE",
      description: "Елегантний дизайн з фокусом на безпеку та експертність",
      href: "/landing/nebachiv-alpine",
      color: "bg-nebachiv-blue hover:bg-nebachiv-blue",
      features: ["Професійний вигляд", "Анімації", "Статистика", "Відгуки"]
    },
    {
      title: "🎯 NEBACHIV MAIN",
      description: "Основна лендінг сторінка з повною інформацією про продукт",
      href: "/landing/nebachiv",
      color: "bg-orange-500 hover:bg-orange-600",
      features: ["8 принципів", "Детальний опис", "FAQ", "Testimonials"]
    },
    {
      title: "🚀 PROMO LANDING",
      description: "Промо сторінка з фокусом на український ринок та локальні переваги",
      href: "/landing/promo",
      color: "bg-green-500 hover:bg-green-600",
      features: ["Українська ідентичність", "Соціальні докази", "Емоційний зв'язок"]
    },
    {
      title: "🎨 MODERN 2025",
      description: "Сучасний дизайн з трендовими елементами та інтерактивністю",
      href: "/landing/modern2025",
      color: "bg-purple-500 hover:bg-purple-600",
      features: ["Сучасний UI", "Інтерактивність", "Responsive", "Gradient Design"]
    },
    {
      title: "🍎 APPLE STYLE",
      description: "Мінімалістичний дизайн в стилі Apple з фокусом на продукт",
      href: "/landing/apple",
      color: "bg-gray-500 hover:bg-gray-600",
      features: ["Мінімалізм", "Якісні зображення", "Чистий дизайн", "Premium feel"]
    },
    {
      title: "🎪 RIDEICON STYLE",
      description: "Яскравий та енергійний дизайн для молодої аудиторії",
      href: "/landing/rideicon",
      color: "bg-yellow-500 hover:bg-yellow-600",
      features: ["Яскраві кольори", "Молодіжний стиль", "Відео контент", "Динамічність"]
    },
    {
      title: "💻 ASCII / RETRO",
      description: "Ретро стиль з ASCII елементами для технічної аудиторії",
      href: "/landing/ascii",
      color: "bg-green-800 hover:bg-green-900",
      features: ["Ретро дизайн", "ASCII арт", "Технічний стиль", "Нестандартний підхід"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            🎯 LANDING PAGES HUB
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Колекція різних лендінг сторінок для тестування конверсії та A/B тестів. 
            Кожна сторінка має свій унікальний підхід та цільову аудиторію.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 rounded-lg p-6 text-center shadow-sm border border-gray-800">
            <div className="text-3xl font-bold text-nebachiv-blue mb-2">{landingPages.length}</div>
            <div className="text-gray-600">Landing Pages</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center shadow-sm border border-gray-800">
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <div className="text-gray-600">Different Styles</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center shadow-sm border border-gray-800">
            <div className="text-3xl font-bold text-purple-600 mb-2">A/B</div>
            <div className="text-gray-600">Testing Ready</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 text-center shadow-sm border border-gray-800">
            <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-gray-600">Mobile Responsive</div>
          </div>
        </div>

        {/* Landing Pages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {landingPages.map((page, index) => (
            <div key={index} className="bg-gray-900 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-800">
              <div className={`${page.color} text-white p-6`}>
                <h3 className="text-2xl font-bold mb-2">{page.title}</h3>
                <p className="text-white/90">{page.description}</p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-200 mb-2">Основні особливості:</h4>
                  <ul className="space-y-1">
                    {page.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link 
                  href={page.href}
                  className="inline-block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Переглянути Landing →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-12">
          <h3 className="text-lg font-bold text-nebachiv-blue/20 mb-2">
            📊 Performance Testing
          </h3>
          <p className="text-blue-800 mb-4">
            Кожна лендінг сторінка оптимізована для різних цілей та аудиторій. 
            Використовуйте Google Analytics та A/B тести для визначення найкращої конверсії.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Conversion Focus:</strong>
              <br />Hormozi, Nebachiv Main
            </div>
            <div>
              <strong>Brand Awareness:</strong>
              <br />Apple, Modern 2025
            </div>
            <div>
              <strong>Niche Targeting:</strong>
              <br />ASCII, Rideicon
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            💡 <strong>Tip:</strong> Тестуйте різні лендінги на різних джерелах трафіку для максимальної конверсії
          </p>
        </div>
      </div>
    </div>
  )
}