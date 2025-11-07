import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';
import { Album } from '@/data/albums';

interface StripProps {
  titleEN: string;
  titleKR: string;
  items: Album[];
}

const AlbumStrip: React.FC<StripProps> = ({ titleEN, titleKR, items }) => {
  const { language } = useSiteContext();
  
  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <header className="mb-4">
          <h3 className="text-lg font-semibold auralis-section-title">{language === 'KR' ? titleKR : titleEN}</h3>
          <div className="mt-2 h-px w-16 bg-[#CBAE7A]/80" />
        </header>

        <div className="relative">
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-12 z-10 bg-gradient-to-r from-[var(--bg)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-12 z-10 bg-gradient-to-l from-[var(--bg)] to-transparent" />

          <div className="overflow-hidden">
            <div
              className="flex gap-6 animate-scroll-x hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] will-change-transform"
              aria-label="New & Upcoming albums auto-scrolling list"
            >
              {/* Duplicate items for infinite loop */}
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