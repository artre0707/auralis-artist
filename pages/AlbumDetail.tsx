import React from 'react';
// FIX: Changed react-router-dom imports to use a wildcard import to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useSiteContext } from '../contexts/SiteContext';
import AlbumBadges from '../components/AlbumBadges';
import { albumsData, Track, Album } from '../data/albums';
import { motion, AnimatePresence } from 'framer-motion';
import type { Language } from '../App';
import InspiredCTA from '../components/InspiredCTA';
import PageContainer from '../components/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Btn from '../components/Btn';
import WhispersOfTheHeart from '../components/WhispersOfTheHeart';
import WhispersOfTheHeartKR from '../components/WhispersOfTheHeartKR';
import { ParallaxImage } from '../components/Parallax';
import { trackMetaEvent } from '@/utils/metaPixel';

type AlbumKey = keyof typeof albumsData;
const MotionDiv = motion.div;

/* ───────────── static copy */
const pageContent = {
  EN: {
    notFoundTitle: 'Album Not Found',
    notFoundBody: 'The album you are looking for does not exist',
    backToAlbums: 'Back to Albums',
    buttonLabels: {
      listenNow: 'Listen Now',
      spotify: 'Spotify',
      appleMusic: 'Apple Music',
      youtube: 'YouTube',
      flo: 'FLO',
      bandcamp: 'Bandcamp',
      linkComingSoon: 'Link coming soon',
      moreVideo: 'View more video',
      vibe: 'VIBE',
      appleMusicClassical: 'Apple Music Classical',
    },
    albumInfo: { collection: 'Collection', subTheme: 'Sub-theme', releaseDate: 'Release Date', duration: 'Duration' },
    section: {
      tracklistTitle: 'Sound Chapters',
      tracklistSub: 'Where each track tells a quiet story',
      videosTitle: 'Visual Journey',
      videosSub: 'Music unfolds through sea and light',
      gratitudeTitle: 'With Gratitude',
      gratitudeSub: 'In quiet collaboration — where every role becomes part of the light.',
    },
    titleTrack: 'Title',
  },
  KR: {
    notFoundTitle: '앨범을 찾을 수 없습니다',
    notFoundBody: '찾고 계신 앨범이 존재하지 않습니다',
    backToAlbums: '앨범 목록으로 돌아가기',
    buttonLabels: {
      listenNow: '지금 듣기',
      spotify: 'Spotify',
      appleMusic: 'Apple Music',
      youtube: 'YouTube',
      flo: 'FLO',
      bandcamp: 'Bandcamp',
      linkComingSoon: '링크 준비 중',
      moreVideo: '다른 영상 보기',
      vibe: 'VIBE',
      appleMusicClassical: 'Apple Music Classical',
    },
    albumInfo: { collection: '컬렉션', subTheme: '서브테마', releaseDate: '발매일', duration: '총 재생 시간' },
    section: {
      tracklistTitle: '고요의 장면들',
      tracklistSub: '각 곡이 고요한 감정의 장면을 펼칩니다',
      videosTitle: '빛과 바다의 여정',
      videosSub: '음악이 빛과 바다의 결 속에서 천천히 피어납니다',
      gratitudeTitle: '감사의 마음을 담아',
      gratitudeSub: '조용한 협업 속에서 모든 손길이 빛이 되어 모입니다',
    },
    titleTrack: '타이틀',
  },
} as const;

/* ───────────── helpers */
function toEmbedSrc(input: string) {
  const isIdOnly = /^[\w-]{11}$/.test(input);
  if (isIdOnly) return `https://www.youtube-nocookie.com/embed/${input}`;
  try {
    const url = new URL(input);
    const params: string[] = [];
    const t = url.searchParams.get('t');
    const list = url.searchParams.get('list');
    const index = url.searchParams.get('index');
    if (t) {
      const start = parseInt(t.replace('s', ''), 10) || 0;
      if (start > 0) params.push(`start=${start}`);
    }
    if (list) params.push(`list=${encodeURIComponent(list)}`);
    if (index) params.push(`index=${encodeURIComponent(index)}`);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.slice(1);
      return `https://www.youtube-nocookie.com/embed/${id}${params.length ? `?${params.join('&')}` : ''}`;
    }
    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v') || '';
      return `https://www.youtube-nocookie.com/embed/${id}${params.length ? `?${params.join('&')}` : ''}`;
    }
  } catch {}
  return `https://www.youtube-nocookie.com/embed/${input}`;
}

const findAlbumBySlug = (slug: string): Album | undefined =>
  (Object.values(albumsData) as Album[]).find(a => a.slug === slug);

/* ───────────── magazine links mapping (album.slug -> magazine article path) */
const MAG_LINKS: Record<string, string> = {
  // 정확한 라이너 노트 경로로 연결
  'resonance-after-the-first-suite': '/magazine/liner-notes-resonance-after-the-first-suite',
  // 필요 시 다른 앨범들도 여기에 추가
};

/* ───────────── bits */
const Breadcrumb: React.FC<{ title: string }> = ({ title }) => {
  const { language } = useSiteContext();
  const c = language === 'KR' ? { home: '홈', collections: '작품집' } : { home: 'Home', collections: 'Collections' };
  return (
    <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-subtle">
      <ol className="flex items-center gap-2 sm:gap-3">
        <li><ReactRouterDOM.Link to="/" className="text-link-hover">{c.home}</ReactRouterDOM.Link></li>
        <li className="opacity-60">/</li>
        <li className="min-w-0">
          <ReactRouterDOM.Link to="/albums" className="text-link-hover whitespace-nowrap truncate max-w-[8.5rem] sm:max-w-none">
            {c.collections}
          </ReactRouterDOM.Link>
        </li>
        <li className="opacity-60">/</li>
        <li className="min-w-0">
          <span className="font-medium truncate" aria-current="page">{title}</span>
        </li>
      </ol>
    </nav>
  );
};

const AlbumDescription: React.FC<{ description: string[]; language: Language }> = ({ description, language }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
    viewport={{ once: true, amount: 0.3 }}
    className={`prose prose-zinc prose-auralis max-w-none leading-relaxed dark:prose-invert text-subtle ${
      language === 'KR' ? 'text-justify' : 'text-left'
    }`}
  >
    {description.map((p, i) => <p key={i}>{p}</p>)}
  </MotionDiv>
);

const AlbumInfoSection: React.FC<{ album: Album }> = ({ album }) => {
  const { language } = useSiteContext();
  const c = pageContent[language];
  const hasSeries = !!album.seriesInfo;
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 24, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }} viewport={{ once: true, amount: 0.2 }} className="mt-6"
    >
      <dl className="grid grid-cols-2 gap-x-10 gap-y-6 text-sm">
        {hasSeries && (
          <>
            <div>
              <dt className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{c.albumInfo.collection}</dt>
              <dd className="text-[#CBAE7A] dark:text-[#D9C18A] font-medium">{album.seriesInfo!.name[language]}</dd>
            </div>
            <div>
              <dt className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{c.albumInfo.subTheme}</dt>
              <dd className="text-[#CBAE7A] dark:text-[#D9C18A] font-medium">{album.seriesInfo!.subtitle[language]}</dd>
            </div>
          </>
        )}
        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{c.albumInfo.releaseDate}</dt>
          <dd className="album-meta-text">{album.details?.releaseDate ?? ''}</dd>
        </div>
        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Genre</dt>
          <dd className="album-meta-text">{album.details?.displayGenre?.[language] ?? ''}</dd>
        </div>
        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {language === 'KR' ? '전체 곡 수' : 'Track Count'}
          </dt>
          <dd className="album-meta-text">
            {album.content?.[language]?.tracklist?.length
              ? `${album.content[language].tracklist.length} ${language === 'KR' ? '곡' : 'tracks'}`
              : (language === 'KR' ? '정보 없음' : 'N/A')}
          </dd>
        </div>
        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{c.albumInfo.duration}</dt>
          <dd className="album-meta-text">{album.details?.duration ?? ''}</dd>
        </div>
      </dl>
    </MotionDiv>
  );
};

const Tracklist: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const { language } = useSiteContext();
  const s = pageContent[language].section;
  return (
    <section className="max-w-3xl mx-auto px-6">
      <SectionHeader title={s.tracklistTitle} subtitle={s.tracklistSub} divider />
      <ol className="mt-6 space-y-3 sm:space-y-2">
        {tracks.map((t) => (
          <li key={t.no} className="flex items-center gap-4 py-2 sm:py-3">
            <span className="w-10 text-right tabular-nums text-base font-medium accent-text">{String(t.no).padStart(2, '0')}</span>
            <div className="flex-1 text-base sm:text-lg track-title-color">
              <span className="break-words">{t.title}</span>
              {t.isTitle && (
                <span className="ml-2 sm:ml-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-[2px] rounded-md bg-[#CBAE7A]/90 text-white dark:text-black">
                  {pageContent[language].titleTrack}
                </span>
              )}
            </div>
            <span className="text-sm sm:text-base tabular-nums text-zinc-500 dark:text-zinc-400">{t.duration}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};

const VideoShell: React.FC<{ title: string; src: string }> = ({ title, src }) => (
  <div className="group">
    <div
      className="
        relative overflow-hidden rounded-2xl border border-card bg-card shadow-sm
        transition-transform duration-300 group-hover:-translate-y-0.5
        w-full max-w-[480px] sm:max-w-none mx-auto
      "
    >
      <div
        className="
          w-full 
          aspect-[16/9] sm:aspect-video
          scale-90 sm:scale-100
          transform-gpu transition-transform
        "
      >
        <iframe
          className="w-full h-full"
          src={src}
          title={title}
          frameBorder="0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
    <p className="mt-2 text-center text-xs text-subtle">{title}</p>
  </div>
);

const FeaturedVideos: React.FC<{ titleUrl?: string; fullUrl?: string; track1Url?: string }> = ({ titleUrl, fullUrl, track1Url }) => {
  const { language } = useSiteContext();
  const s = pageContent[language].section;
  return (
    <section className="mx-auto max-w-6xl px-6">
      <SectionHeader title={s.videosTitle} subtitle={s.videosSub} divider />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {titleUrl ? <VideoShell title={language === 'KR' ? '타이틀 트랙' : 'Title Track'} src={toEmbedSrc(titleUrl)} /> : null}
        {fullUrl ? <VideoShell title={language === 'KR' ? '풀 앨범 영상' : 'Full Album Video'} src={toEmbedSrc(fullUrl)} /> : null}
      </div>
      {track1Url && (
        <div className="mt-4 flex items-center justify-center">
          <Btn href={track1Url} variant="outlineGhost" arrow>
            {pageContent[language].buttonLabels.moreVideo}
          </Btn>
        </div>
      )}
    </section>
  );
};

const SingleVideo: React.FC<{ url: string; heading?: string; sub?: string; title?: string }> = ({ url, heading, sub, title }) => {
  const { language } = useSiteContext();
  const s = pageContent[language].section;
  return (
    <section className="max-w-3xl mx-auto px-6">
      <SectionHeader title={heading ?? s.videosTitle} subtitle={sub ?? s.videosSub} divider />
      <div className="mt-6 rounded-2xl overflow-hidden bg-card shadow-sm border border-card">
        <iframe className="w-full aspect-video" src={toEmbedSrc(url)} title={title ?? 'Official Video'} loading="lazy" allowFullScreen />
      </div>
    </section>
  );
};

/* ───────────────── ComposerReflection (Reflections + Artist Note) ───────────── */
const ComposerReflection: React.FC<{
  album: Album;
  magazineSlug?: string;
}> = ({ album, magazineSlug }) => {
  const { language } = useSiteContext();
  const isKR = language === 'KR';

  const [tab, setTab] = React.useState<'note' | 'story'>('note');

  const t = isKR
    ? {
        title: '여운의 기록',
        subtitle: '마지막 울림 이후에 남은 사색의 흔적',
        tabNote: '마음의 속삭임',
        tabStory: '음악의 서사',
        story: [
          '이 프로젝트는 바흐의 첼로 모음곡 1번 G장조의 도입부에서 영감을 얻어 피아노의 언어로 재해석하고자 했습니다. 멜로디의 단순함과 구조의 명료함을 유지하는 동시에 현대적인 감각으로 음색과 공명을 확장하는 데 중점을 두었습니다.',
          "첫 번째 트랙인 '바흐의 메아리 I – First Light' 는 원래 모티프에서 발전하여, 공간감과 페달 공명을 통해 정지된 시간 감각을 만들어냅니다. 다음 곡인 '바흐의 메아리 II – Long Shadow'는 소리와 침묵의 상호작용을 탐구하며 지속적인 감정적 긴장감을 조성합니다.",
          "궁극적으로, '공명: 첫 번째 모음곡 이후'는 과거를 인용하는 것이 아니라 과거를 새롭게 경험하는 것을 목표로 합니다. 즉, 친숙한 모티프가 현재 순간의 질감과 호흡을 통해 새로운 의미를 얻도록 하는 것입니다.",
        ],
        readEssay: '전체 에세이 읽기',
      }
    : {
        title: 'Reflections',
        subtitle: 'Thoughts that linger beyond the final note',
        tabNote: 'Whispers of the Heart',
        tabStory: 'The Narrative of Music',
        story: [
          'This project originates from inspiration found in the opening phrase of Bach’s Cello Suite No. 1 in G major and seeks to reinterpret it through the language of the piano. The focus is to preserve the simplicity of melody and clarity of structure while expanding tone and resonance with modern sensitivity.',
          'The first track, Echoes of Bach I – First Light, evolves from the original motif, creating a suspended sense of time through spacing and pedal resonance. The following piece, Echoes of Bach II – Long Shadow, explores the interplay between sound and silence, designing a sustained emotional tension.',
          'Ultimately, Resonance: After the First Suite does not aim to quote the past but to experience it anew — allowing familiar motifs to acquire fresh meaning through the textures and breaths of the present moment.',
        ],
        readEssay: 'Read the full essay',
      };

  /* Essay 링크 결정: 1) 데이터의 magazineSlug, 2) MAG_LINKS 매핑 */
  const essayHref =
    (album as any).magazineSlug
      ? `/magazine/${(album as any).magazineSlug}`
      : MAG_LINKS[(album as any).slug as string];

  return (
    <section className="max-w-3xl mx-auto px-6">
      {/* Header */}
      <SectionHeader title={t.title} subtitle={t.subtitle} divider spacing="md" />

      {/* Tabs */}
      <div className="flex justify-center items-center gap-6 text-sm border-b border-[var(--border)]">
        <button
          onClick={() => setTab('note')}
          className={`pb-2 transition ${
            tab === 'note'
              ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
              : 'text-subtle hover:text-[var(--accent)]'
          }`}
        >
          {t.tabNote}
        </button>
        <button
          onClick={() => setTab('story')}
          className={`pb-2 transition ${
            tab === 'story'
              ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
              : 'text-subtle hover:text-[var(--accent)]'
          }`}
        >
          {t.tabStory}
        </button>
      </div>

      {/* Body */}
      <AnimatePresence mode="wait">
        <MotionDiv
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mt-8"
        >
          {tab === 'note' ? (
            isKR ? <WhispersOfTheHeartKR /> : <WhispersOfTheHeart />
          ) : (
            <div
              className={`max-w-none text-base md:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 ${
                isKR ? 'text-justify' : 'font-serif'
              }`}
            >
              {t.story.map((p, i) => (
                <p key={i} className="mb-4">
                  {p}
                </p>
              ))}
            </div>
          )}
        </MotionDiv>
      </AnimatePresence>

      {/* Essay Link */}
      {essayHref && (
        <div className="mt-10 text-center">
          <Btn to={essayHref} variant="outlineGhost" arrow>
            {t.readEssay}
          </Btn>
        </div>
      )}
    </section>
  );
};

/* ───────────── Credits */
const CreditsSection: React.FC<{ album: Album }> = ({ album }) => {
  const { language } = useSiteContext();
  const s = pageContent[language].section;
  const credits = album.credits || [];
  const catNo = album.catalogueNo || '—';
  return (
    <section className="max-w-3xl mx-auto">
      <SectionHeader title={<span className="text-gradient-gold">{s.gratitudeTitle}</span>} subtitle={s.gratitudeSub} spacing="md" />
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-center">
        {credits.map((credit, idx) => {
          const displayName = typeof credit.name === 'string' ? credit.name : credit.name[language];
          return (
            <div key={idx} className="flex flex-col">
              <dt className="text-[11px] uppercase tracking-wider text-subtle">{credit.role[language]}</dt>
              <dd className="mt-0.5 text-base font-medium accent-text">
                {credit.link ? <a href={credit.link} className="underline underline-offset-2">{displayName}</a> : displayName}
              </dd>
            </div>
          );
        })}
        <div className="flex flex-col">
          <dt className="text-[11px] uppercase tracking-wider text-subtle">{language === 'KR' ? '카탈로그 넘버' : 'Catalogue No.'}</dt>
          <dd className="mt-0.5 text-base font-mono tracking-tight accent-text">{catNo}</dd>
        </div>
      </dl>
    </section>
  );
};

// --- 유틸: http/https 유효 링크인지 검사
function isValidHttpUrl(u?: string) {
  if (!u) return false;
  try {
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// --- Presave 버튼 (공통 사용)
const PresaveButton: React.FC<{ url?: string; isKR: boolean }> = ({ url, isKR }) => {
  const label = isKR ? '사전 저장' : 'Presave';
  if (isValidHttpUrl(url)) {
    return (
      <Btn href={url!} variant="primaryGlow" size="md" arrow>
        {label}
      </Btn>
    );
  }
  return (
    <button
      disabled
      title={isKR ? '링크 준비 중' : 'Link coming soon'}
      className="
        w-full px-5 py-2.5 text-sm rounded-full
        border border-[var(--border)]
        bg-neutral-100/60 dark:bg-white/5
        text-neutral-400 dark:text-neutral-500
        cursor-not-allowed
      "
    >
      {label}
    </button>
  );
};


/* ───────────── main */
const AlbumDetail: React.FC = () => {
  const { slug } = ReactRouterDOM.useParams<{ slug: string }>();
  const { language } = useSiteContext();
  const c = pageContent[language];

  if (!slug) {
    return (
      <PageContainer>
        <div className="min-h-screen text-center px-4 pt-16">
          <h1 className="auralis-hero-title text-4xl md:text-5xl font-medium tracking-tight mb-4">{c.notFoundTitle}</h1>
          <p className="text-subtle">{c.notFoundBody}</p>
          <ReactRouterDOM.Link to="/albums" className="text-link mt-6 inline-block">{c.backToAlbums}</ReactRouterDOM.Link>
        </div>
      </PageContainer>
    );
  }

  // ✅ slug로 안전 탐색 (키와 무관)
  const album = findAlbumBySlug(slug);

  if (!album) {
    if (typeof window !== 'undefined') {
      console.warn('[AlbumDetail] Not found by slug:', slug, 'Available slugs:', (Object.values(albumsData) as Album[]).map(a => a.slug));
    }
    return (
      <PageContainer>
        <div className="min-h-screen text-center px-4 pt-16">
          <h1 className="auralis-hero-title text-4xl md:text-5xl font-medium tracking-tight mb-4">{c.notFoundTitle}</h1>
          <p className="text-subtle">{c.notFoundBody}</p>
          <ReactRouterDOM.Link to="/albums" className="text-link mt-6 inline-block">{c.backToAlbums}</ReactRouterDOM.Link>
        </div>
      </PageContainer>
    );
  }

  const isReleased = album.status === 'released';
  const albumContent = album.content?.[language] ?? { subtitle: '', description: [], tracklist: [] as Track[] };
  const safeDescription = Array.isArray(albumContent.description) ? albumContent.description : [albumContent.description].filter(Boolean) as string[];
  const hasVideos = Boolean(album.videos?.titleTrack || album.videos?.fullAlbum);

  return (
    <PageContainer>
      <header className="bg-card border-b border-base">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-14 sm:h-16 flex items-center">
          <Breadcrumb title={album.title} />
        </div>
      </header>

      <main>
        <div className="space-y-16 md:space-y-24 lg:space-y-[7.5rem] pb-28">
          {/* Hero / Meta */}
          <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[520px,1fr] lg:gap-12">
              <div className="order-1 lg:order-none space-y-6 lg:sticky lg:top-24 self-start">
                <div className="w-full max-w-[520px]">
                  <div className="relative rounded-2xl p-2 ring-1 ring-[var(--border)] shadow-sm">
                    <ParallaxImage
                      src={album.coverUrl}
                      alt={`Album cover for ${album.title}`}
                      strength={0.06}
                      className="rounded-xl overflow-hidden shadow-lg"
                      imgClassName="w-full aspect-square object-cover"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
  {isReleased ? (
    <>
      <Btn
        href={album.links?.listenNow ?? 'https://auralis.bfan.link/resonance-after-the-first-suite-2'}
        variant="primaryGlow"
        size="md"
        arrow
        onClick={() => trackMetaEvent('PlayMusic', { platform: 'SmartLink', track: album.title })}
      >
        {c.buttonLabels.listenNow}
      </Btn>

      {/* 플랫폼 버튼들은 기존 그대로 */}
      {album.links?.spotify ? (
        <Btn href={album.links.spotify} variant="outlineGhost" size="md" arrow={false} onClick={() => trackMetaEvent('PlayMusic', { platform: 'Spotify', track: album.title })}>
          {c.buttonLabels.spotify}
        </Btn>
      ) : (
        <Btn disabled variant="outlineGhost" size="md" arrow={false} disabledTitle={c.buttonLabels.linkComingSoon}>
          {c.buttonLabels.spotify}
        </Btn>
      )}

      {album.links?.appleMusic ? (
        <Btn href={album.links.appleMusic} variant="outlineGhost" size="md" arrow={false} onClick={() => trackMetaEvent('PlayMusic', { platform: 'Apple Music', track: album.title })}>
          {c.buttonLabels.appleMusic}
        </Btn>
      ) : (
        <Btn disabled variant="outlineGhost" size="md" arrow={false} disabledTitle={c.buttonLabels.linkComingSoon}>
          {c.buttonLabels.appleMusic}
        </Btn>
      )}

      {album.links?.youtube ? (
        <Btn href={album.links.youtube} variant="outlineGhost" size="md" arrow={false} onClick={() => trackMetaEvent('PlayMusic', { platform: 'YouTube', track: album.title })}>
          {c.buttonLabels.youtube}
        </Btn>
      ) : (
        <Btn disabled variant="outlineGhost" size="md" arrow={false} disabledTitle={c.buttonLabels.linkComingSoon}>
          {c.buttonLabels.youtube}
        </Btn>
      )}

      {album.links?.flo ? (
        <Btn href={album.links.flo} variant="outlineGhost" size="md" arrow={false} onClick={() => trackMetaEvent('PlayMusic', { platform: 'FLO', track: album.title })}>
          {c.buttonLabels.flo}
        </Btn>
      ) : (
        <Btn disabled variant="outlineGhost" size="md" arrow={false} disabledTitle={c.buttonLabels.linkComingSoon}>
          {c.buttonLabels.flo}
        </Btn>
      )}

      {album.links?.bandcamp ? (
        <Btn href={album.links.bandcamp} variant="outlineGhost" size="md" arrow={false} onClick={() => trackMetaEvent('PlayMusic', { platform: 'Bandcamp', track: album.title })}>
          {c.buttonLabels.bandcamp}
        </Btn>
      ) : (
        <Btn disabled variant="outlineGhost" size="md" arrow={false} disabledTitle={c.buttonLabels.linkComingSoon}>
          {c.buttonLabels.bandcamp}
        </Btn>
      )}

      {/* VIBE (disabled) */}
      <Btn disabled variant="outlineGhost" size="md" arrow={false} disabledTitle={c.buttonLabels.linkComingSoon}>
        {c.buttonLabels.vibe}
      </Btn>

      {/* Apple Music Classical (active) */}
      <Btn
        href="https://classical.music.apple.com/us/album/1841847315"
        variant="outlineGhost"
        size="md"
        arrow={false}
        onClick={() => trackMetaEvent('PlayMusic', { platform: 'Apple Music Classical', track: album.title })}
      >
        {c.buttonLabels.appleMusicClassical}
      </Btn>
    </>
  ) : (
    <>
      {/* ✅ 여기만 바꾸면 모든 'upcoming' 앨범에 공통 적용 (Chorégraphie 포함) */}
      <PresaveButton  isKR={language === 'KR'} />

      <div className="flex items-center justify-center rounded-full border border-[var(--border)] text-sm px-3 py-2 text-subtle">
        {album.details?.releaseDate
          ? `${language === 'KR' ? '발매일' : 'Release'} • ${album.details.releaseDate}`
          : language === 'KR'
          ? '발매일 미정'
          : 'TBA'}
      </div>
    </>
  )}
</div>
                </div>

                {/* Right column */}
              </div>
              <div className="order-2 lg:order-none self-start lg:pt-1">
                {album.details?.formatGenre && <AlbumBadges tags={album.details.formatGenre} />}
                <h1 className="auralis-hero-title tracking-tight leading-[1.05] -tracking-[0.01em] text-3xl sm:text-4xl lg:text-5xl mt-4 break-words text-balance max-w-[18ch] sm:max-w-[22ch]">{album.title}</h1>
                <h2 className="auralis-subtitle mt-3 text-lg sm:text-xl lg:text-2xl text-subtle max-w-[48ch]">{albumContent.subtitle ?? ''}</h2>
                <div className="w-16 h-px bg-[var(--accent)] my-6" />
                <AlbumDescription description={safeDescription} language={language} />
                <AlbumInfoSection album={album} />
              </div>
            </div>
          </section>

          {isReleased && albumContent?.tracklist?.length ? <Tracklist tracks={albumContent.tracklist} /> : null}

          {isReleased && (hasVideos
            ? <FeaturedVideos titleUrl={album.videos?.titleTrack ?? undefined} fullUrl={album.videos?.fullAlbum ?? undefined} track1Url={album.videos?.track1 ?? undefined} />
            : (album.featuredVideoUrl ? <SingleVideo url={album.featuredVideoUrl} /> : null)
          )}

          {/* ▼▼▼ Reflections 섹션 복원: 영상 바로 아래에 표시 ▼▼▼ */}
          {isReleased && <ComposerReflection album={album} />}

          {isReleased && (
            <section aria-label="Feeling Inspired and Credits" className="max-w-6xl mx-auto px-6">
              <div className="space-y-16 md:space-y-24">
                <div id="feeling-inspired">
                  <InspiredCTA albumSlug={album.slug} showHeader />
                </div>
                <section id="with-gratitude" className="max-w-3xl mx-auto">
                  <CreditsSection album={album} />
                </section>
              </div>
            </section>
          )}
        </div>
        
      </main>
      {/* ───────────── 공통 하단 네비게이션 (항상 노출) */}
<section
  aria-label="Album footer navigation"
  className="max-w-6xl mx-auto px-6 mt-16 sm:mt-20 pt-8 border-t border-[var(--border)]"
>
  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-0">
    {/* ← Back to Albums */}
    <Btn
      to="/albums"
      variant="outlineGhost"
      arrow
      className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
    >
      {pageContent[language].backToAlbums}
    </Btn>

    {/* Prev / Next Navigation */}
    <div className="flex gap-3 sm:gap-4">
      {(album as any).prevSlug && (
        <Btn
          to={`/albums/${(album as any).prevSlug}`}
          variant="outlineGhost"
          arrow={false}
          arrowLeft
          className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
        >
          {language === 'KR' ? '이전 앨범' : 'Previous'}
        </Btn>
      )}
      {(album as any).nextSlug && (
        <Btn
          to={`/albums/${(album as any).nextSlug}`}
          variant="outlineGhost"
          arrow
          className="text-[color:var(--link)] hover:text-[color:var(--accent)]"
        >
          {language === 'KR' ? '다음 앨범' : 'Next'}
        </Btn>
      )}
    </div>
  </div>
</section>
    </PageContainer>
  );
};

export default AlbumDetail;