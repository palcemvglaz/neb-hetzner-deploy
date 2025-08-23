'use client'

import { useState } from 'react'
import Link from 'next/link'

const questions = [
  {
    id: 1,
    question: "Ти їдеш 50 км/год містом. Попереду фургон закриває огляд праворуч. Що робиш?",
    options: [
      "Продовжую їхати з тією ж швидкістю",
      "Зміщуюсь ліворуч і знижую швидкість", 
      "Обганяю фургон",
      "Сигналю щоб всі знали де я"
    ],
    correct: 1,
    explanation: "Фургон - це 'блокер'. За ним може вилетіти авто. Потрібно змістися для кращого огляду і бути готовим до екстреного гальмування."
  },
  {
    id: 2,
    question: "На перехресті горить зелене. Авто ліворуч чекає на поворот. Твої дії?",
    options: [
      "Їду - у мене ж зелене світло",
      "Прискорююсь щоб швидше проїхати",
      "Готую руку на гальмі, дивлюсь на колеса авто",
      "Зупиняюсь і пропускаю"
    ],
    correct: 2,
    explanation: "Класична аварія 'лівий поворот'. Водій може не бачити тебе. Дивись на передні колеса - вони першими покажуть початок руху."
  },
  {
    id: 3,
    question: "Після дощу дорога мокра. Як змінюється гальмівний шлях?",
    options: [
      "Не змінюється якщо гума хороша",
      "Збільшується на 20-30%",
      "Збільшується в 2-3 рази",
      "Трохи збільшується"
    ],
    correct: 2,
    explanation: "На мокрій дорозі гальмівний шлях збільшується мінімум вдвічі. А якщо є калюжі або масляні плями - ще більше."
  },
  {
    id: 4,
    question: "Скільки разів на тиждень потрібно тренувати екстрене гальмування?",
    options: [
      "Взагалі не потрібно, це небезпечно",
      "Раз на місяць достатньо",
      "Кожен день хоча б 5-10 разів",
      "Коли буде потрібно - тоді й спрацює"
    ],
    correct: 2,
    explanation: "Екстрене гальмування - це м'язова пам'ять. Без щоденних тренувань в критичній ситуації ти або перегальмуєш, або недогальмуєш."
  },
  {
    id: 5,
    question: "Водій дивиться прямо на тебе на перехресті. Це означає що:",
    options: [
      "Він тебе бачить і пропустить",
      "Він планує поворот",
      "Нічого не означає - він може тебе не помітити",
      "Потрібно махнути рукою"
    ],
    correct: 2,
    explanation: "Помилка сприйняття - водій може дивитись НА тебе але не БАЧИТИ тебе. Мозок часто 'фільтрує' мотоциклістів."
  }
]

export default function TestSkillPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === questions[currentQuestion].correct
    setSelectedAnswer(optionIndex)
    setAnswers([...answers, isCorrect])
    if (isCorrect) setScore(score + 1)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const resetTest = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
  }

  if (showResult) {
    const percentage = (score / questions.length) * 100
    const survived = percentage >= 80

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-900 rounded-lg p-8">
          <h1 className="text-4xl font-black mb-6 text-center">
            Результат тесту
          </h1>
          
          <div className="text-center mb-8">
            <div className={`text-6xl font-black mb-4 ${survived ? 'text-green-500' : 'text-red-500'}`}>
              {score}/{questions.length}
            </div>
            <p className="text-2xl font-bold mb-2">
              {survived ? '🎉 Є шанси вижити!' : '💀 Високий ризик аварії'}
            </p>
            <p className="text-gray-400">
              {survived 
                ? 'Але це лише базові знання. Повний курс дасть набагато більше.'
                : 'Тобі критично потрібні знання з курсу Небачив. Не відкладай!'
              }
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold">Твої відповіді:</h3>
            {questions.map((q, index) => (
              <div key={q.id} className={`p-4 rounded ${answers[index] ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                <p className="font-medium">{q.question}</p>
                <p className="text-sm text-gray-400 mt-2">{q.explanation}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/register"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-4 text-xl font-bold rounded-lg text-center transition-all"
            >
              🔥 Пройти повний курс зі знижкою 40%
            </Link>
            <button
              onClick={resetTest}
              className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-4 text-lg font-medium rounded-lg transition-all"
            >
              Спробувати ще раз
            </button>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-900 rounded-lg p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Тест виживання на дорозі</h1>
            <span className="text-gray-400">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  selectedAnswer === null 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : selectedAnswer === index
                      ? index === question.correct
                        ? 'bg-green-700'
                        : 'bg-red-700'
                      : index === question.correct
                        ? 'bg-green-700'
                        : 'bg-gray-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-yellow-400 font-medium mb-2">
                {selectedAnswer === question.correct ? '✅ Правильно!' : '❌ Неправильно!'}
              </p>
              <p className="text-gray-300">{question.explanation}</p>
            </div>
          )}
        </div>

        {selectedAnswer !== null && (
          <button
            onClick={nextQuestion}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 text-lg font-bold rounded-lg transition-all"
          >
            {currentQuestion < questions.length - 1 ? 'Наступне питання' : 'Подивитись результат'}
          </button>
        )}
      </div>
    </div>
  )
}