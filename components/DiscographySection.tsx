

import React from 'react';
// FIX: Changed react-router-dom imports to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';
import { albumsData } from '@/data/albums';
import SectionHeader from '@/components/SectionHeader';

const ALBUMS_BASE = '/albums';

const content = {
  EN: {
    title: 'Explore the Collections',
    subtitle: "Where quiet emotions find their form in sound",
    viewAll: 'Begin the Musical Journey →',
  },
  KR: {
    title: '작품집 속을 거닐다',
    subtitle: "고요한 감정들이 소리로 피어나는 곳",
    viewAll: '음악의 여정이 시작되는 곳 →',
  }
};

const albumList = Object.values(albumsData);
type Album = typeof albumList[0];

const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
  const { language } = useSiteContext();
  const albumContent = album.content[language];

  return (
    <ReactRouterDOM.Link
      to={`/albums/${album.slug}`}
      className="
        group block text-center 
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/50 
        rounded-2xl
        transition-all duration-300
      "
    >
      {/* 앨범 자켓 */}
      <div
        className="
          rounded-2xl overflow-hidden bg-card shadow-sm border border-card
          hover:-translate-y-1 hover:shadow-xl/30
          transition-transform
          w-[75%] mx-auto sm:w-full
        "
      >
        <img
          src={album.coverUrl}
          alt={`Cover for ${album.title}`}
          className="
            w-full aspect-square object-cover 
            dark:brightness-90 transition duration-300 group-hover:scale-[1.03]
          "
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 제목/부제 */}
      <div className="mt-3 sm:mt-4">
        <h3
          className="
            font-normal text-sm sm:text-lg
            text-neutral-800 dark:text-neutral-200
            leading-snug sm:leading-relaxed
            group-hover:text-[#CBAE7A]
            transition-colors duration-200
          "
        >
          {album.title}
        </h3>
        <p
          className="
            text-[11px] sm:text-sm
            text-neutral-500 dark:text-neutral-400
            mt-1 leading-snug sm:leading-relaxed
          "
        >
          {albumContent.subtitle}
        </p>
      </div>
    </ReactRouterDOM.Link>
  );
};

const DiscographySection: React.FC<{showTitle?: boolean}> = ({ showTitle = true }) => {
  const { language } = useSiteContext();
  const location = ReactRouterDOM.useLocation();
  const isAlbumsPage = location.pathname === '/albums' || location.pathname === '/collections';

  const currentContent = content[language];

  // 버튼 베이스 (before로 배경 제어)
  const BUTTON_PILL =
    "auralis-btn group relative overflow-hidden z-0 rounded-full border px-5 py-2 text-sm font-medium transition " +
    "border-neutral-300/20 before:content-[''] before:absolute before:inset-0 before:rounded-full " +
    "before:transition-opacity before:duration-[600ms] before:ease-in-out " +
    "before:opacity-0 hover:before:opacity-100 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/40";

  // 라벨에서 화살표(→) 분리
  const rawLabel = currentContent.viewAll;
  const labelText = rawLabel.replace(/→/g, '').trim();

  // 라이트/다크 버튼 효과 + 화살표 미세 이동
  const forceStyles = `
    /* Light: 금빛 텍스트 + 은은한 오버레이 */
    .auralis-btn { color: #B89B64; }
    .auralis-btn::before { background-color: rgba(203,174,122,0.10); }
    .auralis-btn:hover { color: #B89B64; }

    /* 화살표만 +3px 이동 */
    .auralis-btn .arrow { display:inline-block; transform: translateX(0); transition: transform 200ms ease; }
    .auralis-btn:hover .arrow,
    .auralis-btn:focus-visible .arrow { transform: translateX(3px); }

    /* Dark: 기본 투명, hover 시 전체 금빛 페이드인(0.6s) + 글자 반전 */
    body.dark .auralis-btn,
    html.dark .auralis-btn,
    [data-theme="dark"] .auralis-btn {
      color: #E7CF9F;
      background: transparent;
    }
    body.dark .auralis-btn::before,
    html.dark .auralis-btn::before,
    [data-theme="dark"] .auralis-btn::before {
      background-color: #E7CF9F;
      opacity: 0;
      transition: opacity 0.6s ease-in-out;
    }
    body.dark .auralis-btn:hover::before,
    html.dark .auralis-btn:hover::before,
    [data-theme="dark"] .auralis-btn:hover::before { opacity: 1; }
    body.dark .auralis-btn:hover,
    html.dark .auralis-btn:hover,
    [data-theme="dark"] .auralis-btn:hover { color: #0b0d12; }

    /* 시스템 다크 선호 */
    @media (prefers-color-scheme: dark) {
      .auralis-btn { color: #E7CF9F; background: transparent; }
      .auralis-btn::before { background-color: #E7CF9F; opacity: 0; transition: opacity 0.6s ease-in-out; }
      .auralis-btn:hover::before { opacity: 1; }
      .auralis-btn:hover { color: #0b0d12; }
    }
  `;

  return (
    <section id="discography" className="py-12 sm:py-14 lg:py-16">
      {/* 버튼 효과 & 화살표 애니메이션 */}
      <style>{forceStyles}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {showTitle && (
          // FIX: Removed `language` prop as it is not accepted by SectionHeader.
          <SectionHeader
            title={currentContent.title}
            subtitle={currentContent.subtitle}
          />
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
          {albumList.map(album => (
            <AlbumCard key={album.slug} album={album} />
          ))}
        </div>

        {!isAlbumsPage && (
          <div className="text-center mt-12">
            <ReactRouterDOM.Link to={ALBUMS_BASE} className={BUTTON_PILL}>
              <span className="relative z-10 inline-flex items-center gap-1">
                <span>{labelText}</span>
                <span aria-hidden className="arrow">→</span>
              </span>
            </ReactRouterDOM.Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default DiscographySection;