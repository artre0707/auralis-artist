import type { Language } from '@/App';

// FIX: Defined ReleaseStatus locally as it was not exported from magazineStore.
export type ReleaseStatus = 'released' | 'upcoming';

export type Track = {
  no: number;
  title: string;
  duration: string;
  isTitle?: boolean;
};

// Guide: It's recommended to store releaseDate in 'YYYY-MM-DD' format for consistency,
// though other formats like "Month DD, YYYY" are also supported for display parsing.
export type Album = {
  status: ReleaseStatus;
  title: string;
  slug: string;
  coverUrl: string;
  catalogueNo?: string;
  magazineSlug?: string;
  featuredVideoUrl?: string; // Fallback for older data structure
  videos?: {
    // ✅ Teaser/Preview 추가
    teaser?: string;
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
    shazam?: string | null;
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
  caption?: {
    [key in Language]: string;
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
  'lullabook-pastel-morning': {
    status: 'upcoming',
    title: 'Lullabook: Pastel Morning',
    slug: 'lullabook-on-a-pastel-morning',
    coverUrl: 'https://www.auralis-music.com/images/albums/lullabook-pastel-morning.jpg',
    catalogueNo: 'ARTRE2025-065',
    seriesInfo: {
      name: { EN: 'Lullabook Series', KR: '럴러북 시리즈' },
      subtitle: { EN: 'Echoes of Childhood', KR: '어린 시절의 메아리' },
    },
    links: {
      listenNow: null,
      spotify: null,
      appleMusic: null,
      youtube: null,
      bandcamp: null,
      believe: null,
      amazonMusic: null,
      flo: null,
      vibe: null,
      presave: null,
      shazam: null,
    },
    details: {
      formatGenre: ['DIGITAL', 'SINGLE', 'PIANO', 'CLASSICAL', 'LULLABY', 'CROSSOVER'],
      displayGenre: { EN: 'Piano Solo, Classical Crossover, Lullaby', KR: '피아노 솔로, 클래식 크로스오버, 자장가' },
      releaseDate: '2025-12-30',
      duration: '1 min 08 sec',
      publisher: 'Auralis Music',
      label: 'Auralis Music',
      management: 'ARTRE',
      distributor: 'ARTRE',
      upc: null,
    },
    caption: {
      KR: '기억 속의 별이 오늘 다시 조용히 빛납니다.',
      EN: 'The star of memory quietly shines again today.',
    },
    credits: [
      { role: { EN: 'Producer & Pianist', KR: '프로듀서 & 피아니스트' }, name: 'Auralis' },
      { role: { EN: 'Composers', KR: '작곡가' }, name: 'Mildred J. Hill, Patty Smith Hill' },
      { role: { EN: 'Arranged by', KR: '편곡' }, name: 'Auralis' },
      { role: { EN: 'Music Technician', KR: '뮤직 테크니션' }, name: 'Auralis' },
      { role: { EN: 'Artwork & Design', KR: '아트워크 & 디자인' }, name: 'Auralis' },
      { role: { EN: 'Label & Publisher', KR: '레이블 & 퍼블리셔' }, name: 'Auralis Music' },
      { role: { EN: 'Management & Distributor', KR: '매니지먼트 & 유통' }, name: 'ARTRE' },
      { role: { EN: 'Created by', KR: '제작' }, name: 'Auralis Music' },
    ],
    content: {
      EN: {
        subtitle: 'A new morning begins in light.',
        description: [
          'A new morning opens with a quiet smile — Lullabook: On a Birthday Morning reimagines the classic American children’s song “Happy Birthday to You” as a tender and reflective piano piece.',
          'Rather than cheerful celebration alone, this arrangement carries the warmth of gratitude, the light of memory, and the gentle emotion that accompanies growing another year older.',
          'It is a song of beginning — a soft candlelight echo that glows quietly within the heart.',
        ],
        feelingInspiredText: 'Another candle, another wish — a tiny glow for a new beginning.',
        tracklist: [{ no: 1, title: 'A Birthday Song', duration: '1:08', isTitle: true }],
        linerNotes: {
          p1: 'This single traces the familiar birthday melody with softness and poise — a reflective moment between gratitude and hope, lit by a single, gentle flame.',
          quote: '"The star of memory quietly shines again today."',
        },
      },
      KR: {
        subtitle: '빛 속에서 새 아침이 시작됩니다.',
        description: [
          '고요한 미소로 열리는 아침 — 「생일 축하합니다」 선율을 부드럽고 사색적인 피아노 곡으로 재해석했습니다.',
          '단순한 축하의 기쁨을 넘어, 감사의 온기와 기억의 빛, 한 해를 더 살아낸 마음의 미묘한 감정을 담았습니다.',
          '작은 촛불처럼, 마음속에서 잔잔히 빛나는 ‘시작의 노래’입니다.',
        ],
        feelingInspiredText: '또 하나의 초, 또 하나의 소원 — 새 시작을 위한 작은 빛.',
        tracklist: [{ no: 1, title: '생일의 노래', duration: '1:08', isTitle: true }],
        linerNotes: {
          p1: '익숙한 생일 노래를 절제된 선율로 그려, 감사와 희망 사이의 조용한 순간을 담았습니다. 한 줄기 부드러운 불빛처럼 마음을 밝히는 음악.',
          quote: '“기억 속의 별이 오늘 다시 조용히 빛납니다.”',
        },
      },
    },
  },
  'lullabook-under-the-little-star': {
    status: 'upcoming',
    title: 'Lullabook: Under the Little Star',
    slug: 'lullabook-under-the-little-star',
    coverUrl: 'https://www.auralis-music.com/images/albums/lullabook-under-the-little-star.jpg',
    catalogueNo: 'ARTRE2025-064',
    seriesInfo: {
      name: { EN: 'Lullabook Series', KR: '럴러북 시리즈' },
      subtitle: { EN: 'Echoes of Childhood', KR: '어린 시절의 메아리' },
    },
    links: {
      listenNow: null, spotify: null, appleMusic: null, youtube: null, bandcamp: null,
      believe: null, amazonMusic: null, flo: null, vibe: null, presave: null, shazam: null,
    },
    details: {
      formatGenre: ['DIGITAL', 'EP', 'PIANO', 'CLASSICAL', 'LULLABY', 'CROSSOVER'],
      displayGenre: { EN: 'Piano Solo, Lullaby, Classical Crossover', KR: '피아노 솔로, 자장가, 클래식 크로스오버' },
      releaseDate: '2025-12-10',
      duration: '4 min 23 sec',
      publisher: 'Auralis Music', label: 'Auralis Music', management: 'ARTRE', distributor: 'ARTRE', upc: null,
    },
    caption: {
      EN: 'A small star rises — quietly marking a day of light.',
      KR: '작은 별 하나가 떠오르며, 조용히 빛의 날을 기록합니다.',
    },
    credits: [
      { role: { EN: 'Producer & Pianist', KR: '프로듀서 & 피아니스트' }, name: 'Auralis' },
      { role: { EN: 'Composer', KR: '작곡가' }, name: 'French Folk Song' },
      { role: { EN: 'Arranged by', KR: '편곡' }, name: 'Auralis' },
      { role: { EN: 'Music Technician', KR: '뮤직 테크니션' }, name: 'Auralis' },
      { role: { EN: 'Artwork & Design', KR: '아트워크 & 디자인' }, name: 'Auralis' },
      { role: { EN: 'Label & Publisher', KR: '레이블 & 퍼블리셔' }, name: 'Auralis Music' },
      { role: { EN: 'Management & Distributor', KR: '매니지먼트 & 유통' }, name: 'ARTRE' },
      { role: { EN: 'Created by', KR: '제작' }, name: 'Auralis Music' },
    ],
    content: {
      EN: {
        subtitle: 'A small star rises, carrying dreams and warmth.',
        description: [
          'Lullabook opens like a tiny storybook of childhood.',
          'Under a quiet starlit sky, two gentle piano pieces unfold—whispering warmth, memory, and dream.',
          'Inspired by “Twinkle, Twinkle, Little Star,” this EP is both a lullaby for little hearts and a song of remembrance for adults.',
          'Between sleep and memory, night and light, a small star rises to bless the quiet corners of our world.',
        ],
        feelingInspiredText: 'Soft songs for little hearts — glowing with dreamlight.',
        tracklist: [
          { no: 1, title: 'Under the Starry Sky', duration: '1:44', isTitle: true },
          { no: 2, title: 'Lullaby of the Little Star', duration: '2:39' },
        ],
        linerNotes: {
          p1: 'The Lullabook Series opens with tender piano whispers that recall childhood nights under the stars. Simple, luminous, and warm — music that remembers the innocence of sleep.',
          quote: '"Tiny melodies, infinite tenderness."',
        },
      },
      KR: {
        subtitle: '작은 별이 떠오르며, 꿈과 따뜻함을 품고 흐릅니다.',
        description: [
          '럴러북 시리즈는 어린 시절의 기억을 부드러운 이야기책처럼 펼칩니다.',
          '고요한 별빛 하늘 아래 두 곡의 피아노 음악이 따스히 흐르며, 추억과 꿈을 속삭입니다.',
          '‘반짝반짝 작은 별’의 프랑스 민요 선율에서 영감을 받아, 아이들을 위한 자장가이자 어른들을 위한 기억의 노래로 완성되었습니다.',
          '잠과 기억, 밤과 빛 사이에서, 작은 별 하나가 세상의 고요한 구석을 비춥니다.',
        ],
        feelingInspiredText: '작은 마음을 위한 부드러운 노래 — 꿈빛으로 물든 자장가.',
        tracklist: [
          { no: 1, title: '별빛 아래에서', duration: '1:44', isTitle: true },
          { no: 2, title: '작은 별의 자장가', duration: '2:39' },
        ],
        linerNotes: {
          p1: '럴러북 시리즈의 첫 번째 앨범은 별빛 아래의 어린 시절을 떠올리게 하는 두 곡의 피아노 자장가입니다. 단순하고 따뜻한 선율 속에서, 잠과 기억이 부드럽게 이어집니다.',
          quote: '“작은 선율 속에, 무한한 다정함이 머문다.”',
        },
      },
    },
  },
  // FIX: Changed typo 'f' to a comma to correctly separate objects.
  'resonance-through-the-wedding-march': {
    status: 'released',
    title: 'Resonance: Through the Wedding March',
    slug: 'resonance-through-the-wedding-march',
    coverUrl: 'https://www.auralis-music.com/images/albums/resonance-through-the-wedding-march.jpg',
    catalogueNo: 'ARTRE2025-012',
    seriesInfo: {
      name: { EN: 'Resonance Series', KR: '레조넌스 시리즈' },
      subtitle: { EN: 'Echoes of Classics', KR: '클래식의 메아리' },
    },
    links: {
      listenNow: null,
      spotify: null,
      appleMusic: null,
      youtube: null,
      bandcamp: null,
      believe: null,
      amazonMusic: null,
      flo: null,
      vibe: null,
      presave: null,
      shazam: null,
    },
    details: {
      formatGenre: ['DIGITAL', 'EP', 'PIANO', 'CLASSICAL', 'EASY LISTENING', 'CROSSOVER'],
      displayGenre: { EN: 'Classical, Easy Listening, Crossover', KR: '클래식, 이지 리스닝, 크로스오버' },
      releaseDate: '2025-11-30',
      duration: '3 min 04 sec',
      publisher: 'Auralis Music',
      label: 'Auralis Music',
      management: 'ARTRE',
      distributor: 'ARTRE',
      upc: null,
    },
    credits: [
      { role: { EN: 'Producer & Pianist', KR: '프로듀서 & 피아니스트' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Composer', KR: '작곡가' }, name: 'Richard Wagner' },
      { role: { EN: 'Arranged by', KR: '편곡' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Music Technician', KR: '뮤직 테크니션' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Artwork & Design', KR: '아트워크 & 디자인' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Label & Publisher', KR: '레이블 & 퍼블리셔' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
      { role: { EN: 'Management & Distributor', KR: '매니지먼트 & 유통' }, name: { EN: 'ARTRE', KR: '아르트레' } },
      { role: { EN: 'Created by', KR: '제작' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
    ],
    content: {
      EN: {
        subtitle: 'Light above, shadow beneath.',
        description: [
          'The sixth chapter of the Resonance Series, Resonance: Through the Wedding March reimagines Wagner’s Bridal Chorus as a dual piano reflection of ceremony and emotion.',
          '“Echoes of Wagner I – Processional Light” embodies the solemn beauty of tradition, while “Echoes of Wagner II – Shadow Veil” unveils the quiet tension beneath its surface.',
          'Between light and shadow, between ritual and introspection, Auralis offers a serene dialogue on love, tradition, and silence.',
        ],
        feelingInspiredText: 'Two pianos tracing a vow — ceremony above, stillness below.',
        tracklist: [
          { no: 1, title: 'Echoes of Wagner I – Processional Light', duration: '2:01', isTitle: true },
          { no: 2, title: 'Echoes of Wagner II – Shadow Veil', duration: '1:03' },
        ],
        linerNotes: {
          p1: 'This EP contemplates the Bridal Chorus through two complementary lenses — the luminous ritual of procession and the shadowed space of inner feeling. In restraint and resonance, the familiar theme becomes a quiet meditation.',
          quote: '"Light above, shadow beneath."',
        },
      },
      KR: {
        subtitle: '빛 위에, 그림자 아래.',
        description: [
          '레조넌스 시리즈의 여섯 번째 챕터. 바그너의 「신부의 합창(Bridal Chorus)」을 의식과 감정의 이중 피아노로 재해석했습니다.',
          '「Echoes of Wagner I – Processional Light」는 전통의 엄숙한 아름다움을, 「Echoes of Wagner II – Shadow Veil」은 그 아래 흐르는 고요한 긴장을 드러냅니다.',
          '빛과 그림자, 의식과 내면 사이에서, 사랑과 전통, 그리고 침묵에 관한 잔잔한 대화를 건넵니다.',
        ],
        feelingInspiredText: '서약을 그리는 두 대의 피아노 — 위로는 의식, 아래에는 고요.',
        tracklist: [
          { no: 1, title: '에코즈 오브 바그너 I – 행진의 빛', duration: '2:01', isTitle: true },
          { no: 2, title: '에코즈 오브 바그너 II – 그림자의 베일', duration: '1:03' },
        ],
        linerNotes: {
          p1: '이 EP는 ‘신부의 합창’을 두 개의 보완적 시선으로 사유합니다. 행진의 빛이 주는 의식의 장엄함과 그 아래 잠긴 내면의 미세한 떨림. 절제와 공명 속에서 익숙한 선율은 조용한 명상이 됩니다.',
          quote: '“빛 위에, 그림자 아래.”',
        },
      },
    },
  },
  'sonic-voyage-first-voyage': {
    status: 'upcoming',
    title: 'Sonic Voyage: First Voyage',
    slug: 'sonic-voyage-first-voyage',
    coverUrl: 'https://www.auralis-music.com/images/albums/sonic-voyage-first-voyage.jpg',
    catalogueNo: 'ARTRE2025-011',
    seriesInfo: {
      name: { EN: 'Sonic Voyages Series', KR: '소닉 보이지스 시리즈' },
      subtitle: { EN: 'Sound Explorations', KR: '사운드 익스플로레이션' },
    },
    links: {
      listenNow: null,
      spotify: null,
      appleMusic: null,
      youtube: null,
      bandcamp: null,
      believe: null,
      amazonMusic: null,
      flo: null,
      vibe: null,
      presave: null,
      shazam: null,
    },
    details: {
      formatGenre: ['DIGITAL', 'EP', 'PIANO', 'AMBIENT'],
      displayGenre: { EN: 'Ambient, Piano, Instrumental', KR: '앰비언트, 피아노, 인스트루멘탈' },
      releaseDate: '2025-12-30',
      duration: '11 min 49 sec',
      publisher: 'Auralis Music',
      label: 'Auralis Music',
      management: 'ARTRE',
      distributor: 'ARTRE',
      upc: null,
    },
    credits: [
      { role: { EN: 'Producer & Pianist', KR: '프로듀서 & 피아니스트' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Composer', KR: '작곡가' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Music Technician', KR: '뮤직 테크니션' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Artwork & Design', KR: '아트워크 & 디자인' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Label & Publisher', KR: '레이블 & 퍼블리셔' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
      { role: { EN: 'Management & Distributor', KR: '매니지먼트 & 유통' }, name: { EN: 'ARTRE', KR: '아르트레' } },
      { role: { EN: 'Created by', KR: '제작' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
    ],
    content: {
      EN: {
        subtitle: 'Music for focus and calm — a sound voyage through silence.',
        description: [
          'The first journey of the Sonic Voyages Series, Auralis invites listeners on an ambient piano exploration inspired by wind, waves, starlight, and distant horizons.',
          'Each piece unfolds like a calm expedition through sound — a meditative voyage designed for focus, relaxation, and emotional clarity.',
          'Let your mind drift freely across tranquil soundscapes where silence breathes and melodies move like light.',
        ],
        feelingInspiredText: 'Sonic Voyage: immerse yourself in the sound of stillness.',
        tracklist: [
          { no: 1, title: 'Whispers of the Wind', duration: '1:56' },
          { no: 2, title: 'Rhythm of the Waves', duration: '2:26' },
          { no: 3, title: 'Starlit Route', duration: '1:54' },
          { no: 4, title: 'Distant Horizon', duration: '2:32' },
          { no: 5, title: 'Dreamlike Voyage', duration: '3:01' },
        ],
        linerNotes: {
          p1: 'This EP marks the first voyage into the Sonic Voyages Series — a study of sound as movement and stillness. Auralis weaves natural imagery into ambient piano textures, inviting quiet focus and introspection.',
          quote: '"Music for focus and calm — a sound voyage through silence."',
        },
      },
      KR: {
        subtitle: '집중과 휴식을 위한 앰비언트 피아노 여정',
        description: [
          '‘소리로 떠나는 여행’을 주제로 한 [Sonic Voyages Series]의 첫 번째 여정.',
          '오랄리스는 바람, 파도, 별빛, 그리고 지평선을 모티프로 앰비언트 피아노 사운드로 이루어진 감각적인 공간을 그려냅니다.',
          '집중과 몰입, 휴식과 회복을 위한 부드러운 사운드 트래블 — 일상의 소음 속에서 마음을 고요히 정화시키는 순수한 청각적 여정이 시작됩니다.',
        ],
        feelingInspiredText: '소리의 고요 속으로 스며드는 여정, Sonic Voyage.',
        tracklist: [
          { no: 1, title: '바람의 속삭임 (Whispers of the Wind)', duration: '1:56' },
          { no: 2, title: '파도의 리듬 (Rhythm of the Waves)', duration: '2:26' },
          { no: 3, title: '별빛 항로 (Starlit Route)', duration: '1:54' },
          { no: 4, title: '먼 지평선 (Distant Horizon)', duration: '2:32' },
          { no: 5, title: '꿈결의 여행 (Dreamlike Voyage)', duration: '3:01' },
        ],
        linerNotes: {
          p1: '이 EP는 ‘소리로 떠나는 여행’ 시리즈의 첫 항해를 담고 있습니다. 오랄리스는 자연의 이미지를 앰비언트 피아노 텍스처로 엮어내며, 집중과 사색을 위한 고요한 사운드 공간을 그립니다.',
          quote: '“집중과 휴식을 위한 앰비언트 피아노 여정.”',
        },
      },
    },
  },
  'resonance-through-the-barcarolle': {
    status: 'released',
    title: 'Resonance: Through the Barcarolle',
    slug: 'resonance-through-the-barcarolle',
    coverUrl: 'https://www.auralis-music.com/images/albums/resonance-along-the-barcarolle.jpg',
    catalogueNo: 'ARTRE2025-010',
    seriesInfo: {
      name: { EN: 'Resonance Series', KR: '레조넌스 시리즈' },
      subtitle: { EN: 'Echoes of Classics', KR: '클래식의 메아리' },
    },
    links: {
      listenNow: null,
      spotify: null,
      appleMusic: null,
      youtube: null,
      bandcamp: null,
      believe: null,
      amazonMusic: null,
      flo: null,
      vibe: null,
      presave: null,
      shazam: null,
    },
    details: {
      formatGenre: ['DIGITAL', 'SINGLE', 'PIANO', 'CROSSOVER'],
      displayGenre: { EN: 'Classical, Crossover', KR: '클래식, 크로스오버' },
      releaseDate: '2025-11-26',
      duration: '2 min 38 sec',
      publisher: 'Auralis Music',
      label: 'Auralis Music',
      management: 'ARTRE',
      distributor: 'ARTRE',
      upc: null,
    },
    credits: [
      { role: { EN: 'Producer & Pianist', KR: '프로듀서 & 피아니스트' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Arranger', KR: '편곡' }, name: { EN: 'Auralis', KR: '오랄리스' } },
      { role: { EN: 'Composer', KR: '작곡가' }, name: 'Gabriel Fauré' },
      { role: { EN: 'Label & Publisher', KR: '레이블 & 퍼블리셔' }, name: { EN: 'Auralis Music', KR: '오랄리스 뮤직' } },
      { role: { EN: 'Management & Distributor', KR: '매니지먼트 & 유통' }, name: { EN: 'ARTRE', KR: '아르트레' } },
    ],
    content: {
      EN: {
        subtitle: 'Echoes of Fauré, reimagined.',
        description: [
          'Auralis presents a delicate and lyrical piano reinterpretation of Gabriel Fauré’s Barcarolle No.1.',
          'Echoes of Fauré – Drifted Elegance flows not beyond Fauré but within his music—capturing the quiet moments where memory and emotion intertwine.',
          'A gentle resonance that bridges classical beauty with modern sensitivity.',
        ],
        feelingInspiredText: 'Where memory meets melody.',
        tracklist: [
          { no: 1, title: 'Echoes of Fauré – Drifted Elegance', duration: '2:38', isTitle: true },
        ],
        linerNotes: {
          p1: 'This single resides within the currents of Fauré’s language rather than after it. It is a quiet study in light, motion, and remembrance—how a familiar barcarolle can hold new breath.',
          quote: '"Flowing through memory, gently."',
        },
      },
      KR: {
        subtitle: '포레의 메아리, 새로운 울림.',
        description: [
          '오랄리스는 가브리엘 포레의 「Barcarolle No.1」을 섬세하고 서정적으로 재해석한 피아노 편곡을 선보입니다.',
          '「Echoes of Fauré – Drifted Elegance」는 포레 이후가 아닌, 그의 음악 속을 흐르는 새로운 울림으로, 고요한 선율 속에서 기억과 감정이 교차하는 순간을 담았습니다.',
          '전통의 아름다움과 현대적 감성을 잇는 조용한 공명입니다.',
        ],
        feelingInspiredText: '기억이 선율을 만나는 순간.',
        tracklist: [
          { no: 1, title: 'Echoes of Fauré – Drifted Elegance', duration: '2:38', isTitle: true },
        ],
        linerNotes: {
          p1: '이 싱글은 포레의 언어 ‘이후’가 아니라 그 ‘안’에서 흐릅니다. 익숙한 바카롤이 새 숨을 머금는 방식—빛과 움직임, 회상을 조용히 탐구합니다.',
          quote: '“기억을 따라, 조용히 흐르다.”',
        },
      },
    },
  },
  'resonance-after-the-first-suite': {
    status: 'released',
    title: 'Resonance: After the First Suite',
    slug: 'resonance-after-the-first-suite',
    magazineSlug: 'liner-notes-resonance',
    coverUrl: 'https://www.auralis-music.com/images/albums/resonance-after-the-first-suite.jpg',
    catalogueNo: "ARTRE2025-009",
    videos: {
      // 필요하면 여기 teaser: '...' 나중에 추가 가능
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
      vibe: "https://vibe.naver.com/album/35746668",
      shazam: 'https://www.shazam.com/album/1841847315/resonance-after-the-first-suite-echoes-of-classics-single',
    },
    details: {
      formatGenre: ["DIGITAL", "SINGLE", "PIANO", "CROSSOVER"],
      displayGenre: { EN: "Classical, Crossover", KR: "클래식, 크로스오버" },
      releaseDate: '2025-10-01',
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
    status: 'released',
    title: 'Chorégraphie: A Dancer’s Diary',
    slug: 'Chorégraphie-Series',
    coverUrl: 'https://www.auralis-music.com/images/albums/choregraphie-series.jpg',
    catalogueNo: "ARTRE2025-033",
    seriesInfo: {
       name: { EN: 'Chorégraphie Series', KR: '코레그라피 시리즈' },
       subtitle: {
         EN: 'Quiet Stage',
         KR: '고요한 무대'
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
      presave: 'https://auralis.bfan.link/choregraphie-a-dancer-s-diary',
      shazam: null,
    },
    details: {
      formatGenre: ["DIGITAL", "EP", "PIANO", "BALLET"],
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
          { no: 2, title: "Journey of Practice", duration: '1:57', isTitle: true },
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
      shazam: null,
    },
    details: {
      formatGenre: ["DIGITAL", "ALBUM", "PIANO", "Meditation"],
      displayGenre: { EN: "Neo-Classical, Relaxation, Meditation", KR: "네오 클래식, 힐링, 명상" },
      releaseDate: '2025-12-20',
      duration: '18 min 07 sec',
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
          { no: 1, title: 'Peaceful Meadow', duration: '2:08', isTitle: false },
          { no: 2, title: 'Soft Light', duration: '2:54', isTitle: true },
          { no: 3, title: 'Whispering Leaves', duration: '1:48', isTitle: false },
          { no: 4, title: 'Morning Glow', duration: '2:47', isTitle: true },
          { no: 5, title: 'Early Mist', duration: '1:36', isTitle: false },
          { no: 6, title: 'Endless Peace', duration: '2:35', isTitle: true },
          { no: 7, title: 'Golden Dawn', duration: '2:24', isTitle: false },
          { no: 8, title: 'Dewdrop Dance', duration: '1:18', isTitle: true },
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
          { no: 1, title: '평화로운 초원 (Peaceful Meadow)', duration: '2:08', isTitle: false },
          { no: 2, title: '부드러운 빛 (Soft Light)', duration: '2:54', isTitle: true },
          { no: 3, title: '속삭이는 잎들 (Whispering Leaves)', duration: '1:48', isTitle: false },
          { no: 4, title: '아침 노을 (Morning Glow)', duration: '2:47', isTitle: true },
          { no: 5, title: '이른 안개 (Early Mist)', duration: '1:36', isTitle: false },
          { no: 6, title: '끝없는 평화 (Endless Peace)', duration: '2:35', isTitle: true },
          { no: 7, title: '황금빛 새벽 (Golden Dawn)', duration: '2:24', isTitle: false },
          { no: 8, title: '이슬방울의 춤 (Dewdrop Dance)', duration: '1:18', isTitle: true },
        ],
        linerNotes: {
            p1: "단순함으로의 회귀. 이 음악은 조용한 시간을 위한 동반자, 삶의 가장 평화로운 순간의 배경에 있는 부드러운 흥얼거림이 되도록 만들어졌습니다.",
            quote: "\"이것들은 단지 아이들만을 위한 것이 아닙니다; 하루의 끝에 약간의 조용함과 평화가 필요한 우리 모두의 일부를 위한 것입니다.\"",
        },
      },
    },
  },
};
