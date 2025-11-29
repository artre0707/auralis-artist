// components/DiscographySection.tsx
import React, { useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';
import { albumsData, Album } from '@/data/albums';
import type { Language } from '@/App';

type Lang = Language;

const copy = {
  EN: {
    sectionTitle: 'Discography',
    sectionSubtitle: 'All officially released Auralis collections.',
    releasedHeading: 'Released Albums',
    upcomingHeading: 'Upcoming Releases',
    viewAll: 'View All Collections',
    statusReleased: 'Released',
    statusUpcoming: 'Upcoming',
  },
  KR: {
    sectionTitle: '디스코그래피',
    sectionSubtitle: '오랄리스의 공식 발매 컬렉션 전체 보기',
    releasedHeading: '발매된 앨범',
    upcomingHeading: '발매 예정 앨범',
    viewAll: '전체 컬렉션 보기',
    statusReleased: '발매 완료',
    statusUpcoming: '발매 예정',
  },
} as const;

// 🔧 날짜 정렬 유틸: details.releaseDate 기준 (Home과 동일 구조 사용)
function getReleaseDate(album: Album): Date | null {
  // albumsData 타입에 따라 조정 (details.releaseDate 사용)
  const raw =
    // @ts-expect-error - some albums may store date on details
    album.details?.releaseDate ||
    // 혹시 상위에 releaseDate가 있으면 fallback
    // @ts-expect-error - optional
    album.releaseDate;

  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function sortByReleaseDateDesc(a: Album, b: Album) {
  const da = getReleaseDate(a);
  const db = getReleaseDate(b);
  if (da && db) return db.getTime() - da.getTime();
  if (da) return -1;
  if (db) return 1;
  return a.title.localeCompare(b.title);
}

const DiscographySection: React.FC = () => {
  const { language } = useSiteContext();
  const lang = (language as Lang) || 'EN';
  const t = copy[lang];

  const albums = useMemo(() => {
    const all = Object.values(albumsData) as Album[];

    const released = all
      .filter((album) => album.status === 'released')
      .sort(sortByReleaseDateDesc);

    const upcoming = all
      .filter((album) => album.status === 'upcoming')
      .sort(sortByReleaseDateDesc);

    return { released, upcoming };
  }, []);

  return (
    <section
      id="discography"
      className="w-full bg-[var(--bg-elevated,#050509)]/95 border-t border-[var(--border,#262626)]/70"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 mb-10">
          <div>
            <h2 className="auralis-section-title text-2xl md:text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--heading,#F5F5F5)] to-[color:rgba(203,174,122,0.9)]">
              {t.sectionTitle}
            </h2>
            <p className="mt-2 text-sm md:text-[15px] text-[var(--text,#E5E5E5)]/70">
              {t.sectionSubtitle}
            </p>
          </div>
          <div className="md:ml-auto">
            <ReactRouterDOM.Link
              to="/collections"
              className="inline-flex items-center gap-2 text-[11px] md:text-xs tracking-[0.22em] uppercase border border-[var(--gold,#CBAE7A)]/80 px-4 py-2 rounded-full text-[var(--gold,#CBAE7A)]/90 hover:bg-[var(--gold,#CBAE7A)]/10 transition-colors duration-250"
            >
              {t.viewAll}
              <span aria-hidden="true">↗</span>
            </ReactRouterDOM.Link>
          </div>
        </div>

        {/* Released Albums */}
        {albums.released.length > 0 && (
          <div className="mb-14">
            <h3 className="text-xs md:text-[11px] tracking-[0.28em] uppercase text-[var(--text,#E5E5E5)]/55 mb-4">
              {t.releasedHeading}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
              {albums.released.map((album) => {
                const d = getReleaseDate(album);
                const dateLabel = d ? d.toISOString().slice(0, 10) : undefined;

                return (
                  <ReactRouterDOM.Link
                    key={album.slug}
                    to={`/albums/${album.slug}`}
                    className="group relative bg-[var(--card-bg,#050509)]/90 border border-[var(--border,#262626)]/80 rounded-2xl overflow-hidden hover:border-[var(--gold,#CBAE7A)]/70 hover:-translate-y-[3px] transition-all duration-250"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-black/40">
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 md:p-5 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        {/* @ts-expect-error - collection may exist on Album */}
                        {album.collection && (
                          <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--text,#E5E5E5)]/55">
                            {
                              // @ts-expect-error
                              album.collection
                            }
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-[2px] rounded-full border border-emerald-400/40 text-emerald-300/80 bg-emerald-500/5">
                          {t.statusReleased}
                        </span>
                      </div>
                      <h4 className="text-sm md:text-[15px] font-medium text-[var(--heading,#F5F5F5)] line-clamp-2">
                        {album.title}
                      </h4>
                      {dateLabel && (
                        <p className="text-[11px] text-[var(--text,#E5E5E5)]/55">
                          {dateLabel}
                        </p>
                      )}
                    </div>
                  </ReactRouterDOM.Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Albums */}
        {albums.upcoming.length > 0 && (
          <div className="border-t border-[var(--border,#262626)]/70 pt-8 md:pt-10">
            <h3 className="text-xs md:text-[11px] tracking-[0.28em] uppercase text-[var(--text,#E5E5E5)]/55 mb-4">
              {t.upcomingHeading}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
              {albums.upcoming.map((album) => {
                const d = getReleaseDate(album);
                const dateLabel = d ? d.toISOString().slice(0, 10) : undefined;

                return (
                  <div
                    key={album.slug}
                    className="relative bg-[var(--card-bg,#050509)]/90 border border-[var(--border,#262626)]/80 rounded-2xl overflow-hidden"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-black/40">
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full h-full object-cover opacity-70"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 md:p-5 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        {/* @ts-expect-error - collection may exist on Album */}
                        {album.collection && (
                          <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--text,#E5E5E5)]/55">
                            {
                              // @ts-expect-error
                              album.collection
                            }
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-[2px] rounded-full border border-amber-300/40 text-amber-200/85 bg-amber-500/5">
                          {t.statusUpcoming}
                        </span>
                      </div>
                      <h4 className="text-sm md:text-[15px] font-medium text-[var(--heading,#F5F5F5)] line-clamp-2">
                        {album.title}
                      </h4>
                      {dateLabel && (
                        <p className="text-[11px] text-[var(--text,#E5E5E5)]/55">
                          {dateLabel}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DiscographySection;
