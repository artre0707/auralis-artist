import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSiteContext } from '../contexts/SiteContext';
import PageContainer from "../components/PageContainer";
import { articles } from '../data/articles';
import BackToSection from "@/components/BackToSection";
import Btn from "@/components/Btn";

function clsx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

const content = {
  EN: {
    notFoundTitle: "Article not found",
    notFoundBody: "The page you’re looking for doesn’t exist.",
    backToMagazine: "Back to Magazine",
    backToAlbum: "Back to Album",
    readersNotes: "Your Notes",
    notesPlaceholder: "Write your thoughts, highlights, or quotes… (auto-saved)",
    notesSaved: "Saved",
    clearNotes: "Clear notes",
    relatedTitle: "Related Articles",
  },
  KR: {
    notFoundTitle: "게시물을 찾을 수 없습니다",
    notFoundBody: "찾고 계신 페이지가 존재하지 않습니다.",
    backToMagazine: "매거진으로 돌아가기",
    backToAlbum: "앨범으로 돌아가기",
    readersNotes: "당신의 노트",
    notesPlaceholder: "감상, 밑줄, 인상 깊은 구절을 적어보세요… (자동 저장)",
    notesSaved: "저장됨",
    clearNotes: "노트 비우기",
    relatedTitle: "관련 글",
  }
};

export default function MagazineArticle() {
  const { slug = "" } = useParams();
  const { language } = useSiteContext();
  const c = content[language];
  
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <PageContainer>
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold">{c.notFoundTitle}</h1>
          <p className="mt-3 text-subtle">{c.notFoundBody}</p>
          <div className="mt-6">
            <BackToSection type="magazine" />
          </div>
        </section>
      </PageContainer>
    );
  }

  const articleContent = article.content[language];
  const articleTags = article.tags?.[language];

  // Personal notes (localStorage)
  const notesKey = `mag:notes:${slug}`;
  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(notesKey) || "";
    } catch {
      return "";
    }
  });
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(notesKey, notes);
        setSavedAt(Date.now());
      } catch {}
    }, 300);
    return () => clearTimeout(id);
  }, [notes, notesKey]);

  const clearNotes = () => {
    try {
      localStorage.removeItem(notesKey);
    } catch {}
    setNotes("");
    setSavedAt(Date.now());
  };

  // Related Articles
  const related = useMemo(() => {
    const tagSet = new Set(articleTags || []);
    if (tagSet.size === 0) return [];
    
    return articles
      .filter(a => a.slug !== article.slug)
      .map(a => {
        const tags = a.tags?.[language] || [];
        const overlap = tags.filter(t => tagSet.has(t)).length;
        return { a, score: overlap };
      })
      .filter(x => x.score > 0)
      .sort((x, y) => y.score - x.score || (new Date(y.a.date || 0).getTime() - new Date(x.a.date || 0).getTime()))
      .slice(0, 2)
      .map(x => x.a);
  }, [article.slug, articleTags, language]);

  return (
    <PageContainer>
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14"
      >
        <header className="text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {articleTags?.map((t) => (
              <span key={t} className="rounded-full border px-2 py-0.5">{t}</span>
            ))}
            {article.date && (
              <time className="ml-auto">
                {new Date(article.date).toLocaleDateString(language === 'KR' ? 'ko-KR' : 'en-US')}
              </time>
            )}
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-semibold tracking-tight">{articleContent.title}</h1>
          {articleContent.dek && <p className="mt-3 text-base text-subtle">{articleContent.dek}</p>}
        </header>

        {article.cover && (
          <div className="mt-8 rounded-3xl overflow-hidden shadow-lg">
            <img src={article.cover} alt="" className="w-full h-auto object-cover" loading="lazy" decoding="async" />
          </div>
        )}

        <div className={clsx("prose prose-lg prose-neutral dark:prose-invert mx-auto mt-8", language === 'KR' ? 'font-noto-kr' : 'font-serif')}>
          {articleContent.body.split("\n\n").map((para, i) => (
            <p key={i} className="whitespace-pre-line leading-relaxed">{para}</p>
          ))}
        </div>

        {(article.author || article.role) && (
          <div className="mt-10 text-sm text-gray-600 dark:text-gray-300 text-center">
            {article.author && <span className="font-medium">{article.author}</span>} {article.role && <span className="opacity-80">· {article.role}</span>}
          </div>
        )}

        <section className="mt-12 border-t border-[var(--border)] pt-8">
          <h2 className="font-serif text-xl sm:text-2xl mb-3 text-[var(--heading)]">{c.readersNotes}</h2>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 p-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={c.notesPlaceholder}
              className="w-full min-h-[160px] bg-transparent outline-none resize-y"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-subtle">
              <div>
                {savedAt && (
                  <span>
                    {c.notesSaved} · {new Date(savedAt).toLocaleTimeString(language === 'KR' ? 'ko-KR' : 'en-US')}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={clearNotes}
                className="rounded-full px-3 py-1 border border-[var(--border)] hover:border-amber-200/60"
              >
                {c.clearNotes}
              </button>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-xl sm:text-2xl mb-4 text-[var(--heading)]">{c.relatedTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((r) => {
                const rc = r.content[language];
                const rt = r.tags?.[language] || [];
                return (
                  <Link
                    key={r.slug}
                    to={`/magazine/${r.slug}`}
                    className="group rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] hover:shadow-md transition"
                  >
                    {r.cover && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={r.cover}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        {rt.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-full border px-2 py-0.5">{t}</span>
                        ))}
                        {r.date && (
                          <time className="ml-auto">
                            {new Date(r.date).toLocaleDateString(language === 'KR' ? 'ko-KR' : 'en-US')}
                          </time>
                        )}
                      </div>
                      <h3 className="mt-1 font-serif text-base sm:text-lg font-semibold line-clamp-2">
                        {rc.title}
                      </h3>
                      {rc.dek && <p className="mt-1 text-xs text-subtle line-clamp-2">{rc.dek}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-12 text-center">
          <BackToSection type="magazine" />
          {article.albumUrl && (
            <div className="mt-6">
              <Link to={article.albumUrl}>
                <Btn variant="outlineGhost" arrow>
                  {c.backToAlbum}
                </Btn>
              </Link>
            </div>
          )}
        </div>
      </motion.article>
    </PageContainer>
  );
}