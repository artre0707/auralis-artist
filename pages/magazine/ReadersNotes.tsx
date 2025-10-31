import React from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import PageHero from "../../components/PageHero";
import { getAllNotes, likeNote, ElysiaNote } from "../../services/magazineStore";
import { motion } from "framer-motion";

export default function ReadersNotes() {
  const [notes, setNotes] = React.useState<ElysiaNote[]>(getAllNotes());
  const [likedIds, setLikedIds] = React.useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("auralis_liked_notes") || "[]");
    } catch {
      return [];
    }
  });

  const handleLike = (id: string) => {
    if (likedIds.includes(id)) return; // Prevent multiple likes
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

  return (
    <PageContainer>
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <PageHero
          title="Elysia Reflections"
          subtitle="감상자들의 울림이 함께 빛으로 이어지는 공간"
          align="center"
          goldTitle
          divider="none"
        />

        {/* Featured Reflection */}
        {featured && (
          <section className="mt-10 mb-14">
            <h2 className="font-serif text-xl mb-3 text-center text-amber-700 dark:text-amber-300">🌟 Featured Reflection</h2>
            <Link
              to={`/magazine/readers-notes/${featured.id}`}
              className="block rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <h3 className="font-serif text-2xl font-semibold mb-3">{featured.title}</h3>
                <p className="text-sm text-subtle line-clamp-4 mb-4">{featured.body?.slice(0, 300)}...</p>
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
                    <time>{new Date(featured.createdAt).toLocaleDateString("ko-KR")}</time>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Other Notes */}
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
              <Link to={`/magazine/readers-notes/${n.id}`} className="block p-5">
                <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">{n.title}</h3>
                <p className="text-sm text-subtle line-clamp-3 mb-3">{n.body?.slice(0, 150)}...</p>
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
                    <time>{new Date(n.createdAt).toLocaleDateString("ko-KR")}</time>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </PageContainer>
  );
}