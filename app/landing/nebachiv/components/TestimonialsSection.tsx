'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { getRandomTestimonials, realTestimonials } from '@/lib/data/real-testimonials';

interface TestimonialsSectionProps {
  version: 'ukrainian' | 'hormozi';
}

export default function TestimonialsSection({ version }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = getRandomTestimonials(7);

  const getRoleEmoji = (role?: string) => {
    if (!role) return '💬';
    if (role.includes('Інструктор')) return '🎓';
    if (role.includes('Початківець')) return '🌟';
    if (role.includes('Досвідчений')) return '⭐';
    if (role.includes('кур\'єр')) return '🚴';
    if (role.includes('мандрівн')) return '🗺️';
    return '🏍️';
  };

  return (
    <section className="py-20 px-4 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-5xl font-bold text-white mb-4 ${
            version === 'hormozi' ? 'uppercase' : ''
          }`}>
            {version === 'hormozi' 
              ? '750+ РЕАЛЬНИХ TESTIMONIALS. ОСЬ ФАКТИ:' 
              : '750+ реальних відгуків з доказами'
            }
          </h2>
          <p className="text-xl text-gray-300">
            {version === 'hormozi'
              ? 'Кожен відгук = чиєсь ЖИТТЯ. Читай і ДУМАЙ.'
              : 'Реальні історії від реальних мотоциклістів'
            }
          </p>
        </div>

        {/* Featured testimonial */}
        {testimonials[0] && (
          <div className={`mb-12 p-8 rounded-lg ${
            version === 'hormozi' 
              ? 'bg-nebachiv-orange/20 border-2 border-nebachiv-orange' 
              : 'bg-gray-900'
          }`}>
            <div className="flex items-start space-x-4">
              <span className="text-4xl">{getRoleEmoji(testimonials[0].role)}</span>
              <div className="flex-1">
                <p className="text-lg md:text-xl text-white mb-4 leading-relaxed">
                  "{testimonials[0].text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{testimonials[0].name}</p>
                    <p className="text-sm text-gray-400">
                      {testimonials[0].role} • {testimonials[0].location}
                    </p>
                  </div>
                  {testimonials[0].verified && (
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-sm text-green-400 font-medium">Перевірено</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(1, 7).map((testimonial) => (
            <Card 
              key={testimonial.id}
              className={`p-6 ${
                version === 'hormozi'
                  ? 'bg-gray-900 border-gray-700 hover:border-nebachiv-orange'
                  : 'bg-gray-900 border-gray-700 hover:border-nebachiv-blue'
              } transition-all cursor-pointer`}
            >
              <div className="flex items-start space-x-3 mb-4">
                <span className="text-2xl">{getRoleEmoji(testimonial.role)}</span>
                <div className="flex-1">
                  <p className="font-medium text-white">{testimonial.name}</p>
                  <p className={`text-xs ${
                    version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
                  }`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 line-clamp-4">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-400">{testimonial.location}</p>
                {testimonial.verified && (
                  <div className="flex items-center space-x-1 text-green-400">
                    <span>✓</span>
                    <span className="text-xs">Перевірено</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className={`text-2xl font-bold mb-4 ${
            version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
          }`}>
            {version === 'hormozi'
              ? 'НЕ СТАНЬ СТАТИСТИКОЮ. СТАНЬ ІСТОРІЄЮ УСПІХУ.'
              : 'Приєднуйся до тих, хто обрав життя'
            }
          </p>
          <button className={`px-8 py-4 rounded-lg font-bold text-lg ${
            version === 'hormozi'
              ? 'bg-nebachiv-orange hover:bg-nebachiv-orange/80 text-white animate-pulse'
              : 'bg-nebachiv-blue hover:bg-nebachiv-blue/80 text-white'
          }`}>
            {version === 'hormozi' 
              ? 'ПОЧАТИ НАВЧАННЯ'
              : 'Почати навчання'
            }
          </button>
        </div>
      </div>
    </section>
  );
}