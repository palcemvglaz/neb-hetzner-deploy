'use client';

import HeroSection from '../components/HeroSection';
import ProblemSection from '../components/ProblemSection';
import SolutionSection from '../components/SolutionSection';
import TestimonialsSection from '../components/TestimonialsSection';
import OfferSection from '../components/OfferSection';
import FAQSection from '../components/FAQSection';
import FinalCTASection from '../components/FinalCTASection';
import FloatingStats from '../components/FloatingStats';

// Import assets
import statistics from '../assets/social-proof/statistics.json';

export default function HormoziLanding() {
  return (
    <main className="min-h-screen bg-black">
      {/* Floating Social Proof */}
      <FloatingStats stats={statistics.proof_points} version="hormozi" />

      {/* Aggressive red banner */}
      <div className="bg-nebachiv-orange text-white text-center py-2 px-4 animate-pulse">
        <p className="font-bold">
          ⚠️ УВАГА: 88% ДТП - через людський фактор. Новачки ризикують в 2.3 РАЗИ більше!
        </p>
      </div>

      {/* Main Sections */}
      <HeroSection version="hormozi" />
      <ProblemSection version="hormozi" />
      <SolutionSection version="hormozi" />
      <TestimonialsSection version="hormozi" />
      <OfferSection version="hormozi" />
      <FAQSection version="hormozi" />
      <FinalCTASection version="hormozi" />
    </main>
  );
}