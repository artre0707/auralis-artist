
import type { Language } from '@/App';

export type NewsItem = {
  slug: string;
  date: string;
  cover?: string;
  tags?: string[];
  title: { [key in Language]: string };
  dek?: { [key in Language]?: string };
  body?: { [key in Language]?: string };
};

export const news: NewsItem[] = [
  {
    slug: 'resonance-after-the-first-suite-out-now',
    date: '2025-10-01',
    cover: 'https://picsum.photos/seed/auralis-release/1200/675',
    tags: ['Release'],
    title: {
      EN: 'Resonance: After the First Suite — Out now',
      KR: '레조넌스: 첫 모음곡 이후 — 지금 감상하기',
    },
    dek: {
      EN: 'New movements unfolding in quiet harmony — listen and read the liner notes',
      KR: '고요함 속에서 펼쳐지는 새로운 악장, 그 여운과 이야기를 만나보세요',
    },
    body: {
      EN: 'Where words fail, music speaks.\nWith Johann Sebastian Bach’s timeless inspiration,\nAuralis begins her first full series — Resonance: After the First Suite (Echoes of Classics).\n\nNow available worldwide, this album reimagines the voice of the classics\n\nthrough a new lens of quiet resonance and emotional depth.\nFrom the lingering warmth of each piano tone\nto the silence that breathes between notes,\nit carries forward the essence of classical sensitivity in a modern voice.\n\n🎧 Discover the global release now on Spotify, Apple Music, and YouTube Music.\n\nThis marks the very first step of the Resonance journey —\na world where stillness becomes music.',
      KR: '말로 다할 수 없는 순간, 음악이 대신 이야기합니다.\n요한 세바스티안 바흐의 영원한 울림에서 영감을 받아,\n오랄리스의 첫 번째 정규 시리즈 Resonance: After the First Suite(Echoes of Classics)가 \n전 세계에 발매되었습니다.\n\n조용한 공명 속에서 클래식의 깊은 감정을 새롭게 담아낸 이번 작품은,\n\n피아노가 남긴 여운과 그 사이의 고요함을 통해\n‘클래식의 본질’을 현대적 감성으로 이어갑니다.\n\n🎧 지금 Spotify, Apple Music YouTube Music 에서 만나보세요.\n\n이것은 레조넌스 여정의 첫걸음이며,\n고요가 음악이 되는 세계의 시작입니다.',
    },
  },
  {
    slug: 'auralis-live-seoul-2025',
    date: '2025-10-01',
    cover: 'https://picsum.photos/seed/auralis-live/1200/675',
    tags: ['Performance'],
    title: {
      EN: 'Auralis: Where Silence Becomes Music — Now Open',
      KR: '오랄리스: 소리와 빛의 집 — 지금 오픈',
    },
    dek: {
      EN: 'The journey of light shaped by sound and silence begins',
      KR: '소리와 고요가 빚어내는 빛의 여정이 시작됩니다',
    },
    body: {
        EN: '**Where silence becomes music — Auralis opens her official home of sound and light.**\n\nHere, listeners can explore Auralis’s world through albums, essays, and the interactive studio.\nNew releases and composer’s notes will be unveiled over time,\nexpanding the ever-growing Auralis archive.\n\nThank you for being part of this beginning.\n\nDiscover the world of Auralis at **auralis-music.com**.',
        KR: '고요가 음악이 되는 곳, 오랄리스의 공식 홈페이지가 새롭게 문을 열었습니다.\n앨범, 저널, 그리고 엘리시아 스튜디오를 통해 오랄리스의 소리와 빛의 세계를 만나보세요.\n\n앞으로 새로운 앨범과 작곡가의 노트가 순차적으로 공개되며,\n오랄리스의 아카이브는 더욱 깊고 넓게 확장될 예정입니다.\n\n함께 이 여정을 시작해주셔서 감사합니다.\n\n지금 **auralis-music.com** 에서\n오랄리스의 세계를 탐험해보세요.',
    }
  },
];

export function sortNewsDesc(items: NewsItem[]) {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
}