'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuickTestProps {
  title: string
  questions: Question[]
  onComplete?: (score: number) => void
}

export default function QuickTest({ title, questions, onComplete }: QuickTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsCompleted(true)
      setShowResults(true)
      
      const score = calculateScore()
      if (onComplete) {
        onComplete(score)
      }
    }
  }

  const calculateScore = () => {
    const correct = selectedAnswers.reduce((sum, answer, index) => {
      return sum + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
    return Math.round((correct / questions.length) * 100)
  }

  const resetTest = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setIsCompleted(false)
    setShowResults(false)
  }

  const progress = ((currentQuestion + (isCompleted ? 1 : 0)) / questions.length) * 100

  if (showResults) {
    const score = calculateScore()
    const passed = score >= 70

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {passed ? 'Тест пройдено!' : 'Тест не пройдено'}
          </h2>
          
          <p className="text-gray-600 mb-4">
            Ваш результат: {score}% ({selectedAnswers.filter((a, i) => a === questions[i].correctAnswer).length} з {questions.length})
          </p>

          {!passed && (
            <p className="text-sm text-red-600 mb-4">
              Мінімальний прохідний бал: 70%
            </p>
          )}
        </div>

        {/* Results breakdown */}
        <div className="space-y-4 mb-6">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index]
            const isCorrect = userAnswer === question.correctAnswer

            return (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-grow">
                    <p className="font-medium mb-2">{question.question}</p>
                    
                    <div className="space-y-1 text-sm">
                      <div className={`p-2 rounded ${
                        userAnswer === question.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        Ваша відповідь: {question.options[userAnswer]}
                      </div>
                      
                      {!isCorrect && (
                        <div className="p-2 rounded bg-green-50 text-green-700">
                          Правильна відповідь: {question.options[question.correctAnswer]}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 p-2 bg-blue-50 rounded">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Пройти знову
          </button>
          
          {passed && (
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Продовжити навчання
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">{title}</h2>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} з {questions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedAnswer === index 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Назад
        </button>
        
        <button
          onClick={handleNext}
          disabled={selectedAnswer === undefined}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {currentQuestion === questions.length - 1 ? 'Завершити тест' : 'Далі'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}