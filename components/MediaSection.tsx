import React, { useState } from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import SectionHeader from '@/components/SectionHeader';

const YT_ID_REGEX = /^[\w-]{11}$/;

// ===== Robust YouTube Embed Parser (shorts/embed/live 지원 + start 파싱) =====
function toEmbedSrc(input: string): string {
  const YT_ID = /^[\w-]{11}$/;

  const parseStart = (t?: string | null): number => {
    if (!t) return 0;
    const s = t.trim();
    if (/^\d+$/.test(s)) return parseInt(s, 10);      // "95"
    if (/^\d+s$/i.test(s)) return parseInt(s, 10);    // "95s"
    const hms = s.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
    if (hms && (hms[1] || hms[2] || hms[3])) {
      const h = parseInt(hms[1] || '0', 10);
      const m = parseInt(hms[2] || '0', 10);
      const sec = parseInt(hms[3] || '0', 10);
      return h * 3600 + m * 60 + sec;
    }
    if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(s)) {
      const parts = s.split(':').map(Number);
      while (parts.length < 3) parts.unshift(0);
      const [h, m, sec] = parts;
      return h * 3600 + m * 60 + sec;
    }
    return 0;
  };

  // ID만 들어온 경우
  if (YT_ID.test(input)) {
    return `https://www.youtube-nocookie.com/embed/${input}`;
  }

  try {
    const url = new URL(input.trim());
    const host = url.hostname.replace(/^www\./, '');
    const path = url.pathname.replace(/\/+/g, '/');
    const start = parseStart(url.searchParams.get('t') || url.searchParams.get('start'));

    let id = '';

    if (host === 'youtu.be') {
      // youtu.be/<id>
      id = path.slice(1);
    } else if (host.includes('youtube.com')) {
      // youtube.com/watch?v= / embed/<id> / shorts/<id> / live/<id>
      if (url.searchParams.get('v')) {
        id = url.searchParams.get('v') || '';
      } else {
        const segs = path.split('/').filter(Boolean);
        // /embed/<id> /shorts/<id> /live/<id>
        const maybeId = segs.pop() || '';
        id = maybeId;
      }
    }

    if (!YT_ID.test(id)) {
      console.warn('Invalid YouTube ID parsed:', input);
      return '';
    }

    return `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ''}`;
  } catch (err) {
    console.error('Invalid YouTube URL:', input, err);
    return '';
  }
}

// ===== Editable: Video Data =====
const initialVideos = [
  { url: 'https://www.youtube.com/watch?v=H7GURKtbU00&t=106s', title: 'Auralis – Echoes of Bach I (Official Video)' },
  { url: 'https://www.youtube.com/watch?v=f9Du-utVUxE', title: 'Auralis – Official Video' },
  { url: 'https://www.youtube.com/watch?v=3WOHTXQy4RM&t=955s', title: 'Auralis – Feature at 15:55' },
];

const moreVideos = [
  { url: 'https://www.youtube.com/watch?v=LfObNP93dA0', title: 'Auralis – Live / Session' },
  { url: 'https://www.youtube.com/watch?v=m9oaq_0W4Yg', title: 'Auralis – Beyond the Sound' },
  { url: 'https://www.youtube.com/watch?v=EJnsdCcLU1g', title: 'Auralis – Performance Cut' },
];

// ===== VideoCard (with nocookie fallback) =====
const VideoCard: React.FC<{ watchUrlOrId: string; title: string }> = ({ watchUrlOrId, title }) => {
  const [src, setSrc] = useState(toEmbedSrc(watchUrlOrId));
  const [failed, setFailed] = useState(false);

  const tryFallback = () => {
    if (!src) return;
    if (src.includes('youtube-nocookie.com')) {
      const fallback = src.replace('youtube-nocookie.com', 'youtube.com');
      setSrc(fallback);
    } else {
      setFailed(true);
    }
  };

  if (!src || failed) {
    // 최종 폴백: 외부로 여는 버튼
    const href = YT_ID_REGEX.test(watchUrlOrId)
      ? `https://www.youtube.com/watch?v=${watchUrlOrId}`
      : watchUrlOrId;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-video rounded-2xl border border-card bg-card grid place-items-center text-sm text-neutral-600 dark:text-neutral-300 hover:shadow-md transition"
      >
        Open on YouTube ↗
      </a>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-card shadow-sm border border-card transition-all duration-400 ease-in-out hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01]">
      <iframe
        className="w-full aspect-video"
        src={src}
        title={title}
        frameBorder="0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        onError={tryFallback}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};


// ===== Section =====
const MediaSection: React.FC = () => {
  const { language } = useSiteContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const content = {
    EN: {
      title: 'Beyond the Sound',
      subtitle: 'Where sound ends and silence begins',
      seeMore: 'See More Moments →',
      seeFewer: 'See less',
      viewAll: 'To the stage of YouTube',
    },
    KR: {
      title: '소리 너머의 세계',
      subtitle: '소리의 끝, 고요의 시작',
      seeMore: '더 많은 순간으로 →',
      seeFewer: '짧게 보기',
      viewAll: 'YouTube의 무대로',
    },
  };
  const currentContent = content[language];

  const BUTTON_PILL =
    "auralis-btn group relative overflow-hidden z-0 rounded-full border px-5 py-2 text-sm font-medium transition " +
    "border-neutral-300/20 before:content-[''] before:absolute before:inset-0 before:rounded-full " +
    "before:transition-opacity before:duration-[600ms] before:ease-in-out " +
    "before:opacity-0 hover:before:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CBAE7A]/40";

  const forceStyles = `
    .auralis-btn { color: #B89B64; }
    .auralis-btn::before { background-color: rgba(203,174,122,0.10); }
    .auralis-btn:hover { color: #B89B64; }
    .auralis-btn .arrow { transform: translateX(0); transition: transform 200ms ease; display: inline-block; }
    .auralis-btn:hover .arrow,
    .auralis-btn:focus-visible .arrow { transform: translateX(3px); }
    body.dark .auralis-btn { color: #E7CF9F; background: transparent; }
    body.dark .auralis-btn:hover { color: #0b0d12; }
    @media (prefers-color-scheme: dark) {
      .auralis-btn { color: #E7CF9F; background: transparent; }
      .auralis-btn:hover { color: #0b0d12; }
    }
  `;

  const rawLabel = isExpanded ? currentContent.seeFewer : currentContent.seeMore;
  const textOnly = rawLabel.replace(/→/g, '').trim();

  return (
    <section id="watch-section" className="scroll-mt-28 md:scroll-mt-32 py-12 sm:py-14 lg:py-16 bg-transparent">
      <style>{forceStyles}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <SectionHeader title={currentContent.title} subtitle={currentContent.subtitle} />

        {/* VISIBLE GRID (first 3) */}
        <div id="video-grid-initial" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {initialVideos.map((v, i) => (
            <VideoCard key={`initial-${i}`} watchUrlOrId={v.url} title={v.title} />
          ))}
        </div>

        {/* EXPANDABLE GRID (more 3) */}
        <div
          id="video-grid-more"
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 overflow-hidden transition-all duration-700 ease-in-out ${
            isExpanded ? 'mt-4 sm:mt-5 lg:mt-6 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isExpanded}
        >
          {moreVideos.map((v, i) => (
            <VideoCard key={`more-${i}`} watchUrlOrId={v.url} title={v.title} />
          ))}
        </div>

        {/* TOGGLE BUTTON & YOUTUBE LINK */}
        <div className="text-center mt-8 sm:mt-9">
          <button
            id="toggle-more-videos"
            type="button"
            aria-controls="video-grid-more"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
            className={BUTTON_PILL}
          >
            <span className="relative z-10 inline-flex items-center gap-1">
              <span>{textOnly}</span>
              <span aria-hidden className="arrow">→</span>
            </span>
          </button>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-200">
            <a
              href="https://www.youtube.com/@auralis.artist"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 text-link-hover"
            >
              {currentContent.viewAll}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;