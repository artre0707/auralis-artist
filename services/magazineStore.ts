// services/magazineStore.ts

// ---- Types ----
export interface ElysiaNote {
  id: string;                 // 항상 string
  title: string;
  body?: string;
  cover?: string;
  albumSlug?: string;
  catalogue?: string;
  createdAt: string;          // ISO string
  likes: number;
  featured: boolean;
  author?: string;
  titleKR?: string;
  bodyKR?: string;
  sections?: { label: string; text: string }[];
  sectionsKR?: { label: string; text: string }[];
  meta?: {
    albumKey?: string;
    sourceTitle?: string;
    youtube?: string;
    slug?: string;
    catalogNo?: string;
  };
  // Legacy fields for migration
  musicTitle?: string;
  musicUrl?: string;
}

const STORAGE_KEY = 'elysia:notes';

// ---- Helpers ----
function readAll(): ElysiaNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ElysiaNote[]) : [];
  } catch {
    return [];
  }
}

function writeAll(notes: ElysiaNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ---- API ----
export function getAllNotes(): ElysiaNote[] {
  return readAll();
}

export function getNote(id: string): ElysiaNote | null {
  return readAll().find(n => n.id === id) ?? null;
}

// FIX: `saveNote` must always return a string. The `Date.now()` fallback returned a number, causing a type error. It is now converted to a string, and the function's return type is explicitly set to `string`.
export function saveNote(
  note: Omit<ElysiaNote, 'id' | 'createdAt' | 'likes' | 'featured'>
): string {
  let id: string;
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    id = crypto.randomUUID();
  } else {
    id = Date.now().toString(36);
  }

  const newNote: ElysiaNote = {
    id,
    title: note.title,
    body: note.body,
    cover: note.cover,
    albumSlug: note.albumSlug,
    catalogue: note.catalogue,
    createdAt: new Date().toISOString(),
    likes: 0,
    featured: false,
    author: note.author,
    titleKR: note.titleKR,
    bodyKR: note.bodyKR,
    sections: note.sections,
    sectionsKR: note.sectionsKR,
    meta: note.meta,
  };

  const all = readAll();
  writeAll([newNote, ...all]);
  return id;
}

export function likeNote(id: string): number {
  const all = readAll();
  const idx = all.findIndex(n => n.id === id);
  if (idx === -1) return 0;
  all[idx] = { ...all[idx], likes: (all[idx].likes ?? 0) + 1 };
  writeAll(all);
  return all[idx].likes;
}

export function updateNote(
  id: string,
  patch: Partial<Omit<ElysiaNote, 'id' | 'createdAt'>>
): ElysiaNote | null {
  const all = readAll();
  const idx = all.findIndex(n => n.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch };
  all[idx] = updated;
  writeAll(all);
  return updated;
}

export function deleteNote(id: string): boolean {
  const all = readAll();
  const next = all.filter(n => n.id !== id);
  writeAll(next);
  return next.length !== all.length;
}
