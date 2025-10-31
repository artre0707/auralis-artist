import React from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import { getAllNotes, likeNote, ElysiaNote } from "../../services/magazineStore";
import { motion } from "framer-motion";
import { useSiteContext } from "../../contexts/SiteContext";
import PageHero from "../../components/PageHero";
import { useTheme } from "../../hooks/useTheme";

const intro = {
  EN: {
    p1: "Elysia are those who dwell in the quiet light of Auralis’ music — listeners who find serenity, memory, and gratitude within sound.",
    p2: "Each reflection is a gentle echo from the garden of light."
  },
  KR: {
    p1: "엘리시아(Elysia)는 오랄리스의 음악 속 고요한 빛의 정원에 머무는 이들입니다.\n그들은 소리 안에서 평온과 기억, 그리고 감사의 마음을 발견합니다.",
    p2: "이곳의 모든 기록은 빛의 정원에서 피어난 울림입니다."
  }
};

export default function ElysiaIndex() {
  const { language } = useSiteContext();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [notes, setNotes] = React.useState<ElysiaNote[]>(getAllNotes());
  const [likedIds, setLikedIds] = React.useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("auralis_liked_notes") || "[]");
    } catch {
      return [];
    }
  });

  const handleLike = (id: string) => {
    if (likedIds.includes(id)) return;
    const newCount = likeNote(id);
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: newCount } : n))
    );
    const updated = [...likedIds, id];
    setLikedIds(updated);
    localStorage.setItem("auralis_liked_notes", JSON.stringify(updated));
  };

  const byDateDesc = (a: ElysiaNote, b: ElysiaNote) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  const byLikesThenDate = (a: ElysiaNote, b: ElysiaNote) =>
    (b.likes || 0) - (a.likes || 0) || byDateDesc(a, b);

  const sortedNotes = [...notes].sort(byDateDesc);

  const featured = [...notes].sort(byLikesThenDate)[0];

  const others = sortedNotes.filter((n) => n.id !== featured?.id);

  const heroContent = {
    EN: {
      title: "Elysia Reflections",
      subtitle: "Moments of Light and Resonance left by Elysia."
    },
    KR: {
      title: "엘리시아의 기록",
      subtitle: "빛과 울림으로 남겨진 이들의 순간들"
    }
  };

  const currentHero = heroContent[language];
  const currentIntro = intro[language];
  const enIntroP1Parts = currentIntro.p1.split("—");

  return (
    <PageContainer>
      {language === "KR" && (
        <style>{`
          /* Elysia Index KR Font Size Adjustments */
          #elysia-hero .auralis-subtitle {
            font-size: 12px; /* ~14px -> 12px */
          }
          @media (min-width: 640px) { /* sm breakpoint */
            #elysia-hero .auralis-subtitle {
              font-size: 14px; /* ~16px -> 14px */
            }
          }
        `}</style>
      )}
      <PageHero
        id="elysia-hero"
        title={currentHero.title}
        subtitle={currentHero.subtitle}
        align="center"
        goldTitle
        divider="fade"
        className={isDarkMode ? "hero-transparent hero-bottom-hairline" : ""}
        gradientOverlay={!isDarkMode}
      />

      <main className="max-w-6xl mx-auto px-4 pb-20">
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`
            -mt-8 max-w-3xl mx-auto text-center
            ${language === 'KR'
              ? 'text-[12px] sm:text-[13px] md:text-[14px]'
              : 'text-[14px] sm:text-[15px] md:text-[16px]'
            }
            leading-[1.85] sm:leading-[1.9] md:leading-[2]
            text-[var(--text)] opacity-90
            ${language === "KR" ? "font-noto-kr" : ""}
          `}
        >
          {language === "EN" ? (
            <>
              <p>
                <em className="text-neutral-500 dark:text-neutral-400">
                  {enIntroP1Parts[0]}—
                </em>
                &nbsp;{enIntroP1Parts[1]}
              </p>
              <p className="mt-4">{currentIntro.p2}</p>
            </>
          ) : (
            <>
              <p className="whitespace-pre-line">{currentIntro.p1}</p>
              <p className="mt-4">{currentIntro.p2}</p>
            </>
          )}
        </motion.div>

        {/* Notes Section */}
        {notes.length === 0 ? (
          <div className="text-center text-sm text-subtle py-16">
            {language === "KR"
              ? "아직 등록된 기록이 없습니다."
              : "No reflections have been posted yet."}
          </div>
        ) : (
          <>
            {/* Featured Reflection */}
            {featured && (
              <section className="mt-10 mb-14">
                <h2 className="font-serif text-xl mb-3 text-center text-amber-700 dark:text-amber-300">
                  🌟 Featured Reflection
                </h2>
                <Link
                  to={`/elysia/${featured.id}`}
                  className="block rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:shadow-md transition overflow-hidden"
                >
                  <div className="p-6 sm:p-8">
                    <h3 className="font-serif text-2xl font-semibold mb-3">
                      {featured.title}
                    </h3>
                    <p className="text-sm text-subtle line-clamp-4 mb-4">
                      {featured.body?.slice(0, 300)}...
                    </p>
                    {featured.meta?.sourceTitle && (
                      <p className="text-xs italic text-amber-700 dark:text-amber-300">
                        🎧 원곡: {featured.meta.sourceTitle}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs mt-4 text-gray-500">
                      <span>{featured.author}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLike(featured.id);
                          }}
                          disabled={likedIds.includes(featured.id)}
                          className="flex items-center gap-1 text-amber-600 hover:text-amber-400"
                        >
                          ❤️ {featured.likes || 0}
                        </button>
                        <time>
                          {new Date(featured.createdAt).toLocaleDateString(
                            "ko-KR"
                          )}
                        </time>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Other Notes */}
            {others.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {others.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    className="rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:shadow-md transition overflow-hidden"
                  >
                    <Link to={`/elysia/${n.id}`} className="block p-5">
                      <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">
                        {n.title}
                      </h3>
                      <p className="text-sm text-subtle line-clamp-3 mb-3">
                        {n.body?.slice(0, 150)}...
                      </p>
                      {n.meta?.sourceTitle && (
                        <p className="text-xs italic text-amber-700 dark:text-amber-300 mb-1">
                          🎧 {n.meta.sourceTitle}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{n.author}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleLike(n.id);
                            }}
                            disabled={likedIds.includes(n.id)}
                            className="flex items-center gap-1 text-amber-600 hover:text-amber-400"
                          >
                            ❤️ {n.likes || 0}
                          </button>
                          <time>
                            {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                          </time>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </PageContainer>
  );
}
