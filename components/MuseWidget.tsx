import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// FIX: Changed react-router-dom imports to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from "react-router-dom";
import { useSiteContext } from '../contexts/SiteContext';
import { albumsData } from '../data/albums';

// FIX: Destructure motion component to aid TypeScript type inference.
const MotionSection = motion.section;

type MuseOutput = {
  title: string;
  mood: string;
  instrumentation: string;
  concept: string;
  musicalElements: {
    motif: string;
    harmony: string;
    tempo: string;
    dynamics: string;
  };
};

// From Notebook.tsx for data compatibility
type Note = {
  id: string;
  title: string;
  seed: string;
  chords?: string;
  tempo?: string;
  notes?: string;
  createdAt: number;
};

const NOTEBOOK_KEY = "auralis-notebook";

export default function MuseWidget() {
  const { language } = useSiteContext();
  const location = ReactRouterDOM.useLocation();
  const navigate = ReactRouterDOM.useNavigate();

  const [input, setInput] = useState("");
  const [data, setData] = useState<MuseOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [albumTitle, setAlbumTitle] = useState<string | null>(null);
  const [albumSlug, setAlbumSlug] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const album = p.get("album");
    const seed = p.get("seed");

    if (album) {
      setAlbumTitle(album);
      const foundAlbum = Object.values(albumsData).find(a => a.title === album);
      if (foundAlbum) {
        setAlbumSlug(foundAlbum.slug);
      }
    } else {
      setAlbumTitle(null);
      setAlbumSlug(null);
    }

    if (seed) {
      setInput(seed);
    } else if (album) {
      setInput(
        language === "KR"
          ? `오랄리스의 앨범 『${album}』에서 영감을 받아, 빛과 기억의 고요한 순간을 상상해보세요.`
          : `Inspired by Auralis’s album “${album}”, imagine a moment of quiet light and memory.`
      );
    }
  }, [language, location.search]);

  const examples = [
    language === "KR"
      ? "고요한 새벽, 창문 너머로 들어오는 푸른빛과 함께 시작되는 따뜻한 하루"
      : "A soft golden light over a still lake, warm and reflective.",
    language === "KR"
      ? "저녁의 긴 그림자 속에서 서서히 사라지는 기억의 온기"
      : "Long shadows at twilight, fading warmth and memory.",
    language === "KR"
      ? "은빛 비 내리는 도시의 거리, 잔잔한 피아노처럼 울리는 발걸음"
      : "A silver rain falling over a quiet city street, echoing like a piano."
  ];
  
  const content = {
      EN: {
          saveToNotebook: "Save to Notebook",
          copied: "Copied!",
      },
      KR: {
          saveToNotebook: "노트북에 저장",
          copied: "복사됨!",
      }
  };
  const c = content[language];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/muse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          lang: language === 'KR' ? 'ko' : 'en',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.message || `Server error: ${res.status}`);
      }
      setData(json);
    } catch (err: any) {
      setError(err?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  }
  
  function copyAll() {
    if (!data) return;
    const text = `Title: ${data.title}

Mood:
${data.mood}

Instrumentation:
${data.instrumentation}

Concept:
${data.concept}

Musical Elements:
- Motif: ${data.musicalElements.motif}
- Harmony: ${data.musicalElements.harmony}
- Tempo: ${data.musicalElements.tempo}
- Dynamics: ${data.musicalElements.dynamics}`;
    navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy text: ', err));
  }
  
  const handleSendToNotebook = () => {
    if (!data) return;

    const notes = [
      `Motif: ${data.musicalElements.motif}`,
      `Dynamics: ${data.musicalElements.dynamics}`,
      `\nConcept:\n${data.concept}`,
    ].join('\n');

    const newNote: Note = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      title: data.title,
      seed: input,
      chords: data.musicalElements.harmony,
      tempo: data.musicalElements.tempo,
      notes: notes,
    };

    try {
      const raw = localStorage.getItem(NOTEBOOK_KEY);
      const existingNotes: Note[] = raw ? JSON.parse(raw) : [];
      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(updatedNotes));
      navigate('/studio/notebook');
    } catch (e) {
      console.error("Failed to save to Notebook:", e);
      alert("Failed to save the note.");
    }
  };


  return (
    <section className="max-w-4xl mx-auto px-6 my-12" aria-labelledby="muse-widget-title">
      <h2 id="muse-widget-title" className="font-serif text-3xl text-zinc-900 dark:text-zinc-100 text-center">
        {language === 'KR' ? "AI 작곡가의 뮤즈" : "AI Composer’s Muse"}
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 text-center">
        {language === "KR"
          ? "감정, 풍경, 색감을 묘사하면 AI가 음악적 콘셉트로 번역해줍니다."
          : "Describe a feeling, a scene, or a color. Let the AI translate it into a musical concept."}
      </p>

      {albumTitle && (
        <div className="mt-2 text-center text-xs text-zinc-500 italic">
          {language === "KR" ? `현재 앨범: ${albumTitle}` : `Album: ${albumTitle}`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === "KR"
              ? "예: ‘잔잔한 비가 내리는 오후의 회상, 빛이 퍼지는 느낌’"
              : "Example: A pale dawn light breaking through still mist..."
          }
          className="min-h-[120px] w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(ex)}
                className="text-xs px-3 py-1 rounded-md border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-600 dark:text-zinc-300"
              >
                {language === "KR" ? `예시 ${i + 1}` : `Example ${i + 1}`}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium ${
              loading || !input.trim()
                ? "bg-zinc-300 text-white dark:bg-zinc-700 cursor-not-allowed"
                : "bg-[#CBAE7A] text-white hover:opacity-90 transition"
            }`}
          >
            {loading
              ? language === "KR"
                ? "생성 중..."
                : "Generating..."
              : language === "KR"
              ? "콘셉트 생성"
              : "Generate Concept"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {data && (
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 bg-white/70 dark:bg-zinc-900/60 backdrop-blur"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif text-gradient-auralis">{data.title}</h3>
            <div className="flex items-center gap-2">
                 <button
                    onClick={handleSendToNotebook}
                    className="text-xs rounded-md px-3 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
                    aria-label={c.saveToNotebook}
                 >
                    {c.saveToNotebook}
                </button>
                <button
                  onClick={copyAll}
                  className="text-xs rounded-md px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Copy generated concept"
                >
                  Copy
                </button>
            </div>
          </div>
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Mood</dt>
              <dd className="mt-1 text-sm leading-relaxed">{data.mood}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Instrumentation</dt>
              <dd className="mt-1 text-sm leading-relaxed">{data.instrumentation}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[12px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Concept</dt>
              <dd className="mt-1 text-sm leading-relaxed">{data.concept}</dd>
            </div>
          </dl>
          <div className="mt-5 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
            <h4 className="text-[12px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Musical Elements
            </h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li><strong className="font-medium">Motif:</strong> {data.musicalElements.motif}</li>
              <li><strong className="font-medium">Harmony:</strong> {data.musicalElements.harmony}</li>
              <li><strong className="font-medium">Tempo:</strong> {data.musicalElements.tempo}</li>
              <li><strong className="font-medium">Dynamics:</strong> {data.musicalElements.dynamics}</li>
            </ul>
          </div>
        </MotionSection>
      )}

      {albumSlug && (
        <div className="mt-10 text-center">
          <ReactRouterDOM.Link
            to={`/albums/${albumSlug}`}
            className="text-xs underline text-zinc-500 hover:text-[#CBAE7A] transition"
          >
            {language === "KR" ? "← 앨범 페이지로 돌아가기" : "← Back to Album Page"}
          </ReactRouterDOM.Link>
        </div>
      )}
    </section>
  );
}