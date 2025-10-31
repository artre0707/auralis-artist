import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSiteContext } from '@/contexts/SiteContext';

type Props = {
  tags: string[];
  years: string[];
};

export default function NewsFilters({ tags, years }: Props) {
  const { language } = useSiteContext(); // 'KR' | 'EN'
  const [params, setParams] = useSearchParams();

  const q = params.get('q') || '';
  const year = params.get('year') || '';
  const activeTags = params.getAll('tag');

  const L = {
    search: language === 'KR' ? '검색' : 'Search',
    year: language === 'KR' ? '연도' : 'Year',
    tag: language === 'KR' ? '태그' : 'Tags',
    clearSearch: language === 'KR' ? '검색 지우기' : 'Clear search',
    clearTags: language === 'KR' ? '태그 모두 지우기' : 'Clear all tags',
    noneTags: language === 'KR' ? '태그가 없습니다' : 'No tags available',
    all: language === 'KR' ? '전체' : 'All',
    open: language === 'KR' ? '열기' : 'Show',
    close: language === 'KR' ? '닫기' : 'Hide',
    placeholder: language === 'KR' ? '검색어를 입력하세요…' : 'Type to search…',
  };

  const [open, setOpen] = useState<{ search: boolean; year: boolean; tag: boolean }>({
    search: false,
    year: false,
    tag: true,
  });

  const [input, setInput] = useState(q);
  useEffect(() => setInput(q), [q]);
  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (input.trim()) next.set('q', input.trim());
      else next.delete('q');
      next.set('page', '1');
      setParams(next, { replace: true });
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const onYear = (y: string) => {
    const next = new URLSearchParams(params);
    if (y) next.set('year', y);
    else next.delete('year');
    next.set('page', '1');
    setParams(next, { replace: true });
  };

  const toggleTag = (t: string) => {
    const next = new URLSearchParams(params);
    const all = new Set(next.getAll('tag'));
    if (all.has(t)) all.delete(t);
    else all.add(t);
    next.delete('tag');
    Array.from(all).forEach((v) => next.append('tag', v));
    next.set('page', '1');
    setParams(next, { replace: true });
  };

  const selected = useMemo(() => new Set(activeTags), [activeTags]);

  const Section: React.FC<{ id: keyof typeof open; title: string; children: React.ReactNode }> = ({
    id,
    title,
    children,
  }) => (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2 bg-[var(--card)] backdrop-blur text-[13px]"
        onClick={() => setOpen((s) => ({ ...s, [id]: !s[id] }))}
        aria-expanded={open[id]}
      >
        <span className="font-medium">{title}</span>
        <span className="text-xs opacity-70">{open[id] ? L.close : L.open}</span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open[id] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* 🔎 검색 */}
      <Section id="search" title={L.search}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={L.placeholder}
          className="w-full px-3 py-2 rounded-md border border-[#CBAE7A]/30 bg-[var(--card)] outline-none"
        />
        {q && (
          <button
            onClick={() => setInput('')}
            className="mt-2 text-xs sm:text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            {L.clearSearch}
          </button>
        )}
      </Section>

      {/* 📅 연도 */}
      <Section id="year" title={L.year}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onYear('')}
            className={`px-2.5 py-1 text-[13px] rounded-full border transition
              ${
                !year
                  ? 'bg-[#CBAE7A]/20 border-[#CBAE7A]/50 text-[#CBAE7A]'
                  : 'border-white/10 hover:border-[#CBAE7A]/40 text-neutral-500 dark:text-neutral-300'
              }`}
          >
            {L.all}
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => onYear(y)}
              className={`px-2.5 py-1 text-[13px] rounded-full border transition
                ${
                  year === y
                    ? 'bg-[#CBAE7A]/20 border-[#CBAE7A]/50 text-[#CBAE7A]'
                    : 'border-white/10 hover:border-[#CBAE7A]/40 text-neutral-700 dark:text-neutral-100'
                }`}
            >
              {y}
            </button>
          ))}
        </div>
      </Section>

      {/* 🏷️ 태그 */}
      <Section id="tag" title={L.tag}>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 && <div className="text-sm opacity-70">{L.noneTags}</div>}
          {tags.map((t) => {
            const on = selected.has(t);
            return (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`px-2.5 py-1 text-[13px] rounded-full border transition
                  ${
                    on
                      ? 'bg-[#CBAE7A]/20 border-[#CBAE7A]/50 text-[#CBAE7A]'
                      : 'border-white/10 hover:border-[#CBAE7A]/40 text-neutral-700 dark:text-neutral-100'
                  }`}
              >
                #{t}
              </button>
            );
          })}
        </div>
        {activeTags.length > 0 && (
          <button
            onClick={() => {
              const next = new URLSearchParams(params);
              next.delete('tag');
              next.set('page', '1');
              setParams(next, { replace: true });
            }}
            className="mt-3 text-xs sm:text-sm underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            {L.clearTags}
          </button>
        )}
      </Section>
    </div>
  );
}
