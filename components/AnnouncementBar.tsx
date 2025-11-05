import React, { useMemo, useEffect, useState } from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { news } from '@/data/news';
// FIX: Changed react-router-dom import to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';

const content = {
  EN: 'NEW • Resonance: After the First Suite — Out now →',
  KR: '신작 • 레조넌스: 첫 모음곡 이후 — 지금 감상하기 →',
};

interface AnnouncementBarProps {
  isVisible: boolean;
  onClose: () => void;
}

function withUtm(base: string, params: Record<string, string>) {
  try {
    const url = new URL(base);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
  } catch {
    return base;
  }
}

const DEFAULT_LISTEN = 'https://auralis.bfan.link/resonance-after-the-first-suite-2';
const SCROLL_FADE_MAX = 160;

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ isVisible, onClose }) => {
  const { language } = useSiteContext();
  const lang = language === 'KR' ? 'KR' : 'EN';
  const [fadeIn, setFadeIn] = useState(false);
  const [scrollFade, setScrollFade] = useState(1);

  const { pathname } = ReactRouterDOM.useLocation();             // ✅ 현재 경로
  const isHome = pathname === '/';                // ✅ 홈 여부

  const href = useMemo(() => {
    try {
      const list = (news || []).filter((n: any) => n?.isAnnouncement);
      const latest = list.sort((a, b) => b.date.localeCompare(a.date))[0];
      const base = (latest as any)?.listenUrl || DEFAULT_LISTEN;
      return withUtm(base, {
        utm_source: 'site',
        utm_medium: 'announce_bar',
        utm_campaign: latest?.slug || 'fallback',
        utm_content: 'fullbar_link',
      });
    } catch {
      return DEFAULT_LISTEN;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const fade = Math.max(0, 1 - y / SCROLL_FADE_MAX);
      setScrollFade(fade);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isVisible) return null;

  // ✅ 경로별 배경 (홈=기존 그라데이션, 그외=읽기용 반투명 배경)
  const bgStyle = isHome
    ? 'linear-gradient(90deg, rgba(203,174,122,0.15) 0%, rgba(255,255,255,0.07) 50%, rgba(203,174,122,0.15) 100%)'
    : 'linear-gradient(0deg, rgba(255,255,255,0.88), rgba(255,255,255,0.88))';

  return (
    <div
      id="announce-bar"
      className={`fixed top-16 left-0 w-full z-40 border-b border-card shadow-sm
        transition-transform duration-700 ease-in-out ${fadeIn ? 'translate-y-0' : '-translate-y-2'}`}
      style={{
        opacity: fadeIn ? scrollFade : 0,
        background: bgStyle,
        backdropFilter: 'blur(10px)',
      }}
    >
      <style>{`
        @keyframes strongPulseBrightness {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.25); }
          100% { filter: brightness(1); }
        }
        #announce-bar { animation: strongPulseBrightness 4.5s ease-in-out infinite; }

        /* 다크 모드 배경(홈이든 아니든 글자 대비 확보) */
        body.dark #announce-bar,
        html.dark #announce-bar,
        [data-theme="dark"] #announce-bar {
          ${isHome
            ? `background: linear-gradient(90deg, rgba(231,207,159,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(231,207,159,0.2) 100%);`
            : `background: linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6));`
          }
          box-shadow: 0 0 18px rgba(231,207,159,0.2);
        }

        /* 금빛 쉬머(홈 전용). 비홈 페이지는 읽기용 고정색으로 전환 */
        @keyframes goldShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gold-shimmer {
          color: #CBAE7A;
          background-image: linear-gradient(90deg,#b38d4f 0%,#e7cf9f 25%,#fff3cf 50%,#e7cf9f 75%,#b38d4f 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldShimmer 3.8s ease-in-out infinite;
          transition: filter 260ms ease, text-shadow 260ms ease;
        }
        a:hover .gold-shimmer, a:focus-visible .gold-shimmer {
          filter: brightness(1.12);
          text-shadow: 0 0 8px rgba(231,207,159,0.35);
        }
        body.dark .gold-shimmer, html.dark .gold-shimmer, [data-theme="dark"] .gold-shimmer {
          background-image: linear-gradient(90deg,#d4b574 0%,#f2e1b4 25%,#fff4d0 50%,#f2e1b4 75%,#d4b574 100%);
        }

        /* ✅ 비홈 페이지에서 가독성용 텍스트 스타일(쉬머 OFF, 고정색 ON) */
        .readable-text { 
          -webkit-text-fill-color: initial !important; 
          background: none !important;
          animation: none !important;
          color: #4a3b23;            /* 라이트 모드 고정 가독색 */
          text-shadow: 0 0 0 transparent;
        }
        body.dark .readable-text,
        html.dark .readable-text,
        [data-theme="dark"] .readable-text {
          color: #fff3cf;            /* 다크 모드 고정 가독색 */
        }
      `}</style>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-sm font-medium py-2 text-center"
        >
          {/* ✅ 홈이면 쉬머 유지, 비홈이면 읽기 텍스트로 변경 */}
          <span className={isHome ? 'gold-shimmer' : 'readable-text'}>
            {content[lang]}
          </span>
        </a>

        <button
          onClick={onClose}
          aria-label="Close announcement"
          className="absolute top-1/2 right-4 -translate-y-1/2 p-1 text-subtle rounded-full 
                     hover:bg-black/5 dark:hover:bg-white/10 transition-colors 
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;