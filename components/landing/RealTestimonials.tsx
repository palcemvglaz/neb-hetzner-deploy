'use client'

import { getRandomTestimonials, Testimonial } from '@/lib/data/real-testimonials'
import { StarIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

interface RealTestimonialsProps {
  count?: number
  title?: string
  subtitle?: string
  variant?: 'default' | 'apple' | 'hormozi'
}

export function RealTestimonials({ 
  count = 3, 
  title = 'Довіряють райдери по всьому світу',
  subtitle,
  variant = 'default'
}: RealTestimonialsProps) {
  const testimonials = getRandomTestimonials(count)

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${
      variant === 'hormozi' ? 'bg-gray-800' : 'bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-4xl font-bold text-center mb-4 ${
          variant === 'hormozi' ? 'text-white uppercase' : 'text-white'
        }`}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-xl text-gray-400 text-center mb-12">{subtitle}</p>
        )}
        
        <div className={`grid gap-6 ${
          count <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {testimonials.map((testimonial) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              variant={variant}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ 
  testimonial, 
  variant 
}: { 
  testimonial: Testimonial
  variant: 'default' | 'apple' | 'hormozi' 
}) {
  return (
    <div className={`p-6 rounded-2xl transition-all duration-300 ${
      variant === 'apple' 
        ? 'bg-gray-800 border border-gray-700 hover:border-nebachiv-blue/50'
        : variant === 'hormozi'
        ? 'bg-gray-900 border border-gray-700 hover:border-nebachiv-orange'
        : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-nebachiv-blue/50'
    }`}>
      {/* Rating */}
      <div className="flex mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <StarIcon 
            key={i} 
            className={`w-5 h-5 ${
              variant === 'hormozi' ? 'text-nebachiv-orange' : 'text-yellow-500'
            }`} 
          />
        ))}
      </div>
      
      {/* Text */}
      <p className="text-gray-300 mb-4 line-clamp-4">
        "{testimonial.text}"
      </p>
      
      {/* Author info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-sm text-gray-400">{testimonial.role}</div>
          {testimonial.location && (
            <div className="text-xs text-gray-500 mt-1">{testimonial.location}</div>
          )}
          {testimonial.courseCompleted && (
            <div className={`text-xs mt-2 ${
              variant === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
            }`}>
              Курс: {testimonial.courseCompleted}
            </div>
          )}
        </div>
        {testimonial.verified && (
          <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
        )}
      </div>
    </div>
  )
}