'use client'

import { useState } from 'react'
import { Star, ThumbsUp, User } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface Review {
  id: string
  userId: string
  userName: string
  userImage?: string
  rating: number
  comment: string
  createdAt: Date
  helpful: number
  userVoted?: boolean
}

interface CourseReviewsProps {
  courseId: string
  courseSlug: string
  reviews?: Review[]
  averageRating?: number
  totalReviews?: number
  userCanReview?: boolean
  onReviewSubmit?: (rating: number, comment: string) => Promise<void>
}

export default function CourseReviews({ 
  courseId, 
  courseSlug,
  reviews = [], 
  averageRating = 0,
  totalReviews = 0,
  userCanReview = false,
  onReviewSubmit
}: CourseReviewsProps) {
  const { data: session } = useSession()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'highest' | 'lowest'>('newest')

  // Mock data for demonstration
  const mockReviews: Review[] = reviews.length > 0 ? reviews : [
    {
      id: '1',
      userId: 'user1',
      userName: 'Олександр К.',
      rating: 5,
      comment: 'Відмінний курс! Принципи Небачива дійсно працюють. Вже двічі уникнув потенційних аварій завдяки знанням з курсу.',
      createdAt: new Date('2024-02-15'),
      helpful: 12,
      userVoted: false
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Марія П.',
      rating: 4,
      comment: 'Дуже корисний матеріал. Особливо сподобались практичні вправи. Мінус зірка за те, що хотілося б більше відео-прикладів.',
      createdAt: new Date('2024-02-10'),
      helpful: 8,
      userVoted: false
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Дмитро М.',
      rating: 5,
      comment: 'Це має знати кожен мотоцикліст! Шкода, що не пройшов цей курс раніше. Рекомендую всім.',
      createdAt: new Date('2024-02-05'),
      helpful: 15,
      userVoted: true
    }
  ]

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) return

    setIsSubmitting(true)
    try {
      if (onReviewSubmit) {
        await onReviewSubmit(rating, comment)
      } else {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      setShowReviewForm(false)
      setRating(0)
      setComment('')
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Sort reviews
  const sortedReviews = [...mockReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime()
      case 'helpful':
        return b.helpful - a.helpful
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = mockReviews.filter(r => r.rating === rating).length
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
    return { rating, count, percentage }
  })

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Відгуки про курс</h2>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{totalReviews || mockReviews.length} відгуків</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm w-3">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-yellow-400 h-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          {session && userCanReview ? (
            !showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Написати відгук
              </button>
            ) : null
          ) : session ? (
            <p className="text-gray-600 text-center">
              Завершіть курс, щоб залишити відгук
            </p>
          ) : (
            <p className="text-gray-600 text-center">
              <a href="/login" className="text-blue-600 hover:underline">Увійдіть</a>, 
              щоб залишити відгук
            </p>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Ваш відгук</h3>
          
          {/* Rating Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Оцінка
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Коментар
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Поділіться своїми враженнями від курсу..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmitReview}
              disabled={!rating || !comment.trim() || isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Відправка...' : 'Опублікувати'}
            </button>
            <button
              onClick={() => {
                setShowReviewForm(false)
                setRating(0)
                setComment('')
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Скасувати
            </button>
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Всі відгуки</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Найновіші</option>
          <option value="helpful">Найкорисніші</option>
          <option value="highest">Найвища оцінка</option>
          <option value="lowest">Найнижча оцінка</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                {review.userImage ? (
                  <img src={review.userImage} alt={review.userName} className="w-full h-full rounded-full" />
                ) : (
                  <User className="w-6 h-6 text-gray-500" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.userName}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.createdAt.toLocaleDateString('uk-UA')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                <button className={`flex items-center gap-2 text-sm ${
                  review.userVoted ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}>
                  <ThumbsUp className="w-4 h-4" />
                  Корисно ({review.helpful})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedReviews.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          Ще немає відгуків. Будьте першим!
        </p>
      )}
    </div>
  )
}