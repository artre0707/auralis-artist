// utils/date.ts
export function parseReleaseDate(s?: string): Date | null {
  if (!s) return null;
  // Try standard parsing first (handles "October 1, 2025")
  const t = Date.parse(s);
  if (!Number.isNaN(t)) return new Date(t);

  // Fallback for "YYYY-MM-DD"
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (m) {
    const [_, y, mo, d] = m;
    // Note: Month is 0-indexed in JS Date constructor
    return new Date(Number(y), Number(mo) - 1, Number(d));
  }
  return null;
}

export function formatReleaseDate(lang: 'EN' | 'KR', s?: string): string {
  const d = parseReleaseDate(s);
  if (!d) return lang === 'KR' ? '발매일 미정' : 'TBA';

  if (lang === 'EN') {
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
  }

  // KR
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}년 ${m}월 ${day}일`;
}
