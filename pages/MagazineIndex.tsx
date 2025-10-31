import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSiteContext } from '../contexts/SiteContext';
import PageContainer from "../components/PageContainer";
import PageHero from "../components/PageHero";
import { articles, Article } from '../data/articles';

const content = {
  EN: {
    title: "Auralis Magazine",
    subtitle: "Stories, essays, liner notes, and studio diaries",
    noArticles: "No articles found.",
    sort: "Sort",
    sortNew: "Newest",
    sortOld: "Oldest",
  },
  KR: {
    title: "Auralis 매거진",
    subtitle: "이야기, 에세이, 라이너 노트, 그리고 스튜디오 다이어리",
    noArticles: "게시물이 없습니다.",
    sort: "정렬",
    sortNew: "최신순",
    sortOld: "오래된순",
  }
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const { language } = useSiteContext();
  const articleContent = article.content[language];
  const articleTags = article.tags?.[language];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] backdrop-blur shadow-sm hover:shadow-md transition-shadow group"
    >
      <Link to={`/magazine/${article.slug}`} className="block">
        {article.cover && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={article.cover}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400">
            {articleTags?.map((t) => (
              <span key={t} className="rounded-full border px-2 py-0.5">{t}</span>
            ))}
            {article.date && (
              <time className="ml-auto">
                {new Date(article.date).toLocaleDateString(language === 'KR' ? 'ko-KR' : 'en-US')}
              </time>
            )}
          </div>
          <h3 className="mt-2 font-serif text-lg sm:text-xl font-semibold line-clamp-2">{articleContent.title}</h3>
          {articleContent.dek && (
            <p className="mt-1 text-sm text-subtle line-clamp-2">{articleContent.dek}</p>
          )}
        </div>
      </Link>
    </motion.article>
  );
};

export default function MagazineIndex() {
  const { language } = useSiteContext();
  const c = content[language];

  const [params, setParams] = useSearchParams();
  const sort = params.get("sort") || "desc"; // desc=newest

  // filtering logic
  const filtered = useMemo(() => {
    // sort by date
    const sorted = [...articles].sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      return sort === "asc" ? da - db : db - da;
    });

    return sorted;
  }, [sort]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  }

  return (
    <PageContainer>
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <PageHero
          title={c.title}
          subtitle={c.subtitle}
          align="center"
          goldTitle
          divider="none"
          size="md"
        />

        <div className="mb-12 flex justify-center">
            <label className="flex items-center gap-2 text-sm text-subtle">
              <span>{c.sort}</span>
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                aria-label={c.sort}
              >
                <option value="desc">{c.sortNew}</option>
                <option value="asc">{c.sortOld}</option>
              </select>
            </label>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-sm text-subtle py-16">{c.noArticles}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </main>
    </PageContainer>
  );
}