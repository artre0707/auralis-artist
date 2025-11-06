

import React, { useEffect, useState } from "react";
import { useSiteContext } from '../../contexts/SiteContext';
// FIX: Changed react-router-dom import to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from "react-router-dom";
import { NoteID } from "../../services/magazineStore";

export type Note = {
  id: NoteID;
  title: string;
  seed: string;
  chords?: string;
  tempo?: string;
  notes?: string;
  createdAt: number;
  titleKR?: string;
  seedKR?: string;
  notesKR?: string;
};

const NOTEBOOK_KEY = "auralis-notebook";

export default function NotebookSection() {
  const { language } = useSiteContext();
  const [items, setItems] = useState<Note[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = ReactRouterDOM.useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTEBOOK_KEY);
      if (raw) {
        const notes = JSON.parse(raw);
        setItems(notes.sort((a: Note, b: Note) => b.createdAt - a.createdAt));
      }
    } catch {}
  }, []);

  const persist = (next: Note[]) => {
    setItems(next.sort((a,b) => b.createdAt - a.createdAt));
    try { localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(next)); } catch {}
  };

  const remove = (id: string) => persist(items.filter(n => n.id !== id));

  const handleCopy = (note: Note) => {
    const textToCopy = `${note.title}\n\nSeed:\n${note.seed}\n\nChords:\n${note.chords}\n\nTempo:\n${note.tempo}\n\nNotes:\n${note.notes}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const content = {
      EN: {
          empty: "No notes yet — add your first idea in Muse.",
          delete: "Delete",
          startCollab: "Start Collab",
          copy: "Copy",
          copied: "Copied!",
          seed: "Seed",
          chords: "Chords",
          tempo: "Tempo",
          notes: "Notes",
      },
      KR: {
          empty: "아직 노트가 없습니다. Muse에서 첫 아이디어를 추가하세요.",
          delete: "삭제",
          startCollab: "콜라보 시작",
          copy: "복사",
          copied: "복사됨!",
          seed: "시드",
          chords: "코드",
          tempo: "템포",
          notes: "노트",
      }
  }
  const c = content[language];

  return (
    <section>
      <h2 className="sr-only">Studio Notebook</h2>

      {items.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500">{c.empty}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((n) => (
            <li key={n.id} className="rounded-2xl border p-5 bg-[var(--card)] border-[var(--border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold post-title">{n.title}</h3>
                  <span className="text-xs text-neutral-400 post-meta">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center flex-shrink-0 gap-2">
                    <button
                      onClick={() => {
                        const q = new URLSearchParams({
                          title: n.title,
                          topic: n.chords || n.tempo || "idea",
                          body: `${c.seed}:\n${n.seed}\n\n${c.chords}:\n${n.chords}\n\n${c.tempo}:\n${n.tempo}\n\n${c.notes}:\n${n.notes}`
                        });
                        navigate(`/studio/collab?${q.toString()}`);
                      }}
                      className="text-xs rounded-md px-3 py-1.5 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
                    >
                      {c.startCollab}
                    </button>
                    <button onClick={() => handleCopy(n)} className="text-xs rounded-md px-3 py-1.5 border border-zinc-300 dark:border-zinc-600 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors w-[60px] text-center">
                      {copiedId === n.id ? c.copied : c.copy}
                    </button>
                    <button onClick={() => remove(n.id)} className="text-xs rounded-md px-3 py-1.5 border border-zinc-300 dark:border-zinc-600 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">{c.delete}</button>
                </div>
              </div>
              <div className="mt-3 text-sm post-body">
                <div className="text-neutral-500 post-label">{c.seed}</div>
                <div>{n.seed}</div>
                <div className="mt-2 grid md:grid-cols-2 gap-4">
                  <div><span className="text-neutral-500 post-label">{c.chords}</span><div>{n.chords}</div></div>
                  <div><span className="text-neutral-500 post-label">{c.tempo}</span><div>{n.tempo}</div></div>
                </div>
                <div className="mt-2 whitespace-pre-wrap"><span className="text-neutral-500 post-label">{c.notes}</span><br/>{n.notes}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}