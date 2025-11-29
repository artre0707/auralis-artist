import React from 'react';
// FIX: Changed react-router-dom import to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';
import HeroSection from '../components/HeroSection';
import NewsSection from '../components/NewsSection';
import AboutSection from '../components/AboutSection';
import MediaSection from '../components/MediaSection';
import ConnectSection from '../components/ConnectSection';
import FeaturedMixedTrio from '../components/FeaturedMixedTrio';
import AlbumStrip from '../components/AlbumStrip';
import { albumsData } from '@/data/albums';
import { parseReleaseDate } from '@/utils/date';
import SectionHeader from '@/components/SectionHeader';

const collectionsHeaderCopy = {
  EN: { title: "Explore the Collections", subtitle: "Where quiet emotions find their form in sound" },
  KR: { title: "작품집 속을 거닐다", subtitle: "고요한 감정들이 소리로 피어나는 곳" },
};

const Home: React.FC = () => {
  const { language } = useSiteContext();

  // 하단 스트립: 발매 예정 앨범 전체를 날짜순으로 정렬해서 사용
  const upcomingStrip = React.useMemo(() => {
    return Object.values(albumsData)
      .filter(a => a.status === 'upcoming')
      .sort(
        (a, b) =>
          (parseReleaseDate(a.details.releaseDate)?.getTime() ?? Infinity) -
          (parseReleaseDate(b.details.releaseDate)?.getTime() ?? Infinity)
      );
  }, []);

  // CTA Button logic from original DiscographySection
  const ctaContent = {
    EN: { viewAll: 'Begin the Musical Journey →' },
    KR: { viewAll: '음악의 여정이 시작되는 곳 →' }
  };
  const currentContent = ctaContent[language];
  const BUTTON_PILL =
    "auralis-btn group relative overflow-hidden z-0 rounded-full border px-5 py-2 text-sm font-medium transition " +
    "border-neutral-300/20 before:content-[''] before:absolute before:inset-0 before:rounded-full " +
    "before:transition-opacity before:duration-[600ms] before:ease-in-out " +
    "before:opacity-0 hover:before:opacity-100 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/40";
  const labelText = currentContent.viewAll.replace(/→/g, '').trim();
  const forceStyles = `
    .auralis-btn { color: #B89B64; }
    .auralis-btn::before { background-color: rgba(203,174,122,0.10); }
    .auralis-btn:hover { color: #B89B64; }
    .auralis-btn .arrow { display:inline-block; transform: translateX(0); transition: transform 200ms ease; }
    .auralis-btn:hover .arrow, .auralis-btn:focus-visible .arrow { transform: translateX(3px); }
    body.dark .auralis-btn, html.dark .auralis-btn, [data-theme="dark"] .auralis-btn { color: #E7CF9F; background: transparent; }
    body.dark .auralis-btn::before, html.dark .auralis-btn::before, [data-theme="dark"] .auralis-btn::before { background-color: #E7CF9F; opacity: 0; transition: opacity 0.6s ease-in-out; }
    body.dark .auralis-btn:hover::before, html.dark .auralis-btn:hover::before, [data-theme="dark"] .auralis-btn:hover::before { opacity: 1; }
    body.dark .auralis-btn:hover, html.dark .auralis-btn:hover, [data-theme="dark"] .auralis-btn:hover { color: #0b0d12; }
    @media (prefers-color-scheme: dark) {
      .auralis-btn { color: #E7CF9F; background: transparent; }
      .auralis-btn::before { background-color: #E7CF9F; opacity: 0; transition: opacity 0.6s ease-in-out; }
      .auralis-btn:hover::before { opacity: 1; }
      .auralis-btn:hover { color: #0b0d12; }
    }
  `;

  const headerCopy = collectionsHeaderCopy[language];

  return (
    <>
      <style>{forceStyles}</style>
      <HeroSection />
      <NewsSection showTitle={false} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-8 md:mt-12 lg:mt-16">
        <SectionHeader title={headerCopy.title} subtitle={headerCopy.subtitle} />
      </div>

      {/* 상단 3개 (발매 1 + 발매예정 2) */}
      <div className="-mt-4">
        <FeaturedMixedTrio />
      </div>

      {/* 하단 마퀴: 발매예정 전체 */}
      <AlbumStrip
        titleEN="New & Upcoming"
        titleKR="새 소식 & 발매 예정"
        items={upcomingStrip}
      />

      <div className="text-center mt-12 mb-8">
        <ReactRouterDOM.Link to="/albums" className={BUTTON_PILL}>
          <span className="relative z-10 inline-flex items-center gap-1">
            <span>{labelText}</span>
            <span aria-hidden className="arrow">→</span>
          </span>
        </ReactRouterDOM.Link>
      </div>

      <MediaSection />
      <AboutSection />
      <ConnectSection />
    </>
  );
};

export default Home;
