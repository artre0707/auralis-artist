

import React, { useState, useEffect } from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { Link } from 'react-router-dom';
import type { Language } from '@/App';

const ALBUMS_BASE = '/albums';

const content = {
  EN: {
    subtitle: "Healing the Heart Through Music",
    subtext: "Where music and silence meet.",
  },
  KR: {
    subtitle: "음악으로 마음을 치유합니다",
    subtext: "음악과 고요가 만나는 곳",
  },
};

const HeroSection: React.FC = () => {
  const { language, isAnnouncementVisible } = useSiteContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  const handleParallaxScroll = () => {
    if (window.scrollY < window.innerHeight) {
      setOffsetY(window.pageYOffset);
    }
  };

  const handleScrollToDiscography = () => {
    const target = document.querySelector('#discography');
    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleParallaxScroll);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      window.removeEventListener('scroll', handleParallaxScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="hero"
      className={`relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden transition-all duration-300 ${isAnnouncementVisible ? 'pt-10 md:pt-12' : ''}`}
    >
      {/* Gold shimmer + 다크 팔레트 */}
      <style>{`
        @keyframes goldShimmerHero {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gold-shimmer-hero {
          background-image: linear-gradient(90deg,
            #b38d4f 0%,
            #e7cf9f 25%,
            #fff3cf 50%,
            #e7cf9f 75%,
            #b38d4f 100%
          );
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShimmerHero 5.2s ease-in-out infinite;
          transition: filter 260ms ease, text-shadow 260ms ease;
        }
        .gold-shimmer-hero:hover,
        .gold-shimmer-hero:focus-visible {
          filter: brightness(1.12);
          text-shadow: 0 0 10px rgba(231,207,159,0.35);
        }
        /* 다크모드 더 밝은 팔레트 */}
        body.dark .gold-shimmer-hero,
        html.dark .gold-shimmer-hero,
        [data-theme="dark"] .gold-shimmer-hero {
          background-image: linear-gradient(90deg,
            #d4b574 0%,
            #f2e1b4 25%,
            #fff4d0 50%,
            #f2e1b4 75%,
            #d4b574 100%
          );
        }
      `}</style>

      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1920&auto=format&fit=crop')`,
          transform: `translateY(${offsetY * 0.4}px) scale(1.1)`
        }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/25 to-[#CBAE7A]/20" />

      <div className={`relative z-10 transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        <h1 className="auralis-hero-title text-7xl md:text-9xl font-medium tracking-tight gold-shimmer-hero">
          Auralis
        </h1>
        <p className="auralis-subtitle text-lg md:text-2xl mt-4 font-light tracking-widest">
          {content[language].subtitle}
        </p>
        <p className="auralis-subtitle italic text-md md:text-lg mt-6 text-neutral-200">
          {content[language].subtext}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://open.spotify.com/artist/48Y3hooTTdatHfOBLCQRDP"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 sm:px-8 sm:py-3 border border-white/80 text-xs sm:text-sm tracking-widest uppercase hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm"
          >
            Listen Now
          </a>
          <Link
            to={ALBUMS_BASE}
            className="px-6 py-2.5 sm:px-8 sm:py-3 border border-[#CBAE7A] bg-[#CBAE7A]/20 text-xs sm:text-sm tracking-widest uppercase hover:bg-[#CBAE7A]/40 transition-colors duration-300 backdrop-blur-sm"
          >
            Explore Album
          </Link>
        </div>
      </div>

      <button
        onClick={handleScrollToDiscography}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-500 animate-gentle-bounce opacity-80 hover:opacity-100"
        aria-label='Scroll to next section'
      >
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-7 h-7'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25L12 15.75L4.5 8.25' />
        </svg>
      </button>
    </section>
  );
};

export default HeroSection;