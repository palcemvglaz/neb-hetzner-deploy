'use client';

import { useEffect } from 'react';

interface ScrollFlowProps {
  children: React.ReactNode;
}

export default function ScrollFlow({ children }: ScrollFlowProps) {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="scroll-container">
      {children}
      
      <style jsx>{`
        .scroll-container {
          scroll-snap-type: y mandatory;
        }
        
        .scroll-container > :global(div) {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
        
        /* Custom scrollbar */
        :global(html) {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }
        
        :global(::-webkit-scrollbar) {
          width: 6px;
        }
        
        :global(::-webkit-scrollbar-track) {
          background: #f7fafc;
        }
        
        :global(::-webkit-scrollbar-thumb) {
          background: #cbd5e0;
          border-radius: 3px;
        }
        
        :global(::-webkit-scrollbar-thumb:hover) {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}