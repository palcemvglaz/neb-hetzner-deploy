import Link from 'next/link'

const pages = [
  { category: 'Промо сайт', pages: [
    { name: 'Головна', url: '/', description: 'Hormozi-стиль лендінг' },
    { name: 'Про проект', url: '/about', description: 'Місія, команда, KB_NEB система' },
    { name: 'Ціни', url: '/pricing', description: 'Тарифи та підписки' },
    { name: 'FAQ', url: '/faq', description: 'Часті питання' },
    { name: 'Історії успіху', url: '/testimonials', description: 'Відгуки та історії учнів' },
    { name: 'Контакти', url: '/contact', description: 'Зв\'язок з нами' },
  ]},
  { category: 'Авторизація', pages: [
    { name: 'Вхід', url: '/login', description: 'Вхід для користувачів' },
    { name: 'Реєстрація', url: '/register', description: 'Створення нового акаунту' },
  ]},
  { category: 'Користувач', pages: [
    { name: 'Дашборд', url: '/dashboard', description: 'Особистий кабінет' },
    { name: 'Профіль', url: '/profile', description: 'Досягнення та сертифікати' },
    { name: 'Курси', url: '/courses', description: 'Список доступних курсів з пошуком' },
    { name: 'Тести', url: '/tests', description: 'Перевірка знань' },
  ]},
  { category: 'Правові документи', pages: [
    { name: 'Умови використання', url: '/terms', description: 'Правила платформи' },
    { name: 'Політика конфіденційності', url: '/privacy', description: 'Захист даних' },
  ]},
  { category: 'Адмін панель', pages: [
    { name: 'Адмін дашборд', url: '/admin', description: 'Головна адмін панелі' },
    { name: 'Користувачі', url: '/admin/users', description: 'Управління користувачами' },
    { name: 'Контент', url: '/admin/content', description: 'Управління контентом' },
    { name: 'Тести', url: '/admin/tests', description: 'Управління тестами' },
    { name: 'Мотошколи', url: '/admin/schools', description: 'Управління школами' },
    { name: 'KB_NEB синхронізація', url: '/admin/kb-neb', description: 'Імпорт контенту' },
    { name: 'Аналітика', url: '/admin/analytics', description: 'Статистика платформи' },
    { name: 'Налаштування', url: '/admin/settings', description: 'Системні налаштування' },
  ]},
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Карта сайту Nebachiv</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {pages.map((category) => (
            <div key={category.category} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">{category.category}</h2>
              <div className="grid gap-3">
                {category.pages.map((page) => (
                  <Link
                    key={page.url}
                    href={page.url}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {page.name}
                      </span>
                      <span className="text-gray-500 ml-2 text-sm">
                        {page.description}
                      </span>
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-600">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Тестові акаунти для входу:
          </p>
          <div className="inline-block text-left bg-gray-100 p-4 rounded-lg">
            <p><strong>Учень:</strong> student@test.com / password123</p>
            <p><strong>Адмін:</strong> admin@test.com / password123</p>
            <p><strong>Мотошкола:</strong> school@test.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}