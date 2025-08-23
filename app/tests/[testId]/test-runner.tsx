'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Clock, CheckCircle, XCircle, AlertCircle, 
  ChevronLeft, ChevronRight, Send, BookOpen,
  Trophy, Target, RotateCcw
} from 'lucide-react'

interface TestData {
  id: string
  title: string
  description: string
  timeLimit: number | null
  questionCount: number
  passingScore: number
  maxAttempts: number
  attemptCount: number
  bestScore: number | null
  courseTitle?: string
  courseSlug?: string
}

interface Question {
  id: string
  question: string
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'TEXT'
  options?: string[]
  points: number
}

interface TestResult {
  score: number
  totalScore: number
  percentage: number
  passed: boolean
  timeSpent: number
  answers: {
    questionId: string
    isCorrect: boolean
    userAnswer: any
    correctAnswer: any
    explanation?: string
  }[]
}

export default function TestRunner({ test, userId }: { test: TestData; userId: string }) {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Start test session
  const startTest = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Start session
      const startRes = await fetch(`/api/tests/${test.id}/start`, {
        method: 'POST'
      })

      if (!startRes.ok) {
        throw new Error(await startRes.text())
      }

      const { session } = await startRes.json()
      setSessionId(session.id)

      // Get questions
      const questionsRes = await fetch(`/api/tests/sessions/${session.id}/questions`)
      
      if (!questionsRes.ok) {
        throw new Error('Failed to load questions')
      }

      const { questions: loadedQuestions } = await questionsRes.json()
      setQuestions(loadedQuestions)

      // Set timer if time limit exists
      if (test.timeLimit) {
        setTimeRemaining(test.timeLimit * 60) // Convert to seconds
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start test')
    } finally {
      setIsLoading(false)
    }
  }

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          // Time's up - submit test
          submitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  // Submit answer for current question
  const submitAnswer = async (answer: any) => {
    if (!sessionId || !questions[currentQuestion]) return

    const questionId = questions[currentQuestion].id
    setAnswers(prev => ({ ...prev, [questionId]: answer }))

    // Submit to server
    try {
      await fetch(`/api/tests/sessions/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer })
      })
    } catch (err) {
      console.error('Failed to submit answer:', err)
    }
  }

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  // Navigate to previous question
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  // Submit test
  const submitTest = async () => {
    if (!sessionId || showResults) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/tests/sessions/${sessionId}/complete`, {
        method: 'POST'
      })

      if (!res.ok) {
        throw new Error('Failed to submit test')
      }

      const { result } = await res.json()
      setTestResult(result)
      setShowResults(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit test')
    } finally {
      setIsLoading(false)
    }
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress
  const answeredCount = Object.keys(answers).length
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  // Pre-test screen
  if (!sessionId && !testResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Back to course link */}
            {test.courseSlug && (
              <Link
                href={`/courses/${test.courseSlug}`}
                className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Повернутися до курсу</span>
              </Link>
            )}

            <div className="bg-white rounded-lg shadow p-8">
              <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
              <p className="text-gray-600 mb-6">{test.description}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <span>{test.questionCount} питань</span>
                </div>
                
                {test.timeLimit && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{test.timeLimit} хвилин</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-gray-400" />
                  <span>Прохідний бал: {test.passingScore}%</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <span>Спроба {test.attemptCount + 1} з {test.maxAttempts}</span>
                </div>

                {test.bestScore !== null && (
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Кращий результат: {test.bestScore}%</span>
                  </div>
                )}
              </div>

              {test.attemptCount >= test.maxAttempts ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900">Ліміт спроб вичерпано</h3>
                      <p className="text-red-700">
                        Ви використали всі {test.maxAttempts} спроб для цього тесту.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-900">Важливо</h3>
                        <p className="text-yellow-700">
                          Після початку тесту ви не зможете призупинити його. 
                          Переконайтеся, що у вас є достатньо часу.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={startTest}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Завантаження...' : 'Почати тест'}
                  </button>
                </>
              )}

              {error && (
                <div className="mt-4 text-red-600 text-center">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results screen
  if (showResults && testResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center mb-8">
                {testResult.passed ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-green-900 mb-2">Тест пройдено!</h1>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-red-900 mb-2">Тест не пройдено</h1>
                  </>
                )}
                
                <div className="text-5xl font-bold mb-2">
                  {testResult.percentage}%
                </div>
                
                <p className="text-gray-600">
                  {testResult.score} з {testResult.totalScore} балів
                </p>
                
                <p className="text-gray-500 mt-2">
                  Час виконання: {Math.floor(testResult.timeSpent / 60)} хв {testResult.timeSpent % 60} сек
                </p>
              </div>

              {/* Detailed results */}
              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold">Детальні результати</h2>
                
                {questions.map((question, idx) => {
                  const answer = testResult.answers.find(a => a.questionId === question.id)
                  if (!answer) return null

                  return (
                    <div 
                      key={question.id}
                      className={`p-4 rounded-lg border ${
                        answer.isCorrect 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {answer.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        
                        <div className="flex-1">
                          <p className="font-medium mb-2">
                            {idx + 1}. {question.question}
                          </p>
                          
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Ваша відповідь:</span>{' '}
                              {formatAnswer(question, answer.userAnswer)}
                            </p>
                            
                            {!answer.isCorrect && (
                              <p>
                                <span className="font-medium">Правильна відповідь:</span>{' '}
                                {formatAnswer(question, answer.correctAnswer)}
                              </p>
                            )}
                            
                            {answer.explanation && (
                              <p className="text-gray-600 mt-2">
                                <span className="font-medium">Пояснення:</span>{' '}
                                {answer.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-4">
                {test.courseSlug && (
                  <Link
                    href={`/courses/${test.courseSlug}`}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold text-center hover:bg-gray-200"
                  >
                    Повернутися до курсу
                  </Link>
                )}
                
                {test.attemptCount + 1 < test.maxAttempts && !testResult.passed && (
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Спробувати ще раз
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Test in progress
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Завантаження питань...</p>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const currentAnswer = answers[question.id]

  function formatAnswer(q: Question, answer: any): string {
    if (!answer && answer !== false) return 'Немає відповіді'
    
    switch (q.type) {
      case 'SINGLE_CHOICE':
        return q.options?.[answer] || 'Невідома відповідь'
      case 'MULTIPLE_CHOICE':
        return Array.isArray(answer) 
          ? answer.map(idx => q.options?.[idx]).join(', ')
          : 'Невідома відповідь'
      case 'TRUE_FALSE':
        return answer ? 'Так' : 'Ні'
      case 'TEXT':
        return answer
      default:
        return String(answer)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{test.title}</h1>
              <p className="text-sm text-gray-600">
                Питання {currentQuestion + 1} з {questions.length}
              </p>
            </div>
            
            {timeRemaining !== null && (
              <div className={`flex items-center gap-2 ${
                timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
            
            <div className="space-y-3">
              {question.type === 'SINGLE_CHOICE' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                        currentAnswer === idx
                          ? 'bg-blue-50 border-blue-300'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={idx}
                        checked={currentAnswer === idx}
                        onChange={() => submitAnswer(idx)}
                        className="mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {question.type === 'MULTIPLE_CHOICE' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, idx) => {
                    const selected = Array.isArray(currentAnswer) && currentAnswer.includes(idx)
                    
                    return (
                      <label
                        key={idx}
                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                          selected
                            ? 'bg-blue-50 border-blue-300'
                            : 'hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={idx}
                          checked={selected}
                          onChange={(e) => {
                            const newAnswer = currentAnswer || []
                            if (e.target.checked) {
                              submitAnswer([...newAnswer, idx])
                            } else {
                              submitAnswer(newAnswer.filter((i: number) => i !== idx))
                            }
                          }}
                          className="mr-3"
                        />
                        <span>{option}</span>
                      </label>
                    )
                  })}
                </div>
              )}
              
              {question.type === 'TRUE_FALSE' && (
                <div className="space-y-2">
                  <label
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                      currentAnswer === true
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value="true"
                      checked={currentAnswer === true}
                      onChange={() => submitAnswer(true)}
                      className="mr-3"
                    />
                    <span>Так</span>
                  </label>
                  
                  <label
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                      currentAnswer === false
                        ? 'bg-blue-50 border-blue-300'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value="false"
                      checked={currentAnswer === false}
                      onChange={() => submitAnswer(false)}
                      className="mr-3"
                    />
                    <span>Ні</span>
                  </label>
                </div>
              )}
              
              {question.type === 'TEXT' && (
                <textarea
                  value={currentAnswer || ''}
                  onChange={(e) => submitAnswer(e.target.value)}
                  placeholder="Введіть вашу відповідь..."
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              )}
            </div>
            
            <div className="text-sm text-gray-500 mt-6">
              Балів за питання: {question.points}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Попереднє
            </button>
            
            <div className="flex gap-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-10 h-10 rounded-lg ${
                    idx === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[questions[idx]?.id]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={submitTest}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                Завершити тест
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Наступне
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}