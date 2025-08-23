'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  CheckIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  ClockIcon,
  StarIcon,
  FireIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { NebachivLogo } from '@/components/ui/NebachivLogo'
import { BrandedButton } from '@/components/ui/BrandedButton'
import { RealTestimonials } from '@/components/landing/RealTestimonials'

// Ієрархія компетенцій з карти
const competencyHierarchy = {
  critical: [
    {
      id: 'visibility',
      name: 'НАДИВЛЕНІСТЬ',
      icon: EyeIcon,
      priority: '⭐⭐⭐',
      description: 'Бачити загрозу за 3-5 секунд',
      skills: [
        'Досвід close calls',
        'Розпізнавання аномалій',
        'Передбачення дій водіїв'
      ],
      color: 'from-nebachiv-orange to-nebachiv-orange/80'
    },
    {
      id: 'strategy',
      name: 'СТРАТЕГІЯ РУХУ',
      icon: ChartBarIcon,
      priority: '⭐⭐⭐',
      description: 'Бачення + позиціювання + блокер',
      skills: [
        'Рух хвилеподібний',
        'Escape routes',
        'Контроль блокерів'
      ],
      color: 'from-nebachiv-blue to-nebachiv-blue/80'
    }
  ],
  important: [
    {
      id: 'braking',
      name: 'ЕКСТРЕНЕ ГАЛЬМУВАННЯ',
      icon: ExclamationTriangleIcon,
      priority: '⭐⭐',
      description: 'Зі швидкості до повної зупинки',
      skills: [
        'Розуміння гальмівного шляху',
        'Час реакції',
        'Техніка максимального гальмування'
      ],
      color: 'from-orange-500 to-orange-700'
    },
    {
      id: 'accidents',
      name: 'ТИПИ МІСЬКИХ АВАРІЙ',
      icon: ShieldCheckIcon,
      priority: '⭐⭐',
      description: 'Знати небезпечні сценарії',
      skills: [
        'Перехрестя',
        'Виїзди з другорядної',
        'Лівий поворот авто'
      ],
      color: 'from-purple-500 to-purple-700'
    }
  ]
}

// Діагностичні питання з карти
const diagnosticQuestions = [
  {
    id: 'videos',
    question: 'Чи дивився ти відео аварій мотоциклістів?',
    category: 'НАДИВЛЕНІСТЬ',
    options: [
      { text: 'Ні, не дивився', value: 0, color: 'red' },
      { text: 'Дивився 1-10 відео', value: 5, color: 'yellow' },
      { text: 'Дивився 10+ відео', value: 10, color: 'green' }
    ],
    explanation: 'Досвід аналізу аварій розвиває надивленість'
  },
  {
    id: 'position',
    question: 'Де б ти їхав на 3-смуговій дорозі?',
    category: 'СТРАТЕГІЯ РУХУ',
    options: [
      { text: 'В правій колії правої смуги', value: 0, color: 'red' },
      { text: 'В лівій колії правої/середній смузі', value: 5, color: 'yellow' },
      { text: 'Залежить від ситуації (можу пояснити)', value: 10, color: 'green' }
    ],
    explanation: 'Правильна позиція = видимість + шляхи відступу'
  },
  {
    id: 'braking',
    question: 'Скільки метрів треба щоб зупинитись з 60 км/год?',
    category: 'ЕКСТРЕНЕ ГАЛЬМУВАННЯ',
    options: [
      { text: '50+ метрів', value: 0, color: 'red' },
      { text: '20-30 метрів', value: 3, color: 'yellow' },
      { text: '~15 метрів (сухий асфальт)', value: 5, color: 'green' }
    ],
    explanation: 'Розуміння гальмівного шляху критично для безпеки'
  },
  {
    id: 'danger',
    question: 'Яке найнебезпечніше місце в місті?',
    category: 'ТИПИ АВАРІЙ',
    options: [
      { text: 'Не знаю', value: 0, color: 'red' },
      { text: 'Світлофор/пішохідний', value: 3, color: 'yellow' },
      { text: 'Перехрестя (лівий поворот зустрічного)', value: 10, color: 'green' }
    ],
    explanation: '37% ДТП - на перехрестях з лівими поворотами'
  },
  {
    id: 'reaction',
    question: 'Що робиш коли водій тебе не бачить?',
    category: 'СТРАТЕГІЯ',
    options: [
      { text: 'Сигналити', value: 0, color: 'red' },
      { text: 'Прискоритись', value: 2, color: 'yellow' },
      { text: 'Змінити позицію + готовність до маневру', value: 5, color: 'green' }
    ],
    explanation: 'Проактивність замість реактивності'
  }
]

// Порочне коло з карти
const viciousCycle = [
  { phase: 'Немає навички', icon: '❌', color: 'from-nebachiv-orange/20 to-nebachiv-orange/20' },
  { phase: 'Виникає страх', icon: '😰', color: 'from-orange-500/20 to-orange-600/20' },
  { phase: 'Уникаю ситуацій', icon: '🚫', color: 'from-yellow-500/20 to-yellow-600/20' },
  { phase: 'Немає практики', icon: '⏸️', color: 'from-gray-500/20 to-gray-600/20' }
]

export default function RiderSafetyLanding() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [stats, setStats] = useState({
    riders: 0,
    accidents: 0,
    saved: 0
  })
  
  // Diagnostic test state
  const [testStarted, setTestStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animated counters
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      
      setStats({
        riders: Math.floor(698 * progress),
        accidents: Math.floor(921 * progress),
        saved: Math.floor(89 * progress)
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)
    
    return () => clearInterval(timer)
  }, [])

  const startTest = () => {
    setTestStarted(true)
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setSelectedAnswer(null)
  }

  const selectAnswer = (value: number) => {
    setSelectedAnswer(value)
  }

  const nextQuestion = () => {
    if (selectedAnswer !== null) {
      const question = diagnosticQuestions[currentQuestion]
      setAnswers({ ...answers, [question.id]: selectedAnswer })
      
      if (currentQuestion < diagnosticQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        calculateResults()
      }
    }
  }

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
    const maxScore = 40
    const percentage = (totalScore / maxScore) * 100
    setShowResults(true)
  }

  const getResultZone = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
    const maxScore = 40
    const percentage = (totalScore / maxScore) * 100
    
    if (percentage <= 30) return { zone: 'red', label: 'ЧЕРВОНА ЗОНА', description: 'Критичні прогалини в базових знаннях' }
    if (percentage <= 70) return { zone: 'yellow', label: 'ЖОВТА ЗОНА', description: 'Базові знання є, але багато прогалин' }
    return { zone: 'green', label: 'ЗЕЛЕНА ЗОНА', description: 'Хороша теоретична база' }
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Navigation - Modern2025 style */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <NebachivLogo size="md" variant="primary" showText={true} />
            <div className="flex items-center space-x-4">
              <BrandedButton
                variant="ghost"
                size="sm"
                onClick={() => router.push('/register')}
              >
                Увійти
              </BrandedButton>
              <BrandedButton
                variant="gradient"
                size="sm"
                onClick={() => router.push('/register')}
              >
                Зареєструватись
              </BrandedButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Modern 2025 style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Advanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900"></div>
          
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-nebachiv-orange/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-nebachiv-blue/20 to-nebachiv-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')] opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full mb-8 hover:bg-white/10 transition-all duration-300">
            <SparklesIcon className="w-5 h-5 text-nebachiv-orange" />
            <span className="text-sm font-medium text-white/90">Система на основі {stats.accidents} проаналізованих ДТП</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 tracking-tight leading-none">
            <span className="block text-white drop-shadow-2xl">
              Бачити небезпеку
            </span>
            <span className="block bg-gradient-to-r from-nebachiv-orange via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              за 3-5 секунд
            </span>
            <span className="block text-white/80 text-5xl sm:text-6xl lg:text-7xl mt-4">
              це реально
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Проактивна безпека через надивленість.<br/>
            Система розвитку критичних компетенцій на основі ієрархії навичок.
            <span className="block mt-2 text-lg text-white/50">Від страху до майстерності за 30 днів.</span>
          </p>

          {/* CTA Section */}
          <div className="space-y-6 mb-16">
            <button
              onClick={startTest}
              className="group relative px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-nebachiv-orange via-orange-500 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-nebachiv-orange/25 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-3">
                Пройти діагностику безкоштовно
                <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <p className="text-white/50 text-sm">
              5 питань • 2 хвилини • Персональний план розвитку
            </p>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-nebachiv-orange">{stats.riders}</div>
              <div className="text-sm text-white/70 mt-1">Навчено райдерів</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-orange-500">{stats.saved}%</div>
              <div className="text-sm text-white/70 mt-1">Уникнули ДТП</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-yellow-500">3-5с</div>
              <div className="text-sm text-white/70 mt-1">Час реакції</div>
            </div>
            <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-green-500">30</div>
              <div className="text-sm text-white/70 mt-1">Днів навчання</div>
            </div>
          </div>
        </div>
      </section>

      {/* Competency Hierarchy Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Ієрархія</span>
              <span className="block bg-gradient-to-r from-nebachiv-orange to-orange-500 bg-clip-text text-transparent">
                критичних компетенцій
              </span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Пріоритезована система навичок з філософією проактивної безпеки
            </p>
          </div>
          
          {/* Critical Skills */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-nebachiv-orange">⭐⭐⭐</span> КРИТИЧНЕ (фундамент виживання)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {competencyHierarchy.critical.map((comp) => {
                const IconComponent = comp.icon
                return (
                  <div key={comp.id} className="group">
                    <div className="relative p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 bg-gradient-to-br ${comp.color} rounded-2xl`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-white">{comp.name}</h4>
                          <p className="text-gray-400">{comp.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {comp.skills.map((skill, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-white/80">{skill}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`absolute inset-0 bg-gradient-to-r ${comp.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl`}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Important Skills */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-orange-500">⭐⭐</span> ДУЖЕ ВАЖЛИВЕ (критичні навички)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {competencyHierarchy.important.map((comp) => {
                const IconComponent = comp.icon
                return (
                  <div key={comp.id} className="group">
                    <div className="relative p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-500">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 bg-gradient-to-br ${comp.color} rounded-2xl`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-white">{comp.name}</h4>
                          <p className="text-gray-400">{comp.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {comp.skills.map((skill, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-white/80">{skill}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`absolute inset-0 bg-gradient-to-r ${comp.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl`}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Vicious Cycle Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-nebachiv-orange/10/10 to-black"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Порочне коло</span>
              <span className="block bg-gradient-to-r from-nebachiv-orange to-orange-500 bg-clip-text text-transparent">
                новачка
              </span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Без критичних навичок ти приречений на постійний стрес замість задоволення
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {viciousCycle.map((phase, idx) => (
              <div key={idx} className="relative">
                <div className={`bg-gradient-to-br ${phase.color} backdrop-blur-2xl border border-white/10 rounded-3xl p-8 h-full`}>
                  <div className="text-5xl mb-4 text-center">{phase.icon}</div>
                  <h3 className="text-xl font-bold text-white text-center">{phase.phase}</h3>
                </div>
                {idx < viciousCycle.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRightIcon className="w-6 h-6 text-white/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-900/20 to-green-900/5 rounded-3xl p-12 border border-green-900/50 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Рішення</h3>
            <div className="flex items-center justify-center gap-4 text-xl text-white/80">
              <span>ОСВІТА</span>
              <ArrowRightIcon className="w-5 h-5" />
              <span>ПРАКТИКА</span>
              <ArrowRightIcon className="w-5 h-5" />
              <span>ДОСВІД</span>
              <ArrowRightIcon className="w-5 h-5" />
              <span className="text-green-400 font-bold">ВПЕВНЕНІСТЬ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnostic Test Modal */}
      {testStarted && !showResults && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400">
                    Питання {currentQuestion + 1} з {diagnosticQuestions.length}
                  </span>
                  <button
                    onClick={() => setTestStarted(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-nebachiv-orange to-orange-500 transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / diagnosticQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-4">
                  <span className="text-sm font-medium text-white/70">
                    {diagnosticQuestions[currentQuestion].category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  {diagnosticQuestions[currentQuestion].question}
                </h3>
                
                <div className="space-y-3">
                  {diagnosticQuestions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(option.value)}
                      className={`w-full p-4 text-left rounded-xl border transition-all duration-200 ${
                        selectedAnswer === option.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white">{option.text}</span>
                        <div className={`w-3 h-3 rounded-full bg-${option.color}-500`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <p className="text-sm text-gray-400 mb-6">
                💡 {diagnosticQuestions[currentQuestion].explanation}
              </p>

              {/* Next button */}
              <button
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className={`w-full py-4 rounded-xl font-medium transition-all duration-200 ${
                  selectedAnswer !== null
                    ? 'bg-gradient-to-r from-nebachiv-orange to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/25'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion < diagnosticQuestions.length - 1 ? 'Наступне питання' : 'Побачити результат'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
              <button
                onClick={() => {
                  setTestStarted(false)
                  setShowResults(false)
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              {/* Result */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${
                  getResultZone().zone === 'red' ? 'bg-nebachiv-orange/20/50 border-4 border-nebachiv-orange' :
                  getResultZone().zone === 'yellow' ? 'bg-yellow-900/50 border-4 border-yellow-500' :
                  'bg-green-900/50 border-4 border-green-500'
                }`}>
                  <span className="text-4xl font-bold text-white">
                    {Object.values(answers).reduce((sum, val) => sum + val, 0)}
                  </span>
                </div>
                <h3 className={`text-3xl font-bold mb-2 ${
                  getResultZone().zone === 'red' ? 'text-nebachiv-orange' :
                  getResultZone().zone === 'yellow' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {getResultZone().label}
                </h3>
                <p className="text-gray-400">{getResultZone().description}</p>
              </div>

              {/* Recommendations */}
              <div className="bg-black/30 rounded-2xl p-6 mb-8">
                <h4 className="text-xl font-bold text-white mb-4">Твій персональний план</h4>
                <div className="space-y-3">
                  {getResultZone().zone === 'red' && (
                    <>
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Базовий курс "Надивленість" - навчись бачити небезпеку</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Практика з інструктором - безпечне середовище</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Щоденний аналіз відео - вчись на чужих помилках</span>
                      </div>
                    </>
                  )}
                  {getResultZone().zone === 'yellow' && (
                    <>
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Курс "Стратегія руху" - де бути безпечно</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Відпрацювання критичних навичок</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Аналіз власних поїздок з ментором</span>
                      </div>
                    </>
                  )}
                  {getResultZone().zone === 'green' && (
                    <>
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Практичні майстер-класи в місті</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Відпрацювання складних умов (дощ, ніч)</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">Підготовка до далеких подорожей</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => router.push('/register')}
                className="w-full py-4 bg-gradient-to-r from-nebachiv-orange to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
              >
                Отримати повний план навчання
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 30-Day Program */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Програма для новачка</span>
              <span className="block bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                30 днів трансформації
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                week: 'Тиждень 1',
                title: 'Фундамент',
                items: [
                  'Надивленість - вчимось бачити',
                  'Стратегія руху - де бути безпечно',
                  'База керування - посадка, гальма'
                ],
                color: 'from-nebachiv-orange to-nebachiv-orange/80'
              },
              {
                week: 'Тиждень 2',
                title: 'Критичні навички',
                items: [
                  'Екстрене гальмування - щодня практика',
                  'Управління страхом - психологічна база',
                  'Типи аварій - розуміння загроз'
                ],
                color: 'from-orange-500 to-orange-700'
              },
              {
                week: 'Тиждень 3',
                title: 'Умови та поверхні',
                items: [
                  'Дощ - перший виїзд',
                  'Рейки/люки - міські пастки',
                  'Перехрестя - найнебезпечніше місце'
                ],
                color: 'from-yellow-500 to-yellow-700'
              },
              {
                week: 'Тиждень 4',
                title: 'Інтеграція',
                items: [
                  'Міжряддя - початок практики',
                  'Концентрація - довгі поїздки',
                  'Аналітика - розбір помилок'
                ],
                color: 'from-green-500 to-green-700'
              }
            ].map((week, idx) => (
              <div key={idx} className="relative">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${week.color} rounded-t-3xl`} />
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 h-full">
                  <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    {week.week}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {week.title}
                  </h3>
                  <ul className="space-y-2">
                    {week.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="mt-16 bg-gradient-to-r from-nebachiv-blue/20 to-nebachiv-blue/20 rounded-3xl p-12 border border-nebachiv-blue/50">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Твій прогрес за 30 днів</h3>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-nebachiv-blue">15м → 12м</div>
                <p className="text-sm text-gray-400 mt-1">Гальмівний шлях з 60 км/год</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-nebachiv-blue">1.5с → 0.8с</div>
                <p className="text-sm text-gray-400 mt-1">Час реакції на загрозу</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-nebachiv-blue">8 → 3</div>
                <p className="text-sm text-gray-400 mt-1">Рівень страху (з 10)</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-nebachiv-blue">2 → 6</div>
                <p className="text-sm text-gray-400 mt-1">Впевненість в дощ (з 10)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <RealTestimonials 
        count={6}
        title="698 райдерів вже пройшли цей шлях"
        subtitle="Від страху до впевненості • Реальні історії трансформації"
      />

      {/* Final CTA */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-nebachiv-orange/10/10 to-black"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-nebachiv-orange to-orange-500 bg-clip-text text-transparent">
              Краще бачити небезпеку за 3 секунди
            </span>
            <span className="block text-white mt-2">
              ніж гальмувати за 0.5
            </span>
          </h2>
          
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Філософія проактивної безпеки. Система розвитку критичних компетенцій.
            <span className="font-bold text-orange-500"> Без води, тільки практика.</span>
          </p>
          
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-nebachiv-orange/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative p-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-nebachiv-orange/20 text-nebachiv-orange-light px-4 py-2 rounded-full text-sm font-medium mb-8">
                <SparklesIcon className="w-4 h-4" />
                Обмежена пропозиція
              </div>
              
              <p className="text-2xl sm:text-3xl font-bold text-white mb-8">
                Повний курс "Проактивна безпека"
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  '30-денна програма трансформації',
                  'Відео з реальними прикладами',
                  'Чек-листи щоденних вправ',
                  'Доступ до закритої спільноти',
                  'Персональний план розвитку',
                  'Гарантія результату'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl mb-8">
                <span className="text-white/70">Залишилось місць:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-nebachiv-orange to-orange-500 bg-clip-text text-transparent">17</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/register')}
            className="group relative px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-nebachiv-orange via-orange-500 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-nebachiv-orange/25 transition-all duration-300 hover:scale-105 mb-6"
          >
            <span className="relative z-10 flex items-center gap-3">
              Почати трансформацію
              <ArrowRightIcon className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          
          <p className="text-white/50">
            Результат за 30 днів або повернемо гроші
          </p>
        </div>
      </section>

      {/* Footer Quote */}
      <footer className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <blockquote className="mb-8">
            <p className="text-2xl text-white/70 italic font-light mb-4">
              "Проактивна безпека - це не потрапляти в небезпеку,<br/>
              а не героїчно з неї виходити"
            </p>
            <cite className="text-white/40 not-italic text-lg">
              — Принцип №1 системи Небачив
            </cite>
          </blockquote>
          
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/30 text-sm">
              © 2025 Небачив. Бачити небезпеку заздалегідь.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}