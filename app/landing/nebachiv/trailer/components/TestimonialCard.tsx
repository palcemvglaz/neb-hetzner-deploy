'use client';

import { useEffect, useState } from 'react';

interface TestimonialCardProps {
  text: string;
  author: string;
  category?: string;
  likes?: number;
}

export default function TestimonialCard({ text, author, category, likes }: TestimonialCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-32 bg-gradient-to-b from-gray-50/50 to-white">
      <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
      }`}>
        {/* Quote mark with blur effect */}
        <div className="text-8xl md:text-9xl lg:text-[10rem] text-gray-100 mb-12 font-light leading-none select-none">
          "
        </div>
        
        {/* Testimonial text with Apple typography */}
        <blockquote className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 font-light leading-tight tracking-tight mb-16 max-w-4xl mx-auto">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            {text}
          </span>
        </blockquote>
        
        {/* Author section with glass morphism */}
        <div className="space-y-4">
          <p className="text-xl md:text-2xl font-medium text-gray-900 tracking-wide">
            {author}
          </p>
          
          {/* Category badge with Apple-style design */}
          {category && (
            <div className="flex justify-center">
              <span className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-xl text-gray-700 text-sm font-medium rounded-full border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                {getCategoryLabel(category)}
              </span>
            </div>
          )}
          
          {/* Likes with subtle design */}
          {likes && likes > 0 && (
            <p className="text-gray-400 text-sm font-light tracking-wide">
              {likes} {likes === 1 ? 'вподобання' : 'вподобань'}
            </p>
          )}
        </div>
        
        {/* Apple-style scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-60">
          <div className="w-6 h-10 border border-gray-300 rounded-full flex justify-center bg-white/50 backdrop-blur-sm">
            <div className="w-0.5 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'life_saved': return 'Врятоване життя';
    case 'transformation': return 'Трансформація';
    case 'professional_validation': return 'Експертна думка';
    case 'family_impact': return 'Вплив на родину';
    case 'practical_application': return 'Практичний досвід';
    case 'ukrainian_content': return 'Українська якість';
    default: return 'Відгук';
  }
}