import type { Language } from '@/App';

export type NewsItem = {
  slug: string;
  date: string;
  cover?: string;
  tags?: string[];
  title: { [key in Language]: string };
  dek?: { [key in Language]?: string };
  body?: { [key in Language]?: string };
  cta?: {
    link: string;
    EN: {
      sectionTitle: string;
      buttonLabel: string;
    };
    KR: {
      sectionTitle: string;
      buttonLabel: string;
    };
  };
};

export const news: NewsItem[] = [
  {
    slug: 'auralis-youtube-music-channel-available',
    date: '2025-11-14',
    cover: 'https://picsum.photos/seed/auralis-yt-music/1200/675',
    tags: ['Channel'],
    title: {
      EN: 'Auralis YouTube Music Channel — Now Available',
      KR: 'Auralis YouTube Music 채널 오픈',
    },
    dek: {
      EN: 'Auralis now has a dedicated YouTube Music Channel for effortless listening.',
      KR: '오랄리스의 음악을 YouTube Music에서 편안하게 만나보세요.',
    },
    body: {
      EN: 'Where music travels further, a new pathway opens.\n\nAlongside the launch of the Auralis YouTube Topic Channel,\na dedicated Auralis YouTube Music Channel has now been created.\nThis space brings together all officially released tracks,\noffering a seamless listening experience within the YouTube Music ecosystem.\n\nHere, piano lines rest gently,\nmodern classical colors unfold quietly,\nand each piece continues its journey through a space shaped purely for listening.\n\n\n🎧 Auralis — YouTube Music Channel\nhttps://music.youtube.com/channel/UC2kTnyIYd4YiYnd7yen8Sjg?si=ikYuCEe2UuPdrNJO\n\nThis channel will naturally expand as future releases join the catalog,\nforming a growing library of Auralis’s musical world.',
      KR: '음악이 더 멀리 흐르는 자리에서, 새로운 길이 열립니다.\n\nAuralis YouTube Topic 채널과 더불어\n오랄리스의 전용 YouTube Music 채널도 새롭게 생성되었습니다.\n이 공간에서는 공식 발매된 모든 음원을\nYouTube Music 환경에서 편안하게 감상하실 수 있습니다.\n\n잔잔하게 흐르는 피아노의 결,\n고요히 펼쳐지는 현대 클래식의 색채가\n보다 풍부하고 자연스러운 청취 경험으로 이어집니다.\n\n\n🎧 오랄리스 — YouTube Music 채널\nhttps://music.youtube.com/channel/UC2kTnyIYd4YiYnd7yen8Sjg?si=ikYuCEe2UuPdrNJO\n\n앞으로 발매될 신작들도 이곳에 차분히 더해지며,\n오랄리스의 음악 세계는 더욱 넓어질 것입니다.',
    },
    cta: {
      link: 'https://music.youtube.com/channel/UC2kTnyIYd4YiYnd7yen8Sjg?si=ikYuCEe2UuPdrNJO',
      EN: {
        sectionTitle: 'Explore the channel connected to this story.',
        buttonLabel: 'Visit YouTube Music Channel',
      },
      KR: {
        sectionTitle: '이 소식과 연결된 채널을 살펴보세요.',
        buttonLabel: 'YouTube Music 채널로 이동',
      },
    },
  },
  {
    slug: 'auralis-youtube-topic-channel-live',
    date: '2025-11-14',
    cover: 'https://picsum.photos/seed/auralis-yt-topic/1200/675',
    tags: ['Channel'],
    title: {
      EN: 'Auralis YouTube Topic Channel — Now Live',
      KR: 'Auralis YouTube Topic 채널 — 지금 만나보세요',
    },
    dek: {
      EN: 'Auralis’s music now flows in one place on YouTube Music.',
      KR: '오랄리스의 음악이 YouTube Music에서 한 흐름이 되었습니다.',
    },
    body: {
      EN: 'Where light and sound meet, a new window opens.\nAll of Auralis’s officially released music now flows into a single stream,\nconnecting with YouTube Music to create the new Auralis Topic Channel.\n\nThis space gathers every note of the journey—from series albums and single pieces\nto library music—into a continuous current of sound.\nIt is a place where you can listen anytime,\nletting the music breathe with the quiet moments of your day.\n\nFuture series and releases will continue to be added,\nexpanding this ever-growing river of sound.\nWhere music resides, the journey continues.\n\n\n🎧 Listen now\nhttps://www.youtube.com/channel/UC2kTnyIYd4YiYnd7yen8Sjg',
      KR: '빛과 소리가 만나는 곳에, 새로운 창이 열립니다.\n오랄리스의 모든 공식 발매 음원이 YouTube Music과 연결되며\n새로운 Auralis Topic 채널이 문을 열었습니다.\n\n이곳은 시리즈 앨범과 단편곡, 라이브러리 음악까지\n여정의 모든 음을 하나의 흐름으로 잇는 공간입니다.\n언제든 찾아와 고요한 순간 속에서 음악이 숨 쉴 수 있도록,\n그렇게 머무는 자리입니다.\n\n앞으로 발매될 시리즈들 또한 이곳에 차분히 더해지며\n소리의 강은 계속해서 넓어질 것입니다.\n음악이 머무는 자리에서, 오랄리스의 여정은 이어집니다.\n\n\n🎧 지금 감상하기\nhttps://www.youtube.com/channel/UC2kTnyIYd4YiYnd7yen8Sjg',
    },
    cta: {
      link: 'https://www.youtube.com/channel/UC2kTnyIYd4YiYnd7yen8Sjg',
      EN: {
        sectionTitle: 'Explore the space that meets this story.',
        buttonLabel: 'Visit the Topic Channel',
      },
      KR: {
        sectionTitle: '이 소식과 맞닿아 있는 공간을 살펴보세요.',
        buttonLabel: '오랄리스 Topic 채널 이동',
      },
    },
  },
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
      EN: 'Where words fail, music speaks.\nWith Johann Sebastian Bach’s timeless inspiration,\nAuralis begins her first full series — Resonance: After the First Suite (Echoes of Classics).\n\nNow available worldwide, this album reimagines the voice of the classics\n\nthrough a new lens of quiet resonance and emotional depth.\nFrom the lingering warmth of each piano tone\nto the silence that breathes between notes,\nit carries forward the essence of classical sensitivity in a modern voice.\n\n\n🎧 Discover the global release now on Spotify, Apple Music, and YouTube Music.\n\nThis marks the very first step of the Resonance journey —\na world where stillness becomes music.',
      KR: '말로 다할 수 없는 순간, 음악이 대신 이야기합니다.\n요한 세바스티안 바흐의 영원한 울림에서 영감을 받아,\n오랄리스의 첫 번째 정규 시리즈 Resonance: After the First Suite(Echoes of Classics)가 \n전 세계에 발매되었습니다.\n\n조용한 공명 속에서 클래식의 깊은 감정을 새롭게 담아낸 이번 작품은,\n\n피아노가 남긴 여운과 그 사이의 고요함을 통해\n‘클래식의 본질’을 현대적 감성으로 이어갑니다.\n\n\n🎧 지금 Spotify, Apple Music YouTube Music 에서 만나보세요.\n\n이것은 레조넌스 여정의 첫걸음이며,\n고요가 음악이 되는 세계의 시작입니다.',
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