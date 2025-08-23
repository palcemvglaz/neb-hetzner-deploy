'use client';

import { useState } from 'react';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import TestimonialsSection from './components/TestimonialsSection';
import OfferSection from './components/OfferSection';
import FAQSection from './components/FAQSection';
import FinalCTASection from './components/FinalCTASection';
import FloatingStats from './components/FloatingStats';

// Import assets
import headlines from './assets/copy/headlines.json';
import statistics from './assets/social-proof/statistics.json';

export default function NebachivLanding() {
  // Default to Ukrainian version
  const [version, setVersion] = useState<'ukrainian' | 'hormozi'>('ukrainian');
  
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Version Switcher (for testing) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 p-2 rounded-lg border border-gray-700">
          <button
            onClick={() => setVersion('ukrainian')}
            className={`px-3 py-1 rounded ${
              version === 'ukrainian' 
                ? 'bg-nebachiv-blue text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            🇺🇦 Ukrainian
          </button>
          <button
            onClick={() => setVersion('hormozi')}
            className={`ml-2 px-3 py-1 rounded ${
              version === 'hormozi' 
                ? 'bg-nebachiv-orange text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            🔥 Hormozi
          </button>
        </div>
      )}

      {/* Floating Social Proof */}
      <FloatingStats stats={statistics.proof_points} version={version} />

      {/* Main Sections */}
      <HeroSection version={version} />
      <ProblemSection version={version} />
      <SolutionSection version={version} />
      <TestimonialsSection version={version} />
      <OfferSection version={version} />
      <FAQSection version={version} />
      <FinalCTASection version={version} />
    </main>
  );
}