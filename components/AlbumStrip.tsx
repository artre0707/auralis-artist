import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';
import { Album } from '@/data/albums';
import { formatReleaseDate } from '@/utils/date';
import type { Language } from '@/App';

interface StripProps {
  titleEN: string;
  titleKR: string;
  items: Album[];
}

const StripAlbumCard: React.FC<{ album: Album; language: Language }> = ({ album, language }) => (
  <Link
    to={`/albums/${album.slug}`}
    className="group w-40 sm:w-48 flex-shrink-0"
    style={{ scrollSnapAlign: 'start' }}
  >
    <div className="rounded-xl overflow-hidden bg-card shadow-sm border border-card">
      <img
        src={album.coverUrl}
        alt={album.title}
        className="w-full aspect-[1/1] object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
    </div>
    <h4 className="mt-2 text-xs sm:text-sm font-medium truncate text-center text-neutral-800 dark:text-neutral-200 group-hover:text-[var(--accent)] transition-colors">
      {album.title}
    </h4>
    {album.status === 'upcoming' && (
        <p className="text-center text-[11px] text-subtle">{formatReleaseDate(language, album.details.releaseDate)}</p>
    )}
  </Link>
);

const AlbumStrip: React.FC<StripProps> = ({ titleEN, titleKR, items }) => {
  const { language } = useSiteContext();
  
  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 md:py-8">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <header className="mb-4">
          <h3 className="text-lg font-semibold auralis-section-title">{language === 'KR' ? titleKR : titleEN}</h3>
          <div className="mt-2 h-px w-16 bg-[#CBAE7A]/80" />
        </header>
        <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' }}>
          {items.map(item => (
            <StripAlbumCard key={item.slug} album={item} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlbumStrip;