'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Про проект Nebachiv</h1>
            <p className="text-xl text-blue-100">
              Місія, яка рятує життя мотоциклістів щодня
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Наша місія</h2>
            
            <div className="bg-blue-50 p-8 rounded-lg mb-12">
              <p className="text-xl leading-relaxed text-gray-700">
                <span className="font-bold text-blue-900">Зменшити кількість загиблих мотоциклістів в Україні на 50%</span> 
                {' '}протягом наступних 5 років через навчання принципам безпечної їзди, 
                заснованим на аналізі реальних аварій та досвіді експертів.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">486</div>
                <p className="text-gray-600">Загиблих мотоциклістів у 2023 році</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">73%</div>
                <p className="text-gray-600">Аварій можна було уникнути</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">12,000+</div>
                <p className="text-gray-600">Проаналізованих ДТП</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Як все почалося</h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="mb-6">
                2020 рік. Після чергової новини про загиблого мотоцикліста, я зрозумів — 
                система не працює. Мотошколи вчать керувати мотоциклом, але не вчать виживати на дорозі.
              </p>
              
              <p className="mb-6">
                За 18 років їзди по Києву я жодного разу не потрапив в аварію. Не тому, що мені щастило. 
                А тому, що розробив систему принципів, яка дозволяє передбачати небезпеку до її появи.
              </p>
              
              <p className="mb-6">
                Я почав аналізувати кожну аварію. Дивитися відео з реєстраторів. Спілкуватися з постраждалими. 
                І виявив шокуючу закономірність — <strong>90% аварій відбуваються за однаковими сценаріями</strong>.
              </p>
              
              <p>
                Так народився Nebachiv — проект, який навчає не правилам дорожнього руху, 
                а принципам виживання на дорозі.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KB_NEB System */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Система знань KB_NEB</h2>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
              <p className="text-xl mb-4">
                KB_NEB — це структурована база знань, яка містить:
              </p>
              <ul className="space-y-2 text-lg">
                <li>✓ 8 базових принципів безпечної їзди</li>
                <li>✓ 289 тем з детальним розбором</li>
                <li>✓ 362 навчальних матеріали</li>
                <li>✓ 144,685 слів перевіреної інформації</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-blue-600">Наукова основа</h3>
                <p className="text-gray-600">
                  Кожен принцип базується на статистиці аварій, 
                  дослідженнях поведінки водіїв та когнітивній психології.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-green-600">Практична перевірка</h3>
                <p className="text-gray-600">
                  Всі техніки перевірені на практиці сотнями учнів 
                  в реальних умовах українських доріг.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Команда</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-2">Чингіз Барінов</h3>
                <p className="text-center text-gray-600 mb-4">Засновник, головний інструктор</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 18 років досвіду міської їзди</li>
                  <li>• Чемпіон України з мотоджимхани</li>
                  <li>• 200,000+ км без аварій</li>
                  <li>• Автор системи "8 принципів Небачива"</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-2">Команда експертів</h3>
                <p className="text-center text-gray-600 mb-4">Інструктори та розробники</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 5 сертифікованих інструкторів</li>
                  <li>• 3 аналітики дорожніх ситуацій</li>
                  <li>• 2 психологи-консультанти</li>
                  <li>• Команда технічної підтримки</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Наші цінності</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Правда понад усе</h3>
                <p className="text-gray-600">
                  Ми говоримо правду про небезпеки, навіть якщо вона неприємна
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Тільки перевірені дані</h3>
                <p className="text-gray-600">
                  Кожне твердження базується на статистиці та реальному досвіді
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Відповідальність</h3>
                <p className="text-gray-600">
                  Ми несемо відповідальність за кожного учня та його безпеку
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Приєднуйся до місії порятунку життів
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Кожен новий учень — це потенційно врятоване життя. 
            Почни свій шлях до безпечної їзди вже сьогодні.
          </p>
          <Link 
            href="/courses"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all"
          >
            Переглянути курси
          </Link>
        </div>
      </section>
    </div>
  )
}