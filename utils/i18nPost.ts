export type ElysiaPost = {
  title: string;               // EN
  body: string;                // EN (HTML or MD 렌더 결과 문자열)
  sections?: { label: string; text: string }[]; // EN
  // ⬇︎ 선택: KR 버전
  titleKR?: string;
  bodyKR?: string;
  sectionsKR?: { label: string; text: string }[];
  meta?: { albumKey?: string; sourceTitle?: string; date?: string; };
};

// FIX: Reordered parameters to place the required `lang` parameter before the optional ones.
export function getLocalized<T>(lang: 'EN' | 'KR', en?: T, kr?: T): T | undefined {
  return lang === 'KR' ? (kr ?? en) : en;
}