import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import { getAllNotes, likeNote, ElysiaNote } from "../../services/magazineStore";
import { motion } from "framer-motion";

export default function ReaderNote() {
  const { id } = useParams();
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
          <Link to="/magazine/readers-notes" className="text-amber-600 hover:underline">
            ← 감상자 노트로 돌아가기
          </Link>
        </main>
      </PageContainer>
    );
  }

  const bodyContent = note.body || "";

  return (
    <PageContainer>
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto px-4 py-16"
      >
        <header className="text-center mb-8">
          <h1 className="text-3xl font-serif font-semibold mb-2">{note.title}</h1>
          <div className="text-sm text-gray-500 flex justify-center items-center gap-2">
            <span>{note.author}</span>
            <time>{new Date(note.createdAt).toLocaleDateString("ko-KR")}</time>
          </div>
          {note.meta?.sourceTitle && (
            <p className="mt-2 text-xs italic text-amber-700 dark:text-amber-300">
              🎧 원곡:{" "}
              {note.meta?.slug ? (
                <Link to={`/albums/${note.meta.slug}`} className="underline">
                  {note.meta.sourceTitle}
                </Link>
              ) : note.meta?.youtube ? (
                <a href={note.meta.youtube} target="_blank" rel="noreferrer" className="underline">
                  {note.meta.sourceTitle}
                </a>
              ) : (
                note.meta.sourceTitle
              )}
            </p>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert leading-relaxed whitespace-pre-line">
          {bodyContent}
        </div>

        <div className="mt-10 flex justify-center items-center gap-2 text-sm">
          <button
            onClick={handleLike}
            disabled={liked}
            className="flex items-center gap-1 px-3 py-1 border rounded-full border-[var(--border)] hover:border-amber-300 transition"
          >
            ❤️ {note.likes || 0}
          </button>
          <Link to="/magazine/readers-notes" className="text-amber-700 dark:text-amber-300 hover:underline">
            ← 목록으로 돌아가기
          </Link>
        </div>
      </motion.article>
    </PageContainer>
  );
}