// pages/studio/Muse.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// FIX: Changed react-router-dom import to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from "react-router-dom";
import { useSiteContext } from '../../contexts/SiteContext';
import type { Note as NotebookNote } from "./Notebook";
import { albumsData } from "../../data/albums";

const MotionSection = motion.section;

type MuseOutput = {
  title: string;
  mood: string;
  instrumentation: string;
  concept: string;
  musicalElements: { motif: string; harmony: string; tempo: string; dynamics: string; };
};

type MuseOutputWithKR = MuseOutput & {
  titleKR?: string;
  moodKR?: string;
  instrumentationKR?: string;
  conceptKR?: string;
  musicalElementsKR?: Partial<MuseOutput['musicalElements']>;
};

type Props = {
  onSendToNotebook: (note: Omit<NotebookNote, 'id'|'createdAt'>, goToNotebook?: boolean) => void;
  onPublishToReaders: (payload: {
    title: string;
    body: string;
    author: string;
    meta?: any;
    titleKR?: string;
    bodyKR?: string;
    sections?: any[];
    sectionsKR?: any[];
  }) => void;
};

export default function MuseSection({ onSendToNotebook, onPublishToReaders }: Props) {
  const { language, museSeed } = useSiteContext();

  const [input, setInput] = useState("");
  const [data, setData] = useState<MuseOutputWithKR | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (museSeed) {
      setInput(museSeed.prompt);
    } else {
      setInput("");
    }
  }, [museSeed]);

  const examples = [
    language === "KR" ? "고요한 새벽, 창문 너머의 푸른 잔광" : "A soft golden light over a still lake.",
    language === "KR" ? "저녁의 긴 그림자, 사라지는 온기" : "Long shadows at twilight, fading warmth.",
    language === "KR" ? "은빛 비 내리는 도시의 거리" : "A silver rain over a quiet street."
  ];
  
  const c = {
    EN: { saveToNotebook: "Send to Notebook", publish: "Post to Elysia", copy: "Copy", gen: "Generate Concept", gathering: "Gathering inspiration…" },
    KR: { saveToNotebook: "노트북으로 전송", publish: "엘리시아로 게시", copy: "복사", gen: "콘셉트 생성", gathering: "영감을 모으는 중…" }
  }[language];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/muse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          lang: language === 'KR' ? 'ko' : 'en',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errData.error || errData.message || `Server error: ${res.status}`);
      }
      
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err?.message || "Error occurred");
    } finally { setLoading(false); }
  }

  function buildPlainText(d: MuseOutput) {
    return `Title: ${d.title}\n\nMood:\n${d.mood}\n\nInstrumentation:\n${d.instrumentation}\n\nConcept:\n${d.concept}\n\nMusical Elements:\n- Motif: ${d.musicalElements.motif}\n- Harmony: ${d.musicalElements.harmony}\n- Tempo: ${d.musicalElements.tempo}\n- Dynamics: ${d.musicalElements.dynamics}`;
  }

  function copyAll() {
    if (!data) return;
    navigator.clipboard.writeText(buildPlainText(data)).catch(()=>{});
  }

  const handleSendToNotebook = () => {
    if (!data) return;
    const newNote: Omit<NotebookNote, 'id' | 'createdAt'> = {
      title: data.title,
      seed: input,
      chords: data.musicalElements.harmony,
      tempo: data.musicalElements.tempo,
      notes: `Motif: ${data.musicalElements.motif}\nDynamics: ${data.musicalElements.dynamics}\n\nConcept:\n${data.concept}`,
      titleKR: data.titleKR,
      notesKR: data.conceptKR,
    };
    onSendToNotebook(newNote, true);
  };

  const handlePublish = () => {
    if (!data) return;
    const albumKey = museSeed?.meta?.albumKey as keyof typeof albumsData | undefined;
    const album = albumKey ? albumsData[albumKey] : null;
    
    const sections = [
      { label: "Mood", text: data.mood },
      { label: "Instrumentation", text: data.instrumentation },
      { label: "Concept", text: data.concept },
      { label: "Musical Elements", text: `- Motif: ${data.musicalElements.motif}\n- Harmony: ${data.musicalElements.harmony}\n- Tempo: ${data.musicalElements.tempo}\n- Dynamics: ${data.musicalElements.dynamics}` },
    ];
    
    const sectionsKR = data.moodKR ? [
      { label: "무드", text: data.moodKR },
      { label: "악기 구성", text: data.instrumentationKR || "" },
      { label: "콘셉트", text: data.conceptKR || "" },
      { label: "음악적 요소", text: `- 모티브: ${data.musicalElementsKR?.motif}\n- 하모니: ${data.musicalElementsKR?.harmony}\n- 템포: ${data.musicalElementsKR?.tempo}\n- 다이내믹스: ${data.musicalElementsKR?.dynamics}` },
    ] : undefined;

    onPublishToReaders({
      title: data.title,
      body: buildPlainText(data), // fallback body
      author: "Muse Collaboration",
      titleKR: data.titleKR,
      sections,
      sectionsKR,
      meta: album ? {
        albumKey: albumKey,
        sourceTitle: album.title,
        youtube: album.links?.youtube || undefined,
        slug: album.slug,
        catalogNo: album.catalogueNo,
      } : undefined,
    });
  };

  return (
    <section aria-labelledby="muse-widget-title">
      <h2 id="muse-widget-title" className="sr-only">
        {language === 'KR' ? "AI 작곡가의 뮤즈" : "AI Composer’s Muse"}
      </h2>

      {/* Studio Quick Nav */}
      <div className="mb-6 flex items-center gap-2">
        <ReactRouterDOM.Link
          to="/studio/collab"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
        >
          🤝 Collab
        </ReactRouterDOM.Link>
        <ReactRouterDOM.Link
          to="/studio/colorboard"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-[var(--border)] hover:bg-white/60 dark:hover:bg-white/10 transition-colors text-subtle"
        >
          🎨 Colorboard
        </ReactRouterDOM.Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === "KR" ? "예: ‘잔잔한 비가 내리는 오후의 회상...’" : "Example: A pale dawn light breaking through still mist..."}
          className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {examples.map((ex, i) => (
              <button
                key={i} type="button" onClick={() => setInput(ex)}
                className="text-xs px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition"
              >
                {language === "KR" ? `예시 ${i + 1}` : `Example ${i + 1}`}
              </button>
            ))}
          </div>
          <button
            type="submit" disabled={loading || !input.trim()}
            className="rounded-lg px-5 py-2.5 text-sm font-medium bg-neutral-900 text-white hover:opacity-95 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                {c.gathering}
              </span>
            ) : c.gen}
          </button>
        </div>
      </form>

      {loading && (
        <div className="mt-6 animate-pulse">
          <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-3"></div>
          <div className="h-24 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
        </div>
      )}

      {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {data && !loading && (
        <MotionSection
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="mt-8 rounded-2xl border border-[var(--border)] p-5 bg-[var(--card)] backdrop-blur"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif text-gradient-auralis post-title">{data.title}</h3>
            <div className="flex items-center gap-2">
              <button onClick={handleSendToNotebook} className="text-xs rounded-md px-3 py-1.5 bg-amber-600 text-white hover:opacity-90">{c.saveToNotebook}</button>
              <button onClick={handlePublish} className="text-xs rounded-md px-3 py-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 transition">{c.publish}</button>
              <button onClick={copyAll} className="text-xs rounded-md px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">{c.copy}</button>
            </div>
          </div>

          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 post-label">Mood</dt>
              <dd className="mt-1 text-sm leading-relaxed post-body">{data.mood}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 post-label">Instrumentation</dt>
              <dd className="mt-1 text-sm leading-relaxed post-body">{data.instrumentation}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[12px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 post-label">Concept</dt>
              <dd className="mt-1 text-sm leading-relaxed post-body">{data.concept}</dd>
            </div>
          </dl>

          <div className="mt-5 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
            <h4 className="text-[12px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 post-label">Musical Elements</h4>
            <ul className="mt-2 space-y-2 text-sm post-body">
              <li><strong>Motif:</strong> {data.musicalElements.motif}</li>
              <li><strong>Harmony:</strong> {data.musicalElements.harmony}</li>
              <li><strong>Tempo:</strong> {data.musicalElements.tempo}</li>
              <li><strong>Dynamics:</strong> {data.musicalElements.dynamics}</li>
            </ul>
          </div>

          {museSeed?.meta?.albumKey && (
            <div className="mt-10 text-center">
              <ReactRouterDOM.Link to={`/albums/${museSeed.meta.albumKey}`} className="text-xs underline text-zinc-500 hover:text-[#CBAE7A] transition">
                {language === "KR" ? "← 앨범 페이지로 돌아가기" : "← Back to Album Page"}
              </ReactRouterDOM.Link>
            </div>
          )}
        </MotionSection>
      )}
    </section>
  );
}
