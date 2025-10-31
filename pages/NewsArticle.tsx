

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PageHero from '@/components/PageHero';
import { useSiteContext } from '@/contexts/SiteContext';
import { news } from '@/data/news';
import NewsBody from '@/components/NewsBody';
import BackToSection from '@/components/BackToSection';

const ALBUMS_BASE = '/albums';

const NewsArticle: React.FC = () => {
  const { language } = useSiteContext();
  const { slug } = useParams<{ slug: string }>();
  const article = news.find(item => item.slug === slug);

  const c = {
    notFoundTitle: language === 'KR' ? '게시물을 찾을 수 없습니다' : 'Article not found',
    backToNews: language === 'KR' ? '목록으로 돌아가기' : 'Back to News',
    relatedIntro:
      language === 'KR'
        ? '이 소식과 맞닿아 있는 앨범을 함께 들어보세요.'
        : 'Explore the album connected to this story.',
  };

  // 외부 링크
  const LISTEN_BASE = 'https://auralis.bfan.link/resonance-after-the-first-suite-2';
  const YT_PLAYLIST = 'https://www.youtube.com/playlist?list=PLDNrR1uLGhzLYbFroTDlebSQmHtuJYtwC';
  const listenHref = `${LISTEN_BASE}?utm_source=site&utm_medium=news_detail&utm_campaign=resonance_release&utm_content=listen_button`;
  const watchHref  = `${YT_PLAYLIST}?utm_source=site&utm_medium=news_detail&utm_campaign=resonance_release&utm_content=youtube_button`;

  // 공통 버튼 베이스
  const BUTTON_PILL =
    "auralis-btn relative overflow-hidden z-0 rounded-full border px-5 py-2 text-sm font-medium transition " +
    "border-neutral-300/30 before:content-[''] before:absolute before:inset-0 before:rounded-full " +
    "before:transition-opacity before:duration-[600ms] before:ease-out " +
    "before:opacity-0 hover:before:opacity-100 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/40";

  // 스타일: (1) 밤모드만 본문 골드 (2) 버튼
  const forceStyles = `
    /* ===== 본문 골드: 밤모드에서만 적용 ===== */
    body.dark .gold-text p,
    body.dark .gold-text em,
    body.dark .gold-text strong,
    html.dark .gold-text p,
    html.dark .gold-text em,
    html.dark .gold-text strong {
      color: #E7CF9F;
    }
    body.dark .gold-text a,
    html.dark .gold-text a {
      color: #E7CF9F;
      text-decoration: underline;
    }
    /* 시스템 다크 선호 대응 */
    @media (prefers-color-scheme: dark) {
      .gold-text p, .gold-text em, .gold-text strong { color: #E7CF9F; }
      .gold-text a { color: #E7CF9F; text-decoration: underline; }
    }
    /* (라이트 모드에선 색 지정 없음 = 기존 테마 그대로) */

    /* ===== 버튼 ===== */
    .auralis-btn { color: #B89B64; }
    .auralis-btn::before { background-color: rgba(203,174,122,0.10); }
    .auralis-btn:hover { color: #CBAE7A; }
    body.dark .auralis-btn, html.dark .auralis-btn { color: #E7CF9F; background: transparent; }
    body.dark .auralis-btn::before, html.dark .auralis-btn::before { background-color: #E7CF9F; opacity: 0; transition: opacity 0.6s ease-in-out; }
    body.dark .auralis-btn:hover::before, html.dark .auralis-btn:hover::before { opacity: 1; }
    body.dark .auralis-btn:hover, html.dark .auralis-btn:hover { color: #0b0d12; }
    @media (prefers-color-scheme: dark) {
      .auralis-btn { color: #E7CF9F; background: transparent; }
      .auralis-btn::before { background-color: #E7CF9F; opacity: 0; transition: opacity 0.6s ease-in-out; }
      .auralis-btn:hover::before { opacity: 1; }
      .auralis-btn:hover { color: #0b0d12; }
    }
  `;

  if (!article) {
    return (
      <PageContainer>
        <div className="py-20 text-center">
          <h1 className="font-serif text-3xl mb-4">{c.notFoundTitle}</h1>
          <BackToSection type="news" />
        </div>
      </PageContainer>
    );
  }

  const isKorean = language === 'KR';
  const dateFormatted = new Date(article.date).toLocaleDateString(
    isKorean ? 'ko-KR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const title = article.title[language];
  const subtitle = article.dek?.[language];

  const fallbackCover =
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1600&auto=format&fit=crop';
  const relatedCover = article.cover || fallbackCover;

  return (
    <PageContainer>
      <style>{forceStyles}</style>

      <article className="pb-20">
        {/* 상단: 배경이미지 없이 효과 유지 */}
        <PageHero
          title={title}
          subtitle={subtitle}
          align="center"
          goldTitle
          divider="fade"
          size="lg"
          breadcrumb={[
            { label: isKorean ? 'Notes' : 'Notes', to: '/news' },
            { label: 'Detail' },
          ]}
        />

        {/* 본문: 낮모드 기본색, 밤모드만 금빛 */}
        <div className="max-w-3xl mx-auto px-6 sm:px-8 mt-10 gold-text">
          <p className="text-sm opacity-70 mb-6 text-center">{dateFormatted}</p>
          <NewsBody text={article.body?.[language]} language={language} />
        </div>

        {/* 관련 자료 카드 */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 mt-14">
          <article className="rounded-2xl overflow-hidden border border-card bg-card shadow-sm">
            <Link to={`${ALBUMS_BASE}/resonance-after-the-first-suite`} className="block">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={relatedCover}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-all duration-500 ease-out grayscale-[35%] brightness-[0.9] contrast-[0.98] group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-transparent dark:from-black/45 dark:via-black/25 dark:to-transparent" />
              </div>
            </Link>

            <div className="p-5 sm:p-6">
              <p className="text-sm text-subtle mb-4">{c.relatedIntro}</p>
              <div className="flex flex-wrap gap-3">
                <Link to={`${ALBUMS_BASE}/resonance-after-the-first-suite`} className={BUTTON_PILL}>
                  <span className="relative z-10">
                    {language === 'EN' ? 'Embrace the Album' : '앨범과 마주하다'}
                  </span>
                </Link>
                <a href={listenHref} target="_blank" rel="noopener noreferrer" className={BUTTON_PILL}>
                  <span className="relative z-10">
                    {language === 'EN' ? 'Drift into Sound' : '지금 듣기'}
                  </span>
                </a>
                <a href={watchHref} target="_blank" rel="noopener noreferrer" className={BUTTON_PILL}>
                  <span className="relative z-10">
                    {language === 'EN' ? 'See the Music' : 'YouTube에서 보기'}
                  </span>
                </a>
              </div>
            </div>
          </article>
        </div>
        
        <BackToSection type="news" className="mt-12" />
      </article>
    </PageContainer>
  );
};

export default NewsArticle;
