import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PageHero from '@/components/PageHero';
import { useSiteContext } from '@/contexts/SiteContext';
import { news } from '@/data/news';

const PAGE_SIZE = 6;

export default function News() {
  const { language } = useSiteContext();
  const [params, setParams] = useSearchParams();

  const q = params.get('q')?.toLowerCase() || '';
  const page = Number(params.get('page') || '1');

  // ===== Filtering =====
  const filtered = useMemo(() => {
    let items = [...news];
    if (q) {
      items = items.filter((n) => {
        const title = n.title[language === 'KR' ? 'KR' : 'EN'].toLowerCase();
        const dek = (n.dek?.[language === 'KR' ? 'KR' : 'EN'] || '').toLowerCase();
        const body = (n.body?.[language === 'KR' ? 'KR' : 'EN'] || '').toLowerCase();
        return title.includes(q) || dek.includes(q) || body.includes(q);
      });
    }
    items.sort((a, b) => b.date.localeCompare(a.date));
    return items;
  }, [q, language]);

  // ===== Pagination =====
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updatePage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next, { replace: true });
  };
  
  const searchInput = (
    <input
      type="text"
      value={q}
      onChange={(e) => {
        const next = new URLSearchParams(params);
        if (e.target.value.trim()) next.set('q', e.target.value.trim());
        else next.delete('q');
        next.set('page', '1');
        setParams(next, { replace: true });
      }}
      placeholder={language === 'KR' ? '검색어를 입력하세요…' : 'Search news...'}
      className="
        w-full max-w-xs px-4 py-2 rounded-full text-sm tracking-wide
        border border-[#CBAE7A]/50 bg-transparent
        text-neutral-800 dark:text-neutral-100
        placeholder-neutral-400 dark:placeholder-neutral-500
        focus:outline-none focus:border-[#CBAE7A]/70 focus:ring-1 focus:ring-[#CBAE7A]/30
        transition
      "
    />
  );

  return (
    <PageContainer>
      <main className="max-w-6xl mx-auto px-4 pb-20">

        {/* ===== Hero ===== */}
        <PageHero
          title={language === 'KR' ? '노트' : 'Notes'}
          subtitle={
            language === 'KR'
              ? '새로운 음악과 여운의 순간을 전해드립니다'
              : 'Sharing new music and moments that linger'
          }
          align="center"
          goldTitle
          divider="none"
        />

        {/* ===== 카드 hover 스타일 ===== */}
        <style>{`
          .news-card {
            transition: all 0.3s ease;
          }
          .news-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(203,174,122,0.2);
          }
          .news-card img {
            transition: transform 0.4s ease, filter 0.3s ease;
          }
          .news-card:hover img {
            transform: scale(1.04);
            filter: brightness(1.05);
          }
        `}</style>

        {/* ===== 리스트 ===== */}
        {paged.length === 0 ? (
          <div className="text-center text-subtle py-16">
            {language === 'KR'
              ? '검색 결과가 없습니다.'
              : 'No news matches your search.'}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paged.map((n) => {
              const title = n.title[language === 'KR' ? 'KR' : 'EN'];
              const dek = n.dek?.[language === 'KR' ? 'KR' : 'EN'] || '';
              const dateLabel =
                language === 'KR'
                  ? new Date(n.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : new Date(n.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

              return (
                <article
                  key={n.slug}
                  className="
                    news-card rounded-2xl overflow-hidden border
                    border-[#CBAE7A]/20 hover:border-[#CBAE7A]/40
                    bg-transparent backdrop-blur-md
                    shadow-[0_0_10px_rgba(203,174,122,0.08)]
                    hover:shadow-[0_0_16px_rgba(203,174,122,0.15)]
                    transition-all duration-300
                  "
                >
                  <Link to={`/news/${n.slug}`} className="block">
                    {n.cover && (
                      <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                        <img
                          src={n.cover}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[12px] text-neutral-500 dark:text-neutral-400">
                        {n.tags?.[0] && (
                          <span className="rounded-full border px-2 py-0.5 border-[#CBAE7A]/40 text-[#CBAE7A]">
                            {n.tags[0]}
                          </span>
                        )}
                        <time className="ml-auto">{dateLabel}</time>
                      </div>
                      <h3 className="auralis-section-title mt-2 text-lg sm:text-xl font-semibold leading-snug">
                        {title}
                      </h3>
                      {dek && (
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                          {dek}
                        </p>
                      )}
                      <span className="mt-3 inline-block text-sm underline underline-offset-4 text-[#CBAE7A]/80 hover:text-[#FFD787]">
                        {language === 'KR' ? '자세히 보기 →' : 'Read more →'}
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {/* ===== 🔍 검색창 (All devices) ===== */}
        <div className="flex justify-center mt-12 mb-8">
          {searchInput}
        </div>

        {/* ===== 페이지네이션 ===== */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2 text-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => updatePage(p)}
                className={`px-3 py-1.5 rounded-full border transition
                  ${
                    p === page
                      ? 'bg-[#CBAE7A]/30 border-[#CBAE7A]/60 text-[#CBAE7A]'
                      : 'border-white/10 hover:border-[#CBAE7A]/40 text-neutral-400 hover:text-[#CBAE7A]'
                  }
                `}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
