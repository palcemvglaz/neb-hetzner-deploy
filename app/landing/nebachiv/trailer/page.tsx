'use client';

import ScrollFlow from './components/ScrollFlow';
import TestimonialCard from './components/TestimonialCard';
import FactCard from './components/FactCard';
import EmailCTA from './components/EmailCTA';

// Import testimonials data
import heroTestimonials from '../assets/testimonials/hero-testimonials.json';

export default function TrailerPage() {
  // Select the best testimonials for the trailer
  const selectedTestimonials = [
    heroTestimonials.testimonials[0], // Володимир К. - life saved
    heroTestimonials.testimonials[1], // Катерина П. - transformation  
    heroTestimonials.testimonials[5], // StanislavM - expert validation
    heroTestimonials.testimonials[3], // Оксана - family impact
    heroTestimonials.testimonials[4], // vova10158 - Europe journey
    heroTestimonials.testimonials[8]  // valentinfaybula - best content
  ];

  return (
    <div className="bg-white text-gray-900 font-light">
      <ScrollFlow>
        {/* Apple-style Header */}
        <div className="min-h-screen flex items-center justify-center px-8 py-32 bg-gradient-to-b from-white via-gray-50/30 to-white">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight text-gray-900 mb-12 leading-tight tracking-tight">
              <span className="bg-gradient-to-b from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Що кажуть про Nebachiv
              </span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-3xl mx-auto font-light tracking-wide leading-relaxed">
              Реальні історії від тих, хто навчився виживати на дорозі
            </p>
            
            {/* Apple-style decorative dots */}
            <div className="flex justify-center items-center mt-16 space-x-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        {/* Testimonial 1 - Life saved */}
        <TestimonialCard
          text={selectedTestimonials[0].text}
          author={selectedTestimonials[0].author}
          category={selectedTestimonials[0].category}
          likes={selectedTestimonials[0].engagement.likes}
        />

        {/* Testimonial 2 - Transformation */}
        <TestimonialCard
          text={selectedTestimonials[1].text}
          author={selectedTestimonials[1].author}
          category={selectedTestimonials[1].category}
          likes={selectedTestimonials[1].engagement.likes}
        />

        {/* CTA 1 */}
        <EmailCTA
          title="Дізнатися більше"
          subtitle="Приєднайтесь до тих, хто обрав безпеку"
        />

        {/* Testimonial 3 - Expert validation */}
        <TestimonialCard
          text={selectedTestimonials[2].text}
          author={selectedTestimonials[2].author}
          category={selectedTestimonials[2].category}
          likes={selectedTestimonials[2].engagement.likes}
        />

        {/* Fact 1 */}
        <FactCard
          number="50+"
          label="врятованих життів"
          description="Задокументовані історії тих, хто уникнув аварій завдяки навчанню"
        />

        {/* Testimonial 4 - Family impact */}
        <TestimonialCard
          text={selectedTestimonials[3].text}
          author={selectedTestimonials[3].author}
          category={selectedTestimonials[3].category}
          likes={selectedTestimonials[3].engagement.likes}
        />

        {/* Testimonial 5 - Practical application */}
        <TestimonialCard
          text={selectedTestimonials[4].text}
          author={selectedTestimonials[4].author}
          category={selectedTestimonials[4].category}
          likes={selectedTestimonials[4].engagement.likes}
        />

        {/* Fact 2 */}
        <FactCard
          number="12,000+"
          label="проаналізованих аварій"
          description="Кожен урок базується на реальних випадках з українських доріг"
        />

        {/* CTA 2 */}
        <EmailCTA
          title="Почати навчання"
          subtitle="Дізнайтесь про систему, що рятує життя"
        />

        {/* Testimonial 6 - Quality recognition */}
        <TestimonialCard
          text={selectedTestimonials[5].text}
          author={selectedTestimonials[5].author}
          category={selectedTestimonials[5].category}
          likes={selectedTestimonials[5].engagement.likes}
        />

        {/* Final fact */}
        <FactCard
          number="18"
          label="років без аварій"
          description="Досвід засновника Chyngyz Nebachiv на українських дорогах"
        />

        {/* Final CTA with Apple polish */}
        <div className="min-h-screen flex items-center justify-center px-8 py-32 bg-gradient-to-b from-white to-gray-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 font-extralight mb-16 tracking-tight leading-tight">
              Приєднуйтесь до спільноти
            </h3>
            
            <div className="max-w-lg mx-auto">
              <EmailCTA
                title=""
                placeholder="your@email.com"
                buttonText="Дізнатися більше"
              />
            </div>
            
            {/* Apple-style discrete branding */}
            <div className="mt-24 pt-12">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8"></div>
              <p className="text-sm text-gray-400 font-light tracking-widest uppercase">
                Nebachiv
              </p>
              <p className="text-xs text-gray-300 mt-2 font-light">
                Система виживання для мотоциклістів
              </p>
            </div>
          </div>
        </div>
      </ScrollFlow>
    </div>
  );
}