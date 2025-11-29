import React, { useMemo } from 'react';
// FIX: Changed react-router-dom import to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';
import { albumsData, Album } from '@/data/albums';
import { parseReleaseDate } from '@/utils/date';

// --- 날짜 기반 헬퍼 ---

const UPCOMING_WINDOW_DAYS = 20;

function getReleaseDate(album: Album): Date | null {
  const d = parseReleaseDate(album.details.releaseDate);
  if (!d) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function isWithinUpcomingWindow(album: Album): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const release = getReleaseDate(album);
  if (!release) return false;

  const diffDays = (release.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= UPCOMING_WINDOW_DAYS;
}

// --- 앨범 카드 ---

const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
  const { language } = useSiteContext();
  const albumContent = album.content[language];

  return (
    <ReactRouterDOM.Link
      to={`/albums/${album.slug}`}
      className="group block text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/50 rounded-2xl transition-all duration-300"
    >
      <div className="rounded-2xl overflow-hidden bg-card shadow-sm border border-card transition-transform w-full">
        <img
          src={album.coverUrl}
          alt={`Cover for ${album.title}`}
          className="w-full aspect-square object-cover dark:brightness-90 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const t = e.currentTarget;
            t.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'>
                   <defs>
                     <linearGradient id='g' x1='0' x2='1'>
                       <stop offset='0' stop-color='#111'/>
                       <stop offset='1' stop-color='#222'/>
                     </linearGradient>
                   </defs>
                   <rect width='100%' height='100%' fill='url(#g)'/>
                   <text x='50%' y='50%' fill='#777' font-size='22' text-anchor='middle' font-family='Inter, sans-serif'>image not found</text>
                 </svg>`
              );
          }}
        />
      </div>
      <div className="mt-3 sm:mt-4">
        <h3 className="font-normal text-sm sm:text-lg text-neutral-800 dark:text-neutral-200 leading-snug sm:leading-relaxed group-hover:text-[#CBAE7A] transition-colors duration-200">
          {album.title}
        </h3>
        <p className="text-[11px] sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-snug sm:leading-relaxed">
          {albumContent.subtitle}
        </p>
      </div>
    </ReactRouterDOM.Link>
  );
};

// --- 메인 컴포넌트 ---

const FeaturedMixedTrio: React.FC = () => {
  const trio = useMemo(() => {
    const all = Object.values(albumsData) as Album[];

    const released = all
      .filter((a) => a.status === 'released')
      .sort((a, b) => {
        const da = getReleaseDate(a)?.getTime() ?? 0;
        const db = getReleaseDate(b)?.getTime() ?? 0;
        return db - da; // 최신 발매일 우선
      });

    const upcoming = all
      .filter((a) => a.status === 'upcoming' && isWithinUpcomingWindow(a))
      .sort((a, b) => {
        const da = getReleaseDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const db = getReleaseDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return da - db; // 가장 임박한 발매일 우선
      });

    const selected: Album[] = [];

    // ▶ 1. 발매된 앨범 2개
    if (released.length > 0) selected.push(released[0]);
    if (released.length > 1) selected.push(released[1]);

    // ▶ 2. 발매 예정 앨범 1개 (있으면)
    if (upcoming.length > 0) selected.push(upcoming[0]);

    // ▶ 3. 부족하면 다른 앨범으로 채우기 (중복 없이)
    if (selected.length < 3) {
      const remaining = [...released, ...upcoming].filter(
        (a) => !selected.some((s) => s.slug === a.slug)
      );
      while (selected.length < 3 && remaining.length > 0) {
        selected.push(remaining.shift()!);
      }
    }

    return selected.slice(0, 3);
  }, []);

  if (trio.length === 0) return null;

  return (
    <section className="py-12 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
          {trio.map((album) => (
            <AlbumCard key={album.slug} album={album} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMixedTrio;
