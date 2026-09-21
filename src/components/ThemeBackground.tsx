import React from 'react';

interface ThemeBackgroundProps {
  theme: 'light' | 'dark';
}

// Pre-calculated deterministic star coordinates for Lailatul Qadr starry sky
const STARS = [
  { top: '8%', left: '12%', size: 2, delay: 'animate-twinkle' },
  { top: '14%', left: '28%', size: 1.5, delay: 'animate-twinkle-delay-1' },
  { top: '6%', left: '45%', size: 2.5, delay: 'animate-twinkle-delay-2' },
  { top: '18%', left: '62%', size: 1, delay: 'animate-twinkle' },
  { top: '10%', left: '78%', size: 3, delay: 'animate-twinkle-delay-1' },
  { top: '22%', left: '88%', size: 1.5, delay: 'animate-twinkle-delay-2' },
  { top: '28%', left: '8%', size: 2, delay: 'animate-twinkle-delay-1' },
  { top: '35%', left: '22%', size: 1, delay: 'animate-twinkle' },
  { top: '25%', left: '38%', size: 2, delay: 'animate-twinkle-delay-2' },
  { top: '32%', left: '52%', size: 2.5, delay: 'animate-twinkle' },
  { top: '29%', left: '71%', size: 1.5, delay: 'animate-twinkle-delay-1' },
  { top: '38%', left: '85%', size: 2, delay: 'animate-twinkle' },
  { top: '45%', left: '15%', size: 1, delay: 'animate-twinkle-delay-2' },
  { top: '52%', left: '30%', size: 2, delay: 'animate-twinkle' },
  { top: '48%', left: '48%', size: 1.5, delay: 'animate-twinkle-delay-1' },
  { top: '56%', left: '65%', size: 2, delay: 'animate-twinkle-delay-2' },
  { top: '42%', left: '80%', size: 1.5, delay: 'animate-twinkle' },
  { top: '65%', left: '10%', size: 2, delay: 'animate-twinkle-delay-1' },
  { top: '72%', left: '25%', size: 1.5, delay: 'animate-twinkle-delay-2' },
  { top: '68%', left: '42%', size: 2, delay: 'animate-twinkle' },
  { top: '78%', left: '58%', size: 1, delay: 'animate-twinkle-delay-1' },
  { top: '62%', left: '74%', size: 2.5, delay: 'animate-twinkle' },
  { top: '70%', left: '90%', size: 1.5, delay: 'animate-twinkle-delay-2' },
  { top: '85%', left: '18%', size: 1.5, delay: 'animate-twinkle' },
  { top: '82%', left: '35%', size: 2, delay: 'animate-twinkle-delay-1' },
  { top: '88%', left: '80%', size: 1, delay: 'animate-twinkle-delay-2' },
  { top: '15%', left: '94%', size: 2, delay: 'animate-twinkle' },
  { top: '4%', left: '22%', size: 1, delay: 'animate-twinkle-delay-2' },
];

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* 1. LIGHT MODE BACKGROUND: Padang Pasir Islami (Golden Dunes & Warm Haze) */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* High-res Arabian Desert Photography */}
        <img
          src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2560&q=80"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />

        {/* Soft Golden Sunlight & Warm Desert Atmospheric Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/85 via-stone-50/80 to-amber-100/75 mix-blend-multiply" />
        
        {/* Subtle Radial Glow from morning sun (top-right) */}
        <div className="absolute -top-24 -right-24 w-96 sm:w-[550px] h-96 sm:h-[550px] rounded-full bg-gradient-to-br from-amber-200/50 via-orange-100/30 to-transparent blur-3xl" />

        {/* Ambient Warm tint ensuring readability of Quran text and cards */}
        <div className="absolute inset-0 bg-stone-100/40 backdrop-blur-[0.5px]" />

        {/* Floating subtle Islamic 8-Point Star watermark in the sky */}
        <div className="absolute top-12 right-12 sm:right-24 opacity-[0.035] text-amber-900 pointer-events-none">
          <svg className="w-64 h-64 sm:w-96 sm:h-96" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,0 63,37 100,50 63,63 50,100 37,63 0,50 37,37" />
            <polygon points="50,10 60,40 90,50 60,60 50,90 40,60 10,50 40,40" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Gentle desert dune contour silhouette at the bottom */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-amber-100/60 via-amber-50/20 to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 2. DARK MODE BACKGROUND: Malam Lailatul Qadr (Hening Penuh Bintang)        */}
      {/* ========================================================================= */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* High-res Celestial Midnight Sky Photography */}
        <img
          src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2560&q=80"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />

        {/* Deep Spiritual Night Gradient Overlay (Midnight Indigo to Dark Emerald) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060c18]/90 via-[#071324]/85 to-[#040911]/95" />

        {/* Lailatul Qadr Celestial Nur Glow (Spiritual Aurora Aura) */}
        <div className="absolute top-0 right-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute top-20 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-indigo-500/10 blur-[90px]" />

        {/* Radiant Crescent Moon (Hilal Lailatul Qadr) with Ethereal Glow */}
        <div className="absolute top-8 sm:top-14 right-6 sm:right-20 pointer-events-none animate-float-gentle">
          {/* Outer Celestial Glow Halo */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-200/20 blur-xl animate-pulse" />
            
            {/* Elegant SVG Crescent Moon */}
            <svg
              className="w-10 h-10 sm:w-14 sm:h-14 text-amber-100/90 drop-shadow-[0_0_12px_rgba(254,240,138,0.7)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
            </svg>
            
            {/* Luminous Morning/Night Star adjacent to the Moon */}
            <div className="absolute -top-1 -left-2 w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_8px_rgba(254,240,138,1)] animate-twinkle" />
          </div>
        </div>

        {/* Dynamic Twinkling Stars across the whole viewport */}
        <div className="absolute inset-0">
          {STARS.map((star, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-white ${star.delay}`}
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.9)`,
              }}
            />
          ))}
        </div>

        {/* Distant Peaceful Desert & Mosque Silhouette at Horizon */}
        <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none opacity-30">
          <svg
            className="w-full h-full text-[#03070d] preserve-3d"
            viewBox="0 0 1440 200"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            {/* Gentle Rolling Night Desert Dunes & Dome Silhouettes */}
            <path d="M0,160 C320,120 420,180 720,140 C1020,100 1200,160 1440,130 L1440,200 L0,200 Z" />
            <path d="M0,180 C260,150 560,195 900,165 C1180,140 1340,175 1440,160 L1440,200 L0,200 Z" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
};
