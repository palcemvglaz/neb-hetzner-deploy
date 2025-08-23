'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Info, Check, AlertCircle, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonInline } from '@/components/ui/button-inline'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import MotorcycleAutocomplete from '@/components/forms/MotorcycleAutocomplete'
import { 
  BEGINNER_QUESTIONNAIRE, 
  calculateBeginnerProfile,
  type QuestionnaireQuestion 
} from '@/data/questionnaire-beginner'
import { 
  EXPERIENCED_QUESTIONNAIRE, 
  calculateExperiencedProfile 
} from '@/data/questionnaire-experienced'

interface QuestionnairePageProps {
  type?: 'beginner' | 'experienced'
}

export default function QuestionnairePage({ type: initialType }: QuestionnairePageProps = {}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentAnswer, setCurrentAnswer] = useState<any>(null)
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireQuestion[]>(
    initialType === 'experienced' ? EXPERIENCED_QUESTIONNAIRE : BEGINNER_QUESTIONNAIRE
  )
  const [questionnaireType, setQuestionnaireType] = useState<'beginner' | 'experienced'>(
    initialType || 'beginner'
  )
  const [startTime] = useState(Date.now())
  const [timePerQuestion, setTimePerQuestion] = useState<Record<string, number>>({})
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [showOtherInput, setShowOtherInput] = useState<Record<string, boolean>>({})
  const [otherInputValues, setOtherInputValues] = useState<Record<string, string>>({})
  const [showTypeSelection, setShowTypeSelection] = useState(!initialType)

  // Get visible questions based on conditions
  const getVisibleQuestions = () => {
    return questionnaire.filter(q => {
      // Check if question should be shown based on dependencies
      if (q.dependsOn) {
        const dependentAnswer = answers[q.dependsOn.questionId]
        if (!dependentAnswer) return false
        
        switch (q.dependsOn.condition) {
          case 'equals':
            return dependentAnswer === q.dependsOn.value
          case 'not_equals':
            return dependentAnswer !== q.dependsOn.value
          case 'includes':
            return Array.isArray(dependentAnswer) 
              ? dependentAnswer.includes(q.dependsOn.value)
              : dependentAnswer?.includes?.(q.dependsOn.value)
          case 'not_includes':
            return Array.isArray(dependentAnswer)
              ? !dependentAnswer.includes(q.dependsOn.value)
              : !dependentAnswer?.includes?.(q.dependsOn.value)
          default:
            return true
        }
      }
      
      // Check skip conditions
      if (q.skipIf) {
        const skipAnswer = answers[q.skipIf.questionId]
        if (!skipAnswer) return true
        
        switch (q.skipIf.condition) {
          case 'equals':
            return skipAnswer !== q.skipIf.value
          case 'not_equals':
            return skipAnswer === q.skipIf.value
          case 'includes':
            return Array.isArray(skipAnswer)
              ? !skipAnswer.includes(q.skipIf.value)
              : !skipAnswer?.includes?.(q.skipIf.value)
          default:
            return true
        }
      }
      
      return true
    })
  }

  const visibleQuestions = getVisibleQuestions()
  const currentQuestion = visibleQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / visibleQuestions.length) * 100

  // Removed automatic redirection - now users choose at the start

  // Track time per question
  useEffect(() => {
    setQuestionStartTime(Date.now())
    
    // Initialize answer for current question (only on question change, not on answers change)
    const currentQuestion = visibleQuestions[currentQuestionIndex]
    if (currentQuestion) {
      const existingAnswer = answers[currentQuestion.id]
      if (existingAnswer !== undefined) {
        setCurrentAnswer(existingAnswer)
      } else {
        // Set default values for specific question types
        if (currentQuestion.id === 'e1_3') {
          setCurrentAnswer('5') // Default skill level for question e1_3
        } else if (currentQuestion.type === 'number') {
          setCurrentAnswer('5') // Default for other number questions
        } else {
          setCurrentAnswer(null)
        }
      }
    }
  }, [currentQuestionIndex]) // Remove answers dependency to prevent overwriting user input

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isSubmitting) {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentAnswer, currentQuestionIndex, isSubmitting])

  const handleNext = () => {
    if (currentQuestion?.required && !currentAnswer) {
      toast.error('Це питання є обов\'язковим')
      return
    }

    // Check if "Інше" is selected but no custom text provided
    if (currentAnswer === 'Інше' && !otherInputValues[currentQuestion?.id]) {
      toast.error('Будь ласка, вкажіть свій варіант')
      return
    }
    if (Array.isArray(currentAnswer) && currentAnswer.includes('Інше') && !otherInputValues[currentQuestion?.id]) {
      toast.error('Будь ласка, вкажіть свій варіант')
      return
    }

    // Save time spent on question
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
    setTimePerQuestion(prev => ({
      ...prev,
      [currentQuestion?.id]: timeSpent
    }))

    // Save answer with custom text if "Інше" was selected
    if (currentAnswer !== null) {
      let finalAnswer = currentAnswer
      
      // For single choice with "Інше"
      if (currentAnswer === 'Інше' && otherInputValues[currentQuestion?.id]) {
        finalAnswer = `Інше: ${otherInputValues[currentQuestion?.id]}`
      }
      
      // For multiple choice with "Інше"
      if (Array.isArray(currentAnswer) && currentAnswer.includes('Інше') && otherInputValues[currentQuestion?.id]) {
        finalAnswer = currentAnswer.map(ans => 
          ans === 'Інше' ? `Інше: ${otherInputValues[currentQuestion?.id]}` : ans
        )
      }
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestion?.id]: finalAnswer
      }))
    }

    // Move to next question or finish
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      // Don't reset currentAnswer here - useEffect will handle it
      // Clear "Інше" input for next question
      setShowOtherInput({})
      setOtherInputValues({})
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      // useEffect will handle setting currentAnswer for the previous question
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Calculate profile
    const calculatedProfile = questionnaireType === 'beginner'
      ? calculateBeginnerProfile(answers)
      : calculateExperiencedProfile(answers)

    setProfile(calculatedProfile)

    // Extract motorcycle data if present
    const motorcycleAnswer = answers['b1_6'] || answers['e1_4']
    let motorcycleData = undefined
    if (motorcycleAnswer && typeof motorcycleAnswer === 'string') {
      // Parse motorcycle name to extract basic info
      const parts = motorcycleAnswer.split(' ')
      motorcycleData = {
        brand: parts[0] || 'Unknown',
        model: parts.slice(1).join(' ') || 'Unknown',
        fullName: motorcycleAnswer,
        engineSize: 0 // Would need to look up from database
      }
    }

    // Save to database via API
    try {
      const response = await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: questionnaireType,
          answers,
          profile: calculatedProfile,
          timePerQuestion,
          totalTime: Math.round((Date.now() - startTime) / 1000),
          motorcycleData
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save questionnaire')
      }

      const result = await response.json()
      console.log('Questionnaire saved:', result)
      
      // Store profile ID for linking
      if (result.profileId) {
        setProfile(prev => ({ ...prev, profileId: result.profileId }))
      }
      
      toast.success('Questionnaire completed and saved!')
      setShowResults(true)
    } catch (error) {
      console.error('Error submitting questionnaire:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save results')
      // Still show results even if save failed
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.type) {
      case 'single_choice':
        return (
          <>
            <RadioGroup value={currentAnswer || ''} onValueChange={(value) => {
              setCurrentAnswer(value)
              // Show input field if "Інше" is selected
              if (value === 'Інше') {
                setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: true })
              } else {
                setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: false })
              }
            }}>
              <div className="space-y-2">
                {currentQuestion.options?.map((option) => (
                  <div 
                    key={option} 
                    className={cn(
                      "flex items-start space-x-2 p-2.5 rounded-lg transition-all cursor-pointer",
                      currentAnswer === option 
                        ? "bg-blue-900/30 border border-blue-500" 
                        : "hover:bg-gray-700/50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentAnswer(option)
                      if (option === 'Інше') {
                        setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: true })
                      } else {
                        setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: false })
                      }
                    }}
                    onDoubleClick={() => {
                      if (option !== 'Інше') {
                        setCurrentAnswer(option)
                        handleNext()
                      }
                    }}
                  >
                    <RadioGroupItem 
                      value={option} 
                      id={option} 
                      className="mt-1 border-gray-500 text-blue-500" 
                    />
                    <Label 
                      htmlFor={option} 
                      className={cn(
                        "cursor-pointer transition-colors flex-1",
                        currentAnswer === option ? "text-white font-medium" : "text-gray-200 hover:text-white"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentAnswer(option)
                        if (option === 'Інше') {
                          setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: true })
                        } else {
                          setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: false })
                        }
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        if (option !== 'Інше') {
                          setCurrentAnswer(option)
                          handleNext()
                        }
                      }}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {/* Show input field for "Інше" */}
            {showOtherInput[currentQuestion.id] && (
              <div className="mt-3">
                <Input
                  type="text"
                  placeholder="Вкажіть свій варіант..."
                  value={otherInputValues[currentQuestion.id] || ''}
                  onChange={(e) => {
                    setOtherInputValues({ 
                      ...otherInputValues, 
                      [currentQuestion.id]: e.target.value 
                    })
                  }}
                  className="w-full bg-gray-800 border-gray-700 text-white"
                  autoFocus
                />
              </div>
            )}
          </>
        )

      case 'multiple_choice':
        return (
          <>
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => {
                const isChecked = (currentAnswer || []).includes(option)
                return (
                  <div 
                    key={option} 
                    className={cn(
                      "flex items-start space-x-2 p-2.5 rounded-lg transition-all cursor-pointer",
                      isChecked 
                        ? "bg-blue-900/30 border border-blue-500" 
                        : "hover:bg-gray-700/50"
                    )}
                    onClick={(e) => {
                      // Let the checkbox handle the click when clicking on the label
                      if (e.target === e.currentTarget) {
                        const current = currentAnswer || []
                        if (option === 'Інше') {
                          if (!isChecked) {
                            setCurrentAnswer([...current, option])
                            setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: true })
                          } else {
                            setCurrentAnswer(current.filter((v: string) => v !== option))
                            setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: false })
                          }
                        } else {
                          if (isChecked) {
                            setCurrentAnswer(current.filter((v: string) => v !== option))
                          } else {
                            setCurrentAnswer([...current, option])
                          }
                        }
                      }
                    }}
                  >
                    <Checkbox
                      id={option}
                      checked={isChecked}
                      className="mt-1 border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      onCheckedChange={(checked) => {
                        const current = currentAnswer || []
                        if (option === 'Інше') {
                          if (checked) {
                            setCurrentAnswer([...current, option])
                            setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: true })
                          } else {
                            setCurrentAnswer(current.filter((v: string) => v !== option))
                            setShowOtherInput({ ...showOtherInput, [currentQuestion.id]: false })
                          }
                        } else {
                          if (checked) {
                            setCurrentAnswer([...current, option])
                          } else {
                            setCurrentAnswer(current.filter((v: string) => v !== option))
                          }
                        }
                      }}
                    />
                    <Label 
                      htmlFor={option} 
                      className={cn(
                        "cursor-pointer transition-colors flex-1",
                        isChecked ? "text-white font-medium" : "text-gray-200 hover:text-white"
                      )}
                    >
                      {option}
                    </Label>
                  </div>
                )
              })}
            </div>
            {/* Show input field for "Інше" */}
            {showOtherInput[currentQuestion.id] && (
              <div className="mt-3">
                <Input
                  type="text"
                  placeholder="Вкажіть свій варіант..."
                  value={otherInputValues[currentQuestion.id] || ''}
                  onChange={(e) => {
                    setOtherInputValues({ 
                      ...otherInputValues, 
                      [currentQuestion.id]: e.target.value 
                    })
                  }}
                  className="w-full bg-gray-800 border-gray-700 text-white"
                  autoFocus
                />
              </div>
            )}
          </>
        )

      case 'text':
        return (
          <Textarea
            value={currentAnswer || ''}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full min-h-[100px] bg-gray-800 border-gray-700 text-white"
            maxLength={currentQuestion.validationRules?.maxLength}
          />
        )

      case 'number':
        // Special handling for skill level slider (question e1_3)
        if (currentQuestion.id === 'e1_3') {
          return (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400">
                <span>1 - Новачок з мотошколи</span>
                <span>10 - Все знаю все вмію</span>
              </div>
              <Slider
                value={[parseInt(currentAnswer || '5')]}
                onValueChange={(value) => setCurrentAnswer(value[0].toString())}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900/50 text-2xl font-bold text-blue-400">
                  {currentAnswer || 5}
                </span>
              </div>
            </div>
          )
        }
        // Regular number input for other questions
        return (
          <Input
            type="number"
            value={currentAnswer || ''}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full bg-gray-800 border-gray-700 text-white"
          />
        )

      case 'motorcycle_select':
        return (
          <MotorcycleAutocomplete
            value={currentAnswer}
            onChange={(moto) => setCurrentAnswer(moto?.fullName || null)}
            placeholder={currentQuestion.placeholder}
            required={currentQuestion.required}
            userExperience="beginner"
          />
        )

      case 'slider':
        if (currentQuestion.sliderConfig) {
          const config = currentQuestion.sliderConfig
          const value = currentAnswer || config.defaultValue || config.min
          return (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{config.min}</span>
                <span>{config.max}</span>
              </div>
              <Slider
                value={[parseInt(value)]}
                onValueChange={(value) => setCurrentAnswer(value[0].toString())}
                max={config.max}
                min={config.min}
                step={config.step || 1}
                className="w-full"
              />
              <div className="text-center">
                <div className="inline-flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-blue-900/50">
                  <span className="text-3xl font-bold text-blue-400">
                    {value}
                  </span>
                  {config.label && (
                    <span className="text-sm text-gray-300 mt-2">
                      {config.label(parseInt(value))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        }
        return null

      default:
        return null
    }
  }

  if (showResults && profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-gray-800 rounded-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Ваш профіль райдера</h1>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/50 text-blue-400">
              {profile.profile}
            </div>
          </div>

          {profile.redFlags && profile.redFlags.length > 0 && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <h3 className="text-red-400 font-semibold mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Виявлено проблеми з безпекою
              </h3>
              <ul className="list-disc list-inside text-red-300 space-y-1">
                {profile.redFlags.map((flag: string, i: number) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-6">
            {/* Profile description */}
            {profile.profileDescription && (
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Опис профілю</h3>
                <p className="text-gray-300">{profile.profileDescription}</p>
              </div>
            )}

            {/* Metrics display */}
            {profile.metrics && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Ваші характеристики</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <span className="text-xs text-gray-400">Рівень ризику</span>
                    <p className="text-xl font-bold text-red-400">{profile.metrics.riskTaking}</p>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <span className="text-xs text-gray-400">Технічні навички</span>
                    <p className="text-xl font-bold text-green-400">{profile.metrics.technicalSkills}</p>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <span className="text-xs text-gray-400">Самооцінка</span>
                    <p className="text-xl font-bold text-blue-400">{profile.metrics.adequacy}</p>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <span className="text-xs text-gray-400">Індекс безпеки</span>
                    <p className="text-xl font-bold text-cyan-400">{profile.metrics.safetyIndex}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Old characteristics display if no metrics */}
            {!profile.metrics && profile.characteristics && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Ваші характеристики</h3>
                <ul className="space-y-2">
                  {profile.characteristics.map((char: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-1.5" />
                      <span className="text-gray-300">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <ButtonInline
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600"
            >
              На головну
            </ButtonInline>
            {profile.profileId && (
              <ButtonInline
                onClick={() => router.push(`/profile/${profile.profileId}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Детальний профіль
              </ButtonInline>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Show type selection screen
  if (showTypeSelection) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Оберіть тип анкети</h1>
            <p className="text-gray-400">Виберіть варіант, який найкраще описує ваш досвід</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Beginner Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
              onClick={() => {
                setQuestionnaireType('beginner')
                setQuestionnaire(BEGINNER_QUESTIONNAIRE)
                setShowTypeSelection(false)
              }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-900/50 rounded-full mb-4 mx-auto">
                <span className="text-3xl">🏍️</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">Початківець</h2>
              <p className="text-gray-400 text-sm text-center mb-4">
                Для тих, хто тільки починає або має досвід до 1 року
              </p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ще не маю мотоцикла</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>В мотошколі або щойно закінчив</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Їжджу менше року</span>
                </li>
              </ul>
            </motion.div>

            {/* Experienced Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-orange-500 transition-all cursor-pointer"
              onClick={() => {
                setQuestionnaireType('experienced')
                setQuestionnaire(EXPERIENCED_QUESTIONNAIRE)
                setShowTypeSelection(false)
              }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-orange-900/50 rounded-full mb-4 mx-auto">
                <span className="text-3xl">🏁</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">Досвідчений</h2>
              <p className="text-gray-400 text-sm text-center mb-4">
                Для тих, хто їздить більше року
              </p>
              <ul className="text-gray-300 text-sm space-y-1">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Їжджу більше року</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Маю кілька мотоциклів</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Їжджу в далекі подорожі</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Не впевнені? Почніть з анкети для початківців
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-screen">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 pb-2">
          {/* User info and badge */}
          {session?.user && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{session.user.email}</span>
              </div>
              <Badge className={cn(
                "px-2 py-1 text-xs",
                questionnaireType === 'beginner' 
                  ? "bg-blue-900/50 text-blue-400 border-blue-800" 
                  : "bg-orange-900/50 text-orange-400 border-orange-800"
              )}>
                {questionnaireType === 'beginner' ? '🏍️ Початківець' : '🏁 Досвідчений'}
              </Badge>
            </div>
          )}
          
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Питання {currentQuestionIndex + 1} з {visibleQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-4">
          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-800 rounded-xl p-5"
            >
              {currentQuestion && (
                <>
                  <div className="mb-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      {currentQuestion.blockName}
                    </span>
                    <h2 className="text-lg font-semibold text-white mt-1 leading-tight">
                      {currentQuestion.text}
                    </h2>
                    {currentQuestion.required && (
                      <span className="text-red-400 text-sm">* Обов'язково</span>
                    )}
                  </div>

                  <div className="mt-4">
                    {renderQuestion()}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Navigation - with padding for mobile nav */}
        <div className="flex-shrink-0 p-4 pb-28 bg-gray-900 border-t border-gray-800">
          <div className="flex justify-between gap-4">
            <ButtonInline
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              size="lg"
              leftIcon={<ChevronLeft className="w-5 h-5" />}
              className="px-6 py-3 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-1 max-w-[150px] rounded-xl font-medium"
            >
              Назад
            </ButtonInline>

            <ButtonInline
              onClick={handleNext}
              disabled={isSubmitting}
              size="lg"
              rightIcon={<ChevronRight className="w-5 h-5" />}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium flex-1 max-w-[150px] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all"
            >
              {currentQuestionIndex === visibleQuestions.length - 1 ? 'Завершити' : 'Далі'}
            </ButtonInline>
          </div>
        </div>
      </div>
    </div>
  )
}