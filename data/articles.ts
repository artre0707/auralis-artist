import type { Language } from '@/App';

export type Article = {
  slug: string;
  isReaderNote?: boolean;
  cover: string | null;
  date: string | null; // ISO 8601 format: "YYYY-MM-DD"
  author: string | null;
  role: string | null;
  albumUrl: string | null;
  tags: {
    [key in Language]?: string[];
  };
  content: {
    [key in Language]: {
      title: string;
      dek: string; // "dek" is a short summary
      body: string;
    };
  };
};

export const articles: Article[] = [
  {
    slug: 'liner-notes-resonance',
    cover: 'https://picsum.photos/seed/mag1/800/450',
    date: '2025-10-01',
    author: 'Auralis',
    role: 'Musician',
    albumUrl: '/albums/resonance-after-the-first-suite',
    tags: {
      EN: ['Liner Notes', 'Composition', 'Piano'],
      KR: ['라이너 노트', '작곡', '피아노'],
    },
    content: {
      EN: {
        title: 'Liner Notes: Resonance, After the First Suite',
        dek: 'A quiet exploration of the space between notes, where memory and emotion converge in a dialogue between classical structure and modern feeling.',
        body: `Music has always been the language of memory for me. When a moment in life passes, it remains as a trace of emotion, and over time, that trace transforms into a resonance that lingers in the heart. This album, Resonance: After the First Suite, is a record of the moment when that resonance first began to take form. At its center lies Bach. His music holds a human tremor even within order and clarity. Upon that classical balance, I wanted to add a modern sensibility — of breath and stillness. The result was two variations: Echoes of Bach I – First Light and Echoes of Bach II – Long Shadow.\n\n\nFirst Light begins like the breath of the clearest dawn. A quiet yet living resonance fills the space, painting a sense that everything is awakening once again. In contrast, Long Shadow contains the length of emotion felt at the end of a day.\n\n\n Like a breath that slowly fades away, a long reverberation lingers in the air. The two pieces carry different colors of time, yet ultimately connect as a single circle. Within that circle, the word “restoration” came to my mind — the moment when what has passed turns once more into light, and the faint resonance heard then becomes the essence of this music.\n\n\nI believe that Bach’s counterpoint is not merely a musical technique, but a dialogue of life itself. Just as different melodies collide, resonate, and eventually arrive at a harmonious whole, our emotions too return to a quiet equilibrium.\n\n\nThis album marks the first step in that search for balance. And at the end of that journey, I wish to share with you the resonance that dwells within silence.`,
      },
      KR: {
        title: '라이너 노트: 레조넌스, 첫 모음곡 이후',
        dek: '음표 사이의 공간, 기억과 감정이 만나 고전적 구조와 현대적 감성 사이의 대화를 나누는 조용한 탐험.',
        body: `음악은 나에게 언제나 ‘기억의 언어’였다. 삶의 한순간을 지나고 나면, 그것은 감정의 결로 남고, 그 결은 시간이 지나며 ‘울림’으로 바뀌어 마음속에 머문다. 이 앨범 Resonance: After the First Suite는 그 울림이 처음 형태를 갖추기 시작한 순간의 기록이다. 작품의 중심에는 바흐가 있다. 그의 음악은 질서와 명료함 속에서도 인간적인 떨림을 품고 있다. 나는 그 고전적 균형의 틀 위에 ‘호흡’과 ‘쉼’이라는 현대적인 감성을 더해보고자 했다. 그 결과 두 개의 변주, Echoes of Bach I – First Light와 Echoes of Bach II – Long Shadow가 태어났다.\n\n\n‘First Light’는 가장 투명한 새벽의 호흡처럼 시작된다. 조용하지만 살아 있는 울림이 공간을채우며, 모든 것이 다시 깨어나는 듯한 감각을 그려낸다. 반면 ‘Long Shadow’는 하루의 끝에서 느껴지는 감정의 길이를 담고 있다.\n\n\n한 번 내뱉은 호흡이 서서히 사라지듯, 긴 여운이 공간 속에 머무른다. 두 곡은 서로 다른 시간의 색을 지니지만, 결국 하나의 원처럼 이어진다. 그 원 안에서 나는 ‘회복’이라는 단어를 떠올렸다. 지나온 것들이 다시 빛으로 번지는 순간 — 그때 들리는 미세한 울림이 이 음악의 본질이다.\n\n\n나는 바흐의 ‘대위법’이 단지 음악적 기술이 아니라 ‘삶의 대화’라고 생각한다. 서로 다른 선율들이 부딪히고, 공명하고, 결국 조화로운 전체로 귀결되는 것처럼, 우리의 감정 또한 그렇게 하나의 조용한 균형으로 돌아온다.\n\n\n이 앨범은 그 균형을 찾아가는 여정의 첫걸음이다. 그리고 그 여정의 끝에서 들려오는 ‘침묵 속의 울림’을, 당신과 함께 나누고 싶다.`,
      },
    },
  },
  {
    slug: 'studio-diary-finding-stillness',
    cover: 'https://picsum.photos/seed/mag2/800/450',
    date: '2025-10-20',
    author: 'Auralis',
    role: 'Musician',
    albumUrl: null,
    tags: {
      EN: ['Studio Diary', 'Creative Process'],
      KR: ['스튜디오 다이어리', '창작 과정'],
    },
    content: {
      EN: {
        title: 'Studio Diary: The Search for Stillness',
        dek: 'Behind the scenes on the creative process—how silence becomes as important as the notes themselves in shaping a piece.',
        body: `Today in the studio was less about playing and more about listening. I spent hours simply sitting at the piano, letting the ambient sounds of the room settle. The hum of the city outside, the creak of the wooden floor—it all becomes part of the music if you let it.\n\n\nI'm finding that the most powerful moments in my compositions often come from the rests, the pauses, the breaths between phrases. It's in this stillness that the listener can truly feel the emotional weight of what came before. Music isn't just a collection of sounds; it's a carefully sculpted landscape of sound and silence. And today, I was sculpting the silence.\n\n\nAs the hours passed, I felt as though I was stacking silent notes upon one another. Even without touching the keys, the room continued to vibrate—its quiet resonance intertwining with fragments of my own memory. At times, I think this unplayed music might be the truest form of all sound.\n\n\nIn today’s stillness, I was reminded that music is, at its core, the act of listening to existence itself. Even after the sound leaves our fingertips, it lingers—reflecting who we are in its fading echo.\n\n\nThis day may leave no trace upon a score. Yet within that wordless time, I knew—the first note of the next piece was already being born.`,
      },
      KR: {
        title: '스튜디오 다이어리: 정적을 찾아서',
        dek: '창작 과정의 비하인드—작품을 형성하는 데 있어 음표 자체만큼이나 침묵이 어떻게 중요해지는지에 대하여.',
        body: `오늘 스튜디오에서는 연주보다는 듣는 것에 더 집중했습니다. 저는 몇 시간 동안 그저 피아노 앞에 앉아 방 안의 주변 소리가 가라앉기를 기다렸습니다. 바깥 도시의 웅성거림, 나무 바닥의 삐걱거림—내버려두면 이 모든 것이 음악의 일부가 됩니다.\n\n\n제 작곡에서 가장 강력한 순간들은 종종 쉼표, 멈춤, 악구 사이의 숨결에서 나온다는 것을 깨닫고 있습니다. 바로 이 정적 속에서 청취자는 이전에 나왔던 것의 감정적 무게를 진정으로 느낄 수 있습니다. 음악은 단지 소리의 집합이 아니라, 소리와 침묵으로 세심하게 조각된 풍경입니다. 그리고 오늘, 저는 그 침묵을 조각하고 있었습니다.\n\n\n그 시간이 지나며, 나는 소리 없는 음표들을 쌓아 올리는 느낌을 받았습니다. 건반을 누르지 않아도 공간은 여전히 진동하고 있었고, 그 진동은 내 안의 기억과 맞물려 미세하게 울렸습니다. 때로는 이 ‘연주되지 않은 음악’이야말로 가장 진실한 형태의 음악이라는 생각이 듭니다.\n\n\n나는 오늘의 정적 속에서, 음악이란 결국 ‘존재를 듣는 행위’라는 것을 다시금 느꼈습니다. 손끝에서 벗어난 순간에도, 음은 여전히 머물러 있으며, 그 잔향 속에서 우리 자신이 반사됩니다. 이 하루의 기록은 악보 위에 남지 않을지도 모릅니다. 하지만 그 무언의 시간 속에서, 다음 곡의 첫 음이 이미 태어나고 있었음을—나는 분명히 알고 있었습니다.`,
      },
    },
  },
   {
    slug: 'essay-on-minimalism',
    cover: 'https://picsum.photos/seed/mag3/800/450',
    date: '2025-10-10',
    author: 'ARTRE',
    role: 'Editorial',
    albumUrl: null,
    tags: {
      EN: ['Essay', 'Musical Philosophy'],
      KR: ['에세이', '음악 철학'],
    },
    content: {
      EN: {
        title: 'The Gentle Power of Musical Minimalism',
        dek: 'An essay on how "less is more" can create profound emotional depth in modern classical and ambient music.',
        body: `In a world saturated with noise, minimalism in music offers a sanctuary. It's an invitation to focus, to find the universe within a single, sustained note or a slowly repeating pattern. Artists like Auralis build on a legacy that stretches from Satie to Philip Glass, but with a deeply personal, emotional touch.\n\nThis isn't empty music; it is music full of space. Space for thought, for feeling, for the listener's own story to unfold. By stripping away the non-essential, the composer reveals a core truth, a raw emotion that a more complex arrangement might obscure. It's a quiet revolution against the clamor of modern life, proving that the softest voice can often be the most powerful.`,
      },
      KR: {
        title: '음악적 미니멀리즘의 부드러운 힘',
        dek: '현대 클래식과 앰비언트 음악에서 "적을수록 많다"는 원칙이 어떻게 깊은 감정적 깊이를 만들어낼 수 있는지에 대한 에세이.',
        body: `소음으로 가득 찬 세상에서 음악의 미니멀리즘은 안식처를 제공합니다. 이는 하나의 지속되는 음이나 천천히 반복되는 패턴 속에서 우주를 발견하도록 집중하라는 초대입니다. 오랄리스와 같은 아티스트들은 사티에서 필립 글래스에 이르는 유산 위에, 깊이 개인적이고 감성적인 손길을 더해 구축합니다.\n\n이것은 텅 빈 음악이 아니라, 공간으로 가득 찬 음악입니다. 생각과 감정, 그리고 청취자 자신의 이야기가 펼쳐질 공간입니다. 비본질적인 것을 제거함으로써 작곡가는 핵심적인 진실, 즉 더 복잡한 편곡이 가릴 수 있는 날것의 감정을 드러냅니다. 이는 현대 생활의 소란에 대한 조용한 혁명이며, 가장 부드러운 목소리가 종종 가장 강력할 수 있음을 증명합니다.`,
      },
    },
  },
];
