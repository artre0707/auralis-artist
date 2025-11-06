import type { Language } from '@/App';

// FIX: Defined ReleaseStatus locally as it was not exported from magazineStore.
export type ReleaseStatus = 'released' | 'upcoming';

export type Track = {
  no: number;
  title: string;
  duration: string;
  isTitle?: boolean;
};

export type Album = {
  status: ReleaseStatus;
  title: string;
  slug: string;
  coverUrl: string;
  catalogueNo?: string;
  magazineSlug?: string;
  featuredVideoUrl?: string; // Fallback for older data structure
  videos?: {
    titleTrack?: string;
    track1?: string;
    track2?: string;
    fullAlbum?: string;
  };
  seriesInfo: {
    name: { [key in Language]: string };
    subtitle: { [key in Language]: string };
  } | null;
  links: {
    // FIX: Added optional `listenNow` property to the links object to be used for the main "Listen Now" button.
    listenNow?: string | null;
    spotify: string | null;
    appleMusic: string | null;
    youtube: string | null;
    bandcamp: string | null;
    believe: string | null;
    amazonMusic: string | null;
    flo: string | null;
    vibe: string | null;
    presave?: string | null;
  };
  details: {
    formatGenre: string[] | null;
    displayGenre: { [key in Language]: string };
    releaseDate: string;
    duration: string;
    publisher: string;
    label: string;
    management: string;
    distributor: string;
    upc: string | null;
  };
  credits: {
    role: { [key in Language]: string };
    name: string | { [key in Language]: string };
    link?: string;
  }[];
  content: {
    [key in Language]: {
      subtitle: string;
      description: string[];
      feelingInspiredText: string;
      tracklist: Track[];
      linerNotes: {
        p1: string;
        quote: string;
      };
    };
  };
};

export const albumsData: { [key: string]: Album } = {
  'resonance-after-the-first-suite': {
    status: 'released',
    title: 'Resonance: After the First Suite',
    slug: 'resonance-after-the-first-suite',
    magazineSlug: 'liner-notes-resonance',
    coverUrl: 'https://www.auralis-music.com/images/albums/resonance-after-the-first-suite.jpg',
    catalogueNo: "ARTRE2025-009",
    videos: {
      titleTrack: 'https://www.youtube.com/watch?v=f9Du-utVUxE&list=PLDNrR1uLGhzIcAkk2elW1gDPxjaEcpne5&index=2',
      track1: 'https://www.youtube.com/watch?v=xk0JSviIitA&list=PLDNrR1uLGhzIcAkk2elW1gDPxjaEcpne5',
      fullAlbum: 'https://www.youtube.com/watch?v=H7GURKtbU00&t=283s'
    },
    seriesInfo: {
      name: { EN: "Resonance Series", KR: "레조넌스 시리즈" },
      subtitle: { EN: "Echoes of Classics", KR: "클래식의 메아리" },
    },
    links: {
      // FIX: Added the specific smart link for this album to match the `listenNow` property.
      listenNow: 'https://auralis.bfan.link/resonance-after-the-first-suite-2',
      spotify: 'https://open.spotify.com/album/5zGA1aoBj5QBahmV5Yir5y',
      appleMusic: 'https://music.apple.com/kr/album/echoes-of-bach-i-first-light-inspired-by-j-s-bach/1841847315?i=1841847426',
      youtube: 'https://www.youtube.com/watch?v=b6ApKZhqeGs&list=PLDNrR1uLGhzLYbFroTDlebSQmHtuJYtwC',
      bandcamp: 'https://auralis-official.bandcamp.com/album/resonance-after-the-first-suite',
      believe: 'https://believemusic.link/resonance-after-the-first-suite',
      amazonMusic: 'https://www.amazon.de/music/player/albums/B0FS93MNZ9',
      flo: "https://www.music-flo.com/detail/album/444504241/albumtrack",
      vibe: null,
    },
    details: {
      formatGenre: ["DIGITAL", "SINGLE", "PIANO", "CROSSOVER"],
      displayGenre: { EN: "Classical, Crossover", KR: "클래식, 크로스오버" },
      releaseDate: 'October 1, 2025',
      duration: '5 min 8 sec',
      publisher: 'Auralis Music',
      label: 'Auralis Music',
      management: 'ARTRE',
      distributor: 'ARTRE',
      upc: null,
    },
    credits: [
        { role: { KR: '프로듀서 & 피아니스트', EN: 'Producer & Pianist' }, name: { EN: 'Auralis', KR: '오랄리스' } },
        { role: { KR: '작곡가', EN: 'Composer' }, name: { EN: 'Soyoung Joung', KR: '정소영' } },
        { role: { KR: '뮤직 테크니션', EN: 'Music Technician' }, name: { EN: 'Auralis', KR: '오랄리스' } },
        { role: { KR: '아트웍 & 디자인', EN: 'Artwork & Design' }, name: { EN: 'Auralis', KR: '오랄리스' } },
        { role: { KR: '레이블 & 퍼블리셔', EN: 'Label & Publisher' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
        { role: { KR: '매니지먼트 & 유통', EN: 'Management & Distributor' }, name: { EN: 'ARTRE', KR: '아르트레' } },
        { role: { KR: '제작', EN: 'Created by' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
    ],
    content: {
      EN: {
        subtitle: 'Echoes of timeless emotions, gently voiced through piano',
        description: [
          "A quiet exploration of the space between notes, where memory and emotion converge.",
          "Inspired by the stillness of light and the fluid grace of movements,",
          "each piece serves as a meditation on reflection and renewal.",
        ],
        feelingInspiredText: "Echoes of Bach, long shadows and first light, a quiet dialogue between classical structure and modern emotion.",
        tracklist: [
          { no: 1, title: 'Echoes of Bach I — First Light', duration: '2:52' },
          { no: 2, title: 'Echoes of Bach II — Long Shadow', duration: '2:16', isTitle: true },
        ],
        linerNotes: {
            p1: "This collection was born from early morning improvisations, finding melodies in the quiet moments just before sunrise. Each track is a dialogue between the structured logic of Bach and the free-form emotionality of modern cinematic music.",
            quote: "\"I wanted to create a sound that felt both timeless and immediate, like discovering an old letter that speaks directly to your present heart.\"",
        },
      },
      KR: {
        subtitle: '시간을 초월한 감정의 메아리, 피아노의 언어로 담아내다',
        description: [
          '음표 사이의 공간, 기억과 감정이 만나는 곳을 조용히 탐험합니다.',
          '빛의 정적과 움직임의 유려한 우아함에서 영감을 받은 각 곡은 성찰과 재탄생에 대한 명상으로 기능합니다.',
        ],
        feelingInspiredText: "바흐의 메아리, 긴 그림자와 첫 빛, 고전적 구조와 현대적 감성 사이의 조용한 대화.",
        tracklist: [
          { no: 1, title: '바흐의 메아리 I — 첫 빛', duration: '2:52' },
          { no: 2, title: '바흐의 메아리 II — 긴 그림자', duration: '2:16', isTitle: true },
        ],
        linerNotes: {
            p1: "이 컬렉션은 이른 아침의 즉흥 연주에서 태어났으며, 해가 뜨기 직전의 고요한 순간에 멜로디를 찾았습니다. 각 트랙은 바흐의 구조화된 논리와 현대 영화 음악의 자유로운 감성 사이의 대화입니다.",
            quote: "\"오래된 편지가 현재의 마음에 직접 말을 거는 것을 발견하는 것처럼, 시대를 초월하면서도 즉각적인 사운드를 만들고 싶었습니다.\"",
        },
      },
    },
  },
  'Chorégraphie-Series': {
    status: 'upcoming',
    title: 'Chorégraphie: A Dancer’s Diary',
    slug: 'Chorégraphie-Series',
    coverUrl: 'https://www.auralis-music.com/images/albums/choregraphie-series.jpg',
    catalogueNo: "ARTRE2025-033",
    seriesInfo: {
       name: { EN: 'Chorégraphie Series', KR: '코레그라피 시리즈' },
       subtitle: {
         EN: 'Diary',
         KR: '일기'
       },
    },
    links: {
      spotify: null,
      appleMusic: null,
      youtube: null,
      bandcamp: null,
      believe: null,
      amazonMusic: null,
      flo: null,
      vibe: null,
      presave: 'https://example.com/presave-ballet',
    },
    details: {
      formatGenre: null,
      displayGenre: { EN: "Ballet, Classical", KR: "발레, 클래식" },
      releaseDate: '2025-11-24',
      duration: '6 min 11 sec',
      publisher: 'Auralis Music',
      label: 'Auralis Music',
      management: 'ARTRE',
      distributor: 'ARTRE',
      upc: '123456789013',
    },
    credits: [
        { role: { KR: '프로듀서 & 피아니스트', EN: 'Producer & Pianist' }, name: { EN: 'Auralis', KR: '오랄리스' } },
        { role: { KR: '작곡가', EN: 'Composer' }, name: { EN: 'Soyoung Joung', KR: '정소영' } },
        { role: { KR: '뮤직 테크니션', EN: 'Music Technician' }, name: { EN: 'Auralis', KR: '오랄리스' } },
        { role: { KR: '아트웍 & 디자인', EN: 'Artwork & Design' }, name: { EN: 'Auralis', KR: '오랄리스' } },
        { role: { KR: '레이블 & 퍼블리셔', EN: 'Label & Publisher' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
        { role: { KR: '매니지먼트 & 유통', EN: 'Management & Distributor' }, name: { EN: 'ARTRE', KR: '아르트레' } },
        { role: { KR: '제작', EN: 'Created by' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
    ],
    content: {
      EN: {
        subtitle: 'Melodies the body remembers',
        description: ["Chorégraphie: A Dancer’s Diary unfolds where music meets movement. Each piano piece traces the subtle choreography of emotion — the way a dancer’s body remembers what words cannot. Through gentle resonance and shifting light,Auralis captures the quiet pulse of motion that lingers long after the stage fades.",
        ],
        feelingInspiredText: "The graceful arc of a dancer's movement, translating joy and introspection into sound, satin ribbons and soliloquies.",
        tracklist: [
          { no: 1, title: 'Morning Stretch', duration: '1:23', isTitle: false },
          { no: 2, title: "Journey of Practice", duration: '1:56', isTitle: true },
          { no: 3, title: 'Solitude in Motion', duration: '1:34', isTitle: false },
          { no: 4, title: "Curtain of Memories", duration: '1:17', isTitle: true },
        ],
        linerNotes: {
            p1: "The piano and the body both tell stories without words. This album is an attempt to find the harmony between them, where each note is a step, and every melody is a leap of faith.",
            quote: "\"I watched old ballet performances on silent, trying to hear the music the dancers' bodies were making. This album is what I heard.\"",
        },
      },
      KR: {
        subtitle: '몸이 기억하는 선율',
        description: ["「코레그라피: 춤으로 쓴 일기」는 음악과 움직임이 만나는 지점에서 시작됩니다. 피아노의 각 선율은 말로 남기지 못한 감정의 안무를 따라가며, 몸이 기억한 순간들을 고요하게 되살립니다. 오랄리스는 무대가 끝난 뒤에도 남아 있는 그 미세한 움직임의 숨결을 음악으로 기록했습니다.",
        ],
        feelingInspiredText: "무용수의 우아한 몸짓, 기쁨과 성찰을 소리로 번역한 새틴 리본과 독백.",
        tracklist: [
          { no: 1, title: '아침의 스트레칭', duration: '1:23', isTitle: false },
          { no: 2, title: '연습의 여정', duration: '1:56', isTitle: true },
          { no: 3, title: '움직임 속의 고독', duration: '1:34', isTitle: false },
          { no: 4, title: '막이 내린 뒤의 기억', duration: '1:17', isTitle: true },
        ],
        linerNotes: {
            p1: "피아노와 몸은 모두 말없이 이야기를 전합니다. 이 앨범은 그들 사이의 조화를 찾으려는 시도이며, 각 음표는 한 걸음이고 모든 멜로디는 믿음의 도약입니다.",
            quote: "\"무용수들의 몸이 만드는 음악을 듣기 위해 무음으로 오래된 발레 공연을 보았습니다. 이 앨범은 제가 들었던 것입니다.\"",
        },
      },
    },
  },
  'serene-horizons-morning-dew': {
    status: 'upcoming',
    title: 'Serene Horizons: Morning Dew',
    slug: 'serene-horizons-morning-dew',
    coverUrl: 'https://www.auralis-music.com/images/albums/serene-horizons-morning-dew.jpg',
    catalogueNo: "ARTRE2025-022",
    seriesInfo: {
      name: { EN: "Serene Horizons Series", KR: "세린 호라이즌스 시리즈" },
      subtitle: { EN: "Calm Waves", KR: "고요한 파도" },
    },
    links: {
      spotify: null,
      appleMusic: null,
      youtube: null,
      bandcamp: null,
      believe: null,
      amazonMusic: null,
      flo: null,
      vibe: null,
      presave: null,
    },
    details: {
      formatGenre: null,
      displayGenre: { EN: "Neo-Classical, Contemporary Piano", KR: "네오 클래식, 컨템퍼러리 피아노" },
      releaseDate: '2025-11-20',
      duration: '35 min 40 sec',
      publisher: 'Auralis Music',
      label: 'Auralis Music',
      management: 'ARTRE',
      distributor: 'ARTRE',
      upc: '123456789014',
    },
    credits: [
        { role: { KR: '프로듀서 & 피아니스트', EN: 'Producer & Pianist' }, name: { EN: 'Auralis', KR: '오랄리스' } },
        { role: { KR: '작곡가', EN: 'Composer' }, name: { EN: 'Soyoung Joung', KR: '정소영' } },
        { role: { KR: '뮤직 테크니션', EN: 'Music Technician' }, name: { EN: 'Auralis', KR: '오랄리스' } },
        { role: { KR: '아트웍 & 디자인', EN: 'Artwork & Design' }, name: { EN: 'Auralis', KR: '오랄리스' } },
        { role: { KR: '레이블 & 퍼블리셔', EN: 'Label & Publisher' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
        { role: { KR: '매니지먼트 & 유통', EN: 'Management & Distributor' }, name: { EN: 'ARTRE', KR: '아르트레' } },
        { role: { KR: '제작', EN: 'Created by' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
    ],
    content: {
      EN: {
        subtitle: 'Calm begins where the horizon meets the morning light',
        description: [
            "Serene Horizons: Morning Dew gathers gentle piano melodies for quiet moments — music that rests between dawn and silence. Each piece traces the soft awakening of light across a still horizon, offering calm reflection and inner clarity. Auralis invites you to begin the day where time slows, and every note feels like a breath of morning air.",
        ],
        feelingInspiredText: "A simple, heartfelt melody for a quiet moment, like a first star appearing in a velvet sky.",
        tracklist: [
          { no: 1, title: 'First Star', duration: '2:50', isTitle: false },
          { no: 2, title: 'The Velvet Hour', duration: '3:10', isTitle: true },
          { no: 3, title: 'Paper Moon', duration: '3:05', isTitle: false },
          { no: 4, title: 'The Velvet Hour', duration: '3:10', isTitle: true },
          { no: 5, title: 'Paper Moon', duration: '3:05', isTitle: false },
          { no: 6, title: 'The Velvet Hour', duration: '3:10', isTitle: true },
          { no: 7, title: 'Paper Moon', duration: '3:05', isTitle: false },
          { no: 8, title: 'The Velvet Hour', duration: '3:10', isTitle: true },
          { no: 9, title: 'Paper Moon', duration: '3:05', isTitle: false },
        ],
        linerNotes: {
            p1: "A return to simplicity. This music was created to be a companion for the quiet hours, a gentle hum in the background of life's most peaceful moments.",
            quote: "\"These aren't just for children; they're for the part of all of us that needs a little quiet, a little peace at the end of the day.\"",
        },
      },
      KR: {
        subtitle: '수평선 위로 빛이 깨어날 때, 고요는 시작된다',
        description: [
            "「세린 호라이즌스: 고요한 아침」은 새벽과 고요 사이, 마음을 쉬게 하는 피아노 선율들을 모았습니다. 각 곡은 빛이 천천히 수평선을 스치는 순간을 따라가며, 고요 속의 사색과 맑은 시작을 선사합니다. 오랄리스는 느리게 흘러가는 시간 속에서 아침의 숨결 같은 음악을 들려줍니다.",
        ],
        feelingInspiredText: "벨벳 하늘에 첫 별이 나타나는 듯한, 고요한 순간을 위한 단순하고 진심 어린 멜로디.",
        tracklist: [
          { no: 1, title: '첫 별', duration: '2:50', isTitle: false },
          { no: 2, title: '벨벳 시간', duration: '3:10', isTitle: true },
          { no: 3, title: '종이 달', duration: '3:05', isTitle: false },
        ],
        linerNotes: {
            p1: "단순함으로의 회귀. 이 음악은 조용한 시간을 위한 동반자, 삶의 가장 평화로운 순간의 배경에 있는 부드러운 흥얼거림이 되도록 만들어졌습니다.",
            quote: "\"이것들은 단지 아이들만을 위한 것이 아닙니다; 하루의 끝에 약간의 조용함과 평화가 필요한 우리 모두의 일부를 위한 것입니다.\"",
        },
      },
    },
  },
};