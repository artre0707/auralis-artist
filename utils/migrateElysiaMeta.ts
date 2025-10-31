import { albumsData } from "../data/albums";
import { ElysiaNote } from "../services/magazineStore";

const KEY = "auralis_readers_notes_v1";

export function migrateElysiaMeta() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { updated: 0, total: 0, error: null };

    const posts: ElysiaNote[] = JSON.parse(raw);
    let updated = 0;

    const fixed = posts.map((p) => {
      // If meta is already good, skip.
      if (p.meta?.albumKey && p.meta?.sourceTitle) return p;

      let guess = null;

      // 1. Guess from old `musicUrl` (which contained slug)
      if (p.musicUrl) {
        const slug = p.musicUrl.split('/').pop();
        if (slug && slug in albumsData) {
          guess = albumsData[slug as keyof typeof albumsData];
        }
      }

      // 2. Guess from old `musicTitle`
      if (!guess && p.musicTitle) {
        const matchedAlbum = Object.values(albumsData).find(a => 
          a.title.toLowerCase() === p.musicTitle!.toLowerCase()
        );
        if (matchedAlbum) guess = matchedAlbum;
      }

      // 3. Fallback: search for album titles in post body or title (less reliable)
      if (!guess) {
        guess = Object.values(albumsData).find(a =>
          p.body?.toLowerCase().includes(a.title.toLowerCase()) ||
          p.title?.toLowerCase().includes(a.title.toLowerCase())
        );
      }

      if (!guess) return p;

      updated++;
      const { musicTitle, musicUrl, ...restOfPost } = p;
      return {
        ...restOfPost,
        meta: {
          ...p.meta,
          albumKey: guess.slug,
          sourceTitle: guess.title,
          youtube: guess.links?.youtube || undefined,
          slug: guess.slug,
          catalogNo: guess.catalogueNo,
        },
      };
    });

    localStorage.setItem(KEY, JSON.stringify(fixed));
    return { updated, total: posts.length, error: null };
  } catch (e: any) {
    console.error("Elysia migration failed:", e);
    return { error: e.message, updated: 0, total: 0 };
  }
}