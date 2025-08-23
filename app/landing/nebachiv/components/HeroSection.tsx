'use client';

import { useState, useEffect } from 'react';
import WaitlistForm from './WaitlistForm';
import headlines from '../assets/copy/headlines.json';
import heroVideos from '../assets/videos/hero-videos.json';
import statistics from '../assets/social-proof/statistics.json';
import ctaTexts from '../assets/copy/cta-texts.json';

interface HeroSectionProps {
  version: 'ukrainian' | 'hormozi';
}

export default function HeroSection({ version }: HeroSectionProps) {
  const [showVideo, setShowVideo] = useState(false);
  const headlineData = headlines.headlines[version === 'ukrainian' ? 'ukrainian_version' : 'hormozi_version'];
  const socialProof = ctaTexts.social_proof_texts[version];
  const stats = statistics.statistics;

  // Get shock video for hero
  const shockVideo = heroVideos.videos.find(v => v.category === 'shock_content');
  
  // Extract YouTube video ID
  const getVideoId = (url: string) => {
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : '';
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Text & Form */}
          <div className="space-y-6">
            {/* Urgency banner for Hormozi version */}
            {version === 'hormozi' && (
              <div className="bg-nebachiv-orange/20 border-2 border-nebachiv-orange p-3 rounded-lg animate-pulse">
                <p className="text-nebachiv-orange-light text-center font-bold">
                  {headlineData.urgency}
                </p>
              </div>
            )}

            {/* Main headline */}
            <h1 className={`font-bold leading-tight ${
              version === 'hormozi' 
                ? 'text-4xl md:text-6xl text-white' 
                : 'text-3xl md:text-5xl text-white'
            }`}>
              {headlineData.main}
            </h1>

            {/* Subheadline */}
            <p className={`text-xl md:text-2xl ${
              version === 'hormozi' ? 'text-nebachiv-orange-light' : 'text-gray-300'
            }`}>
              {headlineData.sub}
            </p>

            {/* Social proof */}
            <div className="flex items-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">👥</span>
                <span>{socialProof[0].replace('{count}', stats.audience.youtube_subscribers.toString())}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✅</span>
                <span>{stats.impact.lives_saved.documented}+ врятованих</span>
              </div>
            </div>

            {/* Form */}
            <div className={`p-6 rounded-lg ${
              version === 'hormozi' 
                ? 'bg-gray-900 border-2 border-nebachiv-orange' 
                : 'bg-gray-800'
            }`}>
              <h3 className="text-xl font-bold text-white mb-4">
                {headlineData.cta}
              </h3>
              <WaitlistForm version={version} />
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="relative">
            {!showVideo ? (
              <div 
                className="relative cursor-pointer group"
                onClick={() => setShowVideo(true)}
              >
                {/* Video thumbnail */}
                <img
                  src={shockVideo?.thumbnail}
                  alt={shockVideo?.title}
                  className="w-full rounded-lg shadow-2xl"
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <div className="bg-nebachiv-orange w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>

                {/* Video title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-lg">
                  <p className="text-white font-semibold">{shockVideo?.title}</p>
                </div>
              </div>
            ) : (
              <div className="relative pb-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg shadow-2xl"
                  src={`https://www.youtube.com/embed/${getVideoId(shockVideo?.url || '')}?autoplay=1`}
                  title={shockVideo?.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Stats badges */}
            <div className="absolute -bottom-6 -left-6 bg-gray-800 p-4 rounded-lg shadow-xl">
              <p className="text-3xl font-bold text-nebachiv-orange">73%</p>
              <p className="text-sm text-gray-400">гинуть з ПДР</p>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-gray-800 p-4 rounded-lg shadow-xl">
              <p className="text-3xl font-bold text-green-500">89%</p>
              <p className="text-sm text-gray-400">менше ризику</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}