import React, { useMemo } from 'react';
// FIX: Changed react-router-dom imports to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PageHero from '@/components/PageHero';
import { useSiteContext } from '@/contexts/SiteContext';
import { news } from '@/data/news';
import NewsFilters from '@/components/NewsFilters';

const PAGE_SIZE = 6;

export default function News() {
  const { language } = useSiteContext();
  const [params, setParams] = ReactRouterDOM.useSearchParams();

  const q = params.get('q')?.toLowerCase() || '';
  const page = Number(params.get('page') || '1');
  const year = params.get('year') || '';
  const activeTags = params.getAll('tag');

  // Extract available tags and years for filters
  const { tags, years } = useMemo(() => {
    const allTags = new Set<string>();
    const allYears = new Set<string>();
    news.forEach(n => {
      n.tags?.forEach(t => allTags.add(t));
      if (n.date) {
        allYears.add(new Date(n.date).getFullYear().toString());
      }
    });
    return {
      tags: Array.from(allTags).sort(),
      years: Array.from(allYears).sort((a, b) => b.localeCompare(a)),
    };
  }, []);

  // ===== Filtering =====
  const filtered = useMemo(() => {
    let items = [...news];
    
    // Search query filter
    if (q) {
      items = items.filter((n) => {
        const title = n.title[language === 'KR' ? 'KR' : 'EN'].toLowerCase();
        const dek = (n.dek?.[language === 'KR' ? 'KR' : 'EN'] || '').toLowerCase();
        const body = (n.body?.[language === 'KR' ? 'KR' : 'EN'] || '').toLowerCase();
        return title.includes(q) || dek.includes(q) || body.includes(q);
      });
    }

    // Year filter
    if (year) {
      items = items.filter(n => n.date && new Date(n.date).getFullYear().toString() === year);
    }
    
    // Tags filter (match all selected tags)
    if (activeTags.length > 0) {
      items = items.filter(n => 
        n.tags && activeTags.every(t => n.tags!.includes(t))
      );
    }

    items.sort((a, b) => b.date.localeCompare(a.date));
    return items;
  }, [q, year, activeTags, language]);

  // ===== Pagination =====
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updatePage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next, { replace: true });
  };

  return (
    <PageContainer>
      <main className="max-w-7xl mx-auto px-4 pb-20">

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

        {/* ===== Page Layout with Filters ===== */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] lg:gap-10">
          <aside className="lg:sticky lg:top-24 self-start mb-8 lg:mb-0">
            <NewsFilters tags={tags} years={years} />
          </aside>
          
          <div className="min-w-0">
            {/* ===== News Cards ===== */}
            {paged.length === 0 ? (
              <div className="text-center text-subtle py-16">
                {language === 'KR'
                  ? '필터와 일치하는 게시물이 없습니다.'
                  : 'No articles match the selected filters.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                      className="gold-card rounded-2xl overflow-hidden"
                    >
                      <ReactRouterDOM.Link to={`/news/${n.slug}`} className="block">
                        {n.cover && (
                          <div className="relative aspect-[16/9] overflow-hidden">
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
                      </ReactRouterDOM.Link>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ===== Pagination ===== */}
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
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
