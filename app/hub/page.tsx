import Link from 'next/link'

export default function Hub() {
  const hormoziMaterials = [
    {
      title: "🚀 GROWTH STRATEGY",
      description: "Hormozi магічна формула росту для Nebachiv",
      href: "/vault/marketing_data/HORMOZI_GROWTH_STRATEGY.md",
      internal: true,
      color: "bg-nebachiv-orange hover:bg-nebachiv-orange",
      features: ["YouTube → $7 → $297 → $2,997", "200 телефонів/тиждень", "$100K MRR в 6 місяців", "Partner школи"]
    },
    {
      title: "💰 STACK CLOSE",
      description: "Digital продукт система без персонального коучингу",
      href: "/vault/marketing_data/hormozi_stack_close.md", 
      internal: true,
      color: "bg-green-500 hover:bg-green-600",
      features: ["$13,000 → $2,997 stack", "Triple guarantee система", "Self-guided навчання", "Автоматизація"]
    },
    {
      title: "🏆 ACHIEVEMENTS SYSTEM",
      description: "160+ achievements трансформують страхи в тріумфи",
      href: "/vault/marketing_data/achievements_system.md",
      internal: true,
      color: "bg-purple-500 hover:bg-purple-600", 
      features: ["Bronze → Platinum рівні", "Fear → Achievement мапінг", "XP та Badge система", "Gamification"]
    },
    {
      title: "🎯 DIAGNOSTIC SYSTEM", 
      description: "Інтелектуальний онбординг через компетенції",
      href: "/vault/marketing_data/diagnostic_questions.md",
      internal: true,
      color: "bg-nebachiv-blue hover:bg-nebachiv-blue",
      features: ["Quick assessment 2 хв", "Competency mapping", "Персоналізований шлях", "Achievement path"]
    },
    {
      title: "📊 ADVERTISING MATRIX",
      description: "30 страхів новачка → 30 рекламних кампаній", 
      href: "/vault/marketing_data/advertising_fear_matrix.md",
      internal: true,
      color: "bg-orange-500 hover:bg-orange-600",
      features: ["Fear-based маркетинг", "7 систем кластеризації", "A/B тест матриця", "Платформо-специфічні"]
    },
    {
      title: "🗺️ COMPETENCY MAP V2",
      description: "Вдосконалена карта компетенцій з зонами та пріоритетами",
      href: "/vault/marketing_data/rider_competency_map_v2.md", 
      internal: true,
      color: "bg-indigo-500 hover:bg-indigo-600",
      features: ["Red/Yellow/Green зони", "36 критичних компетенцій", "Fear → Problem мапінг", "Diagnostic інтеграція"]
    }
  ]

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
    },
    {
      title: "🛡️ FEARFUL NOVICE",
      description: "Персоналізований лендінг для обережних новачків з поетапним підходом",
      href: "/fearful-novice",
      color: "bg-green-600 hover:bg-green-700",
      features: ["Зелені акценти", "Підтримуючий тон", "Поетапно", "Подолання страхів"]
    },
    {
      title: "📊 TECHNICAL RATIONALIST",
      description: "Data-driven лендінг для аналітиків з MAIDS статистикою",
      href: "/technical-rationalist",
      color: "bg-nebachiv-blue hover:bg-nebachiv-blue/80",
      features: ["Сині акценти", "Точні дані", "921 аварія MAIDS", "Наукові факти"]
    },
    {
      title: "💜 EMOTIONAL SEEKER",
      description: "Емоційний лендінг для шукачів спільноти з фокусом на підтримку",
      href: "/emotional-seeker",
      color: "bg-purple-600 hover:bg-purple-700",
      features: ["Фіолетові акценти", "Емодзі", "Спільнота 698", "Емоційна підтримка"]
    },
    {
      title: "🎯 COMBINED ARCHETYPE",
      description: "Універсальний підхід для всіх типів особистості з адаптивною системою",
      href: "/combined-archetype",
      color: "bg-gradient-to-r from-nebachiv-blue via-purple-600 to-green-600",
      features: ["Градієнт кольорів", "Адаптивність", "Всі підходи", "360° розвиток"]
    },
    {
      title: "📄 PAGE V2 OPTIMIZED",
      description: "Оптимізована версія головної сторінки (8 блоків замість 13)",
      href: "/page-v2",
      color: "bg-gray-600 hover:bg-gray-700",
      features: ["8 блоків", "Реальні дані", "Оптимізована", "Instagram insights"]
    },
    {
      title: "🌟 TESTIMONIALS HUB",
      description: "Сторінка з реальними відгуками з YouTube каналу Небачив",
      href: "/hub/testimonials",
      color: "bg-yellow-600 hover:bg-yellow-700",
      features: ["12 testimonials", "750+ проаналізовано", "Реальні історії", "Life-saving"]
    },
    {
      title: "🟢 MATRIX CHOICE",
      description: "Matrix-стиль лендінг з бінарним вибором між усвідомленістю та вдачею",
      href: "/matrix",
      color: "bg-green-800 hover:bg-green-900",
      features: ["Matrix rain effect", "Бінарний вибір", "Позиціонування Ogilvy", "Red/Blue pills"]
    },
    {
      title: "💻 TEASER MATRIX",
      description: "Мінімалістичний Matrix-style teaser для швидкого email capture",
      href: "/teaser/matrix",
      color: "bg-green-700 hover:bg-green-800",
      features: ["Terminal interface", "Matrix rain", "Typing animation", "Minimal text"]
    },
    {
      title: "🖥️ PAGE V2 MATRIX",
      description: "Повноцінний інтерактивний Matrix лендінг з меню навігації",
      href: "/page-v2/matrix",
      color: "bg-green-600 hover:bg-green-700",
      features: ["Interactive menu", "Multiple screens", "Terminal UI", "Full content"]
    },
    {
      title: "🎬 MATRIX + VIDEO OVERLAY",
      description: "Відео бекграунд з постійним Matrix rain overlay ефектом",
      href: "/teaser/matrix-overlay",
      color: "bg-emerald-700 hover:bg-emerald-800",
      features: ["Video + Matrix", "Adjustable intensity", "Mix blend mode", "Green terminal style"]
    },
    {
      title: "⏱️ MATRIX TRANSITION",
      description: "Спочатку чисте відео, потім поступово з'являється Matrix",
      href: "/teaser/matrix-transition",
      color: "bg-teal-700 hover:bg-teal-800",
      features: ["3s delay", "Gradual transition", "Style morphing", "Auto activation"]
    },
    {
      title: "⚡ MATRIX GLITCH",
      description: "Періодичні Matrix glitch ефекти кожні 10-15 секунд",
      href: "/teaser/matrix-glitch",
      color: "bg-lime-700 hover:bg-lime-800",
      features: ["Glitch effects", "Color distortion", "Manual trigger", "Random intervals"]
    },
    {
      title: "👁️ RIDER SAFETY",
      description: "Проактивна безпека через ієрархію критичних компетенцій",
      href: "/landing/rider-safety",
      color: "bg-gradient-to-r from-nebachiv-orange to-orange-600",
      features: ["Ієрархія навичок", "Інтерактивний тест", "30-денна програма", "Порочне коло страху"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            🎯 NEBACHIV CONTENT HUB
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Централізований хаб всіх маркетингових матеріалів, лендінг сторінок та Hormozi-inspired стратегій.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-nebachiv-orange mb-2">{hormoziMaterials.length}</div>
            <div className="text-gray-600">Hormozi Materials</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-nebachiv-blue mb-2">{landingPages.length}</div>
            <div className="text-gray-600">Landing Pages</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">$100K</div>
            <div className="text-gray-600">MRR Target</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">160+</div>
            <div className="text-gray-600">Achievements</div>
          </div>
        </div>

        {/* HORMOZI SECTION */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-nebachiv-orange to-orange-500 text-white px-6 py-3 rounded-full">
              <h2 className="text-2xl font-bold">🚀 HORMOZI GROWTH SYSTEM</h2>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-nebachiv-orange/20 mb-2">
                📊 Value Formula: (Dream Outcome × Perceived Likelihood) ÷ (Time × Effort)
              </h3>
              <p className="text-red-800">
                Від "Боюсь виїхати" до "Впевнений міський райдер" за 30 днів замість 6-12 місяців
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm text-nebachiv-orange/20">
              <div className="bg-white/50 rounded-lg p-4">
                <strong>💰 Revenue Ladder:</strong><br />
                Free → $7 → $297 → $2,997 → $4,997
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <strong>🎯 Target Metrics:</strong><br />
                200 phones/week → $100K MRR in 6 months
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <strong>⚡ Quick Wins:</strong><br />
                YouTube → SMS → Phone calls → Sales
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hormoziMaterials.map((material, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                <div className={`${material.color} text-white p-6`}>
                  <h3 className="text-xl font-bold mb-2">{material.title}</h3>
                  <p className="text-white/90 text-sm">{material.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Ключові компоненти:</h4>
                    <ul className="space-y-1">
                      {material.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {material.internal ? (
                    <Link 
                      href={material.href}
                      className="inline-block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Відкрити файл →
                    </Link>
                  ) : (
                    <a 
                      href={material.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Відкрити файл →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LANDING PAGES SECTION */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-nebachiv-blue to-purple-500 text-white px-6 py-3 rounded-full">
              <h2 className="text-2xl font-bold">🎯 LANDING PAGES COLLECTION</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {landingPages.map((page, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className={`${page.color} text-white p-6`}>
                <h3 className="text-2xl font-bold mb-2">{page.title}</h3>
                <p className="text-white/90">{page.description}</p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Основні особливості:</h4>
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