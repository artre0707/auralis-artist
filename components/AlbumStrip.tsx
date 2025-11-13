import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';
import { Album } from '@/data/albums';
import clsx from 'clsx';

interface StripProps {
  titleEN: string;
  titleKR: string;
  items: Album[];
}

const AlbumStrip: React.FC<StripProps> = ({ titleEN, titleKR, items }) => {
  const { language } = useSiteContext();
  const [paused, setPaused] = useState(false);
  const isTouchPause = useRef(false);

  useEffect(() => {
    // Only auto-resume if the pause was initiated by a touch event
    if (paused && isTouchPause.current) {
      const timer = setTimeout(() => {
        setPaused(false);
        isTouchPause.current = false; // Reset after resuming
      }, 2000); // User request: shorten pause to 2s
      return () => clearTimeout(timer);
    }
  }, [paused]);
  
  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <header className="mb-4">
          <h3 className="text-lg font-semibold auralis-section-title">{language === 'KR' ? titleKR : titleEN}</h3>
          <div className="mt-2 h-px w-16 bg-[#CBAE7A]/80" />
        </header>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-16 z-10 bg-gradient-to-r from-[var(--bg)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-16 z-10 bg-gradient-to-l from-[var(--bg)] to-transparent" />

          <div className="overflow-hidden">
            <div
              className={clsx(
                "flex gap-6 animate-scroll-x will-change-transform",
                paused && "[animation-play-state:paused]"
              )}
              onMouseEnter={() => { isTouchPause.current = false; setPaused(true); }}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => { isTouchPause.current = false; setPaused(true); }}
              onBlurCapture={() => setPaused(false)}
              onTouchStart={() => { isTouchPause.current = true; setPaused(true); }}
              aria-label="New & Upcoming albums auto-scrolling list"
            >
              {[...items, ...items].map((album, i) => (
                <ReactRouterDOM.Link
                  key={`${album.slug}-${i}`}
                  to={`/albums/${album.slug}`}
                  className="flex-shrink-0 w-48 md:w-56 lg:w-60 aspect-square rounded-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/40"
                >
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;utf8," +
                        encodeURIComponent(
                          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='100%' height='100%' fill='#111'/><text x='50%' y='50%' fill='#777' font-size='22' text-anchor='middle' font-family='Inter, sans-serif'>image not found</text></svg>`
                        );
                    }}
                  />
                </ReactRouterDOM.Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlbumStrip;
