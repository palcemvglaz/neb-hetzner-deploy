'use client';

import { useState, useEffect } from 'react';

interface EmailCTAProps {
  title: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
}

export default function EmailCTA({ 
  title, 
  subtitle, 
  placeholder = "your@email.com",
  buttonText = "Дізнатися більше"
}: EmailCTAProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'nebachiv_trailer',
          metadata: {
            landingVersion: 'trailer',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('Щось пішло не так');
      }

      setSuccess(true);
      setEmail('');
      
      // Reset success state after 4 seconds
      setTimeout(() => setSuccess(false), 4000);

    } catch (err) {
      setError('Помилка. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8 py-32 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="max-w-3xl mx-auto text-center">
          {/* Apple-style success animation */}
          <div className="w-20 h-20 mx-auto mb-8 bg-nebachiv-blue/200 rounded-full flex items-center justify-center transform scale-0 animate-[scale-in_0.5s_ease-out_forwards]">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 font-light mb-6 tracking-tight">
            Дякуємо!
          </h3>
          <p className="text-lg md:text-xl text-gray-600 font-light tracking-wide">
            Ми скоро з вами зв'яжемося
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-32 bg-gradient-to-b from-gray-50/30 to-white">
      <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
      }`}>
        {/* Title with Apple typography */}
        {title && (
          <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-900 font-light mb-8 tracking-tight leading-tight">
            {title}
          </h3>
        )}
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-16 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
            {subtitle}
          </p>
        )}
        
        {/* Apple-style email form */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="relative">
            {/* Email input with Apple design */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                required
                className={`w-full px-8 py-6 text-lg font-light bg-white/80 backdrop-blur-xl border-2 rounded-2xl transition-all duration-300 outline-none ${
                  isFocused 
                    ? 'border-nebachiv-blue shadow-xl shadow-nebachiv-blue/10 bg-white' 
                    : 'border-gray-200/50 shadow-lg hover:shadow-xl'
                } placeholder:text-gray-400 placeholder:font-light`}
              />
              
              {/* Floating label effect */}
              <div className={`absolute left-8 transition-all duration-300 pointer-events-none ${
                isFocused || email 
                  ? 'top-2 text-xs text-nebachiv-blue font-medium' 
                  : 'top-6 text-lg text-gray-400 font-light'
              }`}>
                {isFocused || email ? 'Email адреса' : ''}
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !email}
              className={`mt-6 w-full px-8 py-6 text-lg font-medium rounded-2xl transition-all duration-300 ${
                loading || !email
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-nebachiv-blue hover:bg-nebachiv-blue/80 text-white shadow-lg hover:shadow-xl hover:shadow-nebachiv-blue/25 transform hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Обробка...</span>
                </div>
              ) : (
                buttonText
              )}
            </button>
          </div>
          
          {/* Error message */}
          {error && (
            <p className="text-nebachiv-orange text-sm mt-4 font-light">{error}</p>
          )}
          
          {/* Privacy note */}
          <p className="text-gray-400 text-sm mt-8 font-light tracking-wide">
            Ваші дані захищені та не передаються третім особам
          </p>
        </form>
      </div>
      
      <style jsx>{`
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}