import React, { useMemo, useState } from "react";
// FIX: Changed react-router-dom imports to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from "react-router-dom";
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
      <ReactRouterDOM.Link to={`/magazine/${article.slug}`} className="block">
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
      </ReactRouterDOM.Link>
    </motion.article>
  );
};

export default function MagazineIndex() {
  const { language } = useSiteContext();
  const c = content[language];
  const [sort, setSort] = useState<'new' | 'old'>('new');

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return sort === 'new' ? dateB - dateA : dateA - dateB;
    });
  }, [sort]);

  return (
    <PageContainer>
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <PageHero
          title={c.title}
          subtitle={c.subtitle}
          align="center"
          goldTitle
          divider="none"
        />

        <div className="my-8 flex justify-center items-center gap-2">
          <span className="text-sm text-subtle">{c.sort}:</span>
          <button
            onClick={() => setSort('new')}
            className={`px-3 py-1 text-sm rounded-full transition ${
              sort === 'new'
                ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                : 'text-subtle hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {c.sortNew}
          </button>
          <button
            onClick={() => setSort('old')}
            className={`px-3 py-1 text-sm rounded-full transition ${
              sort === 'old'
                ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                : 'text-subtle hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {c.sortOld}
          </button>
        </div>

        {sortedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedArticles.map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-subtle">{c.noArticles}</p>
        )}
      </main>
    </PageContainer>
  );
}