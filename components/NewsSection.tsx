

import React from 'react';
// FIX: Changed react-router-dom imports to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';

const ALBUMS_BASE = '/albums';

const NewsSection: React.FC<{ showTitle?: boolean }> = ({ showTitle = true }) => {
  const { language } = useSiteContext();
  const navigate = ReactRouterDOM.useNavigate();

  const newsSlug = 'resonance-after-the-first-suite-out-now';

  // 외부 링크
  const LISTEN_BASE = 'https://auralis.bfan.link/resonance-after-the-first-suite-2';
  const YT_PLAYLIST  = 'https://www.youtube.com/watch?v=f9Du-utVUxE';
  const listenHref = `${LISTEN_BASE}?utm_source=site&utm_medium=news_card&utm_campaign=resonance_release&utm_content=listen_button`;
  const watchHref  = `${YT_PLAYLIST}&utm_source=site&utm_medium=news_card&utm_campaign=resonance_release&utm_content=youtube_button`;

  const goDetail = () => navigate(`/news/${newsSlug}`);

  const handleCardClick: React.MouseEventHandler<HTMLElement> = (e) => {
    const blocker = (e.target as HTMLElement).closest('a,button,[data-no-card]');
    if (blocker) return;
    goDetail();
  };
  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goDetail();
    }
  };
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  // 공통 버튼 스타일
  const BUTTON_PILL =
    "auralis-btn relative overflow-hidden z-0 rounded-full border px-5 py-2 text-sm font-medium transition " +
    "border-neutral-300/30 before:content-[''] before:absolute before:inset-0 before:rounded-full " +
    "before:transition-opacity before:duration-[600ms] before:ease-out " +
    "before:opacity-0 hover:before:opacity-100 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/40";

  // ✅ 다크모드 전체 페이드인 스타일
  const forceStyles = `
    /* --- 라이트 기본 --- */
    .auralis-title { color: #1f1f1f; font-weight: 600; }
    .auralis-sub   { color: #555555; }

    .auralis-btn { color: #B89B64; }
    .auralis-btn::before { background-color: rgba(203,174,122,0.10); }
    .auralis-btn:hover { color: #CBAE7A; }

    /* --- 다크 모드 --- */
    body.dark .auralis-title,
    html.dark .auralis-title,
    [data-theme="dark"] .auralis-title {
      color: #F5E3B5;
      text-shadow: 0 0 8px rgba(245,227,181,0.28);
    }
    body.dark .auralis-sub,
    html.dark .auralis-sub,
    [data-theme="dark"] .auralis-sub {
      color: #E0E0E0;
    }

    /* 다크: 기본 투명, hover 시 천천히 전체 금빛 페이드인 */
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
    [data-theme="dark"] .auralis-btn:hover::before {
      opacity: 1;
    }
    body.dark .auralis-btn:hover,
    html.dark .auralis-btn:hover,
    [data-theme="dark"] .auralis-btn:hover {
      color: #0b0d12;
    }

    /* 시스템 다크 대응 */
    @media (prefers-color-scheme: dark) {
      .auralis-title { color: #F5E3B5; text-shadow: 0 0 8px rgba(245,227,181,0.28); }
      .auralis-sub   { color: #E0E0E0; }
      .auralis-btn   { color: #E7CF9F; background: transparent; }
      .auralis-btn::before {
        background-color: #E7CF9F;
        opacity: 0;
        transition: opacity 0.6s ease-in-out;
      }
      .auralis-btn:hover::before { opacity: 1; }
      .auralis-btn:hover { color: #0b0d12; }
    }
  `;

  return (
    <section id="news" className="py-12 sm:py-14 lg:py-16">
      <style>{forceStyles}</style>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-tight auralis-title">
              News
            </h2>
            <p className="mt-3 text-sm sm:text-base auralis-sub">
              {language === 'EN'
                ? "Echoes of what’s new—releases, videos, and moments between notes."
                : '최근 소식과 새로운 음악의 여운을 전해드립니다.'}
            </p>
          </>
        )}

        <article
          role="button"
          tabIndex={0}
          onClick={handleCardClick}
          onKeyDown={handleKeyDown}
          aria-label={
            language === 'EN'
              ? 'Read more: Resonance: After the First Suite — Out now'
              : '자세히 보기: 레조넌스: 첫 모음곡 이후 — 지금 감상하기'
          }
          className="
            mt-6 rounded-2xl bg-card border border-card shadow-sm
            hover:shadow-md transition-all duration-400 ease-in-out hover:scale-[1.01]
            p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center
            cursor-pointer select-none
            max-w-6xl mx-auto
          "
        >
          <img
            src="https://picsum.photos/seed/auralis-new/200/200"
            alt="Latest release cover"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover flex-shrink-0"
          />

          <div className="min-w-0 flex-grow">
            <h3 className="auralis-title text-lg md:text-xl leading-relaxed transition-colors duration-200">
              {language === 'EN'
                ? 'Resonance: After the First Suite — Out now'
                : '레조넌스: 첫 모음곡 이후 — 지금 감상하기'}
            </h3>

            <p className="auralis-sub mt-2 text-sm md:text-base leading-relaxed">
              {language === 'EN'
                ? 'New movements unfolding in quiet harmony — listen and read the liner notes'
                : '고요함 속에서 펼쳐지는 새로운 악장, 그 여운과 이야기를 만나보세요'}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 items-center" data-no-card>
              <ReactRouterDOM.Link
                to={`${ALBUMS_BASE}/resonance-after-the-first-suite`}
                onClick={stop}
                className={BUTTON_PILL}
              >
                <span className="relative z-10">
                  {language === 'EN' ? 'Embrace the Album' : '앨범과 마주하다'}
                </span>
              </ReactRouterDOM.Link>

              <a
                href={listenHref}
                onClick={stop}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON_PILL}
              >
                <span className="relative z-10">
                  {language === 'EN' ? 'Drift into Sound' : '지금 듣기'}
                </span>
              </a>

              <a
                href={watchHref}
                onClick={stop}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON_PILL}
              >
                <span className="relative z-10">
                  {language === 'EN' ? 'See the Music' : 'YouTube에서 보기'}
                </span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default NewsSection;