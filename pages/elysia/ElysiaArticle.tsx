import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import { getAllNotes, likeNote, ElysiaNote } from "../../services/magazineStore";
import { motion } from "framer-motion";
import ElysiaSourceTag from "../../components/ElysiaSourceTag";
import { useSiteContext } from "../../contexts/SiteContext";
import { getLocalized } from "../../utils/i18nPost";
import PageHero from "../../components/PageHero";
import { useTheme } from "../../hooks/useTheme";

export default function ElysiaArticle() {
  const { id } = useParams();
  const { language } = useSiteContext();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [notes, setNotes] = useState<ElysiaNote[]>(getAllNotes());
  const note = notes.find((n) => n.id === id);

  const [liked, setLiked] = useState(() =>
    (JSON.parse(localStorage.getItem("auralis_liked_notes") || "[]") as string[]).includes(id!)
  );

  const handleLike = () => {
    if (!id || liked) return;
    const newCount = likeNote(id);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: newCount } : n))
    );
    const likedSet = new Set(
      JSON.parse(localStorage.getItem("auralis_liked_notes") || "[]")
    );
    likedSet.add(id);
    localStorage.setItem("auralis_liked_notes", JSON.stringify([...likedSet]));
    setLiked(true);
  };

  if (!note) {
    return (
      <PageContainer>
        <main className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-serif mb-3">게시글을 찾을 수 없습니다.</h1>
          <Link to="/elysia" className="text-amber-600 hover:underline">
            ← 엘리시아 기록으로 돌아가기
          </Link>
        </main>
      </PageContainer>
    );
  }

  const rawTitle = getLocalized(language, note.title, note.titleKR) ?? note.title ?? '';
  const rawBody  = getLocalized(language, note.body,  note.bodyKR)  ?? note.body  ?? '';
  const sections = getLocalized(language, note.sections, note.sectionsKR);

  const bodyHtml = rawBody ? rawBody.replace(/\n/g, '<br />') : '';

  const subtitle = `${note.author || 'Anonymous'} · ${new Date(note.createdAt).toLocaleDateString(language === 'KR' ? 'ko-KR' : 'en-US')}`;

  return (
    <PageContainer>
      <PageHero
        title={rawTitle}
        subtitle={subtitle}
        align="center"
        goldTitle
        divider="fade"
        className={isDarkMode ? 'hero-transparent hero-bottom-hairline' : ''}
        gradientOverlay={!isDarkMode}
        backgroundImage={isDarkMode ? undefined : 'https://images.unsplash.com/photo-1518602264539-53b028731b54?q=80&w=1920&auto=format&fit=crop'}
      />
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto px-6 pt-8 pb-24"
      >
        <div className="text-center -mt-4 mb-8">
            <ElysiaSourceTag
              albumKey={note.meta?.albumKey as any}
              sourceTitle={note.meta?.sourceTitle}
            />
          </div>

        <div className="mt-8 flex justify-center">
          <span className="h-px w-20 bg-gradient-to-r from-transparent via-[#CBAE7A] to-transparent opacity-70" />
        </div>

        {sections?.length ? (
          <div className="mt-8 space-y-8">
            {sections.map((s, i) => (
              <section key={i}>
                <h3 className="mb-2 text-[13px] tracking-wide font-semibold text-neutral-700 dark:text-neutral-300">
                  {s.label}
                </h3>
                <p className="leading-[1.9] text-[15px] md:text-[16px] text-neutral-800 dark:text-neutral-200 whitespace-pre-line">
                  {s.text}
                </p>
              </section>
            ))}
          </div>
        ) : (
          <div
            className="prose prose-neutral dark:prose-invert mt-8 prose-p:leading-[1.9] prose-p:text-[16px] text-neutral-800 dark:text-neutral-200"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        )}


        <div className="mt-10 flex justify-center items-center gap-2 text-sm">
          <button
            onClick={handleLike}
            disabled={liked}
            className="flex items-center gap-1 px-3 py-1 border rounded-full border-[var(--border)] hover:border-amber-300 transition"
          >
            ❤️ {note.likes || 0}
          </button>
          <Link to="/elysia" className="text-amber-700 dark:text-amber-300 hover:underline">
            ← 목록으로 돌아가기
          </Link>
        </div>
      </motion.article>
    </PageContainer>
  );
}