'use client';

import { useEffect, useState } from 'react';

interface FloatingStatsProps {
  stats: Array<{
    metric: string;
    label: string;
    icon: string;
  }>;
  version: 'ukrainian' | 'hormozi';
}

export default function FloatingStats({ stats, version }: FloatingStatsProps) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Rotate through stats every 3 seconds
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);

    // Show after 2 seconds
    setTimeout(() => setIsVisible(true), 2000);

    return () => clearInterval(interval);
  }, [stats.length]);

  const currentStat = stats[currentStatIndex];

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-40 ${
      version === 'hormozi' 
        ? 'bg-nebachiv-orange/20 border-2 border-nebachiv-orange' 
        : 'bg-gray-800 border border-gray-700'
    } p-4 rounded-lg shadow-xl transition-all duration-500 max-w-xs`}>
      <div className="flex items-center space-x-3">
        <div className="text-2xl">
          {getIconEmoji(currentStat.icon)}
        </div>
        <div>
          <div className={`text-2xl font-bold ${
            version === 'hormozi' ? 'text-nebachiv-orange' : 'text-nebachiv-blue'
          }`}>
            {currentStat.metric}
          </div>
          <div className="text-sm text-gray-300">
            {currentStat.label}
          </div>
        </div>
      </div>
      
      {/* Progress indicators */}
      <div className="flex space-x-1 mt-3">
        {stats.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded ${
              index === currentStatIndex
                ? version === 'hormozi' 
                  ? 'bg-nebachiv-orange' 
                  : 'bg-nebachiv-blue'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {version === 'hormozi' && (
        <div className="mt-2 text-xs text-nebachiv-orange-light font-bold">
          ⚠️ НЕ СТАНЬ СТАТИСТИКОЮ
        </div>
      )}
    </div>
  );
}

function getIconEmoji(icon: string): string {
  switch (icon) {
    case 'users': return '👥';
    case 'heart': return '💖';
    case 'chart': return '📊';
    case 'shield': return '🛡️';
    case 'alert': return '⚠️';
    case 'trending-down': return '📉';
    default: return '📈';
  }
}