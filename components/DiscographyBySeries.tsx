import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '../contexts/SiteContext';
import { albumsData, Album } from '../data/albums';
import AlbumBadges from './AlbumBadges';
import { parseReleaseDate, formatReleaseDate } from '../utils/date';

type SeriesMeta = {
  title: { EN: string; KR: string };
  subtitle: { EN: string; KR: string };
  accentColor: string;
  bgClass?: string;
};

const SERIES_META: Record<string, SeriesMeta> = {
  'Resonance Series': {
    title: { EN: 'Resonance Series', KR: '레조넌스 시리즈' },
    subtitle: { EN: 'Echoes of time in piano, gently sustained.', KR: '시간의 울림을 피아노로 은은히 머금다.' },
    accentColor: '#CBAE7A',
    bgClass: 'dark:bg-[rgba(25,23,18,0.2)]',
  },
  'Chorégraphie Series': {
    title: { EN: 'Chorégraphie Series', KR: '코레그라피 시리즈' },
    subtitle: { EN: 'Studies for movement — music made for bodies in motion.', KR: '움직임을 위한 습작 — 몸을 위한 음악.' },
    accentColor: '#C7A35F',
  },
  'Lullabook Series': {
    title: { EN: 'Lullabook Series', KR: '럴러북 시리즈' },
    subtitle: { EN: 'Small bedtime pieces to rest the day.', KR: '하루를 내려놓는 작은 잠자리 음악.' },
    accentColor: '#E7CF9F',
  },
  'Serene Horizons Series': {
    title: { EN: 'Serene Horizons Series', KR: '세린 호라이즌스 시리즈' },
    subtitle: { EN: 'Calm lines of melody stretching toward quiet skies.', KR: '고요한 하늘을 향해 뻗는 선율의 수평선.' },
    accentColor: '#E0C890',
    bgClass: 'dark:bg-[rgba(28,26,20,0.2)]',
  },
  'Sonic Voyages Series': {
    title: { EN: 'Sonic Voyages Series', KR: '소닉 보야지스 시리즈' },
    subtitle: { EN: 'Journeys through timbre, rhythm, and space.', KR: '음색과 리듬, 공간을 넘나드는 여정.' },
    accentColor: '#D0B076',
  },
  'Light & Faith Series': {
    title: { EN: 'Light & Faith Series', KR: '라이트 앤 페이스 시리즈' },
    subtitle: { EN: 'Quiet prayers and luminous intervals.', KR: '고요한 기도와 빛나는 간격들.' },
    accentColor: '#E3C785',
  },
  'Miniatures Series': {
    title: { EN: 'Miniatures Series', KR: '미니어처스 시리즈' },
    subtitle: { EN: 'Short forms where detail whispers.', KR: '세부가 속삭이는 짧은 형식들.' },
    accentColor: '#BFA56F',
  },
};

const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
  const { language } = useSiteContext();
  const albumContent = album.content[language];
  return (
    <Link to={`/albums/${album.slug}`} className="group block text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)] rounded-2xl">
      <div className="album-card rounded-2xl overflow-hidden bg-card border border-[#CBAE7A]/20 hover:border-[#CBAE7A]/40 shadow-[0_0_10px_rgba(203,174,122,0.08)] hover:shadow-[0_0_16px_rgba(203,174,122,0.15)] transition will-change-transform max-w-[260px] mx-auto">
        <img src={album.coverUrl} alt={`Cover for ${album.title}`} className="w-full aspect-[4/5] object-cover rounded-xl transition duration-300 group-hover:scale-105" loading="lazy" decoding="async" onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml;utf8," +
            encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='100%' height='100%' fill='#111'/><text x='50%' y='50%' fill='#777' font-size='22' text-anchor='middle' font-family='Inter, sans-serif'>image not found</text></svg>");
        }} />
      </div>
      <div className="mt-4">
        {album.details.formatGenre && (
          <AlbumBadges tags={album.details.formatGenre} className="justify-center mb-2" />
        )}
        <h3 className="font-normal text-base sm:text-lg accent-text dark:text-[#E7CF9F] leading-relaxed transition-colors duration-200">{album.title}</h3>
        <p className={`text-sm text-subtle mt-1 leading-relaxed ${language === 'KR' ? 'font-noto-kr' : ''}`}>{albumContent.subtitle}</p>
      </div>
    </Link>
  );
};

const UpcomingCard: React.FC<{ album: Album }> = ({ album }) => {
  const { language } = useSiteContext();
  return (
    <Link to={`/albums/${album.slug}`} className="group block text-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)]">
      <div className="rounded-2xl overflow-hidden bg-card border border-[var(--border)] hover:border-[#CBAE7A]/50 transition max-w-[260px] mx-auto">
        <div className="relative">
          <img src={album.coverUrl} alt={`Cover for ${album.title}`} className="w-full aspect-[4/5] object-cover rounded-xl transition duration-300 group-hover:scale-105 grayscale-[18%]" loading="lazy" decoding="async" onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='100%' height='100%' fill='#111'/><text x='50%' y='50%' fill='#777' font-size='22' text-anchor='middle' font-family='Inter, sans-serif'>image not found</text></svg>");
          }} />
          <span className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-[#CBAE7A]/90 text-black shadow">
            {language === 'KR' ? '발매 예정' : 'Coming Soon'}
          </span>
        </div>
      </div>
      <div className="mt-4">
        {album.details.formatGenre && (
          <AlbumBadges tags={album.details.formatGenre} className="justify-center mb-2" />
        )}
        <h3 className="text-base sm:text-lg font-medium">{album.title}</h3>
        <p className="text-xs text-subtle mt-1">{formatReleaseDate(language, album.details?.releaseDate)}</p>
        {album.caption?.[language] && (
            <p className="text-xs italic text-subtle mt-1.5 px-2">{album.caption[language]}</p>
        )}
      </div>
    </Link>
  );
};

const DiscographyBySeries: React.FC<{ filterGenre?: string }> = ({ filterGenre }) => {
  const { language } = useSiteContext();

  const all = useMemo(() => Object.values(albumsData) as Album[], []);

  const released = useMemo(() => {
    let xs = all.filter(a => a.status === 'released');
    if (filterGenre) {
      xs = xs.filter(a => a.details.formatGenre?.some(g => g.toLowerCase() === filterGenre.toLowerCase()));
    }
    return xs.sort(
      (a, b) =>
        (parseReleaseDate(b.details?.releaseDate)?.getTime() ?? 0) -
        (parseReleaseDate(a.details?.releaseDate)?.getTime() ?? 0)
    );
  }, [all, filterGenre]);

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const twentyDaysInMs = 20 * 24 * 60 * 60 * 1000;

    let xs = all.filter(a => {
      if (a.status === 'released') return false;
      const releaseDate = parseReleaseDate(a.details?.releaseDate);
      if (!releaseDate) return false;
      releaseDate.setHours(0, 0, 0, 0);
      const timeDiff = releaseDate.getTime() - today.getTime();
      return timeDiff >= 0 && timeDiff <= twentyDaysInMs;
    });

    if (filterGenre) {
      xs = xs.filter(a => a.details.formatGenre?.some(g => g.toLowerCase() === filterGenre.toLowerCase()));
    }
    return xs.sort(
      (a, b) =>
        (parseReleaseDate(a.details?.releaseDate)?.getTime() ?? Number.POSITIVE_INFINITY) -
        (parseReleaseDate(b.details?.releaseDate)?.getTime() ?? Number.POSITIVE_INFINITY)
    );
  }, [all, filterGenre]);

  // 그룹핑
  const grouped = released.reduce((acc, album) => {
    const seriesName = album.seriesInfo?.name?.EN || 'Miscellaneous';
    (acc[seriesName] ??= []).push(album);
    return acc;
  }, {} as Record<string, Album[]>);

  const seriesOrder = Object.keys(SERIES_META);
  const miscellaneousAlbums = grouped['Miscellaneous'];

  const MISC_META: SeriesMeta = {
    title: { EN: 'Miscellaneous', KR: '기타' },
    subtitle: { EN: 'Unique collections and standalone pieces.', KR: '독특한 컬렉션 및 독립 작품.' },
    accentColor: '#CBAE7A',
  };

  if (released.length === 0 && filterGenre) {
    return <div className="py-10 md:py-16 text-center text-subtle">{language === 'KR' ? '선택한 장르에 해당하는 앨범이 없습니다.' : 'No albums found for the selected genre.'}</div>;
  }

  return (
    <div>
      {/* 시리즈별 */}
      {seriesOrder.map((seriesKey) => {
        const albumsInSeries = grouped[seriesKey];
        if (!albumsInSeries || albumsInSeries.length === 0) return null;
        const meta = SERIES_META[seriesKey];
        return (
          <section key={seriesKey} className={`py-10 md:py-16 ${meta.bgClass || ''} rounded-3xl my-4`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <header className="mb-6 md:mb-8 border-t-4 pt-4" style={{ borderColor: meta.accentColor }}>
                <h2 className="font-playfair text-2xl md:text-3xl auralis-heading">{meta.title[language]}</h2>
                <p className={`mt-1 text-sm md:text-base text-subtle ${language === 'KR' ? 'font-noto-kr' : ''}`}>{meta.subtitle[language]}</p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
                {albumsInSeries.map((album) => (<AlbumCard key={album.slug} album={album} />))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Misc */}
      {miscellaneousAlbums && miscellaneousAlbums.length > 0 && (
        <section className="py-10 md:py-16 rounded-3xl my-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-6 md:mb-8 border-t-4 pt-4" style={{ borderColor: MISC_META.accentColor }}>
              <h2 className="font-playfair text-2xl md:text-3xl auralis-heading">{MISC_META.title[language]}</h2>
              <p className={`mt-1 text-sm md:text-base text-subtle ${language === 'KR' ? 'font-noto-kr' : ''}`}>{MISC_META.subtitle[language]}</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
              {miscellaneousAlbums.map((album) => (<AlbumCard key={album.slug} album={album} />))}
            </div>
          </div>
        </section>
      )}

      {/* 골드 디바이더 */}
      <div className="mt-12 mb-8">
        <div className="h-px w-40 mx-auto bg-[#CBAE7A] opacity-90" />
      </div>

      {/* 발매 예정 */}
      {upcoming.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-6">
              <h2 className="text-lg tracking-wide text-subtle">{language === 'KR' ? '발매 예정' : 'Coming Soon'}</h2>
              <div className="mt-3 h-px w-24 bg-[#CBAE7A]/80" />
            </header>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12">
              {upcoming.map((a) => (<li key={a.slug}><UpcomingCard album={a} /></li>))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};

export default DiscographyBySeries;