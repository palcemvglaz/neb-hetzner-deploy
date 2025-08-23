'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, AcademicCapIcon, ChartBarIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { BrandedButton } from '@/components/ui/BrandedButton'
import { getRandomTestimonials } from '@/lib/data/real-testimonials'

export default function HomePage() {
  const [stats, setStats] = useState({
    accidentsAnalyzed: 0,
    livesSaved: 0,
    studentsActive: 0
  })
  
  const testimonials = getRandomTestimonials(3)

  // Animated counter effect
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      
      setStats({
        accidentsAnalyzed: Math.floor(921 * progress),
        livesSaved: Math.floor(89 * progress),
        studentsActive: Math.floor(698 * progress)
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Hero Section - Modern Elegant Style */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-nebachiv-blue/20"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-nebachiv-blue rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-nebachiv-blue/80 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-700/80 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-nebachiv-blue/20 to-nebachiv-blue-dark/20 border border-nebachiv-blue/50 rounded-full backdrop-blur-sm">
                <SparklesIcon className="w-4 h-4 text-nebachiv-blue" />
                <span className="text-sm font-medium text-nebachiv-blue">Удача закінчується. Знання - ні.</span>
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-6 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
                Як водити мотоцикл
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-blue via-gray-400 to-nebachiv-blue-light">
                в місті
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">
                не покладаючись на удачу
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-400 text-center mb-12 max-w-3xl mx-auto leading-relaxed">
              Освітній застосунок для мотоциклістів. Перетворюємо 5 років болючого досвіду на 1 тиждень структурованих знань. 
              8 принципів безпеки • 17 років досвіду • 89% зниження ризику ДТП.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">18 років досвіду</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">200,000+ км без ДТП</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">Чемпіон України</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <BrandedButton 
                  variant="gradient" 
                  size="lg"
                  className="group relative inline-flex items-center justify-center text-lg font-medium"
                >
                  <span className="flex items-center gap-2">
                    Почати навчання
                    <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </BrandedButton>
              </Link>
              
              <Link href="/promo">
                <BrandedButton 
                  variant="secondary" 
                  size="lg"
                  className="group inline-flex items-center justify-center text-lg font-medium"
                >
                  <span className="flex items-center gap-2">
                    Дізнатися більше
                    <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </BrandedButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful Quote Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-black to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-light">
                "Ми НЕ вчимо їздити.
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-blue to-nebachiv-blue-light">
                Ми вчимо НЕ вляпатись."
              </span>
            </h2>
            <p className="text-xl text-gray-500">© NEBACHIV</p>
          </div>
        </div>
      </section>

      {/* Stats Section - Modern Design */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-transparent"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-light blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-dark">
                  {stats.accidentsAnalyzed.toLocaleString()}
                </div>
              </div>
              <div className="mt-3 text-gray-400 text-sm sm:text-base font-medium">Аварій MAIDS</div>
            </div>
            
            <div className="text-center group">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-blue to-gray-400 blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-blue to-gray-500">
                  {stats.livesSaved}
                </div>
              </div>
              <div className="mt-3 text-gray-400 text-sm sm:text-base font-medium">% зниження ризику</div>
            </div>
            
            <div className="text-center group">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-400 blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
                  {stats.studentsActive.toLocaleString()}
                </div>
              </div>
              <div className="mt-3 text-gray-400 text-sm sm:text-base font-medium">Навчених райдерів</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Elegant Dark */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-16 text-center">
              <span className="text-gray-300">Твоя мотошкола</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-dark mt-2">не розповіла тобі головного</span>
            </h2>
            
            <div className="space-y-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 transition-all group-hover:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-nebachiv-orange/20 rounded-lg flex items-center justify-center">
                        <span className="text-nebachiv-orange text-xl">⚠</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-200 mb-2">
                        "Дотримуйся ПДР і все буде добре"
                      </p>
                      <p className="text-gray-400">
                        <span className="text-nebachiv-orange font-medium">Реальність:</span> 73% загиблих мотоциклістів дотримувались всіх правил
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 transition-all group-hover:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-nebachiv-orange/20 rounded-lg flex items-center justify-center">
                        <span className="text-nebachiv-orange text-xl">⚠</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-200 mb-2">
                        "Їзди повільно і обережно"
                      </p>
                      <p className="text-gray-400">
                        <span className="text-nebachiv-orange font-medium">Реальність:</span> 68% аварій відбувається на швидкості менше 60 км/год
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 transition-all group-hover:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-nebachiv-orange/20 rounded-lg flex items-center justify-center">
                        <span className="text-nebachiv-orange text-xl">⚠</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-200 mb-2">
                        "Яскравий шолом = тебе побачать"
                      </p>
                      <p className="text-gray-400">
                        <span className="text-nebachiv-orange font-medium">Реальність:</span> "Я його не бачив" - фраза №1 від водіїв після ДТП
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange/20 to-nebachiv-orange-light/20 rounded-2xl blur-2xl"></div>
              <div className="relative bg-gradient-to-r from-nebachiv-orange/30 to-nebachiv-orange-dark/30 backdrop-blur-sm border border-nebachiv-orange/50 rounded-2xl p-8 sm:p-10 text-center">
                <p className="text-xl sm:text-2xl font-medium text-gray-200">
                  Після мотошколи ти знаєш як <span className="text-nebachiv-orange">керувати мотоциклом</span>,
                  <br />
                  але не знаєш як <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-light font-bold">вижити на дорозі</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section - New */}
      <section className="py-32 relative bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
                  🎯 Наш підхід
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-light ml-3">
                  кардинально інший
                </span>
              </h2>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange/20 to-nebachiv-orange-light/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-xl border border-nebachiv-orange/50 rounded-3xl p-8 sm:p-12">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-light mb-8">
                    5 років досвіду за 1 тиждень навчання
                  </p>
                  
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="flex items-start gap-4">
                      <CheckCircleIcon className="w-6 h-6 text-nebachiv-orange flex-shrink-0 mt-1" />
                      <div className="text-left">
                        <p className="text-xl font-semibold text-gray-100 mb-1">95% аварій - однотипні і передбачувані</p>
                        <p className="text-gray-400">Але про це не розповідають в мотошколах</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <CheckCircleIcon className="w-6 h-6 text-nebachiv-orange flex-shrink-0 mt-1" />
                      <div className="text-left">
                        <p className="text-xl font-semibold text-gray-100 mb-1">Система розпізнавання смертельних патернів</p>
                        <p className="text-gray-400">Навчаємо бачити загрозу до її появи</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <CheckCircleIcon className="w-6 h-6 text-nebachiv-orange flex-shrink-0 mt-1" />
                      <div className="text-left">
                        <p className="text-xl font-semibold text-gray-100 mb-1">Заснована на аналізі реальних аварій</p>
                        <p className="text-gray-400">17+ років досвіду і тисячі врятованих життів</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <CheckCircleIcon className="w-6 h-6 text-nebachiv-orange flex-shrink-0 mt-1" />
                      <div className="text-left">
                        <p className="text-xl font-semibold text-gray-100 mb-1">89% зниження ризику ДТП</p>
                        <p className="text-gray-400">Підтверджено реальними результатами випускників</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-center text-lg text-gray-500 max-w-3xl mx-auto">
              Результат: Ти стаєш не потенційною жертвою, а усвідомленим учасником дорожнього руху, 
              який грає в "виживання" професійно, а не на авось.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section - Modern Grid */}
      <section className="py-32 relative bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
                  Що ти отримаєш за 7 днів
                </span>
              </h2>
              <p className="text-xl text-gray-500">
                Те, на що іншим потрібно роки та декілька аварій
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Card 1 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-blue/10 to-gray-600/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 transition-all duration-300 group-hover:border-gray-700 group-hover:shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-nebachiv-blue/20 to-gray-500/20 rounded-2xl">
                      <ShieldCheckIcon className="w-8 h-8 text-nebachiv-orange" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-100">Принципи виживання</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">8 принципів Небачива - як думати на дорозі</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Концепція "блокерів" - звідки з'являється смерть</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Хвильова природа небезпеки - коли бути готовим</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Правило "ніхто нікому нічого не винен"</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-nebachiv-blue/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 transition-all duration-300 group-hover:border-gray-700 group-hover:shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-gray-500/20 to-nebachiv-blue/20 rounded-2xl">
                      <ChartBarIcon className="w-8 h-8 text-nebachiv-orange" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-100">Аналіз реальних аварій</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">12 типів "раптових" аварій і як їх передбачити</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Смертельні перехрестя - алгоритм проїзду</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">"Ліве зі двору" - чому це вбиває і як уникнути</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Відеорозбори з поясненням кожної помилки</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-blue/10 to-gray-600/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 transition-all duration-300 group-hover:border-gray-700 group-hover:shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-nebachiv-blue/20 to-gray-500/20 rounded-2xl">
                      <AcademicCapIcon className="w-8 h-8 text-nebachiv-blue" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-100">Технічні навички</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Екстрене гальмування - 90% не вміють</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Trail braking - як це врятує в повороті</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Контрруління на швидкості</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Читання поведінки водіїв - передбачення їх дій</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Card 4 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-nebachiv-blue/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 transition-all duration-300 group-hover:border-gray-700 group-hover:shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-gray-500/20 to-nebachiv-blue/20 rounded-2xl">
                      <SparklesIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-100">Практичні тренування</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Симулятор небезпечних ситуацій</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Тести на розпізнавання загроз</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Чек-листи щоденних вправ</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Баланс безпеки і задоволення від їзди</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Slider */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gray-300">Вони</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-blue to-gray-400 ml-3">вижили</span>
              <span className="text-gray-300 ml-3">завдяки системі</span>
            </h2>
            <p className="text-lg text-gray-500 mt-4">
              Реальні відгуки з YouTube каналу • 698 коментарів проаналізовано
            </p>
          </div>
          
          {/* Real testimonials */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-nebachiv-blue/50 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 line-clamp-4">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                  {testimonial.verified && (
                    <div className="flex items-center gap-1">
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      <span className="text-xs text-green-400">Перевірено</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/testimonials">
              <BrandedButton 
                variant="secondary" 
                size="md"
                className="group inline-flex items-center gap-2"
              >
                Переглянути всі 53 відгуки
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </BrandedButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Guarantee Section - Modern Design */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-gray-300">Моя</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-light ml-3">100% гарантія</span>
              </h2>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange/20 to-nebachiv-orange-light/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-yellow-700/30 rounded-3xl p-8 sm:p-12">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
                    Якщо через 30 днів ти не відчуєш себе
                    <span className="block text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-light my-4">
                      10× впевненіше на дорозі
                    </span>
                  </p>
                  
                  <div className="py-6 border-y border-gray-700/50">
                    <p className="text-2xl sm:text-3xl font-bold text-green-400">
                      Я поверну всі гроші. Без питань.
                    </p>
                  </div>
                  
                  <p className="text-gray-400 text-lg">
                    Більше того: якщо ти пройдеш весь курс і потрапиш в аварію з своєї вини - 
                    я особисто розберу твій випадок і поверну гроші.
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                    <span className="text-green-400 font-medium">100% захист твоїх інвестицій</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mt-12 text-center text-lg text-gray-500 max-w-2xl mx-auto">
              Чому я можу таке обіцяти? За 3 роки жоден учень, який пройшов курс повністю, 
              не потрапив в серйозну аварію. Це не випадковість - це система працює.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA - Modern Urgency */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-gray-900 via-nebachiv-orange/10 to-gray-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-nebachiv-blue/30 via-transparent to-gray-900/30"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-light">
                Кожен день без цих знань
              </span>
              <span className="block text-gray-300 mt-2">
                це гра в рулетку з життям
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Середньостатистичний мотоцикліст потрапляє в першу серйозну аварію протягом 
              <span className="font-bold text-nebachiv-orange"> 18 місяців</span>.
              Скільки вже проїздив ти?
            </p>
            
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange/20 to-nebachiv-orange-light/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gray-900/90 backdrop-blur-xl border border-yellow-700/30 rounded-3xl p-8 sm:p-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-nebachiv-orange/20 text-nebachiv-orange px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <SparklesIcon className="w-4 h-4" />
                  Обмежена пропозиція
                </div>
                
                <p className="text-2xl sm:text-3xl font-bold text-gray-100 mb-6">
                  Перші 100 учнів отримують:
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-left max-w-md mx-auto">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">Повний курс зі знижкою 40%</span>
                  </div>
                  <div className="flex items-center gap-3 text-left max-w-md mx-auto">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">Особиста консультація зі мною</span>
                  </div>
                  <div className="flex items-center gap-3 text-left max-w-md mx-auto">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">Щотижневі оновлення контенту</span>
                  </div>
                </div>
                
                <div className="inline-flex items-center gap-4 bg-gray-800/50 px-6 py-3 rounded-2xl">
                  <span className="text-gray-400">Залишилось місць:</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nebachiv-orange to-nebachiv-orange-light">17</span>
                </div>
              </div>
            </div>
            
            <Link href="/register">
              <BrandedButton 
                variant="gradient" 
                size="xl"
                className="group relative inline-flex items-center justify-center text-xl font-bold"
              >
                <span className="flex items-center gap-3">
                  Забрати місце зараз
                  <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </span>
              </BrandedButton>
            </Link>
            
            <p className="mt-6 text-gray-500">
              Ціна підніметься через 48 годин
            </p>
          </div>
        </div>
      </section>

      {/* Alternative Landing Pages */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            🎯 Альтернативні Лендінги
          </h2>
          <p className="text-gray-400 mb-8">
            Різні підходи до конверсії для різних типів аудиторії
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/teaser" className="block">
              <div className="bg-nebachiv-blue hover:bg-nebachiv-blue-dark transition-colors rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">📧 TEASER PAGES</h3>
                <p className="text-purple-100 mb-4">
                  Швидкий email capture в стилі головного лендінга
                </p>
                <div className="text-purple-200 text-sm">
                  Email capture • Мінімалістичний • A/B ready • 3 варіанти
                </div>
              </div>
            </Link>

            <Link href="/landing/hormozi" className="block">
              <div className="bg-nebachiv-orange hover:bg-nebachiv-orange transition-colors rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">🔥 HORMOZI STYLE</h3>
                <p className="text-red-100 mb-4">
                  Агресивний лендінг в стилі Alex Hormozi з конкретними офертами та гарантіями
                </p>
                <div className="text-red-200 text-sm">
                  Конкретні ціни • Urgency • 100% гарантія • Strong CTAs
                </div>
              </div>
            </Link>
            
            <Link href="/landing/hub" className="block">
              <div className="bg-nebachiv-blue hover:bg-nebachiv-blue transition-colors rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">🎯 ALL LANDINGS HUB</h3>
                <p className="text-blue-100 mb-4">
                  Повна колекція всіх лендінг сторінок для A/B тестування
                </p>
                <div className="text-blue-200 text-sm">
                  11 різних стилів • Performance аналіз • Testing ready
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <footer className="py-20 bg-gray-950 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="relative container mx-auto px-4 text-center">
          <blockquote className="max-w-2xl mx-auto">
            <p className="text-2xl text-gray-400 italic font-light mb-4">
              "Не покладайся на удачу. Вона закінчується."
            </p>
            <cite className="text-gray-600 not-italic">
              — Чингіз Барінов, засновник Небачив
            </cite>
          </blockquote>
        </div>
      </footer>
    </div>
  )
}