import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '../contexts/SiteContext';
import { albumsData, Album } from '../data/albums';
import { parseReleaseDate } from '../utils/date';

const FeaturedReleases: React.FC<{ count?: number; filterGenre?: string }> = ({ count = 3, filterGenre }) => {
  const { language } = useSiteContext();

  const latest = useMemo(() => {
    let base = Object.values(albumsData).filter(a => a.status === 'released') as Album[];
    
    // Filter by genre if provided
    if (filterGenre) {
        base = base.filter(album => 
            album.details.formatGenre?.some(g => g.toLowerCase() === filterGenre.toLowerCase())
        );
    }
    
    const filtered = base.filter((a) => a && a.slug);
    const sorted = filtered.slice().sort((a, b) => (parseReleaseDate(b.details?.releaseDate)?.getTime() ?? 0) - (parseReleaseDate(a.details?.releaseDate)?.getTime() ?? 0));
    const hasAnyDate = sorted.some((x) => (parseReleaseDate(x.details?.releaseDate)?.getTime() ?? 0) > 0);
    return (hasAnyDate ? sorted : filtered).slice(0, Math.max(1, Math.min(3, count)));
  }, [count, filterGenre]);

  if (!latest.length) return null;

  return (
    <section className="mb-8 md:mb-10">
      <header className="mb-3 md:mb-5 border-t-4 pt-2.5" style={{ borderColor: 'var(--accent)' }}>
        <h2 className="font-playfair text-2xl md:text-3xl auralis-heading">
          {language === 'KR' ? '새로운 빛을 들어보세요' : 'Hear the New Light'}
        </h2>
        <p className="mt-1 text-sm md:text-base text-subtle">
          {language === 'KR' ? '오랄리스의 가장 새로운 숨결' : 'The newest whispers of sound'}
        </p>
      </header>

      {/* 간격 축소 */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map((a) => {
          const title = a.title;
          const desc = a.content?.[language]?.subtitle;
          const seriesBadge = a.seriesInfo?.name?.[language] || a.seriesInfo?.name?.EN;

          return (
            <Link
              key={a.slug}
              to={`/albums/${a.slug}`}
              // Align with series cards for consistent sizing and layout
              className="group block text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-2xl"
            >
              <div className="relative rounded-2xl border border-card transition shadow-[0_3px_14px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-xl/30 will-change-transform">

                {/* 🔽 앨범 자켓: 정사각형 */}
                <div className="aspect-square w-full overflow-hidden rounded-2xl">
                  {a.coverUrl ? (
                    <img
                      src={a.coverUrl}
                      alt={`Cover for ${title}`}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-full w-full bg-[rgba(10,12,18,0.7)]" />
                  )}
                </div>

                {/* NEW */}
                <div className="absolute right-3 top-3 z-10 px-2 py-1 rounded-full text-[10px] font-semibold tracking-wide text-[#0b0d12] bg-[var(--accent)] shadow">
                  NEW
                </div>
                {/* 시리즈 배지 */}
                {seriesBadge && (
                  <div className="absolute left-3 top-3 z-20 transform-gpu px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide border accent-border text-[var(--accent)] bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(19,23,34,0.7)] backdrop-blur">
                    {seriesBadge}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-semibold leading-relaxed" style={{ color: 'var(--accent)' }}>
                  <span className="dark:text-[#E7CF9F]">{title}</span>
                </h3>
                {desc && (
                  <p className="mt-1 text-sm text-subtle leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedReleases;