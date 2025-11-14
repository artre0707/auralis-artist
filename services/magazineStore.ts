// services/magazineStore.ts

// ---- Types ----
export type NoteID = string;

export interface ElysiaNote {
  id: NoteID;
  title: string;
  body?: string;
  cover?: string;
  albumSlug?: string;
  catalogue?: string;
  createdAt: string;          // ISO string
  likes: number;
  featured: boolean;
  author?: string;

  // KR 번역 필드(선택)
  titleKR?: string;
  bodyKR?: string;

  // 섹션형 본문(선택)
  sections?: { label: string; text: string }[];
  sectionsKR?: { label: string; text: string }[];

  // 메타데이터(선택)
  meta?: {
    albumKey?: string;
    sourceTitle?: string;
    youtube?: string;
    slug?: string;
    catalogNo?: string;
  };

  // 구버전 호환
  musicTitle?: string;
  musicUrl?: string;
}

const STORAGE_KEY = "elysia:notes";

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

function generateNoteId(): NoteID {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36);
}

// ---- Public APIs ----
export function getAllNotes(): ElysiaNote[] {
  return readAll();
}

export function getNote(id: NoteID): ElysiaNote | null {
  return readAll().find((n) => n.id === id) ?? null;
}

/**
 * 새 노트를 저장하고 ID(string)를 반환
 */
export function saveNote(
  note: Omit<ElysiaNote, "id" | "createdAt" | "likes" | "featured">
): NoteID {
  const id = generateNoteId();

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
    musicTitle: note.musicTitle,
    musicUrl: note.musicUrl,
  };

  const all = readAll();
  writeAll([newNote, ...all]);
  return id;
}

export function likeNote(id: NoteID): number {
  const all = readAll();
  const idx = all.findIndex((n) => n.id === id);
  if (idx === -1) return 0;
  const likes = (all[idx].likes ?? 0) + 1;
  all[idx] = { ...all[idx], likes };
  writeAll(all);
  return likes;
}

export function updateNote(
  id: NoteID,
  patch: Partial<Omit<ElysiaNote, "id" | "createdAt">>
): ElysiaNote | null {
  const all = readAll();
  const idx = all.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch };
  all[idx] = updated;
  writeAll(all);
  return updated;
}
