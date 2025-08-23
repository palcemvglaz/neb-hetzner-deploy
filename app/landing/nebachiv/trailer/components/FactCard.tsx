'use client';

import { useEffect, useState } from 'react';

interface FactCardProps {
  number: string;
  label: string;
  description?: string;
}

export default function FactCard({ number, label, description }: FactCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Animated counter effect
  useEffect(() => {
    if (isVisible) {
      const targetNumber = parseInt(number.replace(/[^0-9]/g, '')) || 0;
      const duration = 2000;
      const steps = 60;
      const increment = targetNumber / steps;
      
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          setCount(targetNumber);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, number]);

  const displayNumber = number.includes('+') ? `${count}+` : 
                       number.includes('к') ? `${count}к` :
                       count.toString();

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-32 bg-gradient-to-b from-white to-gray-50/30">
      <div className={`max-w-3xl mx-auto text-center transition-all duration-1200 ease-out ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'
      }`}>
        {/* Large number with Apple typography */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl lg:text-[14rem] xl:text-[16rem] font-extralight leading-none">
            <span className="bg-gradient-to-b from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              {displayNumber}
            </span>
          </div>
          
          {/* Subtle shadow effect */}
          <div className="absolute inset-0 text-8xl md:text-9xl lg:text-[14rem] xl:text-[16rem] font-extralight leading-none text-gray-200 opacity-30 transform translate-x-1 translate-y-1 -z-10">
            {displayNumber}
          </div>
        </div>
        
        {/* Label with premium spacing */}
        <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 font-light mb-8 tracking-tight">
          {label}
        </h3>
        
        {/* Description with perfect typography */}
        {description && (
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            {description}
          </p>
        )}
        
        {/* Apple-style decorative element */}
        <div className="flex justify-center items-center mt-12 space-x-2">
          <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </div>
  );
}