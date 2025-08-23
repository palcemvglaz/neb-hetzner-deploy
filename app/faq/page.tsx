'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

const faqCategories = [
  {
    title: 'Початок роботи',
    icon: '🚀',
    questions: [
      {
        q: 'Що таке Небачив і як це працює?',
        a: 'Небачив — це освітня платформа для мотоциклістів, яка навчає принципам безпечної їзди на основі аналізу реальних аварій. Ми використовуємо систему KB_NEB з 8 базовими принципами, які дозволяють передбачати та уникати небезпечних ситуацій на дорозі.'
      },
      {
        q: 'Чим Небачив відрізняється від мотошколи?',
        a: 'Мотошкола вчить керувати мотоциклом та правилам дорожнього руху. Небачив вчить виживати на дорозі — передбачати небезпеку, розуміти поведінку водіїв, правильно позиціонуватися та реагувати в критичних ситуаціях. Це доповнення до мотошколи, а не заміна.'
      },
      {
        q: 'Скільки часу потрібно на навчання?',
        a: 'Базовий курс з 8 принципів можна пройти за 7 днів, приділяючи 1-2 години щодня. Повний курс з усіма темами та практичними вправами займає 2-3 місяці при регулярних заняттях. Але навіть перші 3 уроки дадуть критично важливі знання.'
      },
      {
        q: 'Чи підходить платформа для початківців?',
        a: 'Так! Більше того, початківцям особливо важливо вивчити принципи Небачива до того, як набратися поганих звичок. Ми маємо спеціальний трек для новачків, який починається з базових концепцій.'
      }
    ]
  },
  {
    title: 'Підписка та оплата',
    icon: '💳',
    questions: [
      {
        q: 'Скільки коштує підписка?',
        a: 'Основний план "Небачив Pro" коштує 499 грн/міс (або 399 грн/міс при річній оплаті). Є безкоштовний план з доступом до базових матеріалів та 3 безкоштовних уроків.'
      },
      {
        q: 'Чи можу я скасувати підписку?',
        a: 'Так, ви можете скасувати підписку в будь-який момент через особистий кабінет. Доступ до платформи зберігається до кінця оплаченого періоду. Повернення коштів можливе протягом 30 днів.'
      },
      {
        q: 'Які способи оплати доступні?',
        a: 'Ми приймаємо: банківські картки Visa/Mastercard через Stripe, Apple Pay, Google Pay. Для юридичних осіб доступна оплата за рахунком.'
      },
      {
        q: 'Чи є знижки для студентів або груп?',
        a: 'Так! Студенти денної форми отримують 30% знижки. Для груп від 5 осіб — 20% знижка. Мотошколи отримують спеціальні умови. Напишіть на support@nebachiv.com для активації знижки.'
      },
      {
        q: 'Що входить в безкоштовний план?',
        a: 'Безкоштовний план включає: доступ до базових принципів безпеки, 3 повних уроки, тест "Чи виживеш ти цього сезону", доступ до форуму спільноти. Цього достатньо, щоб зрозуміти цінність платформи.'
      }
    ]
  },
  {
    title: 'Навчальний процес',
    icon: '📚',
    questions: [
      {
        q: 'Як побудований навчальний процес?',
        a: 'Навчання складається з: теоретичних уроків з відео та текстом, аналізу реальних аварій, інтерактивних тестів, практичних вправ для відпрацювання на дорозі. Ви рухаєтесь в своєму темпі з персональним планом.'
      },
      {
        q: 'Чи потрібен мотоцикл для навчання?',
        a: 'Для теоретичної частини мотоцикл не потрібен — можна вивчати принципи та аналізувати ситуації. Для практичних вправ знадобиться мотоцикл, але багато вправ можна виконувати навіть на парковці.'
      },
      {
        q: 'Як відстежується прогрес?',
        a: 'Платформа автоматично відстежує ваш прогрес: пройдені уроки, результати тестів, витрачений час, виконані вправи. Ви бачите статистику в особистому кабінеті та отримуєте рекомендації.'
      },
      {
        q: 'Чи видаються сертифікати?',
        a: 'Так, після проходження курсів видаються іменні сертифікати з унікальним номером. Сертифікат Небачива — це підтвердження що ви володієте принципами безпечної їзди.'
      },
      {
        q: 'Що робити, якщо щось незрозуміло?',
        a: 'У кожному уроці є коментарі, де можна задати питання. Для Pro-підписників доступний закритий Telegram-чат з інструкторами. Також проводяться щомісячні онлайн-зустрічі для розбору питань.'
      }
    ]
  },
  {
    title: 'Технічні питання',
    icon: '⚙️',
    questions: [
      {
        q: 'На яких пристроях працює платформа?',
        a: 'Небачив працює на всіх сучасних пристроях: комп\'ютерах, планшетах, смартфонах. Є мобільна версія сайту та можливість встановити як додаток (PWA). Підтримуються всі популярні браузери.'
      },
      {
        q: 'Чи можна дивитися офлайн?',
        a: 'Так, відео-уроки можна завантажити для офлайн-перегляду через мобільний додаток. Текстові матеріали кешуються автоматично і доступні без інтернету.'
      },
      {
        q: 'Як увійти через Google?',
        a: 'На сторінці входу натисніть кнопку "Продовжити з Google". Якщо акаунт з такою поштою вже існує — ви увійдете, якщо ні — автоматично створитися новий акаунт.'
      },
      {
        q: 'Що робити, якщо забув пароль?',
        a: 'На сторінці входу натисніть "Забули пароль?". Введіть email і ми надішлемо інструкцію для відновлення. Лист приходить протягом 5 хвилин (перевірте папку спам).'
      },
      {
        q: 'Як змінити мову інтерфейсу?',
        a: 'Платформа підтримує українську, англійську та російську мови. Змінити мову можна в налаштуваннях профілю або через перемикач мови в шапці сайту.'
      }
    ]
  },
  {
    title: 'Безпека та принципи',
    icon: '🛡️',
    questions: [
      {
        q: 'Що таке "8 принципів Небачива"?',
        a: 'Це основа системи безпечної їзди: 1) Принцип блокерів, 2) Хвильова природа небезпеки, 3) Час-Простір-Варіанти, 4) Контроль периферії, 5) Динамічне позиціонування, 6) Прогнозування намірів, 7) Буфери безпеки, 8) Постійна готовність.'
      },
      {
        q: 'Що означає "Ніхто нікому нічого не винен"?',
        a: 'Це ключовий принцип виживання: не покладайтеся на те, що інші водії дотримуються правил. Завжди будьте готові до неадекватних дій інших учасників руху. Правота не захистить від аварії.'
      },
      {
        q: 'Чи гарантує система 100% безпеку?',
        a: 'Ніщо не гарантує 100% безпеки на дорозі. Але статистика показує: учні, які засвоїли принципи Небачива, потрапляють в аварії в 5-7 разів рідше. Це максимум, що можна зробити для своєї безпеки.'
      },
      {
        q: 'Як швидко з\'являється результат?',
        a: 'Перші зміни помітні вже після 2-3 уроків — ви почнете інакше дивитися на дорогу. Через тиждень сформуються базові рефлекси. Через місяць принципи стануть автоматичними. Головне — практикувати щодня.'
      }
    ]
  },
  {
    title: 'Співпраця',
    icon: '🤝',
    questions: [
      {
        q: 'Як підключити мотошколу до платформи?',
        a: 'Мотошколи отримують адмін-панель для управління учнями, брендування під свою школу, аналітику прогресу, навчання для інструкторів. Напишіть на partners@nebachiv.com для обговорення умов.'
      },
      {
        q: 'Чи можна стати інструктором Небачива?',
        a: 'Так, ми шукаємо досвідчених мотоциклістів, які поділяють наші принципи. Потрібен досвід від 5 років, бажання навчати, проходження сертифікації. Деталі на nebachiv.com/instructors.'
      },
      {
        q: 'Чи є партнерська програма?',
        a: 'Так, ви отримуєте 20% від кожного приведеного учня протягом року. Також є спеціальні умови для блогерів та лідерів думок в мото-спільноті.'
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  // Filter questions based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    category.questions.length > 0 || searchQuery === ''
  )

  // Get categories to display
  const displayCategories = selectedCategory 
    ? filteredCategories.filter(cat => cat.title === selectedCategory)
    : filteredCategories

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Часті питання
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Все, що потрібно знати про навчання на платформі Небачив
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Пошук питань..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Всі категорії
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.title}
                onClick={() => setSelectedCategory(category.title)}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.title
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {displayCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Нічого не знайдено за запитом "{searchQuery}"
                </p>
              </div>
            ) : (
              displayCategories.map((category) => (
                <div key={category.title} className="mb-12">
                  {!selectedCategory && (
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      {category.title}
                    </h2>
                  )}
                  
                  <div className="space-y-4">
                    {category.questions.map((item, index) => {
                      const itemId = `${category.title}-${index}`
                      const isOpen = openItems.includes(itemId)
                      
                      return (
                        <div 
                          key={index}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(itemId)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 pr-4">
                              {item.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          
                          {isOpen && (
                            <div className="px-6 pb-4">
                              <div className="prose prose-gray max-w-none">
                                <p className="text-gray-600 leading-relaxed">
                                  {item.a}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Не знайшли відповідь?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Наша команда підтримки готова допомогти вам з будь-якими питаннями
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all"
            >
              Написати в підтримку
            </Link>
            <a 
              href="https://t.me/nebachiv_support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-transparent border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all"
            >
              Telegram підтримка
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}